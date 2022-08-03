import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Header from '../component/HeaderUser'
import Container from '@mui/material/Container'
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from "react-router";
import LoadingButton from '@mui/lab/LoadingButton';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {getUserForTranfert} from '../admin/user/UsersApi'
import {useEffect} from 'react';
import { createTransaction } from '../admin/transaction/TransactionApi';
import { fetchToken } from '../security/Auth';
import Autocomplete from '@mui/material/Autocomplete';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

export default function TransactionCreate() {
  const [values, setValues] = React.useState({
    reference: '',validReference:true,
    type: '', validType: true,
    amount: '',validAmount: true,
    email:'current', validUser: false
  });

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("null");
  const [loading, setLoading] = React.useState(false);
  const [severity, setSeverity] = React.useState("success");
  const [usersReceved, setUsersReceved] = React.useState([]);
  const [isDisable, setIsDisable] = React.useState(true);
  const navigate = useNavigate();
  const token = fetchToken()

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  async function getAllUsers(){
    try {
      const data = await getUserForTranfert(token);
      console.log(data)
      if (data) {
        setUsersReceved(data)
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

  async function create  (dataBody, email){
    if (!validation()){
        setLoading(true)
        console.log(JSON.stringify(dataBody))
        try {
          const data = await createTransaction(token, JSON.stringify(dataBody), email);
          if (data) {
            setSeverity("success")
            setMessage("Transaction created")
            handleClick();
            setLoading(false)
          }
        } catch (err) {
          if (err instanceof Error) {
            // handle errors thrown from frontend
            console.log(err.message);
            setSeverity("warning")
            setMessage(String(err))
            handleClick();
            setLoading(false)
          } else {
            // handle errors thrown from backend
            console.log(String(err));
            setSeverity("error")
            setMessage(String(err));
            handleClick();
            setLoading(false)
          }
        }
    }else{
      setSeverity("error")
      setMessage("champs requise not set")
      handleClick();
    }
  };

  function createTrans(){
    const dataBody = {
      "transaction_reference": values.reference,
      "transaction_type":values.type,
      "amount": values.amount
      }
    create(dataBody, "current")
    if (!isDisable){
      setValues({
        ...values,
        type: "Deposit"
      })
      const dataBody_ = {
        "transaction_reference": values.reference,
        "transaction_type":"Deposit",
        "amount": values.amount
        }
      create(dataBody_, values.email)
      navigate('/transactionUser')
    }
  }

function validation(){
  if (values.validReference || values.validType || values.validAmount  || values.validUser){
    return true
  } 
  return false
}
const transactionTypes = [{"label":"Deposit"},{"label":"Withdraw"},{"label":"Transfert betwen my bank account"}]

const validationUser = (event, newValue) => {
  console.log(newValue)
    if (newValue) {
      setValues({
        ...values,
        validUser: false,
        email: newValue.email,
      });
    } else {
      setValues({
        ...values,
        validUser: true,
        email: newValue.email,
      });
    }
  }

const validationTransactionType = (event, newValue) => {
  console.log(newValue)
  if (newValue) {
    setValues({
      ...values,
      validType: false,
      type: newValue.label,
    });
  } else {
    setValues({
      ...values,
      validType: true,
      type: newValue.label,
    });
  }

  if (newValue.label === "Transfert betwen my bank account"){
    setIsDisable(false)
  }else{
    setIsDisable(true)
  }
}

const validateField = (e) => {
  const field = e.target.value
  const id = e.target.id
  switch(id){
    case "reference" :
      if (field ) {
        setValues({
          ...values,
          validReference: false,
          reference: field,
        });
      } else {
        setValues({
          ...values,
          validReference: true,
          reference: field,
        });
      }
      break;
    case "amount" :
        if (field ) {
          setValues({
            ...values,
            validAmount: false,
            amount: field,
          });
        } else {
          setValues({
            ...values,
            validAmount: true,
            amount: field,
          });
        }
    break;
      default:
        break;
};
}

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>

      <Header/>
      <Container style={{ backgroundColor: 'white', minWidth:900, paddingTop:40}} disableGutters>
      <FormGroup aria-label="position" row>
          <Autocomplete
              disablePortal
              id="transaction_type"
              options={transactionTypes}
              onChange={validationTransactionType}
              sx={{ width: '97%' , margin:1}}
              renderInput={(params) => <TextField {...params} label="Transaction type" required error={validationTransactionType}  />}
            />
          <Autocomplete
              disabled={isDisable}
              disablePortal
              id="email"
              options={usersReceved}
              onChange={validationUser}
              getOptionLabel={(option) => option.email}
              sx={{ width: '97%' , margin:1}}
              renderInput={(params) => <TextField {...params} label="Email" required error={values.validUser}  />}
            />
        </FormGroup>
        <div>
         <TextField
          required
          error={values.validReference}
          label="Transaction Reference"
          id="reference"
          sx={{ m: 1, width: '50%' }}
          onChange={(e) => validateField(e)}
        />
         <TextField
         reaquired
          label="Amount"
          error={values.validAmount}
          id="amount"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ m: 1, width: '45%' }}
          onChange={(e) => validateField(e)}
        />

      </div>
    <LoadingButton 
        variant="contained" 
        sx={{ m: 1, width: '97%' , color:'white'}} 
        onClick={()=>{
          createTrans();
        }}
        loading={loading}
    >Create
    </LoadingButton>
    <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      > 
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
     </Container>
    </Box>
  );
}
