import { ChangeDetectorRef, Component, inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { PieChartComponent } from '../../../../shared/components/charts/pie-chart-component/pie-chart-component';
import { isPlatformBrowser } from '@angular/common';
import { SharedModule } from '../../../../shared/modules/shared-module';
import { FleetService } from '../../../../shared/services/fleet-service';
import Chart from 'chart.js/auto';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-home-component',
  imports: [SharedModule, PieChartComponent],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss'
})
export class HomeComponent implements OnInit {
  baseUrl = environment.battmanApiUrl + '/battman-api';
  statusChart?: Chart;
  socBucketsChart?: Chart;
  socPieChart?: Chart;
  avgSocChart?: Chart;
  energyChart?: Chart;
  chargers: any[] = [];
  queue: any[] = [];
  schedule: any[] = [];

  kpis = [
    { label: 'Total Robots', value: '–' },
    { label: 'Active', value: '–' },
    { label: 'Charging', value: '–' },
    { label: 'Fleet Uptime', value: '–' }
  ];

  constructor(private cdr: ChangeDetectorRef, private zone: NgZone, private fleetService: FleetService) {}

  ngOnInit(): void {
    this.init();
    setInterval(() => this.loadKPIs(), 15000);
  }

  async init() {
    await this.loadKPIs();
    await Promise.all([
      this.loadStatus(),
      this.loadSoc(),
      this.loadTrends(),
      this.loadChargers(),
      this.loadSchedule()
    ]);
  }

  async loadSchedule() {
    const d: any = await this.fleetService.get('/api/schedule/next?hours=8');
    this.zone.run(() => {
      this.schedule = d?.items?.sort((a: any, b: any) => a.start.localeCompare(b.start)) ?? [];
      this.cdr.markForCheck();
    });
  }

  async loadStatus() {
    const d: any = await this.fleetService.get('/api/fleet/status-breakdown');
    if (!d?.buckets) return;
    const labels = d.buckets.map((b: any) => b.state);
    const data = d.buckets.map((b: any) => b.count);
    this.statusChart?.destroy();
    this.statusChart = new Chart('statusChart', {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Robots', data, backgroundColor: 'rgba(54,162,235,0.5)' }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 20 },
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Fleet Status Breakdown', font: { size: 16 } }
        },
        scales: {
          x: { ticks: { font: { size: 12 } } },
          y: { beginAtZero: true, ticks: { font: { size: 12 } } }
        }
      }
    });
  }

  async loadSoc() {
    const b: any = await this.fleetService.get('/api/fleet/soc-distribution');
    if (!b?.buckets) return;
    this.socBucketsChart?.destroy();
    this.socBucketsChart = new Chart('socBucketsChart', {
      type: 'bar',
      data: {
        labels: b.buckets.map((x: any) => x.range),
        datasets: [{ label: 'Count', data: b.buckets.map((x: any) => x.count), backgroundColor: 'rgba(255,99,132,0.5)' }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 20 },
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'State of Charge Distribution', font: { size: 16 } }
        },
        scales: {
          x: { ticks: { font: { size: 12 } } },
          y: { beginAtZero: true, ticks: { font: { size: 12 } } }
        }
      }
    });

    const p: any = await this.fleetService.get('/api/fleet/soc-pie');
    if (!p) return;
    this.socPieChart?.destroy();
    this.socPieChart = new Chart('socPieChart', {
      type: 'doughnut',
      data: {
        labels: ['High (>=80%)', 'Mid (20–79%)', 'Low (<20%)'],
        datasets: [{ data: [p.high, p.mid, p.low], backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'] }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Battery Level Overview', font: { size: 16 } }
        }
      }
    });
  }

  async loadTrends() {
    const s: any = await this.fleetService.get('/api/fleet/avg-soc?range=today');
    if (!s?.points) return;
    this.avgSocChart?.destroy();
    this.avgSocChart = new Chart('avgSocChart', {
      type: 'line',
      data: {
        labels: s.points.map((p: any) => new Date(p.ts).toLocaleTimeString()),
        datasets: [{ label: 'Avg SoC %', data: s.points.map((p: any) => p.avgSoc), tension: 0.3, borderColor: '#36A2EB' }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 20 },
        plugins: { title: { display: true, text: 'Average SoC Over Time', font: { size: 16 } } }
      }
    });

    const e: any = await this.fleetService.get('/api/energy/daily?days=14');
    if (!e?.days) return;
    this.energyChart?.destroy();
    this.energyChart = new Chart('energyChart', {
      type: 'line',
      data: {
        labels: e.days.map((d: any) => d.date),
        datasets: [{ label: 'Charging kWh', data: e.days.map((d: any) => d.kWh), tension: 0.3, borderColor: '#4BC0C0' }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 20 },
        plugins: { title: { display: true, text: 'Daily Energy Consumption', font: { size: 16 } } }
      }
    });
  }

  async loadChargers() {
    const d: any = await this.fleetService.get('/api/chargers');
    const q: any = await this.fleetService.get('/api/queue');
    this.zone.run(() => {
      this.chargers = d?.stations ?? [];
      this.queue = q?.waiting ?? [];
      this.cdr.markForCheck();
    });
  }

  exportLinks = [
    { label: 'robots.csv', url: `${this.baseUrl}/api/export/robots.csv` },
    { label: 'chargers.csv', url: `${this.baseUrl}/api/export/chargers.csv` },
    { label: 'queue.csv', url: `${this.baseUrl}/api/export/queue.csv` },
    { label: 'soc-distribution.csv', url: `${this.baseUrl}/api/export/soc-distribution.csv` },
    { label: 'avg-soc.csv', url: `${this.baseUrl}/api/export/avg-soc.csv?range=today` },
    { label: 'energy-daily.csv', url: `${this.baseUrl}/api/export/energy.csv?days=14` },
    { label: 'schedule.csv', url: `${this.baseUrl}/api/export/schedule.csv?hours=8` },
    { label: 'telemetry-R-01.csv', url: `${this.baseUrl}/api/export/telemetry.csv?robotId=R-01&hours=6` },
    { label: 'alerts.csv', url: `${this.baseUrl}/api/export/alerts.csv` }
  ];

  async loadKPIs() {
    const d: any = await this.fleetService.get('/api/fleet/summary');
    if (!d) return;
    this.zone.run(() => {
      this.kpis = [
        { label: 'Total Robots', value: d.totalRobots ?? '–' },
        { label: 'Active', value: d.active ?? '–' },
        { label: 'Charging', value: d.charging ?? '–' },
        { label: 'Fleet Uptime', value: d.uptimePct ? d.uptimePct.toFixed(1) + '%' : '–' }
      ];
      this.cdr.markForCheck();
    });
  }

  platformId = inject(PLATFORM_ID);
}
