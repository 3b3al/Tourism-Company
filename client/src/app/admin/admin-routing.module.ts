import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminToursListComponent } from './pages/admin-tours-list/admin-tours-list.component';
import { AdminTourFormComponent } from './pages/admin-tour-form/admin-tour-form.component';
import { AdminBookingsComponent } from './pages/admin-bookings/admin-bookings.component';
import { AdminGuidesComponent } from './pages/admin-guides/admin-guides.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'tours', component: AdminToursListComponent },
      { path: 'tours/new', component: AdminTourFormComponent },
      { path: 'tours/:id', component: AdminTourFormComponent },
      { path: 'bookings', component: AdminBookingsComponent },
      { path: 'guides', component: AdminGuidesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
