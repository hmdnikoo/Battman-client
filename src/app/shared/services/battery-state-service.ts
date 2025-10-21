import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BatteryState } from '../../interfaces/battery-state';

@Injectable({
  providedIn: 'root'
})
export class BatteryStateService {
  private readonly baseUrl = '/battery-store/batteries';

  constructor(private http: HttpClient) {}

  getStates(batteryId: number): Observable<BatteryState[]> {
    return this.http.get<BatteryState[]>(`${this.baseUrl}/${batteryId}/states`);
  }

  createState(batteryId: number, state: Partial<BatteryState>): Observable<BatteryState> {
    const payload = {
      battery: batteryId,                     // added: some APIs expect both battery & batteryId
      batteryId: batteryId,
      recordSessionId: state.recordSessionId ?? null,
      status: state.status ?? 'Idle',
      voltage: state.voltage ?? 0,
      current: state.current ?? 0,
      temperature: state.temperature ?? 0,
      measuredPower: state.measuredPower ?? 0,
      estimatedPower: state.estimatedPower ?? 0,
      linearSpeed: state.linearSpeed ?? 0,
      microMeasuredTime: state.microMeasuredTime ?? 0,
      bmsMeasuredSoc: state.bmsMeasuredSoc ?? 0,
      bmsMeasuredVoltage: state.bmsMeasuredVoltage ?? 0
    };

    console.log('🔹 POST payload (createState):', payload);

    return this.http.post<BatteryState>(
      `${this.baseUrl}/${batteryId}/states`,
      payload
    );
  }

  getState(stateId: number): Observable<BatteryState> {
    return this.http.get<BatteryState>(`${this.baseUrl}/states/${stateId}`);
  }

  updateState(stateId: number, state: Partial<BatteryState>): Observable<BatteryState> {
    const payload = {
      batteryId: state.batteryId ?? null,
      recordSessionId: state.recordSessionId ?? null,
      status: state.status ?? 'Idle',
      voltage: state.voltage ?? 0,
      current: state.current ?? 0,
      temperature: state.temperature ?? 0,
      measuredPower: state.measuredPower ?? 0,
      estimatedPower: state.estimatedPower ?? 0,
      linearSpeed: state.linearSpeed ?? 0,
      microMeasuredTime: state.microMeasuredTime ?? 0,
      bmsMeasuredSoc: state.bmsMeasuredSoc ?? 0,
      bmsMeasuredVoltage: state.bmsMeasuredVoltage ?? 0
    };

    console.log('🔹 PUT payload (updateState):', payload);

    return this.http.put<BatteryState>(
      `${this.baseUrl}/states/${stateId}`,
      payload
    );
  }

  deleteState(stateId: number): Observable<void> {
    console.log(`🗑️ DELETE state ID: ${stateId}`);
    return this.http.delete<void>(`${this.baseUrl}/states/${stateId}`);
  }
}
