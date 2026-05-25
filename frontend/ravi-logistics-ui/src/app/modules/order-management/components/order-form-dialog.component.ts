import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { Customer, Item, Warehouse, Carrier } from '../../../core/models';

@Component({
  selector: 'app-order-form-dialog',
  template: `
    <h2 mat-dialog-title>Create New Order</h2>
    <mat-dialog-content style="min-width:680px; max-height:80vh; overflow-y:auto">
      <form [formGroup]="form">
        <!-- Header -->
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Order Number *</mat-label>
            <input matInput formControlName="orderNumber" placeholder="ORD-2026-001">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Customer *</mat-label>
            <mat-select formControlName="customerId" (selectionChange)="onCustomerChange($event.value)">
              <mat-option *ngFor="let c of data.customers" [value]="c.customerId">{{ c.customerName }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Warehouse *</mat-label>
            <mat-select formControlName="warehouseId">
              <mat-option *ngFor="let w of warehouses" [value]="w.warehouseId">{{ w.warehouseName }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Shipping Info -->
        <div style="background:#f5f5f5; padding:12px; border-radius:8px; margin-bottom:12px">
          <strong style="color:#333">Shipping Details</strong>
          <div class="form-row" style="margin-top:8px">
            <mat-form-field appearance="outline">
              <mat-label>Ship To Name</mat-label>
              <input matInput formControlName="shipToName">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Required Ship Date *</mat-label>
              <input matInput [matDatepicker]="dp" formControlName="requiredShipDate">
              <mat-datepicker-toggle matSuffix [for]="dp"></mat-datepicker-toggle>
              <mat-datepicker #dp></mat-datepicker>
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline" style="width:100%">
            <mat-label>Address Line 1</mat-label>
            <input matInput formControlName="shipToAddress1">
          </mat-form-field>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>City</mat-label>
              <input matInput formControlName="shipToCity">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>State</mat-label>
              <input matInput formControlName="shipToState" style="max-width:80px">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>ZIP</mat-label>
              <input matInput formControlName="shipToZip">
            </mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Carrier</mat-label>
              <mat-select formControlName="carrierId">
                <mat-option *ngFor="let c of carriers" [value]="c.carrierId">
                  {{ c.carrierName }} ({{ c.serviceLevel }})
                </mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Priority (1=Highest, 10=Lowest)</mat-label>
              <mat-select formControlName="priority">
                <mat-option *ngFor="let p of [1,2,3,4,5,6,7,8,9,10]" [value]="p">{{ p }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <!-- Order Lines -->
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
            <strong>Order Lines</strong>
            <button mat-stroked-button color="primary" type="button" (click)="addLine()">
              <mat-icon>add</mat-icon> Add Line
            </button>
          </div>
          <div formArrayName="lines">
            <div *ngFor="let line of linesArray.controls; let i=index" [formGroupName]="i"
                 style="display:flex; gap:8px; align-items:center; margin-bottom:8px; background:#f9f9f9; padding:8px; border-radius:4px">
              <span style="min-width:24px; font-weight:bold; color:#666">{{ i+1 }}</span>
              <mat-form-field appearance="outline" style="flex:2">
                <mat-label>Item</mat-label>
                <mat-select formControlName="itemId">
                  <mat-option *ngFor="let item of items" [value]="item.itemId">
                    {{ item.itemCode }} — {{ item.itemName }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" style="flex:1">
                <mat-label>Qty *</mat-label>
                <input matInput type="number" formControlName="orderedQty" min="1">
              </mat-form-field>
              <button mat-icon-button color="warn" type="button" (click)="removeLine(i)">
                <mat-icon>remove_circle</mat-icon>
              </button>
            </div>
            <div *ngIf="linesArray.length === 0" style="text-align:center; color:#999; padding:16px">
              No lines added yet.
            </div>
          </div>
        </div>

        <mat-form-field appearance="outline" style="width:100%; margin-top:8px">
          <mat-label>Notes</mat-label>
          <textarea matInput formControlName="notes" rows="2"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()"
              [disabled]="form.invalid || saving || linesArray.length===0">
        {{ saving ? 'Creating...' : 'Create Order' }}
      </button>
    </mat-dialog-actions>
  `
})
export class OrderFormDialogComponent implements OnInit {
  form!: FormGroup;
  warehouses: Warehouse[] = [];
  items: Item[] = [];
  carriers: Carrier[] = [];
  saving = false;

  constructor(
    public dialogRef: MatDialogRef<OrderFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { customers: Customer[] },
    private fb: FormBuilder, private api: ApiService, private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.api.getWarehouses().subscribe(w => this.warehouses = w);
    this.api.getCarriers().subscribe(c => this.carriers = c);
    this.form = this.fb.group({
      orderNumber:      ['', Validators.required],
      customerId:       [null, Validators.required],
      warehouseId:      [null, Validators.required],
      requiredShipDate: [null, Validators.required],
      shipToName:       [''],
      shipToAddress1:   [''],
      shipToCity:       [''],
      shipToState:      [''],
      shipToZip:        [''],
      carrierId:        [null],
      priority:         [5],
      notes:            [''],
      lines:            this.fb.array([])
    });
  }

  get linesArray(): FormArray { return this.form.get('lines') as FormArray; }

  onCustomerChange(customerId: number) {
    this.api.getItems(customerId).subscribe(items => this.items = items);
  }

  addLine() {
    this.linesArray.push(this.fb.group({
      itemId:     [null, Validators.required],
      orderedQty: [1, [Validators.required, Validators.min(1)]]
    }));
  }

  removeLine(i: number) { this.linesArray.removeAt(i); }

  save() {
    if (this.form.invalid) return;
    this.saving = true;
    const val = this.form.getRawValue();
    const payload = {
      ...val,
      requiredShipDate: val.requiredShipDate
        ? new Date(val.requiredShipDate).toISOString().split('T')[0] : null
    };
    this.api.createOrder(payload).subscribe({
      next: () => {
        this.snackBar.open('Order created successfully!', 'Close', { duration: 3000, panelClass: ['success'] });
        this.dialogRef.close(true);
      },
      error: () => { this.saving = false; }
    });
  }
}
