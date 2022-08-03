
import Container from '@mui/material/Container';
import React from 'react';
import Box from '@mui/material/Box';
import {useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Header from '../component/HeaderUser'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import { getMyTransaction } from '../admin/transaction/TransactionApi';


const  Transaction =() => {
  const [transactions, setData] = React.useState([])
  const navigate = useNavigate()


  const columns = [
    { field: 'transaction_reference', headerName: 'Reference', width: 140 },
    { field: 'transaction_type', headerName: 'Type', width: 300 },
    { field: 'amount', headerName: 'Amount', width: 200 },
    {
      field: 'transaction_date',
      headerName: 'Date',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 220,
    },
  ];
  
  async function getTransactions(){
    const token = localStorage.getItem('token')
    try {
      const data = await getMyTransaction(token);
      console.log(data)
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
      <Stack spacing={2} direction="row" margin={1} justifyContent="flex-end">
          <Button variant="contained" 
          startIcon={<PersonAddRoundedIcon />} 
          onClick={()=>{navigate('/transactionCreate')}}
          >Create</Button>
        </Stack>
          <Box sx={{ height: 530 }}>
            <DataGrid
              rows={transactions}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={8}
              rowsPerPageOptions={[8]}
            />
          </Box>
      </Container>
    </>
  );
}
export default Transaction