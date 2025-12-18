import { useNavigate } from 'react-router-dom';

export default function Fiets({ fietsID, model, type, status, foto }) {
  const navigate = useNavigate();

  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    beschikbaar: 'bg-green-500/20 text-green-400 border-green-500/30',
    verhuurd: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    inactive: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div 
      className="card cursor-pointer group" 
      onClick={() => navigate(`/fietsen/${fietsID}`)}
      data-cy="fiets_card"
    >
      <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-white/5">
        <img
          src={foto || '/images/default-bike.jpg'}
          alt={model}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-lg text-white">{model}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[status?.toLowerCase()] || statusColors.active}`}>
            {status}
          </span>
        </div>
        
        <p className="text-white/60 text-sm">{type}</p>
        
        <button className="btn-primary w-full text-sm mt-4 py-2">
          Bekijk Details
        </button>
      </div>
    </div>
  );
}
