import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { KC_CONTEXT } from '../login/KcContext';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    {
      provide: KC_CONTEXT,
      useFactory: () => {
        return window.kcContext;
      },
    },
  ],
};
