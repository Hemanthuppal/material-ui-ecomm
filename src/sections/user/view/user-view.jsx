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

import { addUser, editUser, fetchUsers, deleteUser } from 'src/services/apiUsersServices'; // Import API functions

import { useAccount } from 'src/_mock/account';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function UserPage() {
  const account = useAccount();

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    id: '',
    name: '',
    email: '',
    mobile: '',
    city: '',
    country: '',
  });
  const [userData, setUserData] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // Add state for editing user
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUserData = await fetchUsers();
        setUserData(fetchedUserData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const isDeleted = await deleteUser(userId);
      if (isDeleted) {
        const updatedUserData = userData.filter(user => user.id !== userId);
        setUserData(updatedUserData);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      const addedUser = await addUser(newUser);
      setUserData([...userData, addedUser]);
      handleModalClose();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEditUser = async (updatedData) => {
    try {
      const editedUser = await editUser(editingUser.id, updatedData);
      const updatedUserData = userData.map(user => {
        if (user.id === editingUser.id) {
          return { ...user, ...editedUser };
        }
        return user;
      });
      setUserData(updatedUserData);
      handleModalClose();
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  const handleOpenEditModal = (userId) => {
    const userToEdit = userData.find(user => user.id === userId);
    if (userToEdit) {
      setEditingUser(userToEdit);
      setNewUser(userToEdit); // Set newUser state to pre-fill the form
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
      const newSelecteds = userData.map((user) => user.id); // Selecting based on user ID
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, userId) => {
    const selectedIndex = selected.indexOf(userId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, userId];
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
    selected.forEach((userId) => {
      handleDeleteUser(userId);
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
    setEditingUser(null); // Clear editingUser state
    setNewUser({
      id: '',
      name: '',
      email: '',
      mobile: '',
      city: '',
      country: '',
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const dataFiltered = applyFilter({
    inputData: userData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Hello ,{account.displayName} ! Here are the Users  </Typography>

        <Button onClick={handleModalOpen} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New User
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDeleteSelected={handleDeleteSelected} // New prop to handle delete selected
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={userData.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'id', label: 'ID' },
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'mobile', label: 'Mobile' },
                  { id: 'city', label: 'City' },
                  { id: 'country', label: 'Country' },
                  {id: ''}
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      id={row.id}
                      name={row.name}
                      email={row.email}
                      mobile={row.mobile}
                      city={row.city}
                      country={row.country}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
                      handleDelete={handleDeleteUser}
                      handleEdit={handleOpenEditModal}
                    />
                  ))}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, userData.length)}
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
  <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
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
          value={newUser.id}
          onChange={handleInputChange}
          disabled={editingUser} // Disable ID field for editing
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
          value={newUser.name}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={newUser.email}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          margin="dense"
          name="mobile"
          label="Mobile"
          type="tel"
          fullWidth
          variant="outlined"
          value={newUser.mobile}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          margin="dense"
          name="city"
          label="City"
          type="text"
          fullWidth
          variant="outlined"
          value={newUser.city}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          margin="dense"
          name="country"
          label="Country"
          type="text"
          fullWidth
          variant="outlined"
          value={newUser.country}
          onChange={handleInputChange}
        />
      </Grid>
    </Grid>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleModalClose}>Cancel</Button>
    {editingUser ? (
      <Button onClick={() => handleEditUser(newUser)}>Save</Button>
    ) : (
      <Button onClick={handleAddUser}>Add</Button>
    )}
  </DialogActions>
</Dialog>


    </Container>
  );
}
