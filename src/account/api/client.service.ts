import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { oidc, realm } from '../oidc';
import { I18nMessages, i18nMessagesMock, UserProfile, userProfileMock } from './client';

@Injectable({ providedIn: 'root' })
export class ClientService {
  #httpClient: HttpClient = inject(HttpClient);
  public oidc$ = from(oidc);

  getUserProfile(): Observable<UserProfile> {
    if (import.meta.env.DEV) {
      return of(userProfileMock);
    }
    const headers = new HttpHeaders({ 'oidc-request': 'true', userProfileMetadata: 'true' });
    return this.#httpClient.get<UserProfile>('/account', { headers });
  }

  getI18nMessages(): Observable<I18nMessages> {
    if (import.meta.env.DEV) {
      return of(i18nMessagesMock);
    }
    return this.getUserProfile().pipe(
      switchMap((userProfile_preI18n) => {
        const languageTag = userProfile_preI18n.attributes['locale']?.[0] ?? 'en';
        return this.#httpClient
          .get<{ key: string; value: string }[]>(`/resources/${realm}/account/${languageTag}`)
          .pipe(map((data) => Object.fromEntries(data.map(({ key, value }) => [key, value]))));
      }),
    );
  }

  goToAuthServer(params: {
    extraQueryParams?: Record<string, string>;
    redirectUrl?: string;
    transformUrlBeforeRedirect?: (url: string) => string;
  }) {
    return this.oidc$.pipe(
      switchMap(({ goToAuthServer }) => {
        return from(goToAuthServer(params));
      }),
    );
  }
}
