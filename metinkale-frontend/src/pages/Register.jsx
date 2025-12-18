import { useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import LabelInput from '../components/LabelInput';
import { useAuth } from '../contexts/auth';
import Error from '../components/Error';

export default function Register() {
  const { error, loading, register } = useAuth();
  const navigate = useNavigate();
  const methods = useForm();
  const { getValues, handleSubmit, reset } = methods;

  const handleRegister = useCallback(async ({ voornaam, achternaam, emailadres, wachtwoord }) => {
    const success = await register({ voornaam, achternaam, emailadres, wachtwoord });
    if (success) navigate({ pathname: '/', replace: true });
  }, [register, navigate]);

  const validationRules = useMemo(() => ({
    voornaam: { required: 'Voornaam is verplicht' },
    achternaam: { required: 'Achternaam is verplicht' },
    emailadres: { required: 'E-mail is verplicht' },
    wachtwoord: { required: 'Wachtwoord is verplicht', minLength: { value: 8, message: 'Min. 8 tekens' } },
    confirmwachtwoord: {
      required: 'Bevestig je wachtwoord',
      validate: (v) => v === getValues('wachtwoord') || 'Wachtwoorden komen niet overeen',
    },
  }), [getValues]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">Account Aanmaken</h1>
          <p className="text-white/60">Start vandaag met fietsen</p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            <Error error={error} />

            <div className="grid grid-cols-2 gap-4">
              <LabelInput label="Voornaam" type="text" name="voornaam" placeholder="Jan" validationRules={validationRules.voornaam} />
              <LabelInput label="Achternaam" type="text" name="achternaam" placeholder="Jansen" validationRules={validationRules.achternaam} />
            </div>

            <LabelInput label="E-mailadres" type="email" name="emailadres" placeholder="jan@email.com" validationRules={validationRules.emailadres} />
            <LabelInput label="Wachtwoord" type="password" name="wachtwoord" placeholder="Min. 8 tekens" validationRules={validationRules.wachtwoord} />
            <LabelInput label="Bevestig Wachtwoord" type="password" name="confirmwachtwoord" placeholder="Herhaal wachtwoord" validationRules={validationRules.confirmwachtwoord} />

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Bezig...' : 'Registreren'}
            </button>

            <button type="button" onClick={() => reset()} className="w-full text-white/40 hover:text-white text-sm py-2">
              Formulier wissen
            </button>
          </form>
        </FormProvider>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-white/60">
            Al een account?{' '}
            <Link to="/login" className="text-[#FF6B35] hover:underline font-medium">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
