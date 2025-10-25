import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { BatteryService } from '../../../../shared/services/battery-service';
import { Battery } from '../../../../interfaces/battery';
import { SharedModule } from '../../../../shared/modules/shared-module';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-fleet-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './fleet-list-component.html',
  styleUrls: ['./fleet-list-component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class FleetListComponent implements OnInit {
  @ViewChild('batteryTable') batteryTable!: Table;

  globalFilter = '';
  batteries$!: Observable<Battery[]>;
  displayDialog = false;
  isEditMode = false;
  selectedBatteryId?: number;
  rows = 5;
  rowsOptions = [5, 10, 20].map(v => ({ label: String(v), value: v }));

  batteryForm: Partial<Battery> = {
    nominalVoltage: 0,
    nominalCapacity: 0,
    nominalEnergy: 0
  };

  constructor(
    private router: Router,
    private batteryService: BatteryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadBatteries();
  }

  onRowsPerPageChange(val: number, table: any) {
    this.rows = val;
    table.first = 0;
    table.rows = val;
    table.reset();
  }

  loadBatteries(): void {
    this.batteries$ = this.batteryService.getAll().pipe(map((batteries) => batteries ?? []));
  }

  onGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.batteryTable.filterGlobal(input.value, 'contains');
  }

  goToDetails(id: number): void {
    this.router.navigate(['/fleet/details', id]);
  }

  openNewBatteryDialog(): void {
    this.isEditMode = false;
    this.displayDialog = true;
    this.batteryForm = {
      nominalVoltage: 0,
      nominalCapacity: 0,
      nominalEnergy: 0
    };
  }

  editBattery(battery: Battery): void {
    this.isEditMode = true;
    this.displayDialog = true;
    this.selectedBatteryId = battery.id;
    this.batteryForm = { ...battery };
  }

  saveBattery(): void {
    if (this.isEditMode && this.selectedBatteryId !== undefined) {
      this.batteryService.update(this.selectedBatteryId, this.batteryForm as Battery).subscribe({
        next: () => {
          this.loadBatteries();
          this.closeDialog();
          this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Battery updated successfully' });
        },
        error: (err) => {
          console.error('Error updating battery:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update battery' });
        }
      });
    } else {
      this.batteryService.create(this.batteryForm as Battery).subscribe({
        next: () => {
          this.loadBatteries();
          this.closeDialog();
          this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Battery added successfully' });
        },
        error: (err) => {
          console.error('Error creating battery:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add battery' });
        }
      });
    }
  }

  confirmDeleteBattery(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this battery?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.batteryService.delete(id).subscribe({
          next: () => {
            this.loadBatteries();
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Battery deleted successfully' });
          },
          error: (err) => {
            console.error('Error deleting battery:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete battery' });
          }
        });
      }
    });
  }

  closeDialog(): void {
    this.displayDialog = false;
  }

  getSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | null {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'success';
      case 'CHARGING':
        return 'info';
      case 'DISCHARGING':
        return 'warn';
      case 'ERROR':
        return 'danger';
      default:
        return null;
    }
  }
}
