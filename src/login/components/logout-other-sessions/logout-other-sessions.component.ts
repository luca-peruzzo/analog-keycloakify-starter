import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { ClassKey } from 'keycloakify/login';
import { ComponentReference } from '../../classes/component-reference.class';
import { KcClassDirective } from '../../directives/kc-class.directive';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'kc-logout-other-sessions',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  standalone: true,
  imports: [TranslatePipe, KcClassDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './logout-other-sessions.component.html',
  providers: [{ provide: ComponentReference, useExisting: forwardRef(() => LogoutOtherSessionsComponent) }],
})
export class LogoutOtherSessionsComponent extends ComponentReference {
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();
}
