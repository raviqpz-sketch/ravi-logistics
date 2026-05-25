import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { PickTask } from '../../../core/models';

@Component({
  selector: 'app-confirm-pick-dialog',
  template: `
    <h2 mat-dialog-title>Confirm Pick</h2>
    <mat-dialog-content style="min-width:440px">
      <div style="background:#f5f5f5; border-radius:8px; padding:12px; margin-bottom:16px">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px">
          <div><strong>Task #:</strong> {{ task.pickTaskId }}</div>
          <div><strong>Wave:</strong> {{ task.waveId }}</div>
          <div><strong>Order:</strong> {{ task.orderId }}</div>
          <div><strong>Item ID:</strong> {{ task.itemId }}</div>
          <div><strong>Location:</strong> {{ task.pickLocationId }}</div>
          <div><strong>Lot #:</strong> {{ task.lotNumber || 'N/A' }}</div>
          <div><strong>Required Qty:</strong> <span style="color:#1565c0; font-weight:bold">{{ task.pickQty }}</span></div>
          <div><strong>Already Confirmed:</strong> {{ task.confirmedQty }}</div>
        </div>
      </div>

      <form [formGroup]="form">
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Confirmed Quantity *</mat-label>
          <input matInput type="number" formControlName="confirmedQty"
                 [max]="task.pickQty" min="0">
          <mat-hint *ngIf="isShortPick" style="color:#e65100">
            ⚠️ Short pick — quantity less than required ({{ task.pickQty }})
          </mat-hint>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%; margin-top:8px">
          <mat-label>Picked By *</mat-label>
          <input matInput formControlName="pickedBy" placeholder="Employee name or ID">
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%; margin-top:8px">
          <mat-label>Pick Method</mat-label>
          <mat-select formControlName="pickMethod">
            <mat-option value="MANUAL">Manual</mat-option>
            <mat-option value="RF">RF Scanner</mat-option>
            <mat-option value="VOICE">Voice</mat-option>
            <mat-option value="LIGHT">Pick-to-Light</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%; margin-top:8px">
          <mat-label>Notes</mat-label>
          <textarea matInput formControlName="notes" rows="2"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button [color]="isShortPick ? 'warn' : 'primary'"
              (click)="confirm()" [disabled]="form.invalid || saving">
        {{ saving ? 'Saving...' : (isShortPick ? 'Confirm Short Pick' : 'Confirm Pick') }}
      </button>
    </mat-dialog-actions>
  `
})
export class ConfirmPickDialogComponent implements OnInit {
  form!: FormGroup;
  task!: PickTask;
  saving = false;

  get isShortPick(): boolean {
    const qty = this.form?.get('confirmedQty')?.value;
    return qty != null && Number(qty) < Number(this.task?.pickQty);
  }

  constructor(
    public dialogRef: MatDialogRef<ConfirmPickDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: PickTask },
    private fb: FormBuilder, private api: ApiService, private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.task = this.data.task;
    this.form = this.fb.group({
      confirmedQty: [this.task.pickQty, [Validators.required, Validators.min(0)]],
      pickedBy:     ['', Validators.required],
      pickMethod:   ['MANUAL'],
      notes:        ['']
    });
  }

  confirm() {
    if (this.form.invalid) return;
    this.saving = true;
    this.api.confirmPick(this.task.pickTaskId, this.form.getRawValue()).subscribe({
      next: () => {
        const msg = this.isShortPick
          ? `Short pick confirmed for Task #${this.task.pickTaskId}`
          : `Pick confirmed for Task #${this.task.pickTaskId}!`;
        this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: ['success'] });
        this.dialogRef.close(true);
      },
      error: () => { this.saving = false; }
    });
  }
}
