import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import LoginInfo from '../components/LoginInfo';

function Login() {
  // from React Hook Form
  const formMethods = useForm();
  const register = formMethods.register; // function to register form fields (email, password)
  const handleSubmit = formMethods.handleSubmit; // function validates before onSubmit
  const formState = formMethods.formState; // object with form state
  const errors = formState.errors; // object with validation errors for fields
  
  // get context auth - login function
  const authContext = useAuth();
  const login = authContext.login;
  
  // to navigate
  const navigate = useNavigate();
  
  // error handler
  const [loginError, setLoginError] = useState('');

  // onSubmit function - called when form is submitted and validated
  function onSubmit(data) {
    const success = login(data.email, data.password);
    
    if (success) {
      navigate('/dashboard'); 
    } else {
      setLoginError('Nieprawidłowy email lub hasło');
    }
  }

  // render
  return (
    <div>
      <h2>Zaloguj się</h2>
      
      {/* show test data */}
      <LoginInfo />
      
      {/* log form */}
      {/* handleSubmit from React Hook Form:
            1. prevents default form submission
            2. check fileds validation
            3. if OK -> calls onSubmit with form data
            4. if NOT -> shows validation errors */}
          <form onSubmit={handleSubmit(onSubmit)}>
          {/* component with email and password fields */}
        <LoginForm 
          register={register} 
          errors={errors} 
          loginError={loginError}
        />
      </form>
    </div>
  );
}

export default Login;