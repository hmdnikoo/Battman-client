import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FleetService {
  baseUrl = environment.battmanApiUrl + '/battman-api';
  constructor(private http: HttpClient) {}
    async get(path: string): Promise<any> {
    try {
      return await this.http.get(`${this.baseUrl}${path}`).toPromise();
    } catch (err) {
      console.error('API error:', err);
      return {};
    }
  }
}
