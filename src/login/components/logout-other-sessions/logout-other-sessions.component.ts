import { ChangeDetectionStrategy, Component } from '@angular/core';
import { KcClassDirective } from 'src/login/directives/kc-class.directive';
import { TranslatePipe } from 'src/login/pipes/translate.pipe';

@Component({
  selector: 'kc-logout-other-sessions',
  standalone: true,
  imports: [TranslatePipe, KcClassDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './logout-other-sessions.component.html',
})
export class LogoutOtherSessionsComponent {}
