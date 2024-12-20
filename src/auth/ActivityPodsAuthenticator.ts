import AerogelSolid from 'virtual:aerogel-solid';

import { after, deleteLocationQueryParameters, fail, required } from '@noeldemartin/utils';
import { Authenticator, Solid } from '@aerogel/plugin-solid';
import type { AuthorizationServer, Client, OpenIDTokenEndpointResponse } from 'oauth4webapi';
import type { AuthSession } from '@aerogel/plugin-solid';
import type { Reactive } from 'vue';
import type { SolidUserProfile } from '@noeldemartin/solid-utils';

import persistent from '@/lib/persistent';

interface Data {
    token?: string;
    webId?: string;
    loginUrl?: string;
    codeVerifier?: string;
}

export default class ActivityPodsAuthenticator extends Authenticator {

    private store: Reactive<Data>;

    constructor() {
        super();

        this.store = persistent('activitypods-authenticator', {});
    }

    public async login(loginUrl: string, user?: SolidUserProfile | null): Promise<AuthSession> {
        if (!AerogelSolid.clientID) {
            throw new Error('ActivityPods: Can\'t login in because ClientID document is missing');
        }

        const oauth = await import('oauth4webapi');
        const codeVerifier = oauth.generateRandomCodeVerifier();
        const authorizationServer = await this.getAuthorizationServer(loginUrl);
        const codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier);
        const authorizationUrl = new URL(authorizationServer.authorization_endpoint as string);

        authorizationUrl.searchParams.set('client_id', this.getOAuthClient().client_id);
        authorizationUrl.searchParams.set('redirect_uri', AerogelSolid.clientID.redirect_uris[0]);
        authorizationUrl.searchParams.set('response_type', 'code');
        authorizationUrl.searchParams.set('code_challenge', codeChallenge);
        authorizationUrl.searchParams.set('code_challenge_method', 'S256');
        authorizationUrl.searchParams.set('scope', 'openid webid offline_access');
        authorizationUrl.searchParams.set('is_signup', 'false');

        this.store.webId = user?.webId;
        this.store.loginUrl = loginUrl;
        this.store.codeVerifier = codeVerifier;

        window.location.href = authorizationUrl.href;

        // Browser should redirect, so just make it wait for a while.
        await after({ seconds: 60 });

        throw new Error('Browser should have redirected, but it didn\'t');
    }

    public async logout(): Promise<void> {
        delete this.store.token;
        delete this.store.webId;
        delete this.store.loginUrl;
        delete this.store.codeVerifier;

        await this.endSession();
    }

    protected async restoreSession(): Promise<void> {
        const { searchParams } = new URL(window.location.href);

        if (searchParams.has('code')) {
            await this.processCallbackUrl(searchParams.get('iss') ?? fail('\'iss\' missing from redirect url'));
        }

        if (!this.store.token) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await this.initAuthenticatedFetch((url: RequestInfo, options?: any) => {
            if (typeof url === 'string') {
                options = {
                    url,
                    ...options,
                };
            }

            options.headers ??= {};
            options.headers['Authorization'] = `Bearer ${this.store.token}`;

            return fetch(url, options);
        });

        await this.startSession({
            user: await Solid.requireUserProfile(required(this.store.webId)),
            loginUrl: required(this.store.loginUrl),
        });
    }

    protected async processCallbackUrl(issuerUrl: string): Promise<void> {
        const authorizationServer = await this.getAuthorizationServer(issuerUrl);
        const callbackParameters = await this.getCallbackParameters(authorizationServer);
        const { id_token } = await this.requestToken(authorizationServer, callbackParameters);

        this.store.token = id_token;

        delete this.store.codeVerifier;

        await deleteLocationQueryParameters(['state', 'code', 'iss', 'error', 'error_description']);
    }

    protected async getAuthorizationServer(issuerUrl: string): Promise<AuthorizationServer> {
        const url = new URL(issuerUrl);
        const oauth = await import('oauth4webapi');
        const authorizationServer = await oauth
            .discoveryRequest(url)
            .then((response) => oauth.processDiscoveryResponse(url, response));

        return authorizationServer;
    }

    protected async getCallbackParameters(authorizationServer: AuthorizationServer): Promise<URLSearchParams> {
        const oauth = await import('oauth4webapi');
        const searchParams = oauth.validateAuthResponse(
            authorizationServer,
            this.getOAuthClient(),
            new URL(window.location.href),
            oauth.expectNoState,
        );

        if (oauth.isOAuth2Error(searchParams)) {
            throw new Error(`OAuth error: ${searchParams.error} (${searchParams.error_description})`);
        }

        return searchParams;
    }

    protected async requestToken(
        authorizationServer: AuthorizationServer,
        callbackParameters: URLSearchParams,
    ): Promise<OpenIDTokenEndpointResponse> {
        const oauth = await import('oauth4webapi');

        const authorizationCodeResponse = await oauth.authorizationCodeGrantRequest(
            authorizationServer,
            this.getOAuthClient(),
            callbackParameters,
            required(AerogelSolid.clientID).redirect_uris[0],
            required(this.store.codeVerifier),
        );

        const tokenResponse = await oauth.processAuthorizationCodeOpenIDResponse(
            authorizationServer,
            this.getOAuthClient(),
            authorizationCodeResponse,
        );

        if (oauth.isOAuth2Error(tokenResponse)) {
            throw new Error(`OAuth error: ${tokenResponse.error} (${tokenResponse.error_description})`);
        }

        return tokenResponse;
    }

    protected getOAuthClient(): Client {
        return {
            client_id: import.meta.env.VITE_ACTIVITYPODS_CLIENT_ID ?? fail('ActivityPods clientId missing from .env'),
            token_endpoint_auth_method: 'none',
        };
    }

}
