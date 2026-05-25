import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../../core/services/api.service';
import { Shipment } from '../../../core/models';
import { CreateShipmentDialogComponent } from './create-shipment-dialog.component';

@Component({
  selector: 'app-shipment-list',
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1><mat-icon>flight_takeoff</mat-icon> Shipment Management</h1>
        <div class="action-bar">
          <mat-form-field appearance="outline" style="width:170px">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="selectedStatus" (selectionChange)="loadShipments()">
              <mat-option value="">All</mat-option>
              <mat-option value="CREATED">Created</mat-option>
              <mat-option value="LABEL_PRINTED">Label Printed</mat-option>
              <mat-option value="DISPATCHED">Dispatched</mat-option>
              <mat-option value="IN_TRANSIT">In Transit</mat-option>
              <mat-option value="DELIVERED">Delivered</mat-option>
              <mat-option value="EXCEPTION">Exception</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="openCreateDialog()">
            <mat-icon>add</mat-icon> New Shipment
          </button>
        </div>
      </div>

      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-title">Total Shipments</div>
          <div class="card-value">{{ dataSource.data.length }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">Dispatched</div>
          <div class="card-value" style="color:#6a1b9a">{{ countByStatus('DISPATCHED') }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">In Transit</div>
          <div class="card-value" style="color:#e65100">{{ countByStatus('IN_TRANSIT') }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">Delivered</div>
          <div class="card-value" style="color:#2e7d32">{{ countByStatus('DELIVERED') }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">Exceptions</div>
          <div class="card-value" style="color:#c62828">{{ countByStatus('EXCEPTION') }}</div>
        </div>
      </div>

      <div *ngIf="loading" class="loading-spinner"><mat-spinner></mat-spinner></div>

      <mat-card *ngIf="!loading">
        <mat-table [dataSource]="dataSource">
          <ng-container matColumnDef="shipmentNumber">
            <mat-header-cell *matHeaderCellDef>Shipment #</mat-header-cell>
            <mat-cell *matCellDef="let row"><strong>{{ row.shipmentNumber }}</strong></mat-cell>
          </ng-container>
          <ng-container matColumnDef="orderId">
            <mat-header-cell *matHeaderCellDef>Order ID</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.orderId }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="carrierName">
            <mat-header-cell *matHeaderCellDef>Carrier</mat-header-cell>
            <mat-cell *matCellDef="let row">
              {{ row.carrierName }} <small style="color:#666">({{ row.serviceLevel }})</small>
            </mat-cell>
          </ng-container>
          <ng-container matColumnDef="trackingNumber">
            <mat-header-cell *matHeaderCellDef>Tracking #</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <span *ngIf="row.trackingNumber" style="font-family:monospace; font-size:12px">
                {{ row.trackingNumber }}
              </span>
              <span *ngIf="!row.trackingNumber" style="color:#999">—</span>
            </mat-cell>
          </ng-container>
          <ng-container matColumnDef="shipDate">
            <mat-header-cell *matHeaderCellDef>Ship Date</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.shipDate | date:'MMM dd, yyyy' }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="estimatedDelivery">
            <mat-header-cell *matHeaderCellDef>Est. Delivery</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.estimatedDelivery | date:'MMM dd, yyyy' }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="totalBoxes">
            <mat-header-cell *matHeaderCellDef>Boxes</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.totalBoxes }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <span [class]="'status-badge ' + row.status">{{ row.status }}</span>
            </mat-cell>
          </ng-container>
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <button mat-icon-button color="primary"
                      *ngIf="['CREATED','LABEL_PRINTED'].includes(row.status)"
                      (click)="dispatchShipment(row)" matTooltip="Dispatch Shipment">
                <mat-icon>local_shipping</mat-icon>
              </button>
              <button mat-icon-button color="accent"
                      *ngIf="row.status === 'DISPATCHED'"
                      (click)="markInTransit(row)" matTooltip="Mark In Transit">
                <mat-icon>flight</mat-icon>
              </button>
              <button mat-icon-button
                      *ngIf="row.status === 'IN_TRANSIT'"
                      (click)="markDelivered(row)" matTooltip="Mark Delivered">
                <mat-icon>done</mat-icon>
              </button>
              <button mat-icon-button (click)="copyTracking(row)" matTooltip="Copy Tracking #"
                      *ngIf="row.trackingNumber">
                <mat-icon>content_copy</mat-icon>
              </button>
            </mat-cell>
          </ng-container>
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" [attr.colspan]="displayedColumns.length"
                style="text-align:center;padding:24px;color:#999">No shipments found.</td>
          </tr>
        </mat-table>
        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
      </mat-card>
    </div>
  `,
  styles: ['.page-header h1 { display:flex; align-items:center; gap:8px; }']
})
export class ShipmentListComponent implements OnInit {
  displayedColumns = ['shipmentNumber', 'orderId', 'carrierName', 'trackingNumber', 'shipDate', 'estimatedDelivery', 'totalBoxes', 'status', 'actions'];
  dataSource = new MatTableDataSource<Shipment>([]);
  selectedStatus = '';
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: ApiService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() { this.loadShipments(); }

  loadShipments() {
    this.loading = true;
    this.api.getShipments(this.selectedStatus || undefined).subscribe({
      next: data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  countByStatus(s: string) { return this.dataSource.data.filter(sh => sh.status === s).length; }

  openCreateDialog() {
    const ref = this.dialog.open(CreateShipmentDialogComponent, { width: '560px' });
    ref.afterClosed().subscribe(r => { if (r) this.loadShipments(); });
  }

  dispatchShipment(sh: Shipment) {
    const by = prompt('Shipped By (name/ID):', 'SHIPPER01');
    if (!by) return;
    const today = new Date().toISOString().split('T')[0];
    this.api.dispatchShipment(sh.shipmentId, { shippedBy: by, shipDate: today }).subscribe({
      next: () => {
        this.snackBar.open(`Shipment ${sh.shipmentNumber} dispatched!`, 'Close', { duration: 3000, panelClass: ['success'] });
        this.loadShipments();
      }
    });
  }

  markInTransit(sh: Shipment) {
    this.api.updateShipmentStatus(sh.shipmentId, 'IN_TRANSIT').subscribe({
      next: () => {
        this.snackBar.open(`Shipment ${sh.shipmentNumber} is In Transit`, 'Close', { duration: 3000 });
        this.loadShipments();
      }
    });
  }

  markDelivered(sh: Shipment) {
    this.api.updateShipmentStatus(sh.shipmentId, 'DELIVERED').subscribe({
      next: () => {
        this.snackBar.open(`Shipment ${sh.shipmentNumber} delivered! ✅`, 'Close', { duration: 3000, panelClass: ['success'] });
        this.loadShipments();
      }
    });
  }

  copyTracking(sh: Shipment) {
    navigator.clipboard.writeText(sh.trackingNumber).then(() => {
      this.snackBar.open(`Tracking # copied: ${sh.trackingNumber}`, 'Close', { duration: 2000 });
    });
  }
}
