import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DesignerService {
  private _preset = signal(true);
  preset() {
    return this._preset();
  }
}
