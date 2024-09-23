import '@angular/compiler';

import { APP_INITIALIZER, ApplicationRef, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { ClassKey } from 'keycloakify/login';
import { KcContext } from 'keycloakify/login/KcContext';
import { getI18n, I18N } from './login/i18n';
import { CLASSES, KC_CONTEXT, USE_DEFAULT_CSS } from './login/KcContext';
import { getKcContextMock } from './login/KcContextMock';
import { I18nService } from './login/services/i18n.service';

if (import.meta.env.DEV) {
  window.kcContext = getKcContextMock({
    pageId: 'login.ftl',
    overrides: {},
  });
}

const classes = { kcBodyClass: 'lp' } satisfies { [key in ClassKey]?: string };

if (!window.kcContext) {
  const NoContextComponent = (await import('./no-context.component')).NoContextComponent;
  bootstrapApplication(NoContextComponent);
} else {
  let ComponentBootstrap;
  let doUseDefaultCss = true;
  const kcContext = window.kcContext;
  switch (kcContext.pageId) {
    case 'login.ftl':
      doUseDefaultCss = true;
      ComponentBootstrap = (await import('./login/pages/login/login.component')).LoginComponent;
      break;
    // case 'register.ftl':
    // case 'info.ftl':
    // case 'error.ftl':
    // case 'login-reset-password.ftl':
    // case 'login-verify-email.ftl':
    // case 'terms.ftl':
    // case 'login-oauth2-device-verify-user-code.ftl':
    // case 'login-oauth-grant.ftl':
    // case 'login-otp.ftl':
    case 'login-username.ftl':
      doUseDefaultCss = true;
      ComponentBootstrap = (await import('./login/pages/login-username/login-username.component'))
        .LoginUsernameComponent;
      break;
    // case 'webauthn-authenticate.ftl':
    // case 'webauthn-register.ftl':
    // case 'login-password.ftl':
    // case 'login-update-password.ftl':
    // case 'login-update-profile.ftl':
    // case 'login-idp-link-confirm.ftl':
    // case 'login-idp-link-email.ftl':
    // case 'login-page-expired.ftl':
    // case 'login-config-totp.ftl':
    // case 'logout-confirm.ftl':
    // case 'idp-review-user-profile.ftl':
    // case 'update-email.ftl':
    // case 'select-authenticator.ftl':
    // case 'saml-post-form.ftl':
    // case 'delete-credential.ftl':
    // case 'code.ftl':
    // case 'delete-account-confirm.ftl':
    // case 'frontchannel-logout.ftl':
    // case 'login-recovery-authn-code-config.ftl':
    // case 'login-recovery-authn-code-input.ftl':
    // case 'login-reset-otp.ftl':
    // case 'login-x509-info.ftl':
    // case 'webauthn-error.ftl':
    // case 'login-passkeys-conditional-authenticate.ftl':
    // case 'login-idp-link-confirm-override.ftl':
    //   break;
    default:
      doUseDefaultCss = false;
      ComponentBootstrap = (await import('./no-context.component')).NoContextComponent;
      break;
  }
  if (ComponentBootstrap) {
    const appRef: ApplicationRef = await bootstrapApplication(ComponentBootstrap, {
      providers: [
        provideExperimentalZonelessChangeDetection(),
        {
          provide: KC_CONTEXT,
          useValue: window.kcContext,
        },
        {
          provide: APP_INITIALIZER,
          multi: true,
          useFactory: (i18nService: I18nService, kcContext: KcContext) => async () => {
            const { i18n: _i18n, prI18n_currentLanguage } = getI18n({
              kcContext,
            });
            let i18n = _i18n;
            if (prI18n_currentLanguage) {
              i18n = await prI18n_currentLanguage;
            }
            i18nService.i18n = i18n;
            return true;
          },
          deps: [I18nService, KC_CONTEXT],
        },
        { provide: USE_DEFAULT_CSS, useValue: doUseDefaultCss },
        { provide: CLASSES, useValue: classes },
        {
          provide: I18N,
          useFactory: (i18nService: I18nService) => {
            return i18nService.i18n;
          },
          deps: [I18nService],
        },
      ],
    });
    appRef.components.forEach((componentRef) => {
      if ('classes' in componentRef.instance) {
        componentRef.setInput('classes', classes);
      }
      if ('doUseDefaultCss' in componentRef.instance) {
        componentRef.setInput('doUseDefaultCss', doUseDefaultCss);
      }
    });
  }
}
