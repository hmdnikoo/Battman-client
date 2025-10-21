import { BatteryState } from "./battery-state";
import { RecordSession } from "./record-session ";

export interface Battery {
  id: number;
  createdAt: string;
  nominalVoltage: number;
  nominalCapacity: number;
  nominalEnergy: number;
  states: BatteryState[];
  recordSessions: RecordSession[];
}
