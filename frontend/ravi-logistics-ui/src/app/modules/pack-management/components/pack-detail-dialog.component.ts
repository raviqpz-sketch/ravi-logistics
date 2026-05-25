import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { PackTask, PackBox } from '../../../core/models';

@Component({
  selector: 'app-pack-detail-dialog',
  template: `
    <h2 mat-dialog-title>Pack Task #{{ data.task.packTaskId }} — Boxes</h2>
    <mat-dialog-content style="min-width:500px">
      <div style="background:#f5f5f5; border-radius:8px; padding:12px; margin-bottom:16px">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px">
          <div><strong>Order ID:</strong> {{ data.task.orderId }}</div>
          <div><strong>Station:</strong> {{ data.task.stationCode || 'N/A' }}</div>
          <div><strong>Packer:</strong> {{ data.task.packerId || 'N/A' }}</div>
          <div><strong>Status:</strong>
            <span [class]="'status-badge ' + data.task.status">{{ data.task.status }}</span>
          </div>
        </div>
      </div>

      <div *ngIf="loading" style="text-align:center; padding:24px"><mat-spinner [diameter]="32"></mat-spinner></div>

      <div *ngIf="!loading && boxes.length === 0"
           style="text-align:center; padding:24px; color:#999">
        No boxes added to this pack task yet.
      </div>

      <mat-table *ngIf="!loading && boxes.length > 0" [dataSource]="boxes">
        <ng-container matColumnDef="boxSequence">
          <mat-header-cell *matHeaderCellDef>Box #</mat-header-cell>
          <mat-cell *matCellDef="let box">Box {{ box.boxSequence }}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="boxType">
          <mat-header-cell *matHeaderCellDef>Type</mat-header-cell>
          <mat-cell *matCellDef="let box">{{ box.boxType || 'Standard' }}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="grossWeight">
          <mat-header-cell *matHeaderCellDef>Weight (kg)</mat-header-cell>
          <mat-cell *matCellDef="let box">{{ box.grossWeight || '—' }}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="dimensions">
          <mat-header-cell *matHeaderCellDef>Dimensions (L×W×H)</mat-header-cell>
          <mat-cell *matCellDef="let box">
            {{ box.length && box.width && box.height ? (box.length + '×' + box.width + '×' + box.height) : '—' }}
          </mat-cell>
        </ng-container>
        <ng-container matColumnDef="isClosed">
          <mat-header-cell *matHeaderCellDef>Sealed</mat-header-cell>
          <mat-cell *matCellDef="let box">
            <mat-icon [style.color]="box.isClosed ? '#2e7d32' : '#e65100'">
              {{ box.isClosed ? 'lock' : 'lock_open' }}
            </mat-icon>
          </mat-cell>
        </ng-container>
        <mat-header-row *matHeaderRowDef="cols"></mat-header-row>
        <mat-row *matRowDef="let row; columns: cols;"></mat-row>
      </mat-table>

      <div *ngIf="!loading && boxes.length > 0"
           style="margin-top:12px; padding:8px; background:#e3f2fd; border-radius:4px">
        <strong>Total Boxes: {{ boxes.length }}</strong> |
        <strong>Sealed: {{ getSealedCount() }}</strong>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="dialogRef.close()">Close</button>
    </mat-dialog-actions>
  `
})
export class PackDetailDialogComponent implements OnInit {
  boxes: PackBox[] = [];
  loading = false;
  cols = ['boxSequence', 'boxType', 'grossWeight', 'dimensions', 'isClosed'];

  constructor(
    public dialogRef: MatDialogRef<PackDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: PackTask },
    private api: ApiService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.api.getPackBoxes(this.data.task.packTaskId).subscribe({
      next: boxes => { this.boxes = boxes; this.loading = false; },
      error: () => this.loading = false
    });
  }

  getSealedCount(): number {
    return this.boxes.filter(b => b.isClosed).length;
  }
}
