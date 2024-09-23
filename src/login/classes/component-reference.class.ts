import { InputSignal } from '@angular/core';
import { ClassKey } from 'keycloakify/login';

export abstract class ComponentReference {
  doUseDefaultCss!: InputSignal<boolean | undefined>;
  classes!: InputSignal<Partial<Record<ClassKey, string>> | undefined>;
}
