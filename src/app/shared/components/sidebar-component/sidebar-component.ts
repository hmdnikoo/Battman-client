import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Drawer } from "primeng/drawer";
import { Button } from "primeng/button";
@Component({
  selector: 'sidebar-component',
  imports: [CardModule, Drawer, Button],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.scss'
})
export class SidebarComponent {
visible = false;
}
