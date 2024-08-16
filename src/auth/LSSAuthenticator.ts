import { Storage, after, fail } from '@noeldemartin/utils';
import { Authenticator, Solid } from '@aerogel/plugin-solid';
import type { AuthSession } from '@aerogel/plugin-solid';

const STORAGE_KEY = 'lss';

interface StorageData {
    loginUrl: string;
}

export default class LSSAuthenticator extends Authenticator {

    public async login(loginUrl: string): Promise<AuthSession> {
        Storage.set<StorageData>(STORAGE_KEY, { loginUrl });

        // TODO support authentication without reloading
        location.reload();

        // Browser should reload, so just make it wait for a while.
        await after({ seconds: 60 });

        return fail('Browser should have reloaded, but it didn\'t');
    }

    public async logout(): Promise<void> {
        Storage.remove(STORAGE_KEY);

        await this.endSession();
    }

    protected async restoreSession(): Promise<void> {
        if (!Storage.has(STORAGE_KEY)) {
            return;
        }

        const { loginUrl } = Storage.require<StorageData>(STORAGE_KEY);
        const webId = `${loginUrl}/profile/card#me`;
        const user = await Solid.requireUserProfile(webId);

        await this.initAuthenticatedFetch(window.fetch.bind(window));
        await this.startSession({ loginUrl, user });
    }

}
