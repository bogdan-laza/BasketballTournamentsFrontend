import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';


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
  rules:string;
  tournamentImageUrl:string;
}

function TournamentList() {
  const [tournaments, setTournaments]=useState<Tournament[]>([]);
  const [loading, setLoading]=useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(()=>{
    fetch("http://localhost:5265/api/Tournament")
    .then((response)=>response.json())
    .then((data)=>{
      if(data.items && Array.isArray(data.items)){
           setTournaments(data.items);
      }
      else{
        setError("The API did not return a list!");
      }
    })
    .catch((error)=>{
      console.error("Error while fetching tournaments: ", error);
      setError(error.message)
    })
    .finally(()=>{setLoading(false);});
  }, []);

return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Available Tournaments
        </h1>

        {loading ? (
          <p className="text-gray-500">Currently loading tournaments...</p>
        ) : (
          <div className="grid gap-4">
            {tournaments.map((tournament) => (
              <div 
                key={tournament.tournamentId} 
                className="p-4 border border-gray-200 rounded-md shadow-sm flex items-center gap-6 bg-white"
              >

                <div className="shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=500&auto=format&fit=crop"
                    alt={tournament.tournamentName}
                    className="w-32 h-32 object-cover rounded-md border border-gray-100 shadow-sm"
                  />
                </div>

                <div className="flex flex-col flex-1">
                <h2 className="text-3xl font-semibold text-gray-800">
                  {tournament.tournamentName}
                </h2>

                <h2 className="text-xl font-semibold text-gray-800">
                  {tournament.tournamentLocation}
                </h2>

                <h2 className="text-xl font-semibold text-gray-800">
                  {new Date(tournament.tournamentDate).toLocaleDateString('en-gb')}
                </h2>

                <Link 
                  to={`/tournament/${tournament.tournamentId}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4 transition-colors">
                  See more
                </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}

export default TournamentList;