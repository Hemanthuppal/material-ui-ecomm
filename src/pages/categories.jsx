import { Helmet } from 'react-helmet-async';

import { CategoriesView } from 'src/sections/categories/view';

// ----------------------------------------------------------------------

export default function CategoriesPage() {
  return (
    <>
      <Helmet>
        <title> Categories </title>
      </Helmet>

      <CategoriesView />
    </>
  );
}
