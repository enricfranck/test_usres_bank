
import {urlUsers} from '../../security/config'
import { logout } from '../../security/Auth';

export const createUser = async (token, dataBody, accountType) => {
  console.log(dataBody)

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' +token
   }
  const request = new Request(urlUsers+"1?account_type="+accountType, {
    method: 'POST',
    headers: headers,
    body: dataBody,
  });

  const response = await fetch(request);

  if (response.status === 401) {
    logout()
  }

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

  return data;
};

export const UpdateUser = async (token, dataBody, id) => {
  console.log(urlUsers)
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' +token
   }
  const request = new Request(urlUsers+""+id, {
    method: 'PUT',
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

export const getUserFree = async (type) => {
  const headers = {
    'Content-Type': 'application/json'
   }
  const request = new Request(urlUsers+""+type, {
    method: 'GET',
    headers: headers,
  });

  const response = await fetch(request);

  if (response.status === 500) {
    throw new Error('Internal server error');

  } if (response.status === 401) {
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
export const getUserForTranfert= async (token) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' +token
   }
  const request = new Request(urlUsers+"user", {
    method: 'GET',
    headers: headers,
  });

  const response = await fetch(request);

  if (response.status === 500) {
    throw new Error('Internal server error');

  } if (response.status === 401) {
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

export const getUser = async (token) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' +token
   }
  const request = new Request(urlUsers, {
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
export const getUserById = async (token, id) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' +token
   }
  const request = new Request(urlUsers+""+id, {
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

export const deleteUser = async (token, uuid) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' +token
   }
  const request = new Request(urlUsers+""+uuid, {
    method: 'DELETE',
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