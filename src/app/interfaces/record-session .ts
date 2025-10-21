export interface RecordSession {
  id: number;
  createdAt: string;
  name: string;
  description: string;
  battery: string;
  batteryId: number;
  states: string[];
}
