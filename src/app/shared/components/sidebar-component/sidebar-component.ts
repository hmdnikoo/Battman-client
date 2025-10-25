import { Component, HostListener } from '@angular/core';
import { SharedModule } from '../../modules/shared-module';
@Component({
  selector: 'sidebar-component',
  imports: [
    SharedModule],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.scss'
})
export class SidebarComponent {
isCollapsed = false;
  isMobileHidden = false;

  constructor() {
    this.onResize();
  }

  // Handle screen resizing
  @HostListener('window:resize')
  onResize() {
    this.isMobileHidden = window.innerWidth < 1024; // hide sidebar under 1024px (lg)
  }

  toggleSidebar() {
    this.isMobileHidden = !this.isMobileHidden;
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  closeOnMobile() {
    if (window.innerWidth < 1024) {
      this.isMobileHidden = true;
    }
  }
}
