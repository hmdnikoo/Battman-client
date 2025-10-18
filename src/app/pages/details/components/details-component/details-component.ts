import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-fleet-details',
  standalone: true, // ✅ makes the component independent (no need for NgModule)
  imports: [
    CommonModule,        // ✅ required for *ngIf, *ngFor, etc.
    CardModule,          // ✅ PrimeNG Card component
    ButtonModule,        // ✅ PrimeNG Button component
    TagModule,           // ✅ PrimeNG Tag (for status)
    ProgressBarModule    // ✅ PrimeNG Progress bar (for charge)
  ],
  templateUrl: './details-component.html',
  styleUrls: ['./details-component.scss']
})
export class DetailsComponent implements OnInit {
  robotId: string | null = null; // stores the ID from the route (URL)
  robot: any = null;             // stores the selected robot data

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // 🔹 Get the robot ID from the route parameter
    this.robotId = this.route.snapshot.paramMap.get('id');

    // 🔹 Mock data for demonstration (can be replaced with real API data)
    const mockRobots = [
      { id: 1, name: 'Robot A', charge: 78, status: 'Active', description: 'Operating in Zone 3' },
      { id: 2, name: 'Robot B', charge: 45, status: 'Charging', description: 'Docked for recharging' },
      { id: 3, name: 'Robot C', charge: 90, status: 'Idle', description: 'Ready for next mission' },
      { id: 4, name: 'Robot D', charge: 22, status: 'Error', description: 'System malfunction detected' }
    ];

    // 🔹 Find the robot with the same ID
    this.robot = mockRobots.find(r => r.id.toString() === this.robotId);
  }

  // 🔹 Returns a color severity for the PrimeNG Tag
  getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | null {
    switch (status) {
      case 'Active': return 'success';
      case 'Charging': return 'info';
      case 'Idle': return 'warn';
      case 'Error': return 'danger';
      default: return null;
    }
  }

  // 🔹 Navigate back to the fleet list page
  goBack() {
    this.router.navigate(['/fleet-list']);
  }
}
