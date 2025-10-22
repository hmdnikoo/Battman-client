import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { BatteryState } from '../../../../interfaces/battery-state';
import { BatteryStateService } from '../../../../shared/services/battery-state-service';
import { RecordSessionService } from '../../../../shared/services/record-session-service';
import { RecordSession } from '../../../../interfaces/record-session ';
import { BatteryStatus } from '../../../../types/battery-status';
import { PrimengSharedModule } from '../../../../shared/modules/primeng-shared-module';

@Component({
  selector: 'app-fleet-details',
  standalone: true,
  imports: [PrimengSharedModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './details-component.html',
  styleUrls: ['./details-component.scss']
})
export class DetailsComponent implements OnInit {
  @ViewChild('stateTable') stateTable!: Table;
  @ViewChild('sessionTable') sessionTable!: Table;

  batteryId!: number;
  states: BatteryState[] = [];
  sessions: RecordSession[] = [];

  stateFilter = '';
  sessionFilter = '';

  displayStateDialog = false;
  displaySessionDialog = false;
  isEditState = false;
  isEditSession = false;
  selectedStateId?: number;
  selectedSessionId?: number;

  statusOptions = [
    { label: 'Charging', value: 'CHARGING' as BatteryStatus },
    { label: 'Discharging', value: 'DISCHARGING' as BatteryStatus }
  ];

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
    private sessionService: RecordSessionService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.batteryId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  onStateFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.stateTable.filterGlobal(value, 'contains');
  }

  onSessionFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.sessionTable.filterGlobal(value, 'contains');
  }

  loadData(): void {
    this.stateService.getStates(this.batteryId).subscribe({
      next: (data) => (this.states = data),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load battery states'
        })
    });

    this.sessionService.getSessions(this.batteryId).subscribe({
      next: (data) => (this.sessions = data),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load sessions'
        })
    });
  }

  openNewStateDialog(): void {
    this.isEditState = false;
    this.stateForm = {
      voltage: 0,
      current: 0,
      temperature: 0,
      status: 'CHARGING'
    };
    this.displayStateDialog = true;
  }

  editState(state: BatteryState): void {
    this.isEditState = true;
    this.selectedStateId = state.id;
    this.stateForm = { ...state };
    this.displayStateDialog = true;
  }

  saveState(): void {
    const normalizedStatus: BatteryStatus =
      this.stateForm.status?.toUpperCase() === 'DISCHARGING'
        ? 'DISCHARGING'
        : 'CHARGING';

    const payload: Partial<BatteryState> = {
      ...this.stateForm,
      status: normalizedStatus
    };

    const request$ = this.isEditState && this.selectedStateId
      ? this.stateService.updateState(this.selectedStateId, payload)
      : this.stateService.createState(this.batteryId, payload);

    request$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.isEditState ? 'State updated successfully' : 'State created successfully'
        });
        this.displayStateDialog = false;
        this.loadData();
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.isEditState ? 'Failed to update state' : 'Failed to create state'
        })
    });
  }

  confirmDeleteState(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this state?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.stateService.deleteState(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Deleted',
              detail: 'State deleted successfully'
            });
            this.loadData();
          },
          error: () =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete state'
            })
        });
      }
    });
  }

  openNewSessionDialog(): void {
    this.isEditSession = false;
    this.sessionForm = { name: '', description: '' };
    this.displaySessionDialog = true;
  }

  editSession(session: RecordSession): void {
    this.isEditSession = true;
    this.selectedSessionId = session.id;
    this.sessionForm = { ...session };
    this.displaySessionDialog = true;
  }

  saveSession(): void {
    const request$ = this.isEditSession && this.selectedSessionId
      ? this.sessionService.updateSession(this.selectedSessionId, this.sessionForm)
      : this.sessionService.createSession(this.batteryId, this.sessionForm);

    request$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.isEditSession ? 'Session updated successfully' : 'Session created successfully'
        });
        this.displaySessionDialog = false;
        this.loadData();
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.isEditSession ? 'Failed to update session' : 'Failed to create session'
        })
    });
  }

  confirmDeleteSession(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this session?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.sessionService.deleteSession(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Deleted',
              detail: 'Session deleted successfully'
            });
            this.loadData();
          },
          error: () =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete session'
            })
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/fleet-list']);
  }
}
