// src/pages/Login.jsx
import { useCallback } from 'react'; // 👈 1
import { useNavigate,useLocation } from 'react-router-dom'; // 👈 3
import { FormProvider, useForm } from 'react-hook-form';
import LabelInput from '../components/LabelInput';
import { useAuth } from '../contexts/auth'; // 👈 2
import Error from '../components/Error'; // 👈 5
import './Login.css';

const validationRules = {
  email: {
    required: 'Email is required',
  },
  password: {
    required: 'Password is required',
  },
};

export default function Login() {
  const { search } = useLocation();
  const { error, loading, login } = useAuth(); // 👈 2, 4 en 5
  const navigate = useNavigate();

  // 👇 7
  const methods = useForm({
    defaultValues: {
      email: 'peter.parker@email.com',
      password: '12345678',
    },
  });
  const { handleSubmit, reset } = methods; // 👈 1 en 6

  // 👇 6
  const handleCancel = useCallback(() => {
    reset();
  }, [reset]);

  // 👇 1
  const handleLogin = useCallback(
    async ({ email, password }) => {
      const loggedIn = await login(email, password); // 👈 2
      // 👇 3
      if (loggedIn) {
        const params = new URLSearchParams(search);
        navigate({
          pathname: params.get('redirect') || '/',
          replace: true,
        });
      }
    },
    [login, navigate,search], // 👈 2 en 3
  );

  return (
    <FormProvider {...methods}>
      <div className='login-container'>
        <h2 className='login-title'>Login</h2>
        <form
          className='login-form d-flex flex-column'
          onSubmit={handleSubmit(handleLogin)}
        >
          {/* 👆 1 */}
          <Error error={error} /> {/* 👈 5 */}
          <LabelInput
            label='email'
            type='text'
            name='email'
            placeholder='your@email.com'
            validationRules={validationRules.email}
            data-cy='email_input'
          />
          <LabelInput
            label='password'
            type='password'
            name='password'
            validationRules={validationRules.password}
            data-cy='password_input'
          />
          <div className='clearfix'>
            <div className='btn-group float-end'>
              <button
                type='submit'
                className='btn btn-primary'
                disabled={loading}
                data-cy='submit_btn'
              >
                {/* 👆 4 */}
                Sign in
              </button>

              <button
                type='button'
                className='btn btn-light'
                onClick={handleCancel}
              >
                {/* 👆 6*/}
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
