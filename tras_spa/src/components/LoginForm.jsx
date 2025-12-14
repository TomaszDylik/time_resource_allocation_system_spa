function LoginForm(props) {
  const register = props.register;
  const errors = props.errors;
  const loginError = props.loginError;
  
  return (
    <div>
      <div className="form-group">
        <label className="form-label">
          Email
        </label>
        <input 
          className="form-input"
          type="email"
          {...register("email", { required: "Email jest wymagany" })} 
        />
        {errors.email && (
          <span className="form-error">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Hasło
        </label>
        <input 
          type="password" 
          className="form-input"
          {...register("password", { required: "Hasło jest wymagane" })} 
        />
        {errors.password && (
          <span className="form-error">
            {errors.password.message}
          </span>
        )}
      </div>

      {/* logging error - no in backend */}
      {loginError && (
        <div className="login-error">
          {loginError}
        </div>
      )}

      <button 
        type="submit"
        className="submit-button"
      >
        Zaloguj się
      </button>
    </div>
  );
}

export default LoginForm;