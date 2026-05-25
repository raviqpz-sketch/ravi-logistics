import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-asn-form-dialog',
  template: `
    <h2 mat-dialog-title>
      <mat-icon>local_shipping</mat-icon> Create New ASN
    </h2>
    <mat-dialog-content class="dialog-content">
      <form [formGroup]="asnForm">

        <!-- Header Fields -->
        <div class="form-section">
          <h3 class="section-title">ASN Details</h3>
          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Customer *</mat-label>
              <mat-select formControlName="customerId" (selectionChange)="onCustomerChange()">
                <mat-option *ngFor="let c of customers" [value]="c.id">{{ c.name }}</mat-option>
              </mat-select>
              <mat-error *ngIf="asnForm.get('customerId')?.hasError('required')">Customer is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>ASN Number *</mat-label>
              <input matInput formControlName="asnNumber" placeholder="ASN-2024-001">
              <mat-error *ngIf="asnForm.get('asnNumber')?.hasError('required')">ASN Number is required</mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Supplier Name *</mat-label>
              <input matInput formControlName="supplierName">
              <mat-error *ngIf="asnForm.get('supplierName')?.hasError('required')">Supplier Name is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Supplier Reference</mat-label>
              <input matInput formControlName="supplierRef" placeholder="PO-12345">
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Expected Date *</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="expectedDate">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="asnForm.get('expectedDate')?.hasError('required')">Expected Date is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Notes</mat-label>
              <textarea matInput formControlName="notes" rows="1"></textarea>
            </mat-form-field>
          </div>
        </div>

        <!-- ASN Lines -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">ASN Lines</h3>
            <button mat-stroked-button color="primary" type="button" (click)="addLine()">
              <mat-icon>add</mat-icon> Add Line
            </button>
          </div>

          <div formArrayName="lines">
            <div *ngFor="let line of lines.controls; let i = index" [formGroupName]="i" class="line-row">
              <span class="line-number">#{{ i + 1 }}</span>

              <mat-form-field appearance="outline" class="line-item">
                <mat-label>Item *</mat-label>
                <mat-select formControlName="itemId">
                  <mat-option *ngFor="let item of items" [value]="item.id">{{ item.sku }} - {{ item.name }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="line-qty">
                <mat-label>Expected Qty *</mat-label>
                <input matInput type="number" formControlName="expectedQty" min="1">
              </mat-form-field>

              <mat-form-field appearance="outline" class="line-lot">
                <mat-label>Lot Number</mat-label>
                <input matInput formControlName="lotNumber">
              </mat-form-field>

              <button mat-icon-button color="warn" type="button" (click)="removeLine(i)" matTooltip="Remove Line">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>

          <div *ngIf="lines.length === 0" class="no-lines">
            No lines added. Click "Add Line" to add items.
          </div>
        </div>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [disabled]="asnForm.invalid || saving" (click)="save()">
        <mat-spinner diameter="20" *ngIf="saving"></mat-spinner>
        <span *ngIf="!saving">Create ASN</span>
      </button>
    </mat-dialog-actions>

    <style>
      .dialog-content { min-width: 620px; max-height: 70vh; overflow-y: auto; }
      .form-section { margin-bottom: 24px; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px; }
      .section-title { margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #1976d2; }
      .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
      .form-row { display: flex; gap: 16px; margin-bottom: 8px; }
      .half-width { flex: 1; }
      .line-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; padding: 8px; background: #f9f9f9; border-radius: 6px; }
      .line-number { font-weight: 600; color: #666; min-width: 24px; }
      .line-item { flex: 3; }
      .line-qty { flex: 1; }
      .line-lot { flex: 2; }
      .no-lines { text-align: center; padding: 24px; color: #999; border: 2px dashed #e0e0e0; border-radius: 8px; }
    </style>
  `
})
export class AsnFormDialogComponent implements OnInit {
  asnForm: FormGroup;
  customers: any[] = [];
  items: any[] = [];
  saving = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AsnFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.asnForm = this.fb.group({
      customerId: [null, Validators.required],
      asnNumber: ['', Validators.required],
      supplierName: ['', Validators.required],
      supplierRef: [''],
      expectedDate: [null, Validators.required],
      notes: [''],
      lines: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
    this.loadItems();
  }

  get lines(): FormArray {
    return this.asnForm.get('lines') as FormArray;
  }

  loadCustomers(): void {
    this.api.getCustomers().subscribe({
      next: (data) => { this.customers = data; },
      error: () => { this.snackBar.open('Failed to load customers', 'Close', { duration: 3000 }); }
    });
  }

  loadItems(): void {
    this.api.getItems().subscribe({
      next: (data) => { this.items = data; },
      error: () => { this.snackBar.open('Failed to load items', 'Close', { duration: 3000 }); }
    });
  }

  onCustomerChange(): void {
    const customerId = this.asnForm.get('customerId')?.value;
    if (customerId) {
      this.api.getItems(customerId).subscribe({
        next: (data) => { this.items = data; },
        error: () => {}
      });
    }
  }

  addLine(): void {
    this.lines.push(this.fb.group({
      itemId: [null, Validators.required],
      expectedQty: [1, [Validators.required, Validators.min(1)]],
      lotNumber: ['']
    }));
  }

  removeLine(index: number): void {
    this.lines.removeAt(index);
  }

  save(): void {
    if (this.asnForm.invalid) return;
    this.saving = true;
    const payload = {
      ...this.asnForm.value,
      expectedDate: this.asnForm.value.expectedDate?.toISOString?.() || this.asnForm.value.expectedDate
    };
    this.api.createAsn(payload).subscribe({
      next: () => {
        this.snackBar.open('ASN created successfully', 'Close', { duration: 3000, panelClass: ['success'] });
        this.saving = false;
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Failed to create ASN', 'Close', { duration: 3000, panelClass: ['error'] });
        this.saving = false;
      }
    });
  }
}
