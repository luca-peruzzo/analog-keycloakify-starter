import '@angular/compiler';

import { APP_INITIALIZER, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { ClassKey } from 'keycloakify/login';
import { KcContext } from 'keycloakify/login/KcContext';
import { getI18n, I18n, I18N } from './login/i18n';
import { CLASSES, KC_CONTEXT, USE_DEFAULT_CSS } from './login/KcContext';
import { getKcContextMock } from './login/KcContextMock';
import { I18nService } from './login/services/i18n.service';
import { DO_MAKE_USER_CONFIRM_PASSWORD } from './login/services/user-profile-form.service';

if (import.meta.env.DEV) {
  window.kcContext = getKcContextMock({
    pageId: 'register.ftl',
    overrides: {},
  });
}

const classes = {} satisfies { [key in ClassKey]?: string };

if (!window.kcContext) {
  const NoContextComponentPromise = import('./no-context.component').then((c) => c.NoContextComponent);
  NoContextComponentPromise.then((NoContextComponent) => bootstrapApplication(NoContextComponent));
} else {
  let ComponentBootstrapPromise;
  let doUseDefaultCss = true;
  let doMakeUserConfirmPassword = false;
  const kcContext = window.kcContext;

  switch (kcContext.pageId) {
    case 'login.ftl':
      doUseDefaultCss = true;
      ComponentBootstrapPromise = import('./login/pages/login/login.component').then((c) => c.LoginComponent);
      break;
    case 'register.ftl':
      doUseDefaultCss = true;
      ComponentBootstrapPromise = import('./login/pages/register/register.component').then((c) => c.RegisterComponent);
      break;
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
      ComponentBootstrapPromise = import('./login/pages/login-username/login-username.component').then(
        (c) => c.LoginUsernameComponent,
      );
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
      doMakeUserConfirmPassword = false;
      ComponentBootstrapPromise = import('./no-context.component').then((c) => c.NoContextComponent);
      break;
  }
  if (ComponentBootstrapPromise) {
    ComponentBootstrapPromise.then((ComponentBootstrap) => {
      bootstrapApplication(ComponentBootstrap, {
        providers: [
          provideExperimentalZonelessChangeDetection(),
          {
            provide: KC_CONTEXT,
            useValue: window.kcContext,
          },
          { provide: DO_MAKE_USER_CONFIRM_PASSWORD, useValue: doMakeUserConfirmPassword },
          {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: (i18nService: I18nService, kcContext: KcContext) => async () => {
              const { i18n, prI18n_currentLanguage } = getI18n({
                kcContext,
              });
              let i18nPromise = new Promise<I18n>((resolve) => resolve(i18n));
              if (prI18n_currentLanguage) {
                i18nPromise = prI18n_currentLanguage;
              }
              return i18nPromise.then((i18n) => {
                i18nService.i18n = i18n;
                return true;
              });
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
      }).then((appRef) => {
        appRef.components.forEach((componentRef) => {
          if ('classes' in componentRef.instance) {
            componentRef.setInput('classes', classes);
          }
          if ('doUseDefaultCss' in componentRef.instance) {
            componentRef.setInput('doUseDefaultCss', doUseDefaultCss);
          }
        });
      });
    });
  }
}
