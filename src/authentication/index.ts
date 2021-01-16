import Authenticator, { AuthSession } from '@/authentication/Authenticator';
import DPoPAuthenticator from '@/authentication/DPoPAuthenticator';
import LegacyAuthenticator from '@/authentication/LegacyAuthenticator';

export type { AuthSession };

export enum AuthenticationMethod {
    DPoP = 'dpop',
    Legacy = 'legacy',
}

export const defaultAuthenticationMethod = AuthenticationMethod.DPoP;

export const authenticators: Record<AuthenticationMethod, Authenticator> = {
    [AuthenticationMethod.DPoP]: DPoPAuthenticator,
    [AuthenticationMethod.Legacy]: LegacyAuthenticator,
};
