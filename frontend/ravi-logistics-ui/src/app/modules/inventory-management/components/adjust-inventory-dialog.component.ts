import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { Inventory } from '../../../core/models';

@Component({
  selector: 'app-adjust-inventory-dialog',
  template: `
    <h2 mat-dialog-title>Adjust Inventory</h2>
    <mat-dialog-content style="min-width:480px">
      <div style="background:#f5f5f5; border-radius:8px; padding:12px; margin-bottom:16px">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px">
          <div><strong>Item ID:</strong> {{ inv.itemId }}</div>
          <div><strong>Location ID:</strong> {{ inv.locationId }}</div>
          <div><strong>On Hand:</strong> {{ inv.onHandQty }} {{ inv.uom }}</div>
          <div><strong>Available:</strong> {{ inv.availableQty }} {{ inv.uom }}</div>
          <div><strong>Reserved:</strong> {{ inv.reservedQty }} {{ inv.uom }}</div>
          <div><strong>Lot:</strong> {{ inv.lotNumber || 'N/A' }}</div>
        </div>
      </div>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Adjustment Quantity *</mat-label>
          <input matInput type="number" formControlName="adjustmentQty"
                 placeholder="Use positive to add, negative to deduct">
          <mat-hint>e.g. +10 adds stock, -5 removes stock</mat-hint>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%; margin-top:8px">
          <mat-label>Reason *</mat-label>
          <mat-select formControlName="reason">
            <mat-option value="CYCLE_COUNT">Cycle Count</mat-option>
            <mat-option value="DAMAGE">Damage / Write-off</mat-option>
            <mat-option value="FOUND">Found Stock</mat-option>
            <mat-option value="CORRECTION">Data Correction</mat-option>
            <mat-option value="OTHER">Other</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%; margin-top:8px">
          <mat-label>Adjusted By *</mat-label>
          <input matInput formControlName="adjustedBy" placeholder="Your name or employee ID">
        </mat-form-field>

        <div *ngIf="form.get('adjustmentQty')?.value" style="margin-top:12px; padding:8px; border-radius:4px"
             [style.background]="newQty >= 0 ? '#e8f5e9' : '#ffebee'">
          <strong>New On-Hand Qty:</strong>
          <span [style.color]="newQty >= 0 ? '#2e7d32' : '#c62828'">
            {{ newQty }} {{ inv.uom }}
          </span>
          <span *ngIf="newQty < 0" style="color:#c62828; margin-left:8px">⚠️ Cannot go negative!</span>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()"
              [disabled]="form.invalid || saving || newQty < 0">
        {{ saving ? 'Saving...' : 'Apply Adjustment' }}
      </button>
    </mat-dialog-actions>
  `
})
export class AdjustInventoryDialogComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  inv!: Inventory;

  get newQty(): number {
    const adj = this.form?.get('adjustmentQty')?.value || 0;
    return (this.inv?.onHandQty || 0) + Number(adj);
  }

  constructor(
    public dialogRef: MatDialogRef<AdjustInventoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { inventory: Inventory },
    private fb: FormBuilder, private api: ApiService, private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.inv = this.data.inventory;
    this.form = this.fb.group({
      inventoryId:    [this.inv.inventoryId],
      adjustmentQty:  [null, [Validators.required]],
      reason:         ['', Validators.required],
      adjustedBy:     ['', Validators.required]
    });
  }

  save() {
    if (this.form.invalid || this.newQty < 0) return;
    this.saving = true;
    this.api.adjustInventory(this.form.getRawValue()).subscribe({
      next: () => {
        this.snackBar.open('Inventory adjusted successfully', 'Close', { duration: 3000, panelClass: ['success'] });
        this.dialogRef.close(true);
      },
      error: () => { this.saving = false; }
    });
  }
}
