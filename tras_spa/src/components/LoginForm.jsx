function LoginForm(props) {
  const register = props.register;
  const errors = props.errors;
  const loginError = props.loginError;
  
  return (
    <div>
      <div>
        <label>Email</label>
        <input {...register("email", { required: "Email jest wymagany" })} />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label>Hasło</label>
        <input type="password" {...register("password", { required: "Hasło jest wymagane" })} />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      {/* logging error - no in backend */}
      {loginError && <div>{loginError}</div>}

      <button type="submit">Zaloguj się</button>
    </div>
  );
}

export default LoginForm;