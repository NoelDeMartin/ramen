import { Session } from '@inrupt/solid-client-authn-browser';
import { Fetch } from 'soukai-solid';

import Authenticator from '@/authentication/Authenticator';

class DPoPAuthenticator extends Authenticator {

    private session: Session = new Session();

    public get fetch(): Fetch {
        return this.session.fetch as unknown as Fetch;
    }

    public async boot(): Promise<void> {
        await this.session.handleIncomingRedirect(window.location.href);

        if (this.session.info.isLoggedIn)
            this.onSessionStarted({ webId: this.session.info.webId as string });
    }

    public async login(oidcIssuer: string): Promise<void> {
        await this.session.login({
            oidcIssuer,
            redirectUrl: window.location.href,
        });
    }

    public async logout(): Promise<void> {
        await this.session.logout();
    }

}

export default new DPoPAuthenticator();
