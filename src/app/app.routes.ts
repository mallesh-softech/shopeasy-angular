import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { vendorAuthGuard, vendorGuestGuard } from './core/guards/vendor-auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    canActivate: [guestGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },

      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },

      {
        path: 'signup',
        loadComponent: () =>
          import('./features/auth/signup/signup.component').then(
            (m) => m.SignupComponent
          ),
      },
    ],
  },

  {
    path: '',
    // TEMPORARILY REMOVED authGuard FOR GITHUB PAGES
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),

    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/customer/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },

      {
        path: 'products',
        loadComponent: () =>
          import(
            './pages/customer/products/product-list/product-list.component'
          ).then((m) => m.ProductListComponent),
      },

      {
        path: 'products/:id',
        loadComponent: () =>
          import(
            './pages/customer/products/product-detail/product-detail.component'
          ).then((m) => m.ProductDetailComponent),
      },

      {
        path: 'cart',
        loadComponent: () =>
          import('./pages/customer/cart/cart.component').then(
            (m) => m.CartComponent
          ),
      },

      {
        path: 'wishlist',
        loadComponent: () =>
          import('./pages/customer/wishlist/wishlist.component').then(
            (m) => m.WishlistComponent
          ),
      },

      {
        path: 'checkout',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/customer/checkout/checkout.component').then(
            (m) => m.CheckoutComponent
          ),
      },

      {
        path: 'payment',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/customer/payment/payment.component').then(
            (m) => m.PaymentComponent
          ),
      },

      {
        path: 'orders',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/customer/orders/order-list/order-list.component').then(
            (m) => m.OrderListComponent
          ),
      },

      {
        path: 'orders/confirmation/:id',
        canActivate: [authGuard],
        loadComponent: () =>
          import(
            './pages/customer/orders/order-confirmation/order-confirmation.component'
          ).then((m) => m.OrderConfirmationComponent),
      },

      {
        path: 'orders/track/:id',
        canActivate: [authGuard],
        loadComponent: () =>
          import(
            './pages/customer/orders/order-tracking/order-tracking.component'
          ).then((m) => m.OrderTrackingComponent),
      },

      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/customer/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },

      {
        path: 'gift-cards',
        loadComponent: () =>
          import('./pages/customer/gift-cards/gift-cards.component').then(
            (m) => m.GiftCardsComponent
          ),
      },

      {
        path: 'coupons',
        loadComponent: () =>
          import('./pages/customer/coupons/coupons.component').then(
            (m) => m.CouponsComponent
          ),
      },

      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/customer/contact/contact.component').then(
            (m) => m.ContactComponent
          ),
      },
    ],
  },

  {
    path: 'vendor',
    children: [
      {
        path: 'auth',
        canActivate: [vendorGuestGuard],
        loadComponent: () =>
          import('./layouts/vendor-layout/vendor-auth-layout.component').then(
            (m) => m.VendorAuthLayoutComponent
          ),
        children: [
          { path: '', redirectTo: 'login', pathMatch: 'full' },
          {
            path: 'login',
            loadComponent: () =>
              import('./pages/vendor/auth/login/vendor-login.component').then(
                (m) => m.VendorLoginComponent
              ),
          },
          {
            path: 'register',
            loadComponent: () =>
              import('./pages/vendor/auth/register/vendor-register.component').then(
                (m) => m.VendorRegisterComponent
              ),
          },
        ],
      },
      {
        path: '',
        canActivate: [vendorAuthGuard],
        loadComponent: () =>
          import('./layouts/vendor-layout/vendor-layout.component').then(
            (m) => m.VendorLayoutComponent
          ),
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./pages/vendor/dashboard/vendor-dashboard.component').then(
                (m) => m.VendorDashboardComponent
              ),
          },
          {
            path: 'products',
            loadComponent: () =>
              import('./pages/vendor/products/vendor-products.component').then(
                (m) => m.VendorProductsComponent
              ),
          },
          {
            path: 'products/add',
            loadComponent: () =>
              import('./pages/vendor/products/add-product/add-product.component').then(
                (m) => m.AddProductComponent
              ),
          },
          {
            path: 'inventory',
            loadComponent: () =>
              import('./pages/vendor/inventory/vendor-inventory.component').then(
                (m) => m.VendorInventoryComponent
              ),
          },
          {
            path: 'orders',
            loadComponent: () =>
              import('./pages/vendor/orders/vendor-orders.component').then(
                (m) => m.VendorOrdersComponent
              ),
          },
          {
            path: 'returns',
            loadComponent: () =>
              import('./pages/vendor/returns/vendor-returns.component').then(
                (m) => m.VendorReturnsComponent
              ),
          },
          {
            path: 'promotions',
            loadComponent: () =>
              import('./pages/vendor/promotions/vendor-promotions.component').then(
                (m) => m.VendorPromotionsComponent
              ),
          },
          {
            path: 'wallet',
            loadComponent: () =>
              import('./pages/vendor/wallet/vendor-wallet.component').then(
                (m) => m.VendorWalletComponent
              ),
          },
          {
            path: 'support',
            loadComponent: () =>
              import('./pages/vendor/support/vendor-support.component').then(
                (m) => m.VendorSupportComponent
              ),
          },
          {
            path: 'reports',
            loadComponent: () =>
              import('./pages/vendor/reports/vendor-reports.component').then(
                (m) => m.VendorReportsComponent
              ),
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./pages/vendor/profile/vendor-profile.component').then(
                (m) => m.VendorProfileComponent
              ),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./pages/vendor/settings/vendor-settings.component').then(
                (m) => m.VendorSettingsComponent
              ),
          },
        ],
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];