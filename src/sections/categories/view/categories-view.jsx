import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Grid, Dialog, Button, TextField, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { addCategory, editCategory, deleteCategory, fetchCategories } from 'src/services/apiCategoriesServices'; // Import category API functions

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import CategoriesTableRow from '../categories-table-row';
import CategoriesTableHead from '../categories-table-head';
import CategoriesTableToolbar from '../categories-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function CategoryPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    id: '',
    name: '',
    description: '',
  });
  const [categoryData, setCategoryData] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCategoryData = await fetchCategories();
        setCategoryData(fetchedCategoryData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteCategory = async (categoryId) => {
    try {
      const isDeleted = await deleteCategory(categoryId);
      if (isDeleted) {
        const updatedCategoryData = categoryData.filter(category => category.id !== categoryId);
        setCategoryData(updatedCategoryData);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const addedCategory = await addCategory(newCategory);
      setCategoryData([...categoryData, addedCategory]);
      handleModalClose();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleEditCategory = async (updatedData) => {
    try {
      const editedCategory = await editCategory(editingCategory.id, updatedData);
      const updatedCategoryData = categoryData.map(category => {
        if (category.id === editingCategory.id) {
          return { ...category, ...editedCategory };
        }
        return category;
      });
      setCategoryData(updatedCategoryData);
      handleModalClose();
    } catch (error) {
      console.error('Error editing category:', error);
    }
  };

  const handleOpenEditModal = (categoryId) => {
    const categoryToEdit = categoryData.find(category => category.id === categoryId);
    if (categoryToEdit) {
      setEditingCategory(categoryToEdit);
      setNewCategory(categoryToEdit); 
      setIsModalOpen(true);
    }
  };

  const handleSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = categoryData.map((category) => category.id); 
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, categoryId) => {
    const selectedIndex = selected.indexOf(categoryId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, categoryId];
    } else if (selectedIndex === 0) {
      newSelected = selected.slice(1);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = selected.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [
        ...selected.slice(0, selectedIndex),
        ...selected.slice(selectedIndex + 1),
      ];
    }

    setSelected(newSelected);
  };

  const handleDeleteSelected = () => {
    selected.forEach((categoryId) => {
      handleDeleteCategory(categoryId);
    });
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10) || 5;
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    setPage(0);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setNewCategory({
      id: '',
      name: '',
      description: '',
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const dataFiltered = applyFilter({
    inputData: categoryData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Categories</Typography>
        <Button onClick={handleModalOpen} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New Category
        </Button>
      </Stack>

      <Card>
        <CategoriesTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDeleteSelected={handleDeleteSelected}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CategoriesTableHead
                order={order}
                orderBy={orderBy}
                rowCount={categoryData.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'id', label: 'ID' },
                  { id: 'name', label: 'Name' },
                  { id: 'description', label: 'Description' },
                  { id: '' } // Empty column for actions
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <CategoriesTableRow
                      key={row.id}
                      id={row.id}
                      name={row.name}
                      description={row.description}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
                      handleDelete={handleDeleteCategory}
                      handleEdit={handleOpenEditModal}
                    />
                  ))}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, categoryData.length)}
                />
                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={dataFiltered.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Dialog open={isModalOpen} onClose={handleModalClose}>
        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                name="id"
                label="ID"
                type="text"
                fullWidth
                variant="outlined"
                value={newCategory.id}
                onChange={handleInputChange}
                disabled={editingCategory} 
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="name"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                value={newCategory.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="description"
                label="Description"
                type="text"
                fullWidth
                variant="outlined"
                value={newCategory.description}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          {editingCategory ? (
            <Button onClick={() => handleEditCategory(newCategory)}>Save</Button>
          ) : (
            <Button onClick={handleAddCategory}>Add</Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}
