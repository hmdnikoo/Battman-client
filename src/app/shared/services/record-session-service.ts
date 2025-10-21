import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecordSession } from '../../interfaces/record-session ';

@Injectable({
  providedIn: 'root'
})
export class RecordSessionService {
  private readonly baseUrl = '/battery-store/batteries';

  constructor(private http: HttpClient) {}

  getSessions(batteryId: number): Observable<RecordSession[]> {
    return this.http.get<RecordSession[]>(`${this.baseUrl}/${batteryId}/sessions`);
  }

  createSession(batteryId: number, payload: Partial<RecordSession>): Observable<RecordSession> {
    return this.http.post<RecordSession>(`${this.baseUrl}/${batteryId}/sessions`, payload);
  }

  getSession(sessionId: number): Observable<RecordSession> {
    return this.http.get<RecordSession>(`${this.baseUrl}/sessions/${sessionId}`);
  }

  updateSession(sessionId: number, payload: Partial<RecordSession>): Observable<RecordSession> {
    return this.http.put<RecordSession>(`${this.baseUrl}/sessions/${sessionId}`, payload);
  }

  deleteSession(sessionId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/sessions/${sessionId}`);
  }
}
