import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ✅ PrimeNG Modules
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
// import { SortIcon } from 'primeng/api';

@Component({
  selector: 'app-fleet-list',
  standalone: true, // ✅ ensures standalone usage
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    InputTextModule,
  ],
  templateUrl: './fleet-list-component.html',
  styleUrls: ['./fleet-list-component.scss']
})
export class FleetListComponent {
  globalFilter: string = ''; // ✅ Fix missing property
  robots = [
    { id: 1, name: 'Robot A', charge: 78, status: 'Active' },
    { id: 2, name: 'Robot B', charge: 45, status: 'Charging' },
    { id: 3, name: 'Robot C', charge: 90, status: 'Idle' },
    { id: 4, name: 'Robot D', charge: 22, status: 'Error' }
  ]; // ✅ Sample data

  constructor(private router: Router) {}

  goToDetails(id: number) {
    this.router.navigate(['/fleet/details', id]);
  }

  getSeverity(status: string):
    'success' | 'secondary' | 'info' | 'warn' | 'danger' | null {
    switch (status) {
      case 'Active': return 'success';
      case 'Charging': return 'info';
      case 'Idle': return 'warn';
      case 'Error': return 'danger';
      default: return null;
    }
  }
}
