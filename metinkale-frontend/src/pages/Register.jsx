import {
  useCallback, useMemo,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FormProvider, useForm,
} from 'react-hook-form';
import LabelInput from '../components/LabelInput';
import { useAuth } from '../contexts/auth';
import Error from '../components/Error';
import { useThemeColors } from '../contexts/theme';
import './Register.css';

export default function Register() {
  const {
    theme, oppositeTheme,
  } = useThemeColors();
  const {
    error, loading, register,
  } = useAuth();

  const navigate = useNavigate();

  const methods = useForm();
  const {
    getValues, handleSubmit, reset,
  } = methods;

  const handleCancel = useCallback(() => {
    reset();
  }, [reset]);

  const handleRegister = useCallback(
    async ({
      voornaam,achternaam, emailadres, wachtwoord,
    }) => {
      const loggedIn = await register({
        voornaam,achternaam, emailadres, wachtwoord,
      });

      if (loggedIn) {
        navigate({
          pathname: '/',
          replace: true,
        });
      }
    },
    [register, navigate],
  );

  const validationRules = useMemo(() => ({
    voornaam: { required: 'Voornaam is required' },
    achternaam: { required: 'Name is required' },
    emailadres: { required: 'Email is required' },
    wachtwoord: { required: 'Password is required' },
    confirmwachtwoord: {
      required: 'Password confirmation is required',
      validate: (value) => {
        const password = getValues('wachtwoord');
        return password === value || 'Passwords do not match';
      },
    },
  }), [getValues]);

  return (
    <FormProvider {...methods}>
      <div className={`container bg-${theme} text-${oppositeTheme}`}>
        <div className="register-container">
          <h2 className="register-title">Registreren</h2>
          <form
            className="register-form"
            onSubmit={handleSubmit(handleRegister)}
          >
            <Error error={error} />

            <LabelInput
              label='FirstName'
              type='text'
              name='voornaam'
              placeholder='Your First Name'
              validationRules={validationRules.voornaam}
            />

            <LabelInput
              label='Name'
              type='text'
              name='achternaam'
              placeholder='Your Name'
              validationRules={validationRules.achternaam}
            />

            <LabelInput
              label='Email'
              type='text'
              name='emailadres'
              placeholder='your@email.com'
              validationRules={validationRules.emailadres}
            />

            <LabelInput
              label='Password'
              type='password'
              name='wachtwoord'
              validationRules={validationRules.wachtwoord}
            />

            <LabelInput
              label='Confirm password'
              type='password'
              name='confirmwachtwoord'
              validationRules={validationRules.confirmwachtwoord}
            />

            <div className='clearfix'>
              <div className='btn-group float-end'>
                <button
                  type='submit'
                  className='btn btn-primary'
                  disabled={loading}
                >
                  Register
                </button>

                <button
                  type='button'
                  className='btn btn-light'
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
}