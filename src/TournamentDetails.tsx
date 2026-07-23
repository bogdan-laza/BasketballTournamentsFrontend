import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";


interface Tournament{
  tournamentId:number;
  tournamentName:string;
  tournamentDate:string;
  tournamentLocation:string;
  entryFee:number;
  prize:number;
  tournamentFormat:string;
  createdByUserId:number;
  maxmumNumberOfTeams:number;
  status:string;
  registrationDeadline:string;
  tournamentImageUrl:string;
}

function TournamentDetails(){
    const { tournamentId }=useParams();
    const [tournament, setTournament] = useState<Tournament | null>(null);

    useEffect(() => {
        fetch(`http://localhost:5265/api/Tournament/${tournamentId}`)
        .then((res)=>res.json())
        .then((data) => setTournament(data));
    }, [tournamentId])

    if(!tournament)
        return <div>Loadind details...</div>;

    const getColorByStatus = (status:string) =>{
        switch(status){
            case 'Upcoming':
                return 'bg-green-800 text-white';
            case 'Ongoing':
                return 'bg-green-500 text-white';
            case 'Completed':
                return 'bg-yellow-400 text-black';
            case 'Cancelled':
                return 'bg-red-600 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    }

   return (
  <div className="p-8 bg-gray-50 min-h-screen">
    <Link to="/" className="text-blue-600 hover:underline mb-8 block">
      &larr; Back to dashboard
    </Link>

    <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-md flex gap-12 items-start">
      
      {/* LEFT SIDE: Image */}
      <div className="shrink-0">
        <img
          src="https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=500&auto=format&fit=crop"
          alt={tournament.tournamentName}
          className="w-80 h-80 object-cover rounded-xl shadow-sm"
        />
      </div>

      {/* RIGHT SIDE: Content */}
      <div className="flex flex-col flex-1">
        
        {/* Title and Status */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900">{tournament.tournamentName}</h1>
          <span className={`px-4 py-2 rounded-full text-sm mt-4 font-bold uppercase tracking-wider inline-block ${getColorByStatus(tournament.status)}`}>
            {tournament.status}
          </span>
        </div>

        {/* Details Grid (Splits into 2 columns automatically) */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-lg text-gray-800">
          <p><strong>Location:</strong> {tournament.tournamentLocation}</p>
          <p><strong>Date:</strong> {new Date(tournament.tournamentDate).toLocaleDateString('en-gb')}</p>
          <p><strong>Starting time:</strong> {new Date(tournament.tournamentDate).getHours()}:{new Date(tournament.tournamentDate).getMinutes().toString().padStart(2, '0')}</p>
          <p><strong>Format:</strong> {tournament.tournamentFormat}</p>
          <p><strong>Entry fee:</strong> {tournament.entryFee}</p>
          <p><strong>Winner prize:</strong> {tournament.prize}</p>
          <p><strong>Max teams:</strong> {tournament.maxmumNumberOfTeams}</p>
          <p><strong>Reg. deadline:</strong> {new Date(tournament.registrationDeadline).toLocaleDateString('en-gb')}, {new Date(tournament.registrationDeadline).getHours()}:{new Date(tournament.registrationDeadline).getMinutes().toString().padStart(2, '0')}</p>
          
          {/* Links span across both columns for emphasis */}
          <div className="col-span-2 flex gap-8 mt-4 pt-4 border-t border-gray-100">
            <p><strong>Teams participating:</strong> 
              <Link to={`/tournament/${tournamentId}/teams`} className="text-blue-600 hover:text-blue-800 hover:underline ml-2">See the teams</Link>
            </p>
            <p><strong>Rules:</strong> 
              <Link to={`/tournament/${tournamentId}/rules`} className="text-blue-600 hover:text-blue-800 hover:underline ml-2">See the rules</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
);
}

export default TournamentDetails;