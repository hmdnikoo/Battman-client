// src/app/services/battery.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Battery } from '../../interfaces/battery';
import { BaseService } from './base-service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BatteryService extends BaseService<Battery> {
  constructor(http: HttpClient) {
    // environment.apiUrl will be read from environment.ts
    super(http, 'batteries/', environment.apiUrl);
  }
}
