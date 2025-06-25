import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';

export interface ThemeSettings {
  colorScheme: string;
  accentColors?: {
    [key: string]: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSettings$ = this.http.get<ThemeSettings>('/api/theme').pipe(
    catchError(() => of(this.mockSettings)),
    shareReplay({
      bufferSize: 1,
      refCount: true,
      windowTime: 1000, // 1 second cache
    })
  );

  private readonly mockSettings: ThemeSettings = {
    colorScheme: 'light',
    accentColors: {
      '--primary-color': '#1e75df',
      '--primary-color-text': '#ffffff',
      '--highlight-bg': '#1e75df',
      '--highlight-text-color': '#ffffff',
      '--focus-ring': '0 0 0 0.2rem #B8D8FF',
      // Slider
      '--slider-bg': '#dee2e6',
      '--slider-range-bg': '#1e75df',
      '--slider-handle-bg': '#1e75df',
      // Progress Bar
      '--progressbar-bg': '#dee2e6',
      '--progressbar-value-bg': '#1e75df',
      // Checkbox
      '--checkbox-border': '#1e75df',
      '--checkbox-bg': '#1e75df',
      '--checkbox-hover-bg': '#3185EC',
      // Button
      '--button-bg': '#1e75df',
      '--button-hover-bg': '#3185EC',
      '--button-focus-shadow': '0 0 0 2px #ffffff, 0 0 0 4px #1e75df',
      // Button Inverted
      '--button-inverted-bg': '#3185EC',
      '--button-inverted-hover-bg': '#5CA1F4',
      // Toggle button
      '--togglebutton-bg': '#1e75df',
      '--togglebutton-border': '1px solid #1e75df',
      '--togglebutton-hover-bg': '#3185EC',
      '--togglebutton-hover-border': '1px solid #3185EC',
      '--togglebutton-text-color': '#ffffff',
    },
  };

  constructor(private http: HttpClient) {}

  // Get theme settings from NVS storage
  getThemeSettings(): Observable<ThemeSettings> {
    if (!environment.production) {
      return of(this.mockSettings);
    }
    return this.themeSettings$;
  }

  // Save theme settings to NVS storage
  saveThemeSettings(settings: ThemeSettings): Observable<void> {
    if (environment.production) {
      return this.http.post<void>('/api/theme', settings);
    } else {
      return of(void 0);
    }
  }
}
