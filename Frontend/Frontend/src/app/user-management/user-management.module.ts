import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { ViewUsersComponent } from './view-users/view-users.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTableExporterModule } from 'mat-table-exporter';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxMaskModule } from 'ngx-mask';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ComponentsModule } from '../shared/components/components.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ViewUsersComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    MatIconModule,
    NgApexchartsModule,
    PerfectScrollbarModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressBarModule,

    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,

    MatSelectModule,
    MatTabsModule,
    MatCheckboxModule,
    MatTableExporterModule,
    MatProgressSpinnerModule,
    MatDialogModule,

    MatFormFieldModule,

    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    ComponentsModule,
    MatCardModule,
    ReactiveFormsModule,

    MatSnackBarModule,
    MatToolbarModule,

    SharedModule,
    MatStepperModule,
    NgxMaskModule,
    MatChipsModule,
    CommonModule,

    FormsModule,
    MatBadgeModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatListModule,
    MatSidenavModule,
    MatExpansionModule,
    MatSliderModule,
    NgbModule,
  ]
})
export class UserManagementModule { }
