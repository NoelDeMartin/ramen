import { Fetch } from 'soukai-solid';
import { Storage } from '@noeldemartin/utils';
import type { SolidAuthClient } from 'solid-auth-client';

import Authenticator from '@/authentication/Authenticator';

class LegacyAuthenticator extends Authenticator {

    private client!: SolidAuthClient;

    public get fetch(): Fetch {
        return this.client.fetch.bind(this.client);
    }

    public async startSession(): Promise<void> {
        const { default: client } = await import(
            /* webpackChunkName: 'authentication-legacy' */
            './LegacyAuthenticator.chunk'
        );

        this.client = client;

        const session = await this.client.currentSession();

        if (location.href.endsWith('/#'))
            history.replaceState(null, '', location.href.slice(0, -2));

        if (session)
            this.onSessionStarted({ webId: session.webId });
    }

    public async login(oidcIssuer: string): Promise<void> {
        const response = await this.client.login(oidcIssuer);

        if (response === null)
            throw new Error(`Could not log in to ${oidcIssuer}`);
    }

    public async logout(): Promise<void> {
        await this.client.logout();

        // Clean up storage
        // See https://github.com/solid/solid-auth-client/issues/96
        Storage.remove('solid-auth-client');
    }

}

export default new LegacyAuthenticator();
