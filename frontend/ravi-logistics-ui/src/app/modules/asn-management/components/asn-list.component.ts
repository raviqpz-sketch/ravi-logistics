import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { Customer, Asn } from '../../../core/models';
import { AsnFormDialogComponent } from './asn-form-dialog.component';

@Component({
  selector: 'app-asn-list',
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-title">
          <mat-icon class="header-icon">local_shipping</mat-icon>
          <h1>ASN Management</h1>
        </div>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon> New ASN
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <mat-card class="summary-card">
          <mat-card-content>
            <div class="card-value">{{ dataSource.data.length }}</div>
            <div class="card-label">Total ASNs</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="summary-card warning">
          <mat-card-content>
            <div class="card-value">{{ getPendingCount() }}</div>
            <div class="card-label">Pending</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="summary-card success">
          <mat-card-content>
            <div class="card-value">{{ getReceivedCount() }}</div>
            <div class="card-label">Received</div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Filters -->
      <mat-card class="filter-card">
        <mat-card-content>
          <mat-form-field appearance="outline">
            <mat-label>Filter by Customer</mat-label>
            <mat-select [(ngModel)]="selectedCustomerId" (selectionChange)="loadAsns()">
              <mat-option [value]="null">All Customers</mat-option>
              <mat-option *ngFor="let c of customers" [value]="c.customerId">{{ c.customerName }}</mat-option>
            </mat-select>
          </mat-form-field>
        </mat-card-content>
      </mat-card>

      <!-- Loading Spinner -->
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="48"></mat-spinner>
      </div>

      <!-- Status Flow -->
      <div class="status-flow">
        <span class="flow-label">Status Flow:</span>
        <mat-chip-set>
          <mat-chip>DRAFT</mat-chip>
          <mat-icon class="flow-arrow">arrow_forward</mat-icon>
          <mat-chip>SENT</mat-chip>
          <mat-icon class="flow-arrow">arrow_forward</mat-icon>
          <mat-chip>IN_TRANSIT</mat-chip>
          <mat-icon class="flow-arrow">arrow_forward</mat-icon>
          <mat-chip>ARRIVED</mat-chip>
          <mat-icon class="flow-arrow">arrow_forward</mat-icon>
          <mat-chip>RECEIVED</mat-chip>
          <mat-icon class="flow-arrow">arrow_forward</mat-icon>
          <mat-chip>CLOSED</mat-chip>
        </mat-chip-set>
      </div>

      <!-- Table -->
      <mat-card class="table-card" *ngIf="!loading">
        <mat-card-content>
          <table mat-table [dataSource]="dataSource" class="full-width-table">

            <ng-container matColumnDef="asnNumber">
              <th mat-header-cell *matHeaderCellDef>ASN Number</th>
              <td mat-cell *matCellDef="let row">
                <strong>{{ row.asnNumber }}</strong>
              </td>
            </ng-container>

            <ng-container matColumnDef="supplierName">
              <th mat-header-cell *matHeaderCellDef>Supplier</th>
              <td mat-cell *matCellDef="let row">{{ row.supplierName }}</td>
            </ng-container>

            <ng-container matColumnDef="expectedDate">
              <th mat-header-cell *matHeaderCellDef>Expected Date</th>
              <td mat-cell *matCellDef="let row">{{ row.expectedDate | date:'MMM dd, yyyy' }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let row">
                <span [class]="'status-badge ' + row.status">{{ row.status }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let row">
                <button mat-icon-button color="primary" matTooltip="View Details" (click)="viewAsn(row)">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="accent" matTooltip="Update Status" (click)="updateStatus(row)">
                  <mat-icon>edit</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell no-data-cell" [attr.colspan]="displayedColumns.length">
                No ASNs found.
              </td>
            </tr>
          </table>
          <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
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
      .summary-card.warning { border-top: 4px solid #ff9800; }
      .summary-card.success { border-top: 4px solid #4caf50; }
      .card-value { font-size: 32px; font-weight: 700; color: #1976d2; }
      .card-label { font-size: 14px; color: #666; margin-top: 4px; }
      .filter-card { margin-bottom: 16px; }
      .loading-container { display: flex; justify-content: center; padding: 48px; }
      .status-flow { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
      .flow-label { font-weight: 600; color: #666; }
      .flow-arrow { font-size: 18px; color: #999; }
      .table-card { overflow: hidden; }
      .full-width-table { width: 100%; }
      .no-data-cell { text-align: center; padding: 48px; color: #999; }
      .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
      .status-badge.DRAFT { background: #e3f2fd; color: #1565c0; }
      .status-badge.SENT { background: #fff8e1; color: #f57f17; }
      .status-badge.IN_TRANSIT { background: #e8f5e9; color: #2e7d32; }
      .status-badge.ARRIVED { background: #f3e5f5; color: #6a1b9a; }
      .status-badge.RECEIVED { background: #e0f2f1; color: #00695c; }
      .status-badge.CLOSED { background: #eceff1; color: #455a64; }
    </style>
  `
})
export class AsnListComponent implements OnInit {
  dataSource = new MatTableDataSource<Asn>();
  customers: Customer[] = [];
  selectedCustomerId: number | null = null;
  loading = false;
  displayedColumns = ['asnNumber', 'supplierName', 'expectedDate', 'status', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.loadAsns();
  }

  loadCustomers(): void {
    this.api.getCustomers().subscribe({
      next: (data) => { this.customers = data; },
      error: () => { this.snackBar.open('Failed to load customers', 'Close', { duration: 3000, panelClass: ['error'] }); }
    });
  }

  loadAsns(): void {
    this.loading = true;
    const params: any = {};
    if (this.selectedCustomerId) { params.customerId = this.selectedCustomerId; }
    this.api.getAsns(params).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        setTimeout(() => { this.dataSource.paginator = this.paginator; });
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load ASNs', 'Close', { duration: 3000, panelClass: ['error'] });
        this.loading = false;
      }
    });
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(AsnFormDialogComponent, { width: '720px', data: {} });
    ref.afterClosed().subscribe(result => {
      if (result) { this.loadAsns(); }
    });
  }

  viewAsn(asn: Asn): void {
    this.snackBar.open(`ASN ${asn.asnNumber} - ${asn.lines?.length || 0} line(s)`, 'Close', { duration: 4000 });
  }

  updateStatus(asn: Asn): void {
    const nextStatus = this.getNextStatus(asn.status);
    if (!nextStatus) {
      this.snackBar.open('ASN is already in final status', 'Close', { duration: 3000 });
      return;
    }
    const ref = this.dialog.open(StatusConfirmDialogComponent, {
      width: '400px',
      data: { asn, nextStatus }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.api.updateAsnStatus(asn.asnId, nextStatus).subscribe({
          next: () => {
            this.snackBar.open(`ASN status updated to ${nextStatus}`, 'Close', { duration: 3000, panelClass: ['success'] });
            this.loadAsns();
          },
          error: () => {
            this.snackBar.open('Failed to update status', 'Close', { duration: 3000, panelClass: ['error'] });
          }
        });
      }
    });
  }

  getNextStatus(current: string): string | null {
    const flow = ['DRAFT', 'SENT', 'IN_TRANSIT', 'ARRIVED', 'RECEIVED', 'CLOSED'];
    const idx = flow.indexOf(current);
    return idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
  }

  getPendingCount(): number {
    return this.dataSource.data.filter(a => a.status === 'DRAFT' || a.status === 'SENT').length;
  }

  getReceivedCount(): number {
    return this.dataSource.data.filter(a => a.status === 'RECEIVED').length;
  }
}

// Inline status confirm dialog
import { Component as Comp2, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Comp2({
  selector: 'app-status-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Update ASN Status</h2>
    <mat-dialog-content>
      <p>Update <strong>{{ data.asn.asnNumber }}</strong> from
        <span [class]="'status-badge ' + data.asn.status">{{ data.asn.status }}</span>
        to
        <span [class]="'status-badge ' + data.nextStatus">{{ data.nextStatus }}</span>?
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="confirm()">Confirm</button>
    </mat-dialog-actions>
    <style>
      .status-badge { padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: 600; }
      .status-badge.DRAFT { background: #e3f2fd; color: #1565c0; }
      .status-badge.SENT { background: #fff8e1; color: #f57f17; }
      .status-badge.IN_TRANSIT { background: #e8f5e9; color: #2e7d32; }
      .status-badge.ARRIVED { background: #f3e5f5; color: #6a1b9a; }
      .status-badge.RECEIVED { background: #e0f2f1; color: #00695c; }
      .status-badge.CLOSED { background: #eceff1; color: #455a64; }
    </style>
  `
})
export class StatusConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<StatusConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { asn: Asn; nextStatus: string }
  ) {}

  confirm(): void {
    this.dialogRef.close(true);
  }
}
