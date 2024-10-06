import { getDefaultPageComponent, type KcPage } from '@keycloakify/angular/account';
import { TemplateComponent } from '@keycloakify/angular/account/containers/template';
import type { ClassKey } from 'keycloakify/account';
import type { KcContext } from './KcContext';

const classes = {} satisfies { [key in ClassKey]?: string };
const doUseDefaultCss = true;

export async function getKcPage(pageId: KcContext['pageId']): Promise<KcPage> {
  switch (pageId) {
    case 'password.ftl':
      return {
        PageComponent: (await import('./pages/password')).PasswordComponent,
        TemplateComponent,
        classes,
        doUseDefaultCss,
      };
    case 'account.ftl':
      return {
        PageComponent: (await import('./pages/account')).AccountComponent,
        TemplateComponent,
        classes,
        doUseDefaultCss,
      };
    default:
      return {
        PageComponent: await getDefaultPageComponent(pageId),
        TemplateComponent,
        doUseDefaultCss,
        classes,
      };
  }
}
