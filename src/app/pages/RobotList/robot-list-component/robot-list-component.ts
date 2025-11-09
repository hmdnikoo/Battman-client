import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { environment } from '../../../../environments/environment';
import { FleetService } from '../../../shared/services/fleet-service';
import { SharedModule } from '../../../shared/modules/shared-module';

@Component({
  selector: 'app-robot-list-component',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './robot-list-component.html',
  styleUrls: ['./robot-list-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RobotListComponent implements OnInit {
  baseUrl = environment.battmanApiUrl + '/battman-api';
  kpis = [
    { label: 'Total Robots', value: '–' },
    { label: 'Active', value: '–' },
    { label: 'Charging', value: '–' },
    { label: 'Fleet Uptime', value: '–' }
  ];

  robotTelemetryChart?: Chart;
  robots: any[] = [];
  alerts: any[] = [];
  powerNow = '';
  selectedRobot: any = null;
  rows = 5;
  rowsOptions = [5, 10, 20].map(v => ({ label: String(v), value: v }));

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private fleetService: FleetService
  ) {}

  ngOnInit() {
    this.init();
    setInterval(() => {
      this.loadAlertsAndPower();
    }, 15000);
  }

  async init() {
    await Promise.all([
      this.loadRobots(),
      this.loadAlertsAndPower()
    ]);
  }

  onRowsPerPageChange(val: number, table: any) {
    this.rows = val;
    table.first = 0;
    table.rows = val;
    table.reset();
  }

  goToDetails(id: string) {
    // Navigation to detail page can be implemented later
  }

  async loadRobots() {
    const d: any = await this.fleetService.get('/api/robots');
    this.zone.run(() => {
      this.robots = d?.robots ?? [];
      this.cdr.markForCheck();
    });
  }

  async loadRobotTelemetry(id: string) {
    const d: any = await this.fleetService.get(`/api/robots/${id}/telemetry?hours=6`);
    if (!d?.points) return;

    this.robotTelemetryChart?.destroy();
    this.robotTelemetryChart = new Chart('robotTelemetryChart', {
      type: 'line',
      data: {
        labels: d.points.map((p: any) => new Date(p.ts).toLocaleTimeString()),
        datasets: [
          { label: 'SoC %', data: d.points.map((p: any) => p.soc), yAxisID: 'y1', tension: 0.2 },
          { label: 'Temp °C', data: d.points.map((p: any) => p.tempC), yAxisID: 'y2', tension: 0.2 }
        ]
      },
      options: {
        scales: {
          y1: { type: 'linear', position: 'left' },
          y2: { type: 'linear', position: 'right' }
        }
      }
    });
  }

  async loadAlertsAndPower() {
    const a: any = await this.fleetService.get('/api/alerts');
    const p: any = await this.fleetService.get('/api/power/now');
    this.zone.run(() => {
      this.alerts = a?.alerts ?? [];
      if (p) {
        this.powerNow = `Total charging power: ${p.nowkW ?? '–'} kW (today peak ${p.todaysPeakkW ?? '–'} kW)`;
      }
      this.cdr.markForCheck();
    });
  }

  fmtDate(s: string) {
    return new Date(s).toLocaleString();
  }
}
