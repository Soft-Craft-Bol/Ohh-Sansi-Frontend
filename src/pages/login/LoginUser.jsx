import React, { useState, useCallback, useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import './LoginUser.css';
import { loginUser } from '../../api/api';
import loadImage from '../../assets/ImagesApp';
import { validationSchema } from '../../schemas/LoginValidate';
import { saveToken, saveUser } from '../../utils/authFuntions';
import { parseJwt } from '../../utils/auth';
import InputText from '../../components/inputs/InputText';
import { ButtonPrimary } from '../../components/button/ButtonPrimary';
import { useAuth } from '../../context/AuthProvider';

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

const MemoizedInputText = memo(({ name, placeholder, label, type = "text" }) => (
  <InputText name={name} placeholder={placeholder} label={label} type={type} />
));

const LoginUser = () => {
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const inpased = useImageLoader("inpased");
  const logo = useImageLoader("logo");

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = useCallback(async (values, { setSubmitting }) => {
    setLoginError('');
    try {
      const result = await loginUser({
        correoUsuario: values.correoUsuario.trim(),
        password: values.password,
      });
      console.log('result:', result);

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

        navigate('/home');
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
      {inpased && <img className="logo-fesa" src={inpased} alt="Inpased" height="100px" />}
      <div className="login-form">
        <h1>Inicia sesión</h1>
        {logo && <img className="logo-fesa" src={logo} alt="Logo" height="80px" />}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form style={{ flexDirection: "column" }}>
              <MemoizedInputText name="correoUsuario" placeholder="Introduzca su correo electronico" label="Correo electronico" />
              <MemoizedInputText name="password" type="password" placeholder="Introduzca su contraseña" label="Contraseña" />

              <div>
                {loginError && <span className="error-message">{loginError}</span>}
                <Link to="/reset">¿Olvidaste la contraseña?</Link>
                <ButtonPrimary type="submit" disabled={isSubmitting} className="btn-general">
                  {isSubmitting ? 'Ingresando...' : 'Ingresar'}
                </ButtonPrimary>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default memo(LoginUser);