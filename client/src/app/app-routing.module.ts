import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ToursComponent } from './pages/tours/tours.component';
import { TourDetailComponent } from './pages/tour-detail/tour-detail.component';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { BankInstructionsComponent } from './pages/payment/bank-instructions.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'tours', component: ToursComponent },
    { path: 'tours/:id', component: TourDetailComponent },
    { path: 'bookings', component: BookingsComponent },
    { path: 'payment/:id', component: PaymentComponent },
    { path: 'payment/success/:id', component: InvoiceComponent },
    { path: 'payment/bank-instructions/:id', component: BankInstructionsComponent },
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    { path: '**', redirectTo: '/home' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
