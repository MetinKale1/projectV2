import { useFormContext } from 'react-hook-form';

export default function LabelInput({ label, name, type, placeholder, validationRules, ...rest }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div>
      <label className="block text-white/80 text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className={`input-field ${error ? 'border-red-500' : ''}`}
        {...register(name, validationRules)}
        {...rest}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
