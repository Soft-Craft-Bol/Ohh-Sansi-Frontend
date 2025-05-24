import React, { useState, useCallback, useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { FaEnvelope, FaLock, FaUserShield } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './LoginUser.css';
import { loginUser } from '../../api/api';
import { validationSchema } from '../../schemas/LoginValidate';
import { parseJwt } from '../../utils/authJson';
import InputText from '../../components/inputs/InputText';
import { ButtonPrimary } from '../../components/button/ButtonPrimary';
import { useAuth } from '../../context/AuthProvider';
import logo from '../../assets/img/logo.png';

const initialValues = {
  correoUsuario: '',
  password: '',
};

const LoginUser = () => {
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, login, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/admin');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = useCallback(async (values, { setSubmitting }) => {
    setLoginError('');
    try {
      const result = await loginUser({
        correoUsuario: values.correoUsuario.trim(),
        password: values.password,
      });
      
      if (result?.data?.token) {
        const token = result.data.token;
        const decodedToken = parseJwt(token);
        const roles = decodedToken?.authorities?.split(',') || [];
        const userData = {
          correoUsuario: result.data.correoUsuario,
          roles: roles,
          photo: result.data.photo,
        };
        
        login(token, userData);
      } else {
        setLoginError('Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error en el login:', error);
      setLoginError(
        error.response?.status === 401
          ? 'Usuario o contraseña incorrectos.'
          : 'Ocurrió un error. Intente más tarde.'
      );
    }
    setSubmitting(false);
  }, [login, navigate]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="login-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="login-container">
      {/* Fondo con partículas científicas */}
      <div className="login-background-pattern"></div>
      
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="login-header">
          <img src={logo} alt="Logo Olimpiadas" className="login-logo" />
          <h1 className="login-title">ohSansi</h1>
          <p className="login-subtitle">Olimpiadas Científicas UMSS</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <div className="login-form-icon">
                <FaUserShield />
              </div>

              <InputText
                name="correoUsuario"
                placeholder="Correo electrónico"
                label="Correo electrónico"
                icon={FaEnvelope}
              />
              <InputText
                name="password"
                type="password"
                placeholder="Contraseña"
                label="Contraseña"
                icon={FaLock}
              />

              <div className="login-actions">
                {loginError && (
                  <motion.div 
                    className="login-error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {loginError}
                  </motion.div>
                )}
                <ButtonPrimary 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="login-button"
                >
                  {isSubmitting ? (
                    <span className="login-button-loading">
                      <span className="spinner-dot"></span>
                      <span className="spinner-dot"></span>
                      <span className="spinner-dot"></span>
                    </span>
                  ) : 'Ingresar'}
                </ButtonPrimary>
                <Link to="/reset" className="login-forgot">
                  ¿Olvidaste la contraseña?
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default memo(LoginUser);