import '@angular/compiler';

import { APP_INITIALIZER, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { KcContext } from 'keycloakify/login/KcContext';
import { getI18n, I18n, I18N } from './login/i18n';
import { CLASSES, KC_CONTEXT, USE_DEFAULT_CSS } from './login/KcContext';
import { getKcContextMock } from './login/KcContextMock';
import KcPage from './login/KcPage';
import { I18nService } from './login/services/i18n.service';
import { DO_MAKE_USER_CONFIRM_PASSWORD } from './login/services/user-profile-form.service';

if (import.meta.env.DEV) {
  window.kcContext = getKcContextMock({
    pageId: 'register.ftl',
    overrides: {},
  });
}

if (!window.kcContext) {
  const NoContextComponentPromise = import('./no-context.component').then((c) => c.NoContextComponent);
  NoContextComponentPromise.then((NoContextComponent) => bootstrapApplication(NoContextComponent));
} else {
  KcPage(window.kcContext.pageId).then(
    ({ ComponentBootstrap, doMakeUserConfirmPassword, doUseDefaultCss, classes }) => {
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
    },
  );
}
