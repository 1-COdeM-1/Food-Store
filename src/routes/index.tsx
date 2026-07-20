import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';

// Lazy load pages for code splitting
const HomePage = lazy(() =>
  import('@/pages/Home/HomePage').then((m) => ({ default: m.HomePage }))
);
const ShopPage = lazy(() =>
  import('@/pages/shop/ShopPage').then((m) => ({ default: m.ShopPage }))
);
const ProductPage = lazy(() =>
  import('@/pages/product/ProductPage').then((m) => ({ default: m.ProductPage }))
);
const WishlistPage = lazy(() =>
  import('@/pages/wishlist/WishlistPage').then((m) => ({ default: m.WishlistPage }))
);
const AboutPage = lazy(() =>
  import('@/pages/about/AboutPage').then((m) => ({ default: m.AboutPage }))
);

const ErrorPage = lazy(() =>
  import('@/pages/ErrorPage').then((m) => ({ default: m.ErrorPage }))
);

function PageLoader() {
  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingSkeleton count={8} />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<PageLoader />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="/shop"
          element={
            <Suspense fallback={<PageLoader />}>
              <ShopPage />
            </Suspense>
          }
        />
        <Route
          path="/shop/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProductPage />
            </Suspense>
          }
        />
        <Route
          path="/wishlist"
          element={
            <Suspense fallback={<PageLoader />}>
              <WishlistPage />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<PageLoader />}>
              <AboutPage />
            </Suspense>
          }
        />

        <Route
          path="*"
          element={
            <Suspense fallback={<PageLoader />}>
              <ErrorPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
