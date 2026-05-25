import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { Item, Customer } from '../../../core/models';

@Component({
  selector: 'app-item-form-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.item ? 'Edit Item' : 'Create New Item' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Customer *</mat-label>
            <mat-select formControlName="customerId">
              <mat-option *ngFor="let c of data.customers" [value]="c.customerId">
                {{ c.customerName }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Item Code *</mat-label>
            <input matInput formControlName="itemCode" placeholder="e.g. MODEM-5G-PRO">
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Item Name *</mat-label>
          <input matInput formControlName="itemName">
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="2"></textarea>
        </mat-form-field>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>UOM *</mat-label>
            <mat-select formControlName="uom">
              <mat-option value="EA">EA - Each</mat-option>
              <mat-option value="CS">CS - Case</mat-option>
              <mat-option value="PLT">PLT - Pallet</mat-option>
              <mat-option value="KG">KG - Kilogram</mat-option>
              <mat-option value="LB">LB - Pound</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <input matInput formControlName="category">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Barcode</mat-label>
            <input matInput formControlName="barcode">
          </mat-form-field>
        </div>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Unit Weight (kg)</mat-label>
            <input matInput type="number" formControlName="unitWeight">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Unit Cost ($)</mat-label>
            <input matInput type="number" formControlName="unitCost">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Unit Price ($)</mat-label>
            <input matInput type="number" formControlName="unitPrice">
          </mat-form-field>
        </div>
        <div class="form-row">
          <mat-checkbox formControlName="lotControlled">Lot Controlled</mat-checkbox>
          <mat-checkbox formControlName="serialControlled">Serial Controlled</mat-checkbox>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid || saving">
        {{ saving ? 'Saving...' : (data.item ? 'Update' : 'Create') }}
      </button>
    </mat-dialog-actions>
  `
})
export class ItemFormDialogComponent implements OnInit {
  form!: FormGroup;
  saving = false;

  constructor(
    public dialogRef: MatDialogRef<ItemFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: Item | null; customers: Customer[] },
    private fb: FormBuilder,
    private api: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const item = this.data.item;
    this.form = this.fb.group({
      customerId:     [item?.customerId ?? null, Validators.required],
      itemCode:       [item?.itemCode ?? '', Validators.required],
      itemName:       [item?.itemName ?? '', Validators.required],
      description:    [item?.description ?? ''],
      uom:            [item?.uom ?? 'EA', Validators.required],
      category:       [item?.category ?? ''],
      barcode:        [item?.barcode ?? ''],
      unitWeight:     [item?.unitWeight ?? null],
      unitCost:       [item?.unitCost ?? null],
      unitPrice:      [item?.unitPrice ?? null],
      lotControlled:  [item?.lotControlled ?? false],
      serialControlled: [false]
    });
    if (item) this.form.get('customerId')?.disable();
  }

  save() {
    if (this.form.invalid) return;
    this.saving = true;
    const payload = this.form.getRawValue();
    const op = this.data.item
      ? this.api.updateItem(this.data.item.itemId, payload)
      : this.api.createItem(payload);
    op.subscribe({
      next: () => {
        this.snackBar.open(`Item ${this.data.item ? 'updated' : 'created'} successfully`, 'Close',
          { duration: 3000, panelClass: ['success'] });
        this.dialogRef.close(true);
      },
      error: () => { this.saving = false; }
    });
  }
}
