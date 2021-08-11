import { Fetch } from 'soukai-solid';
import type { Session } from '@inrupt/solid-client-authn-browser';

import Authenticator from '@/authentication/Authenticator';

class InruptAuthenticator extends Authenticator {

    private session!: Session;

    public get fetch(): Fetch {
        return this.session.fetch.bind(this.session);
    }

    public async startSession(): Promise<void> {
        const { Session } = await import(
            /* webpackChunkName: 'authentication-inrupt' */
            './InruptAuthenticator.chunk'
        );

        this.session = new Session();

        await this.session.handleIncomingRedirect(window.location.href);

        if (this.session.info.isLoggedIn)
            this.onSessionStarted({ webId: this.session.info.webId as string });
    }

    public async login(oidcIssuer: string): Promise<void> {
        await this.session.login({
            oidcIssuer,
            clientName: 'Ramen',
            redirectUrl: window.location.href,
        });
    }

    public async logout(): Promise<void> {
        await this.session.logout();
    }

}

export default new InruptAuthenticator();
