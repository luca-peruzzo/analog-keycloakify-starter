import { getDefaultPageComponent, type KcPage } from '@keycloakify/angular/login';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template';
import type { ClassKey } from 'keycloakify/login';
import type { KcContext } from './KcContext';

const classes = {} satisfies { [key in ClassKey]?: string };
const doUseDefaultCss = true;
const doMakeUserConfirmPassword = true;

export async function getKcPage(pageId: KcContext['pageId']): Promise<KcPage> {
  switch (pageId) {
    default:
      return {
        PageComponent: await getDefaultPageComponent(pageId),
        TemplateComponent,
        doMakeUserConfirmPassword,
        doUseDefaultCss,
        classes,
      };
  }
}
