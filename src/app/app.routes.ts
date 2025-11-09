import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/components/home-component/home-component';
import { FleetListComponent } from './pages/fleetList/components/fleet-list-component/fleet-list-component';
import { DetailsComponent } from './pages/details/components/details-component/details-component';
import { RobotListComponent } from './pages/RobotList/robot-list-component/robot-list-component';
import { RobotDetailsComponent } from './pages/RobotList/details/robot-details-component/robot-details-component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'fleet-list', component: FleetListComponent },
  { path: 'fleet/details/:id', component: DetailsComponent },
  { path: 'robot-list', component: RobotListComponent },
  { path: 'robot/details/:id', component: RobotDetailsComponent }
];
