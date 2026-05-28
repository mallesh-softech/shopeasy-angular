import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VendorSidebarComponent } from '../../pages/vendor/shared/components/sidebar/vendor-sidebar.component';
import { VendorTopbarComponent } from '../../pages/vendor/shared/components/topbar/vendor-topbar.component';

@Component({
  selector: 'app-vendor-layout',
  standalone: true,
  imports: [RouterOutlet, VendorSidebarComponent, VendorTopbarComponent],
  template: `
    <div class="vendor-layout" [class.sidebar-collapsed]="sidebarCollapsed()">
      <app-vendor-sidebar [collapsed]="sidebarCollapsed()" (toggleSidebar)="sidebarCollapsed.set(!sidebarCollapsed())" />
      <div class="vendor-main">
        <app-vendor-topbar />
        <main class="vendor-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .vendor-layout {
      display: flex;
      min-height: 100vh;
      background: #f1f5f9;
    }
    .vendor-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      margin-left: 260px;
      transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    .vendor-layout.sidebar-collapsed .vendor-main {
      margin-left: 72px;
    }
    .vendor-content {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
    }
    @media (max-width: 768px) {
      .vendor-main { margin-left: 0; }
      .vendor-layout.sidebar-collapsed .vendor-main { margin-left: 0; }
    }
  `]
})
export class VendorLayoutComponent {
  sidebarCollapsed = signal(false);
}
