import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../core/services/api.service';
import { Order } from '../../../core/models';

@Component({
  selector: 'app-create-wave-dialog',
  template: `
    <h2 mat-dialog-title>Create Pick Wave</h2>
    <mat-dialog-content style="min-width:620px">
      <p style="color:#666; margin-bottom:12px">
        Select ALLOCATED orders to include in this wave. Orders will be grouped and released to pickers.
      </p>

      <div *ngIf="loading" style="text-align:center; padding:32px"><mat-spinner [diameter]="36"></mat-spinner></div>

      <div *ngIf="!loading && orders.length === 0"
           style="text-align:center; padding:24px; color:#999; background:#f5f5f5; border-radius:8px">
        <mat-icon style="font-size:48px; width:48px; height:48px">info</mat-icon>
        <p>No allocated orders available. Allocate orders first.</p>
      </div>

      <mat-table *ngIf="!loading && orders.length > 0" [dataSource]="dataSource">
        <ng-container matColumnDef="select">
          <mat-header-cell *matHeaderCellDef>
            <mat-checkbox (change)="$event ? masterToggle() : null"
                          [checked]="selection.hasValue() && isAllSelected()"
                          [indeterminate]="selection.hasValue() && !isAllSelected()">
            </mat-checkbox>
          </mat-header-cell>
          <mat-cell *matCellDef="let row">
            <mat-checkbox (click)="$event.stopPropagation()"
                          (change)="$event ? selection.toggle(row) : null"
                          [checked]="selection.isSelected(row)">
            </mat-checkbox>
          </mat-cell>
        </ng-container>
        <ng-container matColumnDef="orderNumber">
          <mat-header-cell *matHeaderCellDef>Order #</mat-header-cell>
          <mat-cell *matCellDef="let row"><strong>{{ row.orderNumber }}</strong></mat-cell>
        </ng-container>
        <ng-container matColumnDef="requiredShipDate">
          <mat-header-cell *matHeaderCellDef>Ship By</mat-header-cell>
          <mat-cell *matCellDef="let row">{{ row.requiredShipDate | date:'MMM dd' }}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="shipToCity">
          <mat-header-cell *matHeaderCellDef>Destination</mat-header-cell>
          <mat-cell *matCellDef="let row">{{ row.shipToCity }}, {{ row.shipToState }}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="priority">
          <mat-header-cell *matHeaderCellDef>Priority</mat-header-cell>
          <mat-cell *matCellDef="let row">P{{ row.priority }}</mat-cell>
        </ng-container>
        <mat-header-row *matHeaderRowDef="cols"></mat-header-row>
        <mat-row *matRowDef="let row; columns: cols;" (click)="selection.toggle(row)"
                 [style.background]="selection.isSelected(row) ? '#e3f2fd' : ''"></mat-row>
      </mat-table>

      <div *ngIf="selection.hasValue()" style="margin-top:12px; padding:8px; background:#e8f5e9; border-radius:4px">
        <strong>Selected: {{ selection.selected.length }} order(s)</strong>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary"
              [disabled]="!selection.hasValue() || creating"
              (click)="createWave()">
        {{ creating ? 'Creating...' : 'Create Wave (' + selection.selected.length + ' orders)' }}
      </button>
    </mat-dialog-actions>
  `
})
export class CreateWaveDialogComponent implements OnInit {
  orders: Order[] = [];
  dataSource = new MatTableDataSource<Order>([]);
  selection = new SelectionModel<Order>(true, []);
  cols = ['select', 'orderNumber', 'requiredShipDate', 'shipToCity', 'priority'];
  loading = false;
  creating = false;

  constructor(
    public dialogRef: MatDialogRef<CreateWaveDialogComponent>,
    private api: ApiService, private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loading = true;
    this.api.getOrders(undefined, 'ALLOCATED').subscribe({
      next: data => {
        this.orders = data;
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  isAllSelected() { return this.selection.selected.length === this.dataSource.data.length; }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(r => this.selection.select(r));
  }

  createWave() {
    if (!this.selection.hasValue()) return;
    this.creating = true;
    const orderIds = this.selection.selected.map(o => o.orderId);
    this.api.createWave({ warehouseId: 1, orderIds, createdBy: 'SYSTEM' }).subscribe({
      next: (wave) => {
        this.snackBar.open(`Wave created: ${wave.waveNumber}`, 'Close', { duration: 3000, panelClass: ['success'] });
        this.dialogRef.close(true);
      },
      error: () => { this.creating = false; }
    });
  }
}
