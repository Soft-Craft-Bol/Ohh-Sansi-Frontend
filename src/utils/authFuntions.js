import Cookies from 'js-cookie';

export const signOut = () => {
  Cookies.remove('authToken');
  Cookies.remove('userData');
  window.location.reload();
};

export const saveToken = (token) => {
  Cookies.set('authToken', token, { 
    expires: 1,  // Expira en 1 día
    sameSite: 'Strict' 
  }); 
};

export const getToken = () => {
  return Cookies.get('authToken');
};

export const saveUser = (userData) => {
  Cookies.set('userData', JSON.stringify(userData), {
    expires: 1,  // Expira en 1 día
    sameSite: 'Strict'
  });
};

export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user JSON:", error);
    return null;
  }
};


export const removeToken = () => {
    Cookies.remove('authToken');
    Cookies.remove('userData');
    };
