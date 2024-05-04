import React from 'react';
import { Link } from 'react-router-dom';

import { Grid, Button, Typography } from '@mui/material';

import { products as mockProducts } from 'src/_mock/products';

import ProductCard from '../product-card';
import ProductSort from '../product-sort';
import ProductFilters from '../product-filters';
import ProductCartWidget from '../product-cart-widget';

export default function ProductsView() {
  const [products] = React.useState(mockProducts); // Changed to destructuring to remove warning

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Products
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <ProductFilters />
        <ProductSort />
        <Link to="/add-product" style={{ textDecoration: 'none' }}>
          <Button variant="contained">
            Add Product
          </Button>
        </Link>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid key={product.id} item xs={12} sm={6} md={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <ProductCartWidget />
      </Grid>
    </Grid>
  );
}
