import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { ProgressBar } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { TabsModule, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { Select } from 'primeng/select';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BatteryState } from '../../../../interfaces/battery-state';
import { BatteryStateService } from '../../../../shared/services/battery-state-service';
import { RecordSessionService } from '../../../../shared/services/record-session-service';
import { RecordSession } from '../../../../interfaces/record-session ';
import { BatteryStatus } from '../../../../types/battery-status';
import { TextareaModule } from 'primeng/textarea'
import { PrimengSharedModule } from '../../../../shared/modules/primeng-shared-module';

@Component({
  selector: 'app-fleet-details',
  standalone: true,
  imports: [
    PrimengSharedModule
  ],
  providers: [ConfirmationService, MessageService],
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

    if (this.isEditState && this.selectedStateId !== undefined) {
      this.stateService.updateState(this.selectedStateId, payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'State updated successfully'
          });
          this.displayStateDialog = false;
          this.loadData();
        },
        error: (err) => {
          console.error('Error updating state:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update state'
          });
        }
      });
    } else {
      this.stateService.createState(this.batteryId, payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'State created successfully'
          });
          this.displayStateDialog = false;
          this.loadData();
        },
        error: (err) => {
          console.error('Error creating state:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create state'
          });
        }
      });
    }
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
          error: (err) => {
            console.error('Error deleting state:', err);
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
    if (this.isEditSession && this.selectedSessionId !== undefined) {
      this.sessionService
        .updateSession(this.selectedSessionId, this.sessionForm)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Session updated successfully'
            });
            this.displaySessionDialog = false;
            this.loadData();
          },
          error: (err) => {
            console.error('Error updating session:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update session'
            });
          }
        });
    } else {
      this.sessionService.createSession(this.batteryId, this.sessionForm).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Session created successfully'
          });
          this.displaySessionDialog = false;
          this.loadData();
        },
        error: (err) => {
          console.error('Error creating session:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create session'
          });
        }
      });
    }
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
          error: (err) => {
            console.error('Error deleting session:', err);
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
