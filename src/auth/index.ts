import LSSAuthenticator from '@/auth/LSSAuthenticator';

export const authenticators = {
    lss: new LSSAuthenticator(),
};

export type RamenAuthenticators = typeof authenticators;

declare module '@aerogel/plugin-solid' {
    interface Authenticators extends RamenAuthenticators {}
}
