import { BatteryStatus } from "../types/battery-status";
import { RecordSession } from "./record-session ";

export interface BatteryState {
  id: number;
  battery: string;
  batteryId: number;
  recordSession: RecordSession;
  recordSessionId: number;
  createdAt: string;
  status: BatteryStatus;
  voltage: number;
  current: number;
  measuredPower: number;
  estimatedPower: number;
  linearSpeed: number;
  microMeasuredTime: number;
  bmsMeasuredSoc: number;
  bmsMeasuredVoltage: number;
  temperature: number;
}
