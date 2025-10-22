import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabsModule, TabPanels, Tabs, TabList, TabPanel } from 'primeng/tabs';

import { BatteryState} from '../../../../interfaces/battery-state';
import { BatteryStateService } from '../../../../shared/services/battery-state-service';
import { RecordSessionService } from '../../../../shared/services/record-session-service';
import { RecordSession } from '../../../../interfaces/record-session ';
import { BatteryStatus } from '../../../../types/battery-status';

@Component({
  selector: 'app-fleet-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    ProgressBarModule,
    TableModule,
    TabsModule,
    TabPanels,
    Tabs,
    TabList,
    TabPanel,
    DialogModule,
    InputTextModule,
    InputNumberModule
  ],
  templateUrl: './details-component.html',
  styleUrls: ['./details-component.scss']
})
export class DetailsComponent implements OnInit {
  batteryId!: number;
  states: BatteryState[] = [];
  sessions: RecordSession[] = [];

  displayStateDialog = false;
  displaySessionDialog = false;
  isEditState = false;
  isEditSession = false;

  selectedStateId?: number;
  selectedSessionId?: number;

  availableStatuses: BatteryStatus[] = ['CHARGING', 'DISCHARGING'];

  stateForm: Partial<BatteryState> = {
    voltage: 0,
    current: 0,
    temperature: 0,
    status: 'CHARGING'
  };

  sessionForm: Partial<RecordSession> = {
    name: '',
    description: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stateService: BatteryStateService,
    private sessionService: RecordSessionService
  ) {}

  ngOnInit(): void {
    this.batteryId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  loadData(): void {
    this.stateService.getStates(this.batteryId).subscribe({
      next: (data) => (this.states = data),
      error: (err) => console.error('Error fetching states:', err)
    });

    this.sessionService.getSessions(this.batteryId).subscribe({
      next: (data) => (this.sessions = data),
      error: (err) => console.error('Error fetching sessions:', err)
    });
  }

  openNewStateDialog(): void {
    this.isEditState = false;
    this.displayStateDialog = true;
    this.stateForm = {
      voltage: 0,
      current: 0,
      temperature: 0,
      status: 'CHARGING'
    };
  }

  editState(state: BatteryState): void {
    this.isEditState = true;
    this.displayStateDialog = true;
    this.selectedStateId = state.id;
    this.stateForm = { ...state };
  }

  saveState(): void {
    const normalizedStatus: BatteryStatus =
      this.stateForm.status?.toUpperCase() === 'DISCHARGING'
        ? 'DISCHARGING'
        : 'CHARGING';

    const payload: Partial<BatteryState> = { ...this.stateForm, status: normalizedStatus };

    if (this.isEditState && this.selectedStateId !== undefined) {
      this.stateService.updateState(this.selectedStateId, payload).subscribe({
        next: () => {
          this.loadData();
          this.displayStateDialog = false;
        },
        error: (err) => console.error('Error updating state:', err)
      });
    } else {
      this.stateService.createState(this.batteryId, payload).subscribe({
        next: () => {
          this.loadData();
          this.displayStateDialog = false;
        },
        error: (err) => console.error('Error creating state:', err)
      });
    }
  }

  deleteState(id: number): void {
    if (confirm('Are you sure you want to delete this state?')) {
      this.stateService.deleteState(id).subscribe({
        next: () => this.loadData(),
        error: (err) => console.error('Error deleting state:', err)
      });
    }
  }

  openNewSessionDialog(): void {
    this.isEditSession = false;
    this.displaySessionDialog = true;
    this.sessionForm = { name: '', description: '' };
  }

  editSession(session: RecordSession): void {
    this.isEditSession = true;
    this.displaySessionDialog = true;
    this.selectedSessionId = session.id;
    this.sessionForm = { ...session };
  }

  saveSession(): void {
    if (this.isEditSession && this.selectedSessionId !== undefined) {
      this.sessionService.updateSession(this.selectedSessionId, this.sessionForm).subscribe({
        next: () => {
          this.loadData();
          this.displaySessionDialog = false;
        },
        error: (err) => console.error('Error updating session:', err)
      });
    } else {
      this.sessionService.createSession(this.batteryId, this.sessionForm).subscribe({
        next: () => {
          this.loadData();
          this.displaySessionDialog = false;
        },
        error: (err) => console.error('Error creating session:', err)
      });
    }
  }

  deleteSession(id: number): void {
    if (confirm('Are you sure you want to delete this session?')) {
      this.sessionService.deleteSession(id).subscribe({
        next: () => this.loadData(),
        error: (err) => console.error('Error deleting session:', err)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/fleet-list']);
  }
}
