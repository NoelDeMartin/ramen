import { after, Storage, PromisedValue } from '@noeldemartin/utils';
import { Session } from '@inrupt/solid-client-authn-browser';
import { SolidEngine } from 'soukai-solid';
import Soukai from 'soukai';

import RDFStore from '@/utils/RDFStore';

export type UserProfile = {
    storageUrl: string;
    typeIndexUrl: string;
}

class Auth {

    private session: Session = new Session();
    private _ready: PromisedValue<void> = new PromisedValue();
    private _profile: UserProfile | null = null;

    public get isLoggedIn(): boolean {
        return this.session.info.isLoggedIn || false;
    }

    public get profile(): Promise<UserProfile | null> {
        if (!this.isLoggedIn)
            return Promise.resolve(null);

        if (this._profile)
            return Promise.resolve(this._profile);

        return this.readProfile().then(profile => {
            this._profile = profile;

            return profile;
        });
    }

    public get ready(): Promise<void> {
        return this._ready;
    }

    public async start(): Promise<void> {
        await this.boot();

        this._ready.resolve();
    }

    public async login(identityProvider: string): Promise<void> {
        if (this.isLoggedIn)
            return;

        Storage.set('user', { identityProvider });

        await this.session.login({
            oidcIssuer: identityProvider,
            redirectUrl: window.location.href,
        });

        // The previous operation should trigger a redirect to a different url,
        // if we're still here after 5 seconds something went wrong.
        await after({ seconds: 5 });

        throw new Error(`There was an error logging in to ${identityProvider}`);
    }

    public logout(): void {
        Storage.remove('user');
        this.session.logout();
        window.location.reload();
    }

    public fetch(url: string, config?: unknown): Promise<Response> {
        return this.session.fetch(url, config as RequestInit);
    }

    private async boot(): Promise<void> {
        const info = await this.session.handleIncomingRedirect(window.location.href);

        if (info?.isLoggedIn) {
            Soukai.useEngine(new SolidEngine(this.fetch.bind(this)));

            return;
        }

        if (Storage.has('user')) {
            const { identityProvider } = Storage.get('user', { identityProvider: '' });

            await this.login(identityProvider);

            return;
        }
    }

    private async readProfile(): Promise<UserProfile> {
        const webId = this.session.info.webId as string;
        const store = await RDFStore.fromUrl(this.fetch.bind(this), webId);
        const storages = store.statements(webId, 'pim:storage');
        const typeIndexStatement = store.statement(webId, 'solid:privateTypeIndex');

        if (!typeIndexStatement)
            throw new Error('Couldn\'t find solid:privateTypeIndex in profile');

        if (storages.length === 0)
            throw new Error('Couldn\'t find pim:storage in profile');

        return {
            storageUrl: storages[0].object.value,
            typeIndexUrl: typeIndexStatement.object.value,
        };
    }

}

export default new Auth();
