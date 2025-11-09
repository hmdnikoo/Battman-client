import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { environment } from '../../../../environments/environment';
import { FleetService } from '../../../shared/services/fleet-service';
import { SharedModule } from '../../../shared/modules/shared-module';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-robot-list-component',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './robot-list-component.html',
  styleUrls: ['./robot-list-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RobotListComponent implements OnInit {
  @ViewChild('robotTable') robotTable!: Table;
  baseUrl = environment.battmanApiUrl + '/battman-api';
  kpis = [
    { label: 'Total Robots', value: '–' },
    { label: 'Active', value: '–' },
    { label: 'Charging', value: '–' },
    { label: 'Fleet Uptime', value: '–' }
  ];

  robots: any[] = [];
  alerts: any[] = [];
  powerNow = '';
  selectedRobot: any = null;
  rows = 20;
  rowsOptions = [20, 50, 100].map(v => ({ label: String(v), value: v }));

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private fleetService: FleetService
  ) {}

  ngOnInit() {
    this.init();
  }

  async init() {
    await Promise.all([
      this.loadRobots()
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
    this.router.navigate(['/robot/details', id]);
  }

  async loadRobots() {
    const d: any = await this.fleetService.get('/api/robots');
    this.zone.run(() => {
      this.robots = d?.robots ?? [];
      this.cdr.markForCheck();
    });
  }




  fmtDate(s: string) {
    return new Date(s).toLocaleString();
  }
  onGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.robotTable.filterGlobal(input.value, 'contains');
  }
  robotStateSeverity(state: any): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | null | undefined {
    switch (state) {
      case 'active':
        return "success";
      case 'charging':
        return "warn";
      case 'idle':
        return "danger"
    }

    return undefined;
  }
}
