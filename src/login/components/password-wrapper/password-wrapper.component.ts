import { AsyncPipe } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  inject,
  input,
  signal,
  WritableSignal,
} from '@angular/core';
import { KcClassDirective } from '../../directives/kc-class.directive';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Directive({
  selector: '[kcInput]',
  standalone: true,
})
export class KcInputDirective {
  el = inject<ElementRef<HTMLInputElement>>(ElementRef);
}

@Component({
  selector: 'kc-password-wrapper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KcClassDirective, TranslatePipe, AsyncPipe],
  templateUrl: './password-wrapper.component.html',
})
export class PasswordWrapperComponent implements AfterContentInit {
  @ContentChild(KcInputDirective, { static: true }) input: KcInputDirective | undefined;
  passwordInputId = input<string>();

  isPasswordRevealed: WritableSignal<boolean> = signal(false);

  ngAfterContentInit(): void {
    this.setPasswordInputType();
  }

  togglePasswordVisibility(): void {
    this.isPasswordRevealed.update((revealed) => !revealed);
    this.setPasswordInputType();
  }

  private setPasswordInputType(): void {
    if (this.input) {
      this.input.el.nativeElement.type = this.isPasswordRevealed() ? 'text' : 'password';
    }
  }
}
