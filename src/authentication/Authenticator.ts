import { arr, FluentArray, PromisedValue } from '@noeldemartin/utils';
import { Fetch } from 'soukai-solid';

export interface AuthListener {
    sessionStarted(session: AuthSession): void;
}

export interface AuthSession {
    webId: string;
    authenticator: Authenticator;
}

export default abstract class Authenticator {

    public abstract fetch: Fetch;
    private listeners: FluentArray<AuthListener> = arr<AuthListener>([]);
    private booted?: PromisedValue<void>;

    public abstract login(oidcIssuer: string): Promise<void>;

    public abstract logout(): Promise<void>;

    public async boot(): Promise<void> {
        if (this.booted)
            return this.booted;

        this.booted = new PromisedValue;

        await this.startSession();

        this.booted.resolve();
    }

    public addListener(listener: AuthListener): () => void {
        if (!this.listeners.includes(listener))
            this.listeners.push(listener);

        return () => {
            this.removeListener(listener);
        };
    }

    public removeListener(listener: AuthListener): void {
        if (!this.listeners.includes(listener))
            return;

        this.listeners.remove(listener);
    }

    protected abstract startSession(): Promise<void>;

    protected onSessionStarted(session: Omit<AuthSession, 'authenticator'>): void {
        this.listeners.forEach(listener => {
            listener.sessionStarted?.call(listener, {
                authenticator: this,
                ...session,
            });
        });
    }

}
