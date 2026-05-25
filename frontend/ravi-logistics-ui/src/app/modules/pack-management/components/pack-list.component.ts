import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../../core/services/api.service';
import { PackTask } from '../../../core/models';
import { PackDetailDialogComponent } from './pack-detail-dialog.component';

@Component({
  selector: 'app-pack-list',
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1><mat-icon>inventory</mat-icon> Pack Management</h1>
        <div class="action-bar">
          <mat-form-field appearance="outline" style="width:160px">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="selectedStatus" (selectionChange)="loadPackTasks()">
              <mat-option value="">All</mat-option>
              <mat-option value="OPEN">Open</mat-option>
              <mat-option value="IN_PROGRESS">In Progress</mat-option>
              <mat-option value="COMPLETED">Completed</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="createPackTask()">
            <mat-icon>add</mat-icon> Create Pack Task
          </button>
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
          <div class="card-title">In Progress</div>
          <div class="card-value" style="color:#e65100">{{ countByStatus('IN_PROGRESS') }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">Completed</div>
          <div class="card-value" style="color:#2e7d32">{{ countByStatus('COMPLETED') }}</div>
        </div>
      </div>

      <div *ngIf="loading" class="loading-spinner"><mat-spinner></mat-spinner></div>

      <mat-card *ngIf="!loading">
        <mat-table [dataSource]="dataSource">
          <ng-container matColumnDef="packTaskId">
            <mat-header-cell *matHeaderCellDef>Task #</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.packTaskId }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="orderId">
            <mat-header-cell *matHeaderCellDef>Order ID</mat-header-cell>
            <mat-cell *matCellDef="let row"><strong>{{ row.orderId }}</strong></mat-cell>
          </ng-container>
          <ng-container matColumnDef="stationCode">
            <mat-header-cell *matHeaderCellDef>Pack Station</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.stationCode || '—' }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="packerId">
            <mat-header-cell *matHeaderCellDef>Packer</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.packerId || '—' }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="startedAt">
            <mat-header-cell *matHeaderCellDef>Started</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.startedAt | date:'MMM dd, HH:mm' }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="completedAt">
            <mat-header-cell *matHeaderCellDef>Completed</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.completedAt | date:'MMM dd, HH:mm' }}</mat-cell>
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
                      (click)="startTask(row)" matTooltip="Start Packing">
                <mat-icon>play_arrow</mat-icon>
              </button>
              <button mat-icon-button color="primary"
                      *ngIf="row.status === 'IN_PROGRESS'"
                      (click)="addBox(row)" matTooltip="Add Box">
                <mat-icon>add_box</mat-icon>
              </button>
              <button mat-icon-button
                      *ngIf="row.status === 'IN_PROGRESS'"
                      (click)="completeTask(row)" matTooltip="Complete Pack Task">
                <mat-icon>done_all</mat-icon>
              </button>
              <button mat-icon-button (click)="viewBoxes(row)" matTooltip="View Boxes">
                <mat-icon>visibility</mat-icon>
              </button>
            </mat-cell>
          </ng-container>
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" [attr.colspan]="displayedColumns.length"
                style="text-align:center;padding:24px;color:#999">No pack tasks found.</td>
          </tr>
        </mat-table>
        <mat-paginator [pageSizeOptions]="[10, 25]" showFirstLastButtons></mat-paginator>
      </mat-card>
    </div>
  `,
  styles: ['.page-header h1 { display:flex; align-items:center; gap:8px; }']
})
export class PackListComponent implements OnInit {
  displayedColumns = ['packTaskId', 'orderId', 'stationCode', 'packerId', 'startedAt', 'completedAt', 'status', 'actions'];
  dataSource = new MatTableDataSource<PackTask>([]);
  selectedStatus = '';
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: ApiService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() { this.loadPackTasks(); }

  loadPackTasks() {
    this.loading = true;
    // Load all packs (filter client-side)
    this.api.getPackTask(0).subscribe({
      next: (data: unknown) => {
        const arr = Array.isArray(data) ? data : (data ? [data] : []);
        this.dataSource.data = this.selectedStatus
          ? arr.filter((p: PackTask) => p.status === this.selectedStatus)
          : arr;
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      },
      error: () => {
        this.dataSource.data = [];
        this.loading = false;
      }
    });
  }

  countByStatus(s: string) { return this.dataSource.data.filter(p => p.status === s).length; }

  createPackTask() {
    const orderId = prompt('Enter Order ID to create pack task:');
    if (!orderId || isNaN(Number(orderId))) return;
    this.api.createPackTask({ orderId: Number(orderId), warehouseId: 1, stationCode: 'PACK-01' }).subscribe({
      next: () => {
        this.snackBar.open('Pack task created!', 'Close', { duration: 3000, panelClass: ['success'] });
        this.loadPackTasks();
      }
    });
  }

  startTask(task: PackTask) {
    const packerId = prompt('Enter Packer ID:', 'PACKER01');
    if (!packerId) return;
    this.api.startPackTask(task.packTaskId, packerId).subscribe({
      next: () => {
        this.snackBar.open('Pack task started!', 'Close', { duration: 3000, panelClass: ['success'] });
        this.loadPackTasks();
      }
    });
  }

  addBox(task: PackTask) {
    const boxType = prompt('Box type (SMALL / MEDIUM / LARGE):', 'MEDIUM');
    if (!boxType) return;
    this.api.addBox({ packTaskId: task.packTaskId, boxType }).subscribe({
      next: () => {
        this.snackBar.open('Box added!', 'Close', { duration: 3000, panelClass: ['success'] });
        this.loadPackTasks();
      }
    });
  }

  completeTask(task: PackTask) {
    if (!confirm(`Complete pack task ${task.packTaskId}?`)) return;
    this.api.completePackTask(task.packTaskId).subscribe({
      next: () => {
        this.snackBar.open('Pack task completed!', 'Close', { duration: 3000, panelClass: ['success'] });
        this.loadPackTasks();
      }
    });
  }

  viewBoxes(task: PackTask) {
    this.dialog.open(PackDetailDialogComponent, { width: '550px', data: { task } });
  }
}
