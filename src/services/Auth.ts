import { after, PromisedValue, silenced, Storage, urlBase } from '@noeldemartin/utils';
import { Fetch, SolidEngine } from 'soukai-solid';
import Soukai from 'soukai';

import { AuthSession } from '@/authentication/Authenticator';
import DPoPAuthenticator from '@/authentication/DPoPAuthenticator';
import LegacyAuthenticator from '@/authentication/LegacyAuthenticator';
import RDFStore from '@/utils/RDFStore';

export type UserProfile = {
    name?: string;
    webId: string;
    storageUrls: string[];
    privateTypeIndexUrl: string;
    publicTypeIndexUrl: string;
    oidcIssuerUrl?: string;
}

export type AuthStorage = {
    loginUrl: string;
    supportsDPoP: boolean;
}

// TODO replace this for a way to know for sure when a provider doesn't support DPoP, and use DPoP by default
const KNOWN_DPOP_ISSUERS: RegExp[] = [
    /^https?:\/\/broker\.(pod|demo-ess)\.inrupt\.com/,
];

class Auth {

    private session: AuthSession | null = null;
    private _ready: PromisedValue<void> = new PromisedValue();
    private _profile: PromisedValue<UserProfile> | null = null;
    private _storage: AuthStorage | null = null;

    public get isLoggedIn(): boolean {
        return !!this.session;
    }

    public get wasLoggedIn(): boolean {
        return !!this._storage;
    }

    public get oldLoginUrl(): string | null {
        return this._storage?.loginUrl ?? null;
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

    public async login(loginUrl: string): Promise<void> {
        if (this.session)
            return;

        const profile = await this.readProfileFromLoginUrl(loginUrl);
        const oidcIssuer = profile?.oidcIssuerUrl ?? urlBase(profile?.webId ?? loginUrl);
        const supportsDPoP = await this.supportsDPoPAuthenticaton(oidcIssuer, profile);
        const authenticator = supportsDPoP ? DPoPAuthenticator : LegacyAuthenticator;
        const storage: AuthStorage = { loginUrl, supportsDPoP };

        Storage.set('auth', storage);

        try {
            await authenticator.boot();
            await authenticator.login(oidcIssuer);
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
            this._storage = null;
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

        this._storage = Storage.get('auth') as AuthStorage;

        const authenticator = this._storage.supportsDPoP ? DPoPAuthenticator : LegacyAuthenticator;

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
            ?? await readProfile(urlBase(loginUrl).concat('/profile/card#me'));
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

    private async supportsDPoPAuthenticaton(oidcIssuer: string, profile: UserProfile | null): Promise<boolean> {
        return await this.oidcIssuerSupportsDPoP(oidcIssuer)
            || await this.authorizesDPoPRequests(profile)
            || KNOWN_DPOP_ISSUERS.some(issuerRegex => issuerRegex.test(oidcIssuer));
    }

    private async oidcIssuerSupportsDPoP(oidcIssuer: string): Promise<boolean> {
        try {
            const configUrl = `${oidcIssuer}/.well-known/openid-configuration`;
            const config = await this.fetch(configUrl).then(res => res.json()) as { token_types_supported: string[] };

            return config.token_types_supported.map(token => token.toLowerCase()).includes('dpop');
        } catch (error) {
            return false;
        }
    }

    private async authorizesDPoPRequests(profile: UserProfile | null): Promise<boolean> {
        if (!profile?.privateTypeIndexUrl)
            return false;

        try {
            const response = await window.fetch(profile.privateTypeIndexUrl, {
                headers: { Authorization: 'DPoP invalidtoken' },
            });

            console.log(profile.privateTypeIndexUrl, response.status);

            return response.status === 401;
        } catch (error) {
            return false;
        }
    }

}

export default new Auth();
