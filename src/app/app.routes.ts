import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/components/home-component/home-component';
import { FleetListComponent } from './pages/fleetList/components/fleet-list-component/fleet-list-component';
import { DetailsComponent } from './pages/details/components/details-component/details-component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'fleet-list', component: FleetListComponent },
  { path: 'fleet/details/:id', component: DetailsComponent }
];
