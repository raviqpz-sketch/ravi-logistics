import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../../core/services/api.service';
import { PickTask, Wave } from '../../../core/models';
import { ConfirmPickDialogComponent } from './confirm-pick-dialog.component';

@Component({
  selector: 'app-pick-list',
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1><mat-icon>pan_tool</mat-icon> Pick Management</h1>
        <div class="action-bar">
          <mat-form-field appearance="outline" style="width:200px">
            <mat-label>Wave</mat-label>
            <mat-select [(ngModel)]="selectedWaveId" (selectionChange)="loadPickTasks()">
              <mat-option [value]="null">All Waves</mat-option>
              <mat-option *ngFor="let w of waves" [value]="w.waveId">{{ w.waveNumber }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" style="width:150px">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="selectedStatus" (selectionChange)="loadPickTasks()">
              <mat-option value="">All</mat-option>
              <mat-option value="OPEN">Open</mat-option>
              <mat-option value="ASSIGNED">Assigned</mat-option>
              <mat-option value="COMPLETED">Completed</mat-option>
              <mat-option value="SHORT_PICKED">Short Picked</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" style="width:150px">
            <mat-label>Picker ID</mat-label>
            <input matInput [(ngModel)]="pickerFilter" (keyup.enter)="loadPickTasks()" placeholder="Search picker">
          </mat-form-field>
        </div>
      </div>

      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-title">Total Tasks</div>
          <div class="card-value">{{ dataSource.data.length }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">Open</div>
          <div class="card-value" style="color:#1565c0">{{ countByStatus('OPEN') }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">Assigned</div>
          <div class="card-value" style="color:#e65100">{{ countByStatus('ASSIGNED') }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">Completed</div>
          <div class="card-value" style="color:#2e7d32">{{ countByStatus('COMPLETED') }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">Short Picks</div>
          <div class="card-value" style="color:#c62828">{{ countByStatus('SHORT_PICKED') }}</div>
        </div>
      </div>

      <div *ngIf="loading" class="loading-spinner"><mat-spinner></mat-spinner></div>

      <mat-card *ngIf="!loading">
        <mat-table [dataSource]="dataSource">
          <ng-container matColumnDef="pickTaskId">
            <mat-header-cell *matHeaderCellDef>Task #</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.pickTaskId }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="waveId">
            <mat-header-cell *matHeaderCellDef>Wave</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.waveId }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="orderId">
            <mat-header-cell *matHeaderCellDef>Order</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.orderId }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="itemId">
            <mat-header-cell *matHeaderCellDef>Item</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.itemId }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="pickLocationId">
            <mat-header-cell *matHeaderCellDef>Pick Location</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.pickLocationId }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="progress">
            <mat-header-cell *matHeaderCellDef>Progress</mat-header-cell>
            <mat-cell *matCellDef="let row" style="min-width:120px">
              <div style="width:100%">
                <mat-progress-bar mode="determinate"
                  [value]="pickProgress(row)"
                  [color]="row.status === 'SHORT_PICKED' ? 'warn' : 'primary'">
                </mat-progress-bar>
                <small>{{ row.confirmedQty }}/{{ row.pickQty }}</small>
              </div>
            </mat-cell>
          </ng-container>
          <ng-container matColumnDef="pickerId">
            <mat-header-cell *matHeaderCellDef>Picker</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.pickerId || '—' }}</mat-cell>
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
              <button mat-icon-button color="accent"
                      *ngIf="row.status === 'OPEN'"
                      (click)="assignPicker(row)" matTooltip="Assign Picker">
                <mat-icon>person_add</mat-icon>
              </button>
              <button mat-icon-button color="primary"
                      *ngIf="['OPEN','ASSIGNED'].includes(row.status)"
                      (click)="openConfirmDialog(row)" matTooltip="Confirm Pick">
                <mat-icon>check</mat-icon>
              </button>
            </mat-cell>
          </ng-container>
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" [attr.colspan]="displayedColumns.length"
                style="text-align:center;padding:24px;color:#999">No pick tasks found.</td>
          </tr>
        </mat-table>
        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
      </mat-card>
    </div>
  `,
  styles: ['.page-header h1 { display:flex; align-items:center; gap:8px; }']
})
export class PickListComponent implements OnInit {
  displayedColumns = ['pickTaskId', 'waveId', 'orderId', 'itemId', 'pickLocationId', 'progress', 'pickerId', 'status', 'actions'];
  dataSource = new MatTableDataSource<PickTask>([]);
  waves: Wave[] = [];
  selectedWaveId: number | null = null;
  selectedStatus = '';
  pickerFilter = '';
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: ApiService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.api.getWaves(1).subscribe(w => this.waves = w);
    this.loadPickTasks();
  }

  loadPickTasks() {
    this.loading = true;
    this.api.getPickTasks({
      waveId: this.selectedWaveId ?? undefined,
      status: this.selectedStatus || undefined,
      pickerId: this.pickerFilter || undefined
    }).subscribe({
      next: data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  countByStatus(s: string) { return this.dataSource.data.filter(p => p.status === s).length; }
  pickProgress(task: PickTask): number {
    if (!task.pickQty) return 0;
    return Math.min(100, (task.confirmedQty / task.pickQty) * 100);
  }

  assignPicker(task: PickTask) {
    const pickerId = prompt('Enter Picker ID:', 'PICKER01');
    if (!pickerId) return;
    this.api.assignPickTask(task.pickTaskId, pickerId).subscribe({
      next: () => {
        this.snackBar.open(`Task ${task.pickTaskId} assigned to ${pickerId}`, 'Close', { duration: 3000, panelClass: ['success'] });
        this.loadPickTasks();
      }
    });
  }

  openConfirmDialog(task: PickTask) {
    const ref = this.dialog.open(ConfirmPickDialogComponent, {
      width: '480px',
      data: { task }
    });
    ref.afterClosed().subscribe(r => { if (r) this.loadPickTasks(); });
  }
}
