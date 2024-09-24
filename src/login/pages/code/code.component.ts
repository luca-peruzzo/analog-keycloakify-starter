import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { ClassKey } from 'keycloakify/login';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '../../classes/component-reference.class';
import { TemplateComponent } from '../../containers/template.component';
import { KcClassDirective } from '../../directives/kc-class.directive';
import { KC_CONTEXT } from '../../KcContext';
import { TranslatePipe } from "../../pipes/translate.pipe";

@Component({
  standalone: true,
  imports: [TranslatePipe, TemplateComponent, KcClassDirective],
  selector: 'kc-root',
  templateUrl: 'code.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ComponentReference, useExisting: forwardRef(() => CodeComponent) }],
})
export class CodeComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'code.ftl' }>>(KC_CONTEXT);
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();
}
