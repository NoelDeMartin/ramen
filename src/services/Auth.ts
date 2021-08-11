import { after, PromisedValue, Storage, urlRoot } from '@noeldemartin/utils';
import { fetchLoginUserProfile, SolidUserProfile } from '@noeldemartin/solid-utils';
import { Fetch, SolidEngine } from 'soukai-solid';
import Soukai from 'soukai';

import { authenticators, defaultAuthenticationMethod, AuthenticationMethod, AuthSession } from '@/authentication';

export type AuthPreviousLogin = {
    loginUrl: string;
    authenticationMethod: AuthenticationMethod;
}

class Auth {

    private session: AuthSession | null = null;
    private _ready: PromisedValue<void> = new PromisedValue();
    private _profile: PromisedValue<SolidUserProfile> | null = null;
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

    public get profile(): Promise<SolidUserProfile | null> {
        if (!this.session)
            return Promise.resolve(null);

        if (!this._profile)
            this._profile = PromisedValue.from(
                fetchLoginUserProfile(this.session.webId) as Promise<SolidUserProfile>,
            );

        return this._profile;
    }

    public get ready(): Promise<void> {
        return this._ready;
    }

    public get fetch(): Fetch {
        return this.session?.authenticator.fetch ?? window.fetch.bind(window);
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

        const profile = await fetchLoginUserProfile(loginUrl);
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

}

export default new Auth();
