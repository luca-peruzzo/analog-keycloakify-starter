import { createOidc } from 'oidc-spa';
import { createMockOidc } from 'oidc-spa/mock';

const publicUrl = undefined;
const isAuthGloballyRequired = true;

export const realm = import.meta.env.DEV ? '' : window.location.pathname.split('/')[2];

export const oidc = import.meta.env.DEV
  ? createMockOidc({
      isUserInitiallyLoggedIn: true,
      publicUrl,
      isAuthGloballyRequired,
    })
  : createOidc({
      issuerUri: `${window.location.origin}/realms/${realm}`,
      clientId: 'account-console',
      publicUrl,
      isAuthGloballyRequired,
    });
