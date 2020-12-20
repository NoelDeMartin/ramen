import { Fetch } from 'soukai-solid';
import SolidAuthClient from 'solid-auth-client';

import Authenticator from '@/authentication/Authenticator';

class LegacyAuthenticator extends Authenticator {

    public get fetch(): Fetch {
        return SolidAuthClient.fetch.bind(SolidAuthClient) as unknown as Fetch;
    }

    public async boot(): Promise<void> {
        const session = await SolidAuthClient.currentSession();

        if (session)
            this.onSessionStarted({ webId: session.webId });
    }

    public async login(oidcIssuer: string): Promise<void> {
        const response = await SolidAuthClient.login(oidcIssuer);

        if (response === null)
            throw new Error(`Could not log in to ${oidcIssuer}`);
    }

    public async logout(): Promise<void> {
        await SolidAuthClient.logout();
    }

}

export default new LegacyAuthenticator();
