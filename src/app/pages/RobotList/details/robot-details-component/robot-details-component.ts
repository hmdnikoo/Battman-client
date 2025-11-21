import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/shared-module';
import { ActivatedRoute } from '@angular/router';
import { FleetService } from '../../../../shared/services/fleet-service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-robot-details-component',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './robot-details-component.html',
  styleUrl: './robot-details-component.scss'
})
export class RobotDetailsComponent implements OnInit {

  selectedRobot: string | null = null;

  // --- Telemetry Chart ---
  robotTelemetryChart?: Chart;

  // --- SOH Chart ---
  sohChart?: Chart;

  showPast = true;
  showForecast = true;

  cycles: number[] = [];
  pastData: number[] = [];
  currentData: number[] = [];
  forecastData: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private fleetService: FleetService
  ) {}

  ngOnInit(): void {
    this.selectedRobot = this.route.snapshot.paramMap.get('id');

    if (this.selectedRobot) {
      this.loadRobotTelemetry(this.selectedRobot);
      this.loadSohHistory(this.selectedRobot);
    }
  }

  // ─────────────────────────────────────────────
  //               TELEMETRY CHART
  // ─────────────────────────────────────────────
  async loadRobotTelemetry(id: string) {
    const d: any = await this.fleetService.get(`/api/robots/${id}/telemetry?hours=6`);
    if (!d?.points) return;

    this.robotTelemetryChart?.destroy();

    this.robotTelemetryChart = new Chart('robotTelemetryChart', {
      type: 'line',
      data: {
        labels: d.points.map((p: any) => new Date(p.ts).toLocaleTimeString()),
        datasets: [
          {
            label: 'SoC %',
            data: d.points.map((p: any) => p.soc),
            yAxisID: 'y1',
            tension: 0.2
          },
          {
            label: 'Temp °C',
            data: d.points.map((p: any) => p.tempC),
            yAxisID: 'y2',
            tension: 0.2
          }
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

  // ─────────────────────────────────────────────
  //                SOH HISTORY CHART
  // ─────────────────────────────────────────────
  async loadSohHistory(id: string) {
    const d: any = await this.fleetService.get(`/api/robots/${id}/soh-history`);
    if (!d) return;

    this.cycles = d.current.map((p: any) => p.cycle);
    this.pastData = d.past.map((p: any) => p.soh);
    this.currentData = d.current.map((p: any) => p.soh);
    this.forecastData = d.forecast.map((p: any) => p.soh);

    this.renderSohChart();
  }

  renderSohChart() {
    this.sohChart?.destroy();

    this.sohChart = new Chart('sohChart', {
      type: 'line',
      data: {
        labels: this.cycles,
        datasets: [
          {
            label: 'Current SOH',
            data: this.currentData,
            borderColor: 'black',
            borderWidth: 2,
            tension: 0.3
          },
          {
            label: 'Past SOH',
            data: this.pastData,
            borderColor: 'red',
            borderWidth: 2,
            hidden: !this.showPast,
            tension: 0.3
          },
          {
            label: 'AI Forecast',
            data: this.forecastData,
            borderColor: 'green',
            borderWidth: 2,
            borderDash: [6, 3],
            hidden: !this.showForecast,
            tension: 0.3
          }
        ]
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        scales: {
          y: {
            min: 50,
            max: 105,
            title: { display: true, text: 'SOH (%)' }
          },
          x: {
            title: { display: true, text: 'Battery Cycles' }
          }
        }
      }
    });
  }

  toggleDataset(type: 'past' | 'forecast') {
    if (!this.sohChart) return;

    const index = type === 'past' ? 1 : 2;
    const isVisible = type === 'past' ? this.showPast : this.showForecast;

    this.sohChart.data.datasets[index].hidden = !isVisible;
    this.sohChart.update();
  }
}
