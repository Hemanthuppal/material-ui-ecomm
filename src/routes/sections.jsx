import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import AddProductForm from 'src/sections/products/view/AddProductForm';

// Lazy-loaded components
const IndexPage = lazy(() => import('src/pages/app'));
const BlogPage = lazy(() => import('src/pages/blog'));
const UserPage = lazy(() => import('src/pages/user'));
const LoginPage = lazy(() => import('src/pages/login'));
const ProductsPage = lazy(() => import('src/pages/products'));
const CategoriesPage = lazy(() => import('src/pages/categories'));
const Page404 = lazy(() => import('src/pages/page-not-found'));
const OrdersPage = lazy(() => import('src/pages/orders'));

const Router = () => {
  // Assuming you have a selector to get the user's authentication status
  const isAuthenticated = useSelector((state) => state.auth.user !== null);

  // Define routes based on authentication status
  const routes = useRoutes([
    {
      element: isAuthenticated ? (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'categories', element: <CategoriesPage /> },
        { path: 'add-product', element: <AddProductForm /> },
        { path: 'orders', element: <OrdersPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
};

export default Router;
