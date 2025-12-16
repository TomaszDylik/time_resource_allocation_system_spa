import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import LoginInfo from '../components/LoginInfo';

function Login() {
  const formMethods = useForm();
  const register = formMethods.register;
  const handleSubmit = formMethods.handleSubmit;
  const formState = formMethods.formState;
  const errors = formState.errors;
  
  const authContext = useAuth();
  const login = authContext.login;
  const user = authContext.user;
  
  const navigate = useNavigate();
  
  const [loginError, setLoginError] = useState('');

  // redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  function onSubmit(data) {
    const success = login(data.email, data.password);
    
    if (success) {
      navigate('/dashboard'); 
    } else {
      setLoginError('Nieprawidłowy email lub hasło');
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">
            Zaloguj się
          </h2>
          
          <LoginInfo />
          
          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <LoginForm 
              register={register} 
              errors={errors} 
              loginError={loginError}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;