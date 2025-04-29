import React, { useState, useCallback, useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import './LoginUser.css';
import { loginUser } from '../../api/api';
import { validationSchema } from '../../schemas/LoginValidate';
import { saveToken, saveUser } from '../../utils/authFuntions';
import { parseJwt } from '../../utils/authJson';
import InputText from '../../components/inputs/InputText';
import { ButtonPrimary } from '../../components/button/ButtonPrimary';
import { useAuth } from '../../context/AuthProvider';
import { FaEnvelope, FaLock } from "react-icons/fa";
import loadImage from '../../assets/ImagesApp';

const initialValues = {
  correoUsuario: '',
  password: '',
};

const useImageLoader = (imageName) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    loadImage(imageName).then((img) => setImage(img.default));
  }, [imageName]);

  return image;
};


const LoginUser = () => {
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const ohSansi = useImageLoader("ohSansi");
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

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

        saveToken(token);
        saveUser({
          correoUsuario: result.data.correoUsuario,
          roles: roles,
          photo: result.data.photo,
        });

        navigate('/admin');
        window.location.reload();
      } else {
        setLoginError('Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error en el login:', JSON.stringify(error));
      setLoginError(
        error.response?.status === 401
          ? 'Usuario o contraseña incorrectos.'
          : 'Ocurrió un error. Intente más tarde.'
      );
    }
    setSubmitting(false);
  }, [navigate]);

  return (
    <div className="login-container">
      <div className="glassy-card animate__animated animate__fadeInDown">
        <h1 className="title">Olimpiadas Científicas UMSS</h1>
        {ohSansi && <img className="logo-fesa" src={ohSansi} alt="ohSansi" height="200px"/>}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <InputText
                name="correoUsuario"
                placeholder="Introduzca su correo electrónico"
                label="Correo electrónico"
                icon={FaEnvelope}
              />
              <InputText
                name="password"
                type="password"
                placeholder="Introduzca su contraseña"
                label="Contraseña"
                icon={FaLock}
              />

              <div className="actions">
                {loginError && <span className="error-message">{loginError}</span>}
                <ButtonPrimary type="submit" disabled={isSubmitting} className="btn-general">
                  {isSubmitting ? 'Ingresando...' : 'Ingresar'}
                </ButtonPrimary>
                <Link to="/reset">¿Olvidaste la contraseña?</Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default memo(LoginUser);
