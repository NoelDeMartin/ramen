declare module 'solid-auth-client' {

    export type Session = {
        webId: string;
    };

    export class SolidAuthClient {
        public fetch(input: RequestInfo, options?: RequestInit): Promise<Response>;

        public login(idp: string): Promise<Session | null | void>;

        public currentSession(): Promise<Session | void>;

        public logout(): Promise<void>;
    }

    const _default: SolidAuthClient;
    export default _default;
}
