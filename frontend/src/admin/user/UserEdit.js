import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Header from '../../component/Header'
import Container from '@mui/material/Container'
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from "react-router";
import LoadingButton from '@mui/lab/LoadingButton';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import validator from 'validator'
import {getUserById} from './UsersApi'
import { defaultPassword } from '../../security/config';
import { fetchToken } from '../../security/Auth';
import {UpdateUser} from '../../admin/user/UsersApi'
import {useEffect} from 'react';
import Autocomplete from '@mui/material/Autocomplete';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

export default function UserEdit() {
  const [values, setValues] = React.useState({
    email: '',validEmail:true,
    firstName: '',
    lastName: '',validLastName: true,
    address: '',validAddress: true,
    admin: false,
    active: false,
  });

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("null");
  const [loading, setLoading] = React.useState(false);
  const [severity, setSeverity] = React.useState("success");
  const [accountType, setaccountType] = React.useState("");
  const [validAccountType, setvalidAccountType] = React.useState("");
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



  async function update  (){
    if (!validation()){
        setLoading(true)
    
      const uuid_mention = []
      for (const value in values.mention) {
        if (!uuid_mention.includes(values.mention[value].uuid)){
          uuid_mention.push(values.mention[value].uuid)
        }
      }

      const dataBody = {
        "email": values.email,
        "password":defaultPassword,
        "first_name": values.firstName,
        "last_name": values.lastName,
        "address": values.address,
        "is_active": values.active,
        "is_admin": values.admin,
        }
        console.log(JSON.stringify(dataBody))
        try {
          const data = await UpdateUser(token, JSON.stringify(dataBody), localStorage.getItem('id'));
          if (data) {
            setSeverity("success")
            setMessage("Utilusateur crée")
            handleClick();
            setLoading(false)
            navigate('/users')
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
      setMessage("Veuillez remplir tous les champ obligatoire *")
      handleClick();
    }
  };

  function setDataBody(data){
    setValues({
      ...values,
      email: data.email,
      lastName: data.last_name,
      firstName: data.first_name,
      address: data.address,

      validEmail: false,
      validLastName: false,
      validAddress: false,
      admin: data.is_admin,
      active: data.is_active
      
    });
    setaccountType(data.account_type)
  }
  async function getAllUsers(){
    const token = localStorage.getItem('token')
    try {
      const data = await getUserById(token, localStorage.getItem('id'));
      console.log(data)
      if (data) {
        setDataBody(data)
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

  const validateEmail = (e) => {
    const email = e.target.value
    console.log(e.target.id)
    if (email && validator.isEmail(email)) {
      setValues({
        ...values,
        validEmail: false,
        email: email,
      });
    } else {
      setValues({
        ...values,
        validEmail: true,
      });
    }
};

function validation(){
  if (values.validLastName || values.validEmail || values.validAddress){
    return true
  } 
  return false
}
const accountTypes = [{"label":"Type1"},{"label":"Type2"},{"label":"Type3"}]

const validationAccountType = (event, newValue) => {
  console.log(newValue)
  if (newValue) {
    setaccountType(newValue.label)
    setvalidAccountType(false)
  } else {
    setaccountType(newValue.label)
    setvalidAccountType(true)
  }
  }

const validateField = (e) => {
  const field = e.target.value
  const id = e.target.id
  switch(id){
    case "last-name" :
      if (field && field.length > 1) {
        setValues({
          ...values,
          validLastName: false,
          lastName: field,
        });
      } else {
        setValues({
          ...values,
          validLastName: true,
        });
      }
      break;
    case "address" :
        if (field ) {
          setValues({
            ...values,
            validAddress: false,
            address: field,
          });
        } else {
          setValues({
            ...values,
            validAddress: true,
            address: field,
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
        <div>
         <TextField
          required
          value={values.lastName}
          error={values.validLastName}
          label="Last name"
          id="last-name"
          sx={{ m: 1, width: '50%' }}
          onChange={(e) => validateField(e)}
        />
         <TextField
          value={values.firstName}
          label="First name"
          id="first-name"
          sx={{ m: 1, width: '45%' }}
          onChange={(e)=>{
            setValues({
              ...values,
              firstName: e.target.value,
            });
          }}
        />

      <FormGroup aria-label="position" row>
          <TextField
            required
            value={values.email}
            error={values.validEmail}
            label="Email"
            id="email"
            sx={{ m: 1, width: '50%' }}
            onChange={(e) => validateEmail(e)}
          />
          <TextField
            required
            value={values.address}
            error={values.validAddress}
            label="Address"
            id="address"
            sx={{ m: 1, width: '45%' }}
            onChange={(e) => validateField(e)}
          />
          
        </FormGroup>
      </div>
      <Autocomplete
          disablePortal
          id="account_type"
          options={accountTypes}
          onChange={validationAccountType}
          sx={{ width: '97%' , margin:1}}
          renderInput={(params) => <TextField {...params} label="Acount type" required error={validAccountType}  />}
        />
      <FormControl component="fieldset">
      
      <FormGroup aria-label="position" row>
        <FormControlLabel
            value="Admin"
            control={<Switch checked={values.admin} color="primary" onChange={()=>{
              setValues({
                ...values,
                admin: !values.admin,
              })
              console.log(!values.admin)
            }}/>}
            label="Admin"
            labelPlacement="top"
            />
        <FormControlLabel
          value="Active"
          control={<Switch checked={values.active} color="primary" onChange={()=>{
            setValues({
              ...values,
              active: !values.active,
            });
        console.log(!values.active)
        }}/>}
          label="Active"
          labelPlacement="top"
        />
      </FormGroup>
      
    </FormControl> 
    <LoadingButton 
        variant="contained" 
        sx={{ m: 1, width: '97%' , color:'white'}} 
        onClick={()=>{
          update();
        }}
        loading={loading}
    >Update
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
