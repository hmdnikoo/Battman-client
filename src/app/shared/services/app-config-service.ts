import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
   private _config = signal({
        theme: 'lara-light-blue',
        colorScheme: 'light',
        scale: 14
    });

    get config() {
        return this._config.asReadonly();
    }

    updateConfig(config: any) {
        this._config.set(config);
    }

    transitionComplete() {
        // just returns true or handles theme transition logic
        return true;
    }
}
