import { Authenticator, getAuthenticator } from '@aerogel/plugin-solid';
import { fail } from '@noeldemartin/utils';
import type { AuthSession, AuthenticatorName } from '@aerogel/plugin-solid';
import type { Fetch } from 'soukai-solid';
import type { Reactive } from 'vue';
import type { SolidUserProfile } from '@noeldemartin/solid-utils';

import persistent from '@/lib/persistent';

interface Data {
    authenticator?: AuthenticatorName;
}

export default class RamenAuthenticator extends Authenticator {

    private authenticator: Authenticator | null = null;
    private store: Reactive<Data>;

    constructor() {
        super();

        this.store = persistent('ramen-authenticator', {});
    }

    public async login(loginUrl: string, user?: SolidUserProfile | null): Promise<AuthSession> {
        this.authenticator = this.resolveAuthenticator(user);

        this.store.authenticator = this.authenticator.name;

        await this.bootAuthenticator(this.authenticator);

        return this.authenticator.login(loginUrl, user);
    }

    public async logout(): Promise<void> {
        const authenticator = this.authenticator;

        this.authenticator = null;

        delete this.store.authenticator;

        return authenticator?.logout();
    }

    public getAuthenticatedFetch(): Fetch | null {
        return this.authenticator?.getAuthenticatedFetch() ?? null;
    }

    public requireAuthenticatedFetch(): Fetch {
        return this.authenticator?.requireAuthenticatedFetch() ?? fail('Failed getting ramen authenticator');
    }

    protected async restoreSession(): Promise<void> {
        if (this.store.authenticator) {
            this.authenticator = getAuthenticator(this.store.authenticator);

            await this.bootAuthenticator(this.authenticator);
        }
    }

    protected resolveAuthenticator(user?: SolidUserProfile | null): Authenticator {
        if (user?.usesActivityPods) {
            return getAuthenticator('activity-pods');
        }

        return getAuthenticator('inrupt');
    }

    protected async bootAuthenticator(authenticator: Authenticator): Promise<void> {
        authenticator.addListener({
            onSessionStarted: (...args) => this.notifyListeners('onSessionStarted', ...args),
            onSessionFailed: (...args) => this.notifyListeners('onSessionFailed', ...args),
            onSessionEnded: (...args) => this.notifyListeners('onSessionEnded', ...args),
            onAuthenticatedFetchReady: (...args) => this.notifyListeners('onAuthenticatedFetchReady', ...args),
        });

        await authenticator.boot();
    }

}
