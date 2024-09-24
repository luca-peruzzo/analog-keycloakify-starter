import { inject, Pipe, PipeTransform } from '@angular/core';
import { MessageKey } from 'keycloakify/login/i18n/messages_defaultSet/types';
import { I18N } from '../i18n';

@Pipe({
  name: 'translate',
  standalone: true,
})
export class TranslatePipe implements PipeTransform {
  readonly #i18n = inject(I18N);
  transform(value: MessageKey, ...args: (string | undefined)[]): string {
    return this.#i18n.advancedMsgStr(value, ...args);
  }
}
