import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { forkJoin, finalize } from 'rxjs';
import { BatteryState } from '../../../../interfaces/battery-state';
import { RecordSession } from '../../../../interfaces/record-session ';
import { BatteryStatus } from '../../../../types/battery-status';
import { BatteryStateService } from '../../../../shared/services/battery-state-service';
import { RecordSessionService } from '../../../../shared/services/record-session-service';
import { SharedModule } from '../../../../shared/modules/shared-module';

@Component({
  selector: 'app-fleet-details',
  standalone: true,
  imports: [SharedModule, FormsModule],
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
  loadingStates = true;
  loadingSessions = true;
  stateFilter = '';
  sessionFilter = '';
  displayStateDialog = false;
  displaySessionDialog = false;
  isEditState = false;
  isEditSession = false;
  selectedStateId?: number;
  selectedSessionId?: number;
  stateRows = 5;
  sessionRows = 5;
  stateRowsOptions = [5, 10, 20].map(v => ({ label: String(v), value: v }));
  sessionRowsOptions = [5, 10, 20].map(v => ({ label: String(v), value: v }));
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
  viewOptions = [
    { label: 'Battery States', value: 'state' },
    { label: 'Record Sessions', value: 'session' }
  ];
  activeTable: 'state' | 'session' = 'state';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stateService: BatteryStateService,
    private sessionService: RecordSessionService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.batteryId = Number(this.route.snapshot.paramMap.get('id'));
    this.activeTable = 'state';
    this.loadData();
  }

  toggleView(): void {
    this.activeTable = this.activeTable === 'state' ? 'session' : 'state';
  }

  onRowsChange(val: number, table: Table): void {
    table.first = 0;
    table.rows = val;
    table.reset();
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
    this.loadingStates = true;
    this.loadingSessions = true;
    forkJoin({
      states: this.stateService.getStates(this.batteryId),
      sessions: this.sessionService.getSessions(this.batteryId)
    })
      .pipe(
        finalize(() => {
          this.loadingStates = false;
          this.loadingSessions = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: ({ states, sessions }) => {
          this.states = states;
          this.sessions = sessions;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load data'
          });
        }
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
    const request$ =
      this.isEditState && this.selectedStateId
        ? this.stateService.updateState(this.selectedStateId, payload)
        : this.stateService.createState(this.batteryId, payload);
    request$
      .pipe(finalize(() => this.loadData()))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this.isEditState
              ? 'State updated successfully'
              : 'State created successfully'
          });
          this.displayStateDialog = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.isEditState
              ? 'Failed to update state'
              : 'Failed to create state'
          });
        }
      });
  }

  confirmDeleteState(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this state?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.stateService
          .deleteState(id)
          .pipe(finalize(() => this.loadData()))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'info',
                summary: 'Deleted',
                detail: 'State deleted successfully'
              });
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete state'
              });
            }
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
    const request$ =
      this.isEditSession && this.selectedSessionId
        ? this.sessionService.updateSession(this.selectedSessionId, this.sessionForm)
        : this.sessionService.createSession(this.batteryId, this.sessionForm);
    request$
      .pipe(finalize(() => this.loadData()))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this.isEditSession
              ? 'Session updated successfully'
              : 'Session created successfully'
          });
          this.displaySessionDialog = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.isEditSession
              ? 'Failed to update session'
              : 'Failed to create session'
          });
        }
      });
  }

  confirmDeleteSession(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this session?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.sessionService
          .deleteSession(id)
          .pipe(finalize(() => this.loadData()))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'info',
                summary: 'Deleted',
                detail: 'Session deleted successfully'
              });
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete session'
              });
            }
          });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/fleet-list']);
  }
}
