import { useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import LabelInput from '../components/LabelInput';
import { useAuth } from '../contexts/auth';
import Error from '../components/Error';

export default function Login() {
  const { search } = useLocation();
  const { error, loading, login } = useAuth();
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: { email: '', password: '' },
  });
  const { handleSubmit, reset } = methods;

  const handleLogin = useCallback(async ({ email, password }) => {
    const loggedIn = await login(email, password);
    if (loggedIn) {
      const params = new URLSearchParams(search);
      navigate({ pathname: params.get('redirect') || '/', replace: true });
    }
  }, [login, navigate, search]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">Welkom Terug</h1>
          <p className="text-white/60">Log in op je account</p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
            <Error error={error} />

            <LabelInput
              label="E-mailadres"
              type="email"
              name="email"
              placeholder="jouw@email.com"
              validationRules={{ required: 'E-mail is verplicht' }}
              data-cy="email_input"
            />

            <LabelInput
              label="Wachtwoord"
              type="password"
              name="password"
              placeholder="••••••••"
              validationRules={{ required: 'Wachtwoord is verplicht' }}
              data-cy="password_input"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
              data-cy="submit_btn"
            >
              {loading ? 'Bezig...' : 'Inloggen'}
            </button>

            <div className="text-center">
              <button type="button" onClick={() => reset()} className="text-white/40 hover:text-white text-sm">
                Formulier wissen
              </button>
            </div>
          </form>
        </FormProvider>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-white/60">
            Nog geen account?{' '}
            <Link to="/register" className="text-[#FF6B35] hover:underline font-medium">
              Registreer hier
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
