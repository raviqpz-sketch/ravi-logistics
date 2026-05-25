import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../../../core/services/api.service';
import { Order, Customer } from '../../../core/models';
import { OrderFormDialogComponent } from './order-form-dialog.component';

@Component({
  selector: 'app-order-list',
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1><mat-icon>shopping_cart</mat-icon> Order Management</h1>
        <div class="action-bar">
          <mat-form-field appearance="outline" style="width:190px">
            <mat-label>Customer</mat-label>
            <mat-select [(ngModel)]="selectedCustomerId" (selectionChange)="loadOrders()">
              <mat-option [value]="null">All Customers</mat-option>
              <mat-option *ngFor="let c of customers" [value]="c.customerId">{{ c.customerName }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" style="width:160px">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="selectedStatus" (selectionChange)="loadOrders()">
              <mat-option value="">All</mat-option>
              <mat-option value="CREATED">Created</mat-option>
              <mat-option value="ALLOCATED">Allocated</mat-option>
              <mat-option value="WAVED">Waved</mat-option>
              <mat-option value="PICKED">Picked</mat-option>
              <mat-option value="PACKED">Packed</mat-option>
              <mat-option value="SHIPPED">Shipped</mat-option>
              <mat-option value="CANCELLED">Cancelled</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="openCreateDialog()">
            <mat-icon>add</mat-icon> New Order
          </button>
        </div>
      </div>

      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-title">Total Orders</div>
          <div class="card-value">{{ dataSource.data.length }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">New (Created)</div>
          <div class="card-value" style="color:#1565c0">{{ countByStatus('CREATED') }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">Allocated</div>
          <div class="card-value" style="color:#e65100">{{ countByStatus('ALLOCATED') }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">Shipped</div>
          <div class="card-value" style="color:#2e7d32">{{ countByStatus('SHIPPED') }}</div>
        </div>
      </div>

      <div *ngIf="loading" class="loading-spinner"><mat-spinner></mat-spinner></div>

      <mat-card *ngIf="!loading">
        <mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="orderNumber">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Order #</mat-header-cell>
            <mat-cell *matCellDef="let row"><strong>{{ row.orderNumber }}</strong></mat-cell>
          </ng-container>
          <ng-container matColumnDef="requiredShipDate">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Ship By</mat-header-cell>
            <mat-cell *matCellDef="let row"
              [style.color]="isOverdue(row.requiredShipDate) ? '#c62828' : 'inherit'">
              {{ row.requiredShipDate | date:'MMM dd, yyyy' }}
              <mat-icon *ngIf="isOverdue(row.requiredShipDate)" style="font-size:14px; color:#c62828">warning</mat-icon>
            </mat-cell>
          </ng-container>
          <ng-container matColumnDef="shipToName">
            <mat-header-cell *matHeaderCellDef>Ship To</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.shipToName }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="shipToCity">
            <mat-header-cell *matHeaderCellDef>City</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.shipToCity }}, {{ row.shipToState }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="priority">
            <mat-header-cell *matHeaderCellDef>Priority</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <span [style.color]="priorityColor(row.priority)"
                    style="font-weight:bold">P{{ row.priority }}</span>
            </mat-cell>
          </ng-container>
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Status</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <span [class]="'status-badge ' + row.status">{{ row.status }}</span>
            </mat-cell>
          </ng-container>
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <button mat-icon-button color="primary"
                      *ngIf="row.status === 'CREATED'"
                      (click)="allocateOrder(row)" matTooltip="Allocate Inventory">
                <mat-icon>check_circle</mat-icon>
              </button>
              <button mat-icon-button (click)="viewLines(row)" matTooltip="View Lines">
                <mat-icon>list</mat-icon>
              </button>
              <button mat-icon-button color="warn"
                      *ngIf="['CREATED','ALLOCATED'].includes(row.status)"
                      (click)="cancelOrder(row)" matTooltip="Cancel Order">
                <mat-icon>cancel</mat-icon>
              </button>
            </mat-cell>
          </ng-container>
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell no-data" [attr.colspan]="displayedColumns.length">No orders found.</td>
          </tr>
        </mat-table>
        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-header h1 { display:flex; align-items:center; gap:8px; }
    .no-data { text-align:center; padding:24px; color:#999; }
  `]
})
export class OrderListComponent implements OnInit {
  displayedColumns = ['orderNumber', 'requiredShipDate', 'shipToName', 'shipToCity', 'priority', 'status', 'actions'];
  dataSource = new MatTableDataSource<Order>([]);
  customers: Customer[] = [];
  selectedCustomerId: number | null = null;
  selectedStatus = '';
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private api: ApiService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.api.getCustomers().subscribe(c => this.customers = c);
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.api.getOrders(
      this.selectedCustomerId ?? undefined,
      this.selectedStatus || undefined
    ).subscribe({
      next: data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  countByStatus(status: string) { return this.dataSource.data.filter(o => o.status === status).length; }

  isOverdue(dateStr: string): boolean {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date() && !['SHIPPED', 'CANCELLED'].includes('');
  }

  priorityColor(p: number): string {
    if (p <= 3) return '#c62828';
    if (p <= 6) return '#e65100';
    return '#2e7d32';
  }

  openCreateDialog() {
    const ref = this.dialog.open(OrderFormDialogComponent, {
      width: '750px',
      data: { customers: this.customers }
    });
    ref.afterClosed().subscribe(r => { if (r) this.loadOrders(); });
  }

  allocateOrder(order: Order) {
    if (!confirm(`Allocate inventory for order ${order.orderNumber}?`)) return;
    this.api.allocateOrder(order.orderId).subscribe({
      next: () => {
        this.snackBar.open(`Order ${order.orderNumber} allocated!`, 'Close', { duration: 3000, panelClass: ['success'] });
        this.loadOrders();
      }
    });
  }

  viewLines(order: Order) {
    this.api.getOrderLines(order.orderId).subscribe(lines => {
      this.snackBar.open(`Order ${order.orderNumber}: ${lines.length} line(s)`, 'Close', { duration: 4000 });
    });
  }

  cancelOrder(order: Order) {
    if (!confirm(`Cancel order ${order.orderNumber}? This cannot be undone.`)) return;
    this.api.cancelOrder(order.orderId).subscribe({
      next: () => {
        this.snackBar.open('Order cancelled', 'Close', { duration: 3000, panelClass: ['error'] });
        this.loadOrders();
      }
    });
  }
}
