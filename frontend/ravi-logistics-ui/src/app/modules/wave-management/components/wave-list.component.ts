import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../../core/services/api.service';
import { Wave } from '../../../core/models';
import { CreateWaveDialogComponent } from './create-wave-dialog.component';

@Component({
  selector: 'app-wave-list',
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1><mat-icon>waves</mat-icon> Wave Management</h1>
        <div class="action-bar">
          <mat-form-field appearance="outline" style="width:160px">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="selectedStatus" (selectionChange)="loadWaves()">
              <mat-option value="">All</mat-option>
              <mat-option value="CREATED">Created</mat-option>
              <mat-option value="RELEASED">Released</mat-option>
              <mat-option value="PICKING">Picking</mat-option>
              <mat-option value="COMPLETED">Completed</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="openCreateDialog()">
            <mat-icon>add</mat-icon> Create Wave
          </button>
        </div>
      </div>

      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-title">Total Waves</div>
          <div class="card-value">{{ dataSource.data.length }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">Released</div>
          <div class="card-value" style="color:#6a1b9a">{{ countByStatus('RELEASED') }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">In Picking</div>
          <div class="card-value" style="color:#e65100">{{ countByStatus('PICKING') }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">Completed</div>
          <div class="card-value" style="color:#2e7d32">{{ countByStatus('COMPLETED') }}</div>
        </div>
      </div>

      <div *ngIf="loading" class="loading-spinner"><mat-spinner></mat-spinner></div>

      <mat-card *ngIf="!loading">
        <mat-table [dataSource]="dataSource">
          <ng-container matColumnDef="waveNumber">
            <mat-header-cell *matHeaderCellDef>Wave #</mat-header-cell>
            <mat-cell *matCellDef="let row"><strong>{{ row.waveNumber }}</strong></mat-cell>
          </ng-container>
          <ng-container matColumnDef="waveDate">
            <mat-header-cell *matHeaderCellDef>Wave Date</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.waveDate | date:'MMM dd, yyyy' }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="totalOrders">
            <mat-header-cell *matHeaderCellDef>Orders</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.totalOrders }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="totalLines">
            <mat-header-cell *matHeaderCellDef>Lines</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.totalLines }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="totalUnits">
            <mat-header-cell *matHeaderCellDef>Units</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.totalUnits | number:'1.0-0' }}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="createdBy">
            <mat-header-cell *matHeaderCellDef>Created By</mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.createdBy }}</mat-cell>
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
                      *ngIf="row.status === 'CREATED'"
                      (click)="releaseWave(row)" matTooltip="Release Wave for Picking">
                <mat-icon>play_arrow</mat-icon>
              </button>
              <button mat-icon-button color="primary"
                      *ngIf="row.status === 'PICKING'"
                      (click)="completeWave(row)" matTooltip="Mark Wave Complete">
                <mat-icon>done_all</mat-icon>
              </button>
              <button mat-icon-button (click)="viewOrders(row)" matTooltip="View Wave Orders">
                <mat-icon>visibility</mat-icon>
              </button>
            </mat-cell>
          </ng-container>
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" [attr.colspan]="displayedColumns.length"
                style="text-align:center;padding:24px;color:#999">No waves found.</td>
          </tr>
        </mat-table>
        <mat-paginator [pageSizeOptions]="[10, 25]" showFirstLastButtons></mat-paginator>
      </mat-card>
    </div>
  `,
  styles: ['.page-header h1 { display:flex; align-items:center; gap:8px; }']
})
export class WaveListComponent implements OnInit {
  displayedColumns = ['waveNumber', 'waveDate', 'totalOrders', 'totalLines', 'totalUnits', 'createdBy', 'status', 'actions'];
  dataSource = new MatTableDataSource<Wave>([]);
  selectedStatus = '';
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: ApiService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() { this.loadWaves(); }

  loadWaves() {
    this.loading = true;
    this.api.getWaves(1, this.selectedStatus || undefined).subscribe({
      next: data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  countByStatus(s: string) { return this.dataSource.data.filter(w => w.status === s).length; }

  openCreateDialog() {
    const ref = this.dialog.open(CreateWaveDialogComponent, { width: '700px' });
    ref.afterClosed().subscribe(r => { if (r) this.loadWaves(); });
  }

  releaseWave(wave: Wave) {
    if (!confirm(`Release wave ${wave.waveNumber} for picking?`)) return;
    this.api.releaseWave(wave.waveId).subscribe({
      next: () => {
        this.snackBar.open(`Wave ${wave.waveNumber} released!`, 'Close', { duration: 3000, panelClass: ['success'] });
        this.loadWaves();
      }
    });
  }

  completeWave(wave: Wave) {
    this.api.completeWave(wave.waveId).subscribe({
      next: () => {
        this.snackBar.open(`Wave ${wave.waveNumber} completed!`, 'Close', { duration: 3000, panelClass: ['success'] });
        this.loadWaves();
      }
    });
  }

  viewOrders(wave: Wave) {
    this.api.getWaveOrders(wave.waveId).subscribe(orders => {
      this.snackBar.open(`Wave ${wave.waveNumber} has ${(orders as unknown[]).length} order(s)`, 'Close', { duration: 4000 });
    });
  }
}
