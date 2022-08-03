import * as React from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import GroupIcon from '@mui/icons-material/Group';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import {useNavigate} from 'react-router-dom';
import FormGroup from '@mui/material/FormGroup';

export default function ButtonAppBar() {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');
    navigate('/')
  };

  return (
    <>
     <Container maxWidth="lg" style={{ backgroundColor:"whitesmoke", minWidth:1053}} disableGutters>
     <Stack spacing={2} direction="columns" justifyContent="start" >
        <Container  style={{ backgroundColor:"whitesmoke", height: 100}} disableGutters>

          <FormGroup aria-label="position" columns spacing={2}>

          <Container  style={{ backgroundColor:"whitesmoke", height: 10, paddingLeft:"20",width:"20%"}} disableGutters>
            </Container>
            <Stack spacing={2} direction="row" justifyContent="center" >
                <Button variant="outlined" startIcon={<GroupIcon />} onClick={()=>{
                            navigate('/home')
                          }}> Balance</Button>
                <Button variant="outlined" startIcon={<HomeIcon />} onClick={()=>{
                            navigate('/transactionUser')
                          }
                          }> Trasaction</Button>
                <Button variant="outlined" startIcon={<WorkIcon />}onClick={logout} > Logout</Button>
            </Stack>
            </FormGroup>
        </Container>
      </Stack>
     
    </Container>
    </>
  );
}
