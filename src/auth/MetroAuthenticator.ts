import AerogelSolid from 'virtual:aerogel-solid';

import metro from '@muze-nl/metro';
import metroOidc from '@muze-nl/metro-oidc';
import { Authenticator, Solid } from '@aerogel/plugin-solid';
import { after, required } from '@noeldemartin/utils';
import type { AuthSession } from '@aerogel/plugin-solid';
import type { ClosureArgs } from '@noeldemartin/utils';
import type { Reactive } from 'vue';
import type { SolidUserProfile } from '@noeldemartin/solid-utils';

import persistent from '@/lib/persistent';

interface Data {
    webId?: string;
    issuer?: string;
}

export default class MetroAuthenticator extends Authenticator {

    private store: Reactive<Data>;

    constructor() {
        super();

        this.store = persistent('metro-authenticator', {});
    }

    public async login(loginUrl: string, user?: SolidUserProfile | null): Promise<AuthSession> {
        const issuer = user?.oidcIssuerUrl ?? loginUrl;
        const client = this.initClient(issuer);

        this.store.webId = user?.webId;
        this.store.issuer = issuer;

        // TODO there is probably a better way to trigger the redirect...
        await client.get(user?.webId);

        // Browser should redirect, so just make it wait for a while.
        await after({ seconds: 60 });

        throw new Error('Browser should have redirected, but it didn\'t');
    }

    public async logout(): Promise<void> {
        delete this.store.webId;
        delete this.store.issuer;

        // TODO how do you log out from metro? Clean up storage, etc.

        await this.endSession();
    }

    protected async restoreSession(): Promise<void> {
        if (!this.store.issuer) {
            return;
        }

        const client = this.initClient(this.store.issuer);

        await this.initAuthenticatedFetch((...args: ClosureArgs) => client.fetch(...args));
        await this.startSession({
            user: await Solid.requireUserProfile(required(this.store.webId)),
            loginUrl: required(this.store.issuer),
        });
    }

    private initClient(issuer: string): any {
        if (!AerogelSolid.clientID) {
            throw new Error('Metro: Can\'t login in because ClientID document is missing');
        }

        return metro.client().with(
            metroOidc.oidcmw({
                client_info: AerogelSolid.clientID,
                issuer,
            }),
        );
    }

}
