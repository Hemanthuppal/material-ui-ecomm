import { Helmet } from 'react-helmet-async';

import { OrdersView } from 'src/sections/orders/view';

// ----------------------------------------------------------------------

export default function OrdersPage() {
  return (
    <>
      <Helmet>
        <title> Orders | Minimal UI </title>
      </Helmet>

      <OrdersView />
    </>
  );
}
