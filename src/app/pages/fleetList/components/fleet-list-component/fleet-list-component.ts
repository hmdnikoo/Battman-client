import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Observable, map } from 'rxjs';

import { BatteryService } from '../../../../shared/services/battery-service';
import { Battery } from '../../../../interfaces/battery';

@Component({
  selector: 'app-fleet-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    InputTextModule,
    ButtonModule,
    DialogModule
  ],
  templateUrl: './fleet-list-component.html',
  styleUrls: ['./fleet-list-component.scss']
})
export class FleetListComponent implements OnInit {
  globalFilter = '';
  batteries$!: Observable<Battery[]>;
  displayDialog = false;
  isEditMode = false;
  selectedBatteryId?: number;

  batteryForm: Partial<Battery> = {
    nominalVoltage: 0,
    nominalCapacity: 0,
    nominalEnergy: 0
  };

  constructor(
    private router: Router,
    private batteryService: BatteryService
  ) {}

  ngOnInit(): void {
    this.loadBatteries();
  }

  loadBatteries(): void {
    this.batteries$ = this.batteryService.getAll().pipe(
      map((batteries) => batteries ?? [])
    );
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
        },
        error: (err) => console.error('Error updating battery:', err)
      });
    } else {
      this.batteryService.create(this.batteryForm as Battery).subscribe({
        next: () => {
          this.loadBatteries();
          this.closeDialog();
        },
        error: (err) => console.error('Error creating battery:', err)
      });
    }
  }

  deleteBattery(id: number): void {
    if (confirm('Are you sure you want to delete this battery?')) {
      this.batteryService.delete(id).subscribe({
        next: () => this.loadBatteries(),
        error: (err) => console.error('Error deleting battery:', err)
      });
    }
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
