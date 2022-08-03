import { useLocation,Navigate } from "react-router-dom"
import decodeJwt from 'jwt-decode';
import {urlLogin} from '../security/config'

export const setToken = (token)=>{
    localStorage.setItem('token', token)// make up your own token
}

export const fetchToken = (token)=>{
    return localStorage.getItem('token')
}
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');
  };
  
export const login = async (email, password) => {
    // Assert email or password is not empty
    if (!(email.length > 0) || !(password.length > 0)) {
      throw new Error('Email or password was not provided');
    }
    const formData = new FormData();
    // OAuth2 expects form data, not JSON data
    formData.append('username', email);
    formData.append('password', password);
    console.log(urlLogin)
    const request = new Request(urlLogin, {
      method: 'POST',
      body: formData,
    });
  
    const response = await fetch(request);
  
    if (response.status === 500) {
      throw new Error('Internal server error');
    }
  
    const data = await response.json();
  
    if (response.status >= 400 && response.status < 500) {
      if (data.detail) {
        throw data.detail;
      }
      throw data;
    }
  
    if ('access_token' in data) {
      const decodedToken = decodeJwt(data['access_token']);
      localStorage.setItem('token', data['access_token']);
      localStorage.setItem('permissions', decodedToken.permissions);
    }
  
    return data;
  };


export function RequireToken({children}){

    let auth = fetchToken()
    let location = useLocation()

    if(!auth){

        return <Navigate to='/' state ={{from : location}}/>;
    }

    return children;
}

export function RequireAdmin({children}){

  let auth = fetchToken()
  let location = useLocation()
  let permissions = localStorage.getItem('permissions')
  console.log("permission "+permissions)
  if(!auth){
      return <Navigate to='/' state ={{from : location}}/>;
  }else{
    if(localStorage.getItem("permissions") === "user"){
      return <Navigate to='/home' state ={{from : location}}/>;
    }

  return children;
  }

}