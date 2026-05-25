import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { Carrier } from '../../../core/models';

@Component({
  selector: 'app-create-shipment-dialog',
  template: `
    <h2 mat-dialog-title>Create New Shipment</h2>
    <mat-dialog-content style="min-width:500px">
      <form [formGroup]="form">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Order ID *</mat-label>
            <input matInput type="number" formControlName="orderId" placeholder="e.g. 1">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Pack Task ID</mat-label>
            <input matInput type="number" formControlName="packTaskId" placeholder="Optional">
          </mat-form-field>
        </div>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Carrier *</mat-label>
            <mat-select formControlName="carrierId" (selectionChange)="onCarrierChange($event.value)">
              <mat-option *ngFor="let c of carriers" [value]="c.carrierId">
                {{ c.carrierName }} — {{ c.serviceLevel }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Service Level</mat-label>
            <input matInput formControlName="serviceLevel" placeholder="e.g. GROUND">
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Tracking Number</mat-label>
          <input matInput formControlName="trackingNumber" placeholder="e.g. 1Z999AA10123456784">
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Estimated Delivery</mat-label>
          <input matInput [matDatepicker]="dp" formControlName="estimatedDelivery">
          <mat-datepicker-toggle matSuffix [for]="dp"></mat-datepicker-toggle>
          <mat-datepicker #dp></mat-datepicker>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="create()" [disabled]="form.invalid || saving">
        {{ saving ? 'Creating...' : 'Create Shipment' }}
      </button>
    </mat-dialog-actions>
  `
})
export class CreateShipmentDialogComponent implements OnInit {
  form!: FormGroup;
  carriers: Carrier[] = [];
  saving = false;

  constructor(
    public dialogRef: MatDialogRef<CreateShipmentDialogComponent>,
    private fb: FormBuilder, private api: ApiService, private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.api.getCarriers().subscribe(c => this.carriers = c);
    this.form = this.fb.group({
      orderId:          [null, Validators.required],
      packTaskId:       [null],
      carrierId:        [null, Validators.required],
      carrierName:      [''],
      serviceLevel:     [''],
      trackingNumber:   [''],
      estimatedDelivery:[null]
    });
  }

  onCarrierChange(carrierId: number) {
    const carrier = this.carriers.find(c => c.carrierId === carrierId);
    if (carrier) {
      this.form.patchValue({
        carrierName:  carrier.carrierName,
        serviceLevel: carrier.serviceLevel
      });
    }
  }

  create() {
    if (this.form.invalid) return;
    this.saving = true;
    const val = this.form.getRawValue();
    const payload = {
      ...val,
      estimatedDelivery: val.estimatedDelivery
        ? new Date(val.estimatedDelivery).toISOString().split('T')[0] : null
    };
    this.api.createShipment(payload).subscribe({
      next: (sh) => {
        this.snackBar.open(`Shipment created: ${sh.shipmentNumber}`, 'Close', { duration: 3000, panelClass: ['success'] });
        this.dialogRef.close(true);
      },
      error: () => { this.saving = false; }
    });
  }
}
