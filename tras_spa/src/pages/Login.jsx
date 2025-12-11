import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');

  const onSubmit = (data) => {
    const success = login(data.email, data.password);
    if (success) {
      // Przekierowanie w zależności od roli (możemy to potem ulepszyć)
      navigate('/dashboard'); 
    } else {
      setLoginError('Nieprawidłowy email lub hasło');
    }
  };

  return (
    <div>
      <h2>Zaloguj się</h2>

      <div>
        <p>Admin: admin@spa.pl / password</p>
        <p>Klient: jan@spa.pl / password</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        
        <div>
          <label>Email</label>
          <input 
            {...register("email", { required: "Email jest wymagany" })} 
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div>
          <label>Hasło</label>
          <input 
            type="password"
            {...register("password", { required: "Hasło jest wymagane" })} 
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        {loginError && <div>{loginError}</div>}

        <button type="submit" className="btn btn--primary">
          Zaloguj się
        </button>
      </form>
    </div>
  );
};

export default Login;