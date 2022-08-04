
import Container from '@mui/material/Container';
import React from 'react';
import Box from '@mui/material/Box';
import {useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import Header from '../../component/Header'
import { useNavigate } from 'react-router-dom';
import {getUser} from './UsersApi'
import DeleteIcon from '@mui/icons-material/Delete';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { deleteUser } from './UsersApi';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const  Users =() => {
  const [users, setData] = React.useState([])
  const [open, setOpen] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [message, setMessage] = React.useState('')
  const [userEmail, setUserEmail] = React.useState('')
  const [id, setId] = React.useState('')
  const [severity, setSeverity] = React.useState("success");
  const navigate = useNavigate()

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    deleteUsers()
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const OpenAlert = () => {
    setOpenAlert(true);
  };

  const CloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  async function deleteUsers(){
    const token = localStorage.getItem('token')
    try {
      const data = await deleteUser(token, id)
      if (data) {
        setData(data)
        setOpen(false);
        setSeverity("success")
        setMessage(userEmail+" bien supprimé ")
        OpenAlert()
      }
    } catch (err) {
      if (err instanceof Error) {
        // handle errors thrown from frontend
        console.log(err.message);
        setSeverity("error")
        setMessage(err.message)
        OpenAlert()
      } else {
        // handle errors thrown from backend
        console.log(String(err));
        setSeverity("error")
        setMessage(String(err))
        OpenAlert()
      }
    }
  }

  const handleClick = (event, cellValues) => {
    setUserEmail(cellValues.row.email);
    setId(cellValues.row.id);
    handleClickOpen()
  };

  const editUser = (event, cellValues) => {
    localStorage.setItem("id",cellValues.row.id);
    console.log(cellValues.row)
    navigate('/userEdit')
  };
  

  const columns = [
    { field: 'last_name', headerName: 'Last name', width: 140 },
    { field: 'first_name', headerName: 'First name', width: 120 },
    { field: 'address', headerName: 'Address', width: 200 },
    {
      field: 'is_active',
      headerName: 'Active',
      width: 120,
      renderCell:(cellValues) => {
        return(
          <Checkbox disabled checked={cellValues.row.is_active}  />
        )
      }
    },
    {
      field: 'email',
      headerName: 'Email',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 200,
    },
    {
      field: "Action", width: 200 ,
      renderCell: (cellValues) => {
        return (
          <Stack spacing={2} direction="row" margin={1} justifyContent="flex-end">
            <IconButton color="primary" aria-label="upload picture" component="label" onClick={(event) => {
              editUser(event, cellValues);
            }} >
              <CreateRoundedIcon />
            </IconButton>
            <IconButton component="label" onClick={(event) => {
              handleClick(event, cellValues);
            }} disabled={cellValues.row.is_superuser}>
             <DeleteIcon />
            </IconButton>
          </Stack>
        );
      }
    },
  ];
  
  async function getAllUsers(){
    const token = localStorage.getItem('token')
    try {
      const data = await getUser(token);
      if (data) {
        setData(data)
      }
    } catch (err) {
      if (err instanceof Error) {
        // handle errors thrown from frontend
        console.log(err.message);
      } else {
        // handle errors thrown from backend
        console.log(String(err));
      }
    }
  }
  useEffect(() => {
    getAllUsers()
  }, []);

  return (
      <>
      <Header/>
      <Container maxWidth="lg" style={{ backgroundColor: 'white', minWidth:900}} disableGutters>
        <Stack spacing={2} direction="row" margin={1} justifyContent="flex-end">
          <Button variant="contained" 
          startIcon={<PersonAddRoundedIcon />} 
          onClick={()=>{navigate('/userCreate')}}
          >Create</Button>
        </Stack>
          <Box sx={{ height: 530 }}>
            <DataGrid
              rows={users}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={8}
              rowsPerPageOptions={[8]}
            />
          </Box>
          <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to remove "}{userEmail}{"?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={CloseAlert}
      > 
      <Alert onClose={CloseAlert} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      </Container>
    </>
  );
}
export default Users