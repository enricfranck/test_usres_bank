
import {urlTransaction} from '../../security/config'
import { logout } from '../../security/Auth';

export const createTransaction = async (token, dataBody, email) => {
  console.log(dataBody, email)

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' +token
   }
  const request = new Request(urlTransaction+""+email, {
    method: 'POST',
    headers: headers,
    body: dataBody,
  });

  const response = await fetch(request);

  if (response.status === 500) {
    throw new Error('Internal server error');
  }

  if (response.status === 401) {
    logout()
  }

  const data = await response.json();

  if (response.status >= 400 && response.status < 500) {
    if (data.detail) {
      throw data.detail;
    }
    throw data;
  }

  return data;
};

export const getMyTransaction = async (token) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' +token
   }
  const request = new Request(urlTransaction+"me", {
    method: 'GET',
    headers: headers,
  });

  const response = await fetch(request);

  if (response.status === 500) {
    throw new Error('Internal server error');
  }

  const data = await response.json();

  if (response.status === 401) {
    logout()
  }

  if (response.status >= 400 && response.status < 500) {
    if (data.detail) {
      throw data.detail;
    }
    throw data;
  }

  return data;
};


export const getBalance = async (token) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' +token
   }
  const request = new Request(urlTransaction+"balance", {
    method: 'GET',
    headers: headers,
  });

  const response = await fetch(request);

  if (response.status === 500) {
    throw new Error('Internal server error');
  }

  const data = await response.json();

  if (response.status === 401) {
    logout()
  }

  if (response.status >= 400 && response.status < 500) {
    if (data.detail) {
      throw data.detail;
    }
    throw data;
  }

  return data;
};

export const getTransationDetails = async (token, id) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' +token
   }
  const request = new Request(urlTransaction+""+id, {
    method: 'GET',
    headers: headers,
  });

  const response = await fetch(request);

  if (response.status === 500) {
    throw new Error('Internal server error');
  }

  const data = await response.json();

  if (response.status === 401) {
    logout()
  }

  if (response.status >= 400 && response.status < 500) {
    if (data.detail) {
      throw data.detail;
    }
    throw data;
  }

  return data;
};

export const getAllTransactions = async (token) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' +token
   }
  const request = new Request(urlTransaction, {
    method: 'GET',
    headers: headers,
  });

  const response = await fetch(request);

  if (response.status === 500) {
    throw new Error('Internal server error');
  }

  if (response.status === 401) {
    logout()
  }

  const data = await response.json();

  if (response.status >= 400 && response.status < 500) {
    if (data.detail) {
      throw data.detail;
    }
    throw data;
  }

  return data;
};