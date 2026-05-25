import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';

import { PackListComponent } from './components/pack-list.component';
import { PackDetailDialogComponent } from './components/pack-detail-dialog.component';

const routes: Routes = [{ path: '', component: PackListComponent }];

@NgModule({
  declarations: [PackListComponent, PackDetailDialogComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes), ReactiveFormsModule, FormsModule,
    MatTableModule, MatButtonModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatTooltipModule,
    MatPaginatorModule, MatStepperModule, MatChipsModule
  ]
})
export class PackManagementModule {}
