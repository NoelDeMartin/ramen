import { after, PromisedValue, silenced, Storage, urlRoot } from '@noeldemartin/utils';
import { Fetch, SolidEngine } from 'soukai-solid';
import Soukai from 'soukai';

import { authenticators, defaultAuthenticationMethod, AuthenticationMethod, AuthSession } from '@/authentication';
import RDFStore from '@/utils/RDFStore';

export type UserProfile = {
    name?: string;
    webId: string;
    storageUrls: string[];
    privateTypeIndexUrl: string;
    publicTypeIndexUrl: string;
    oidcIssuerUrl?: string;
}

export type AuthPreviousLogin = {
    loginUrl: string;
    authenticationMethod: AuthenticationMethod;
}

class Auth {

    private session: AuthSession | null = null;
    private _ready: PromisedValue<void> = new PromisedValue();
    private _profile: PromisedValue<UserProfile> | null = null;
    private _previousLogin: AuthPreviousLogin | null = null;

    public get isLoggedIn(): boolean {
        return !!this.session;
    }

    public get wasLoggedIn(): boolean {
        return !!this._previousLogin;
    }

    public get previousLogin(): AuthPreviousLogin | null {
        return this._previousLogin ?? null;
    }

    public get profile(): Promise<UserProfile | null> {
        if (!this.session)
            return Promise.resolve(null);

        return this._profile
            ?? (this._profile = PromisedValue.from(this.readProfile(this.session.webId)));
    }

    public get ready(): Promise<void> {
        return this._ready;
    }

    public get fetch(): Fetch {
        return this.session?.authenticator.fetch ?? window.fetch.bind(window) as Fetch;
    }

    public async start(): Promise<void> {
        await this.boot();

        this._ready.resolve();
    }

    public async login(
        loginUrl: string,
        authenticationMethod: AuthenticationMethod = defaultAuthenticationMethod,
    ): Promise<void> {
        if (this.session)
            return;

        const profile = await this.readProfileFromLoginUrl(loginUrl);
        const oidcIssuerUrl = profile?.oidcIssuerUrl ?? urlRoot(profile?.webId ?? loginUrl);
        const loginData: AuthPreviousLogin = { loginUrl, authenticationMethod };
        const authenticator = authenticators[authenticationMethod];

        Storage.set('auth', loginData);

        try {
            await authenticator.boot();
            await authenticator.login(oidcIssuerUrl);
        } catch (error) {
            Storage.remove('auth');

            throw error;
        }

        await after({ seconds: 10 });

        alert('You should have been redirected by now, maybe something went wrong');
    }

    public async logout(): Promise<void> {
        if (this.wasLoggedIn) {
            Storage.remove('auth');
            this._previousLogin = null;
        }

        if (this.session)
            await this.session.authenticator.logout();

        window.location.reload();

        await after({ seconds: 10 });

        alert('This window should have been refreshed by now, maybe something went wrong');
    }

    private async boot(): Promise<void> {
        if (!Storage.has('auth'))
            return;

        this._previousLogin = Storage.get('auth') as AuthPreviousLogin;

        const authenticator = authenticators[this._previousLogin.authenticationMethod];

        authenticator.addListener({
            sessionStarted: session => {
                if (!session)
                    return;

                this.session = session;
                Soukai.useEngine(new SolidEngine(this.fetch));
            },
        });

        await authenticator.boot();
    }

    private async readProfileFromLoginUrl(loginUrl: string): Promise<UserProfile | null> {
        const readProfile = silenced(this.readProfile.bind(this));

        return await readProfile(loginUrl)
            ?? await readProfile(loginUrl.replace(/\/$/, '').concat('/profile/card#me'))
            ?? await readProfile(urlRoot(loginUrl).concat('/profile/card#me'));
    }

    private async readProfile(webId: string): Promise<UserProfile> {
        const store = await RDFStore.fromUrl(this.fetch, webId);
        const storages = store.statements(webId, 'pim:storage');
        const privateTypeIndex = store.statement(webId, 'solid:privateTypeIndex');
        const publicTypeIndex = store.statement(webId, 'solid:publicTypeIndex');

        if (storages.length === 0)
            throw new Error('Couldn\'t find a storage in profile');

        if (!privateTypeIndex)
            throw new Error('Couldn\'t find a private type index in the profile');

        if (!publicTypeIndex)
            throw new Error('Couldn\'t find a public type index in the profile');

        return {
            webId,
            storageUrls: storages.map(storage => storage.object.value),
            privateTypeIndexUrl: privateTypeIndex.object.value,
            publicTypeIndexUrl: publicTypeIndex.object.value,
            name: store.statement(webId, 'foaf:name')?.object.value,
            oidcIssuerUrl: store.statement(webId, 'solid:oidcIssuer')?.object.value,
        };
    }

}

export default new Auth();
