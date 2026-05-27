import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    canActivate: [guestGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./features/auth/signup/signup.component').then((m) => m.SignupComponent),
      },
    ],
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/customer/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/customer/products/product-list/product-list.component').then(
            (m) => m.ProductListComponent,
          ),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./pages/customer/products/product-detail/product-detail.component').then(
            (m) => m.ProductDetailComponent,
          ),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./pages/customer/cart/cart.component').then((m) => m.CartComponent),
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./pages/customer/wishlist/wishlist.component').then((m) => m.WishlistComponent),
      },
      {
        path: 'checkout',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/customer/checkout/checkout.component').then((m) => m.CheckoutComponent),
      },
      {
        path: 'payment',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/customer/payment/payment.component').then((m) => m.PaymentComponent),
      },
      {
        path: 'orders',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/customer/orders/order-list/order-list.component').then(
            (m) => m.OrderListComponent,
          ),
      },
      {
        path: 'orders/confirmation/:id',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/customer/orders/order-confirmation/order-confirmation.component').then(
            (m) => m.OrderConfirmationComponent,
          ),
      },
      {
        path: 'orders/track/:id',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/customer/orders/order-tracking/order-tracking.component').then(
            (m) => m.OrderTrackingComponent,
          ),
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/customer/profile/profile.component').then((m) => m.ProfileComponent),
      },
    ],
  },
  { path: '**', redirectTo: '/auth/login' },
];
