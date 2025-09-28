import { InjectionToken } from '@angular/core';

// Base URL for the backend API, e.g. http://localhost:3000
// On Render or other hosts, you can inject a value via a global window.__env.API_BASE_URL
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
