import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'product',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'Categories',
    path: '/categories',
    icon: icon('ic_category'),
  },
  {
    title: 'Orders',
    path: '/orders',
    icon: icon('ic_order'),
  },
  {
    title: 'Sales',
    path: '/sales',
    icon: icon('ic_sales'),
  },
];

export default navConfig;