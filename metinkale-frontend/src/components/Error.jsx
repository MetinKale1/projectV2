export default function Error({ error }) {
  if (!error) return null;
  return (
    <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-4">
      {typeof error === 'string' ? error : error.message || 'Er is een fout opgetreden'}
    </div>
  );
}
