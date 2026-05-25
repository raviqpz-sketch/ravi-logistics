import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../../../core/services/api.service';
import { Item, Customer } from '../../../core/models';
import { ItemFormDialogComponent } from './item-form-dialog.component';

@Component({
  selector: 'app-item-list',
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1><mat-icon>inventory_2</mat-icon> Item Management</h1>
        <div class="action-bar">
          <mat-form-field appearance="outline" style="width:200px">
            <mat-label>Customer</mat-label>
            <mat-select [(ngModel)]="selectedCustomerId" (selectionChange)="loadItems()">
              <mat-option [value]="null">All Customers</mat-option>
              <mat-option *ngFor="let c of customers" [value]="c.customerId">
                {{ c.customerName }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" style="width:220px">
            <mat-label>Search Items</mat-label>
            <input matInput [(ngModel)]="searchTerm" (keyup)="applyFilter()" placeholder="Code or name...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="openCreateDialog()">
            <mat-icon>add</mat-icon> New Item
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-title">Total Items</div>
          <div class="card-value">{{ dataSource.data.length }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">Active Items</div>
          <div class="card-value">{{ activeCount }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">Categories</div>
          <div class="card-value">{{ categoryCount }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">Lot Controlled</div>
          <div class="card-value">{{ lotControlledCount }}</div>
        </div>
      </div>

      <div *ngIf="loading" class="loading-spinner">
        <mat-spinner></mat-spinner>
      </div>

      <mat-card *ngIf="!loading">
        <mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="itemCode">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Item Code</mat-header-cell>
            <mat-cell *matCellDef="let row"><strong>{{ row.itemCode }}</strong></mat-cell>
          </ng-container>
          <ng-container matColumnDef="itemName">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Item Name</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.itemName }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="category">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Category</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <span class="status-badge ALLOCATED">{{ row.category }}</span>
            </mat-cell>
          </ng-container>
          <ng-container matColumnDef="uom">
            <mat-header-cell *matHeaderCellDef>UOM</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.uom }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="unitCost">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Unit Cost</mat-header-cell>
            <mat-cell *matCellDef="let row">\${{ row.unitCost | number:'1.2-2' }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="unitPrice">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Unit Price</mat-header-cell>
            <mat-cell *matCellDef="let row">\${{ row.unitPrice | number:'1.2-2' }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="barcode">
            <mat-header-cell *matHeaderCellDef>Barcode</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.barcode }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <span [class]="'status-badge ' + (row.isActive ? 'RECEIVED' : 'CANCELLED')">
                {{ row.isActive ? 'Active' : 'Inactive' }}
              </span>
            </mat-cell>
          </ng-container>
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <button mat-icon-button color="primary" (click)="openEditDialog(row)" matTooltip="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deactivate(row)" matTooltip="Deactivate">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell no-data" [attr.colspan]="displayedColumns.length">No items found.</td>
          </tr>
        </mat-table>
        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-header h1 { display: flex; align-items: center; gap: 8px; }
    mat-icon { vertical-align: middle; }
    .no-data { text-align: center; padding: 24px; color: #999; }
  `]
})
export class ItemListComponent implements OnInit {
  displayedColumns = ['itemCode', 'itemName', 'category', 'uom', 'unitCost', 'unitPrice', 'barcode', 'status', 'actions'];
  dataSource = new MatTableDataSource<Item>([]);
  customers: Customer[] = [];
  selectedCustomerId: number | null = null;
  searchTerm = '';
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  get activeCount() { return this.dataSource.data.filter(i => i.isActive).length; }
  get categoryCount() { return new Set(this.dataSource.data.map(i => i.category)).size; }
  get lotControlledCount() { return this.dataSource.data.filter(i => i.lotControlled).length; }

  constructor(private api: ApiService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadCustomers();
    this.loadItems();
  }

  loadCustomers() {
    this.api.getCustomers().subscribe(data => this.customers = data);
  }

  loadItems() {
    this.loading = true;
    this.api.getItems(this.selectedCustomerId ?? undefined).subscribe({
      next: data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  applyFilter() {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  openCreateDialog() {
    const ref = this.dialog.open(ItemFormDialogComponent, {
      width: '650px',
      data: { item: null, customers: this.customers }
    });
    ref.afterClosed().subscribe(result => { if (result) this.loadItems(); });
  }

  openEditDialog(item: Item) {
    const ref = this.dialog.open(ItemFormDialogComponent, {
      width: '650px',
      data: { item, customers: this.customers }
    });
    ref.afterClosed().subscribe(result => { if (result) this.loadItems(); });
  }

  deactivate(item: Item) {
    if (confirm(`Deactivate item "${item.itemCode}"?`)) {
      this.api.deleteItem(item.itemId).subscribe(() => {
        this.snackBar.open('Item deactivated', 'Close', { duration: 3000, panelClass: ['success'] });
        this.loadItems();
      });
    }
  }
}
