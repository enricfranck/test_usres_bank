
import Container from '@mui/material/Container';
import React from 'react';
import Box from '@mui/material/Box';
import {useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Header from '../../component/Header'
import { useNavigate } from 'react-router-dom';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { getAllTransactions, getTransationDetails } from '../transaction/TransactionApi';


const  Transaction =() => {
  const [transactions, setData] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [id_transaction, setIdTransaction] = React.useState([])
  const [values, setValues] = React.useState({
    reference: '',
    type: '',
    amount:"",
    account:"",
    name: '',
    address: '',email: "",
  });


  const handleClose = () => {
    setOpen(false)
  }

  async function getTransactionDetail(){
    const token = localStorage.getItem('token')
    try {
      const data = await getTransationDetails(token, id_transaction);
      if (data) {
        setValues({
          ...values,
        reference: data.transaction_reference,
        type: data.transaction_type,
        date: data.transaction_date,
        amount: data.amount,
        account: data.account_id,
        name: data.user.last_name+""+data.user.first_name,
        address: data.user.address,
        email: data.user.email,
        })
        setOpen(true)
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

  const viewTransactionDetail = (event, cellValues) => {
    setIdTransaction(cellValues.row.id);
    getTransactionDetail()
  };
  

  const columns = [
    { field: 'transaction_reference', headerName: 'Reference', width: 140 },
    { field: 'transaction_type', headerName: 'Type', width: 120 },
    { field: 'amount', headerName: 'Amount', width: 200 },
    {
      field: 'transaction_date',
      headerName: 'Date',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 220,
    },
    {
      field: "Action", width: 200 ,
      renderCell: (cellValues) => {
        return (
          <>
            <IconButton color="primary" aria-label="transaction details" component="label" onClick={(event) => {
              viewTransactionDetail(event, cellValues);
            }} >
              <CreateRoundedIcon />
            </IconButton>
          </>
        );
      }
    },
  ];
  
  async function getTransactions(){
    const token = localStorage.getItem('token')
    try {
      const data = await getAllTransactions(token);
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
    getTransactions()
  }, []);

  return (
      <>
      <Header/>
      <Container maxWidth="lg" style={{ backgroundColor: 'white', minWidth:900}} disableGutters>
          <Box sx={{ height: 530 }}>
            <DataGrid
              rows={transactions}
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
          {"Transaction information acount N°"}{values.account}
        </DialogTitle>
        <DialogContent dividers>
            <Typography gutterBottom>
              Reference: {values.reference}
            </Typography>
            <Typography gutterBottom>
              Type: {values.type}
            </Typography>
            <Typography gutterBottom>
              Amount: {values.amount}
            </Typography>
            <Typography gutterBottom>
              Date: {values.date}
            </Typography>
            <Typography gutterBottom>
              User Email: {values.email}
            </Typography>
            <Typography gutterBottom>
              User Name: {values.name}
            </Typography>
            <Typography gutterBottom>
              User Address: {values.address}
            </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    </>
  );
}
export default Transaction