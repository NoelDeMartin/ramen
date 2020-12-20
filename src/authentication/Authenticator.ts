import { arr, FluentArray } from '@noeldemartin/utils';
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

    public abstract boot(): Promise<void>;

    public abstract login(oidcIssuer: string): Promise<void>;

    public abstract logout(): Promise<void>;

    public addListener(listener: AuthListener): () => void {
        if (!this.listeners.contains(listener))
            this.listeners.push(listener);

        return () => {
            this.removeListener(listener);
        };
    }

    public removeListener(listener: AuthListener): void {
        if (!this.listeners.contains(listener))
            return;

        this.listeners.remove(listener);
    }

    protected onSessionStarted(session: Omit<AuthSession, 'authenticator'>): void {
        this.listeners.forEach(listener => {
            listener.sessionStarted?.call(listener, {
                authenticator: this,
                ...session,
            });
        });
    }

}
