import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/shared-module';
import { ActivatedRoute } from '@angular/router';
import { FleetService } from '../../../../shared/services/fleet-service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-robot-details-component',
  imports: [SharedModule],
  templateUrl: './robot-details-component.html',
  styleUrl: './robot-details-component.scss'
})
export class RobotDetailsComponent implements OnInit {
  selectedRobot: string | null = null;
  robotTelemetryChart?: Chart;

  constructor(private route: ActivatedRoute, private fleetService: FleetService) { }

  ngOnInit(): void {
    this.selectedRobot = this.route.snapshot.paramMap.get('id');
    if(this.selectedRobot !== null) {
      this.loadRobotTelemetry(this.selectedRobot)
    }
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
}
