import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { environment } from '../../../../environments/environment';
import { FleetService } from '../../../shared/services/fleet-service';
import { SharedModule } from 'primeng/api';

@Component({
  selector: 'app-robot-list-component',
  standalone: true,
  imports: [SharedModule, CommonModule, CardModule, TableModule],
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
  // statusChart?: Chart;
  // socBucketsChart?: Chart;
  // socPieChart?: Chart;
  // avgSocChart?: Chart;
  // energyChart?: Chart;
  robotTelemetryChart?: Chart;
  // chargers: any[] = [];
  // queue: any[] = [];
  // schedule: any[] = [];
  robots: any[] = [];
  alerts: any[] = [];
  powerNow = '';
  selectedRobot: any = null;
  // exportLinks = [
  //   { label: 'robots.csv', url: '/api/export/robots.csv' },
  //   { label: 'chargers.csv', url: '/api/export/chargers.csv' },
  //   { label: 'queue.csv', url: '/api/export/queue.csv' },
  //   { label: 'soc-distribution.csv', url: '/api/export/soc-distribution.csv' },
  //   { label: 'avg-soc.csv', url: '/api/export/avg-soc.csv?range=today' },
  //   { label: 'energy-daily.csv', url: '/api/export/energy.csv?days=14' },
  //   { label: 'schedule.csv', url: '/api/export/schedule.csv?hours=8' },
  //   { label: 'telemetry-R-01.csv', url: '/api/export/telemetry.csv?robotId=R-01&hours=6' },
  //   { label: 'alerts.csv', url: '/api/export/alerts.csv' }
  // ];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private zone: NgZone, private fleetService: FleetService) {}

  ngOnInit() {
    this.init();
    setInterval(() => {
      // this.loadKPIs();
      this.loadAlertsAndPower();
    }, 15000);
  }

  async init() {
    // await this.loadKPIs();
    await Promise.all([
      // this.loadStatus(),
      // this.loadSoc(),
      // this.loadTrends(),
      // this.loadChargers(),
      // this.loadSchedule(),
      this.loadRobots(),
      this.loadAlertsAndPower()
    ]);
  }

  // async j(path: string): Promise<any> {
  //   try {
  //     return await this.http.get(`${this.baseUrl}${path}`).toPromise();
  //   } catch (err) {
  //     console.error('API error:', err);
  //     return {};
  //   }
  // }

  // async loadKPIs() {
  //   const d: any = await this.fleetService.get('/api/fleet/summary');
  //   if (!d) return;
  //   this.zone.run(() => {
  //     this.kpis = [
  //       { label: 'Total Robots', value: d.totalRobots ?? '–' },
  //       { label: 'Active', value: d.active ?? '–' },
  //       { label: 'Charging', value: d.charging ?? '–' },
  //       { label: 'Fleet Uptime', value: d.uptimePct ? d.uptimePct.toFixed(1) + '%' : '–' }
  //     ];
  //     this.cdr.markForCheck();
  //   });
  // }

  // async loadStatus() {
  //   const d: any = await this.fleetService.get('/api/fleet/status-breakdown');
  //   if (!d?.buckets) return;
  //   const labels = d.buckets.map((b: any) => b.state);
  //   const data = d.buckets.map((b: any) => b.count);
  //   this.statusChart?.destroy();
  //   this.statusChart = new Chart('statusChart', {
  //     type: 'bar',
  //     data: { labels, datasets: [{ label: 'Robots', data }] },
  //     options: { plugins: { legend: { display: false } } }
  //   });
  // }

  // async loadSoc() {
  //   const b: any = await this.fleetService.get('/api/fleet/soc-distribution');
  //   if (!b?.buckets) return;
  //   this.socBucketsChart?.destroy();
  //   this.socBucketsChart = new Chart('socBucketsChart', {
  //     type: 'bar',
  //     data: {
  //       labels: b.buckets.map((x: any) => x.range),
  //       datasets: [{ label: 'Count', data: b.buckets.map((x: any) => x.count) }]
  //     },
  //     options: { plugins: { legend: { display: false } } }
  //   });
  //   const p: any = await this.fleetService.get('/api/fleet/soc-pie');
  //   if (!p) return;
  //   this.socPieChart?.destroy();
  //   this.socPieChart = new Chart('socPieChart', {
  //     type: 'doughnut',
  //     data: {
  //       labels: ['High (>=80%)', 'Mid (20-79%)', 'Low (<20%)'],
  //       datasets: [{ data: [p.high, p.mid, p.low] }]
  //     }
  //   });
  // }

  // async loadTrends() {
  //   const s: any = await this.fleetService.get('/api/fleet/avg-soc?range=today');
  //   if (!s?.points) return;
  //   this.avgSocChart?.destroy();
  //   this.avgSocChart = new Chart('avgSocChart', {
  //     type: 'line',
  //     data: {
  //       labels: s.points.map((p: any) => new Date(p.ts).toLocaleTimeString()),
  //       datasets: [{ label: 'Avg SoC %', data: s.points.map((p: any) => p.avgSoc), tension: 0.3 }]
  //     }
  //   });
  //   const e: any = await this.fleetService.get('/api/energy/daily?days=14');
  //   if (!e?.days) return;
  //   this.energyChart?.destroy();
  //   this.energyChart = new Chart('energyChart', {
  //     type: 'line',
  //     data: {
  //       labels: e.days.map((d: any) => d.date),
  //       datasets: [{ label: 'Charging kWh', data: e.days.map((d: any) => d.kWh), tension: 0.3 }]
  //     }
  //   });
  // }

  // async loadChargers() {
  //   const d: any = await this.fleetService.get('/api/chargers');
  //   const q: any = await this.fleetService.get('/api/queue');
  //   this.zone.run(() => {
  //     this.chargers = d?.stations ?? [];
  //     this.queue = q?.waiting ?? [];
  //     this.cdr.markForCheck();
  //   });
  // }

  // async loadSchedule() {
  //   const d: any = await this.fleetService.get('/api/schedule/next?hours=8');
  //   this.zone.run(() => {
  //     this.schedule = d?.items?.sort((a: any, b: any) => a.start.localeCompare(b.start)) ?? [];
  //     this.cdr.markForCheck();
  //   });
  // }

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
      options: { scales: { y1: { type: 'linear', position: 'left' }, y2: { type: 'linear', position: 'right' } } }
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
