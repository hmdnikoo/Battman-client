import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./shared/components/sidebar-component/sidebar-component";
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SplitterModule } from 'primeng/splitter';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    DrawerModule,
    CardModule,
    ButtonModule,
    SplitterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('battman-dashboard');
}
