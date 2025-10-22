import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./shared/components/sidebar-component/sidebar-component";
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SplitterModule } from 'primeng/splitter';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { PrimengSharedModule } from './shared/modules/primeng-shared-module';
@Component({
  selector: 'app-root',
  imports: [

    CommonModule,
    RouterOutlet,
    SidebarComponent,
    PrimengSharedModule,
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('battman-dashboard');
}
