import * as React from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router";
import { login } from "../security/Auth";
import Snackbar from '@mui/material/Snackbar';
import LoadingButton from '@mui/lab/LoadingButton';
import MuiAlert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import { defaultPassword } from '../security/config';
import {useEffect} from 'react';
import {getUserFree} from '../admin/user/UsersApi'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Login() {

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("null");
  const [loading, setLoading] = React.useState(false);
  const [users, setUser] = React.useState([])
  const [userEmail, setUserEmail] = React.useState("")
  const [validUsers, setValidUsers] = React.useState(false)

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
      const data = await getUserFree("login");
      console.log(data)
      if (data) {
        setUser(data)
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

  const navigate = useNavigate();
  const [severity, setSeverity] = React.useState("success");

  const validationUsers = (event, newValue) =>{
    console.log(newValue)
    if (newValue){
      setValidUsers(true)
      setUserEmail(newValue.email)
    }else{
      setValidUsers(false)
      setUserEmail()
    }
  }

  //check to see if the fields are not empty
  async function authentication  (){
    setLoading(true);
    if (validUsers){try {
      const data = await login(userEmail, defaultPassword);
      if (data) {
        setLoading(false)
        if (data) {
          setLoading(false)
          if (localStorage.getItem("permissions") === "admin"){
              navigate('/users')
          }else{
              navigate('/home')
          }
        }
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
    }}else{
        setSeverity("warning")
        setMessage("Select user to login")
        handleClick();
        setLoading(false)
    }
    
  };

  return (
      <Container maxWidth="false" style={{ backgroundColor:'rgb(0, 30, 60)',  minWidth:900}} disableGutters>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height:'100vh'
      }}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>

            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom component={'span'} >
              <Autocomplete
                disablePortal
                id="mention"
                options={users}
                getOptionLabel={(option) => option.email}
                onChange={validationUsers}
                sx={{ width: '100%' , margin:1}}
                renderInput={(params) => <TextField {...params} label="Users" required error={!validUsers}  />}
              />
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom component={'span'} >
                <LoadingButton 
                    variant="contained" 
                    sx={{ m: 1, width: '60ch' , color:'white'}} 
                    onClick={()=>{
                      authentication();
                    }}
                    loading={loading}
                >Login
                </LoadingButton>
            </Typography>
            </CardContent>
            </Card>
      </div>
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
  );
}
