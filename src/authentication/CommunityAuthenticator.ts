import { Fetch } from 'soukai-solid';
import type { login, logout } from 'solid-auth-fetcher';

import Authenticator from '@/authentication/Authenticator';

class CommunityAuthenticator extends Authenticator {

    public fetch!: Fetch;
    private _login!: typeof login;
    private _logout!: typeof logout;

    public async startSession(): Promise<void> {
        const { fetch, getSession, login, logout } = await import(
            /* webpackChunkName: 'authentication-community' */
            './CommunityAuthenticator.chunk'
        );

        this.fetch = fetch as unknown as Fetch;
        this._login = login;
        this._logout = logout;

        const session = await getSession();

        console.log({ session });

        if (session?.loggedIn)
            this.onSessionStarted({ webId: session.webId });
    }

    public async login(oidcIssuer: string): Promise<void> {
        await this._login({
            oidcIssuer,
            redirect: window.location.href,
        });
    }

    public async logout(): Promise<void> {
        await this._logout();
    }

}

export default new CommunityAuthenticator();
