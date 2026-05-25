import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'RAVI LOGISTICS';
  sidenavOpened = true;

  navItems: NavItem[] = [
    { label: 'Item Management',      icon: 'inventory_2',    route: '/items' },
    { label: 'ASN Management',       icon: 'local_shipping', route: '/asn' },
    { label: 'Inventory Management', icon: 'warehouse',      route: '/inventory' },
    { label: 'Order Management',     icon: 'shopping_cart',  route: '/orders' },
    { label: 'Wave Management',      icon: 'waves',          route: '/waves' },
    { label: 'Pick Management',      icon: 'pan_tool',       route: '/picks' },
    { label: 'Pack Management',      icon: 'inventory',      route: '/packs' },
    { label: 'Shipment Management',  icon: 'flight_takeoff', route: '/shipments' }
  ];

  constructor(private router: Router) {}

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
