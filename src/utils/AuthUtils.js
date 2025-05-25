import Cookies from 'js-cookie';

export const signOut = () => {
  Cookies.remove('authToken');
  Cookies.remove('userData');
  localStorage.removeItem('user'); // Limpiar también localStorage
  window.location.href = '/login'; // Mejor que reload
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
  const userString = JSON.stringify(userData);
  // Guardar en ambos lugares para consistencia
  Cookies.set('userData', userString, {
    expires: 1,  // Expira en 1 día
    sameSite: 'Strict'
  });
  localStorage.setItem('user', userString);
};

export const getUser = () => {
  try {
    // Intentar primero con cookies, luego localStorage
    let user = Cookies.get('userData');
    if (user) {
      return JSON.parse(user);
    }
    
    user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user JSON:", error);
    return null;
  }
};

export const removeToken = () => {
  Cookies.remove('authToken');
  Cookies.remove('userData');
  localStorage.removeItem('user');
};

export function parseJwt(token) {
  if (!token) {
    return null;
  }
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}

export function isTokenValid(token) {
  if (!token) return false;
  
  const parsedToken = parseJwt(token);
  if (parsedToken && parsedToken.exp) {
    return parsedToken.exp * 1000 > Date.now();
  }
  return false;
}