import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { AdjustInventoryDialogComponent } from './adjust-inventory-dialog.component';

@Component({
  selector: 'app-inventory-list',
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-title">
          <mat-icon class="header-icon">inventory_2</mat-icon>
          <h1>Inventory Management</h1>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <mat-card class="summary-card">
          <mat-card-content>
            <div class="card-value">{{ getTotalSkus() }}</div>
            <div class="card-label">Total SKUs</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="summary-card blue">
          <mat-card-content>
            <div class="card-value">{{ getTotalOnHand() | number:'1.0-0' }}</div>
            <div class="card-label">Total On Hand Units</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="summary-card warning">
          <mat-card-content>
            <div class="card-value">{{ getTotalReserved() | number:'1.0-0' }}</div>
            <div class="card-label">Total Reserved</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="summary-card success">
          <mat-card-content>
            <div class="card-value">{{ getTotalAvailable() | number:'1.0-0' }}</div>
            <div class="card-label">Total Available</div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Filters -->
      <mat-card class="filter-card">
        <mat-card-content class="filter-row">
          <mat-form-field appearance="outline">
            <mat-label>Filter by Customer</mat-label>
            <mat-select [(ngModel)]="selectedCustomerId" (selectionChange)="loadInventory()">
              <mat-option [value]="null">All Customers</mat-option>
              <mat-option *ngFor="let c of customers" [value]="c.id">{{ c.name }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Filter by Warehouse</mat-label>
            <mat-select [(ngModel)]="selectedWarehouseId" (selectionChange)="loadInventory()">
              <mat-option [value]="null">All Warehouses</mat-option>
              <mat-option *ngFor="let w of warehouses" [value]="w.id">{{ w.name }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Search SKU / Item</mat-label>
            <input matInput [(ngModel)]="searchText" (ngModelChange)="applyFilter()" placeholder="Search...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </mat-card-content>
      </mat-card>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="48"></mat-spinner>
      </div>

      <!-- Table -->
      <mat-card class="table-card" *ngIf="!loading">
        <mat-card-content>
          <table mat-table [dataSource]="dataSource" class="full-width-table">

            <ng-container matColumnDef="itemId">
              <th mat-header-cell *matHeaderCellDef>Item SKU</th>
              <td mat-cell *matCellDef="let row">
                <strong>{{ row.itemSku }}</strong><br>
                <small class="item-name">{{ row.itemName }}</small>
              </td>
            </ng-container>

            <ng-container matColumnDef="locationId">
              <th mat-header-cell *matHeaderCellDef>Location</th>
              <td mat-cell *matCellDef="let row">{{ row.locationCode }}</td>
            </ng-container>

            <ng-container matColumnDef="lotNumber">
              <th mat-header-cell *matHeaderCellDef>Lot Number</th>
              <td mat-cell *matCellDef="let row">{{ row.lotNumber || '-' }}</td>
            </ng-container>

            <ng-container matColumnDef="onHandQty">
              <th mat-header-cell *matHeaderCellDef>On Hand</th>
              <td mat-cell *matCellDef="let row">{{ row.onHandQty | number:'1.2-2' }}</td>
            </ng-container>

            <ng-container matColumnDef="reservedQty">
              <th mat-header-cell *matHeaderCellDef>Reserved</th>
              <td mat-cell *matCellDef="let row">
                <span class="reserved-qty">{{ row.reservedQty | number:'1.2-2' }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="availableQty">
              <th mat-header-cell *matHeaderCellDef>Available</th>
              <td mat-cell *matCellDef="let row">
                <span [class]="getAvailabilityClass(row.availableQty)">
                  {{ row.availableQty | number:'1.2-2' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="uom">
              <th mat-header-cell *matHeaderCellDef>UOM</th>
              <td mat-cell *matCellDef="let row">{{ row.uom }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let row">
                <button mat-stroked-button color="primary" (click)="openAdjustDialog(row)" matTooltip="Adjust Inventory">
                  <mat-icon>tune</mat-icon> Adjust
                </button>
                <button mat-icon-button color="accent" (click)="showTransactions(row)" matTooltip="View Transactions">
                  <mat-icon>history</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell no-data-cell" [attr.colspan]="displayedColumns.length">
                No inventory records found.
              </td>
            </tr>
          </table>
          <mat-paginator [pageSizeOptions]="[10, 25, 50, 100]" showFirstLastButtons></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>

    <style>
      .page-container { padding: 24px; }
      .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
      .header-title { display: flex; align-items: center; gap: 12px; }
      .header-title h1 { margin: 0; font-size: 24px; font-weight: 600; }
      .header-icon { font-size: 32px; width: 32px; height: 32px; color: #1976d2; }
      .summary-cards { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
      .summary-card { flex: 1; min-width: 160px; }
      .summary-card.blue { border-top: 4px solid #1976d2; }
      .summary-card.warning { border-top: 4px solid #ff9800; }
      .summary-card.success { border-top: 4px solid #4caf50; }
      .card-value { font-size: 32px; font-weight: 700; color: #1976d2; }
      .card-label { font-size: 14px; color: #666; margin-top: 4px; }
      .filter-card { margin-bottom: 16px; }
      .filter-row { display: flex; gap: 16px; flex-wrap: wrap; }
      .filter-row mat-form-field { flex: 1; min-width: 200px; }
      .loading-container { display: flex; justify-content: center; padding: 48px; }
      .table-card { overflow: hidden; }
      .full-width-table { width: 100%; }
      .no-data-cell { text-align: center; padding: 48px; color: #999; }
      .item-name { color: #666; font-size: 11px; }
      .reserved-qty { color: #f57f17; font-weight: 600; }
      .qty-green { color: #2e7d32; font-weight: 700; }
      .qty-orange { color: #f57f17; font-weight: 700; }
      .qty-red { color: #c62828; font-weight: 700; }
    </style>
  `
})
export class InventoryListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  customers: any[] = [];
  warehouses: any[] = [];
  selectedCustomerId: number | null = null;
  selectedWarehouseId: number | null = null;
  searchText = '';
  loading = false;
  displayedColumns = ['itemId', 'locationId', 'lotNumber', 'onHandQty', 'reservedQty', 'availableQty', 'uom', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.loadWarehouses();
    this.loadInventory();
  }

  loadCustomers(): void {
    this.api.getCustomers().subscribe({
      next: (data) => { this.customers = data; },
      error: () => {}
    });
  }

  loadWarehouses(): void {
    this.api.getWarehouses().subscribe({
      next: (data) => { this.warehouses = data; },
      error: () => {}
    });
  }

  loadInventory(): void {
    this.loading = true;
    const params: any = {};
    if (this.selectedCustomerId) params.customerId = this.selectedCustomerId;
    if (this.selectedWarehouseId) params.warehouseId = this.selectedWarehouseId;
    this.api.getInventory(params).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        setTimeout(() => { this.dataSource.paginator = this.paginator; });
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load inventory', 'Close', { duration: 3000, panelClass: ['error'] });
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  getAvailabilityClass(qty: number): string {
    if (qty > 10) return 'qty-green';
    if (qty >= 1) return 'qty-orange';
    return 'qty-red';
  }

  openAdjustDialog(inv: any): void {
    const ref = this.dialog.open(AdjustInventoryDialogComponent, {
      width: '480px',
      data: { inventory: inv }
    });
    ref.afterClosed().subscribe(result => {
      if (result) { this.loadInventory(); }
    });
  }

  showTransactions(inv: any): void {
    this.api.getInventoryTransactions(inv.inventoryId).subscribe({
      next: (txns) => {
        this.snackBar.open(`${inv.itemSku} @ ${inv.locationCode}: ${txns.length} transaction(s)`, 'Close', { duration: 4000 });
      },
      error: () => {
        this.snackBar.open('Failed to load transactions', 'Close', { duration: 3000, panelClass: ['error'] });
      }
    });
  }

  getTotalSkus(): number { return new Set(this.dataSource.data.map(i => i.itemId)).size; }
  getTotalOnHand(): number { return this.dataSource.data.reduce((s, i) => s + i.onHandQty, 0); }
  getTotalReserved(): number { return this.dataSource.data.reduce((s, i) => s + i.reservedQty, 0); }
  getTotalAvailable(): number { return this.dataSource.data.reduce((s, i) => s + i.availableQty, 0); }
}
