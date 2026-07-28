import { useEffect, useState } from "react";
import { data, Link } from 'react-router-dom';

interface Tournament {
  tournamentId: number;
  tournamentName: string;
  tournamentDate: string;
  tournamentLocation: string;
  entryFee: number;
  prize: number;
  tournamentFormat: string;
  createdByUserId: number;
  maximumNumberOfTeams: number; 
  status: string;
  registrationDeadline: string;
  rules: string;
  tournamentImageUrl: string;
}

function TournamentList() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage]=useState(1);
  const [pageSize]=useState(6);
  const [totalPages, setTotalPages]=useState(1);
  const [totalCount, setTotalCount]=useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5265/api/Tournament?page=${page}&pageSize=${pageSize}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.items && Array.isArray(data.items)) {
          setTournaments(data.items);
          setTotalPages(data.totalPages);
          setTotalCount(data.totalCount);
        } else {
          setError("The API did not return a list!");
        }
      })
      .catch((error) => {
        console.error("Error while fetching tournaments: ", error);
        setError(error.message);
      })
      .finally(() => { setLoading(false); });
  }, [page, pageSize]);

  const handlePreviousPage=()=> {
    setPage((prev)=>Math.max(1, prev-1));
}

  const handleNextPage=()=>{
    setPage((cur)=>cur+1)
  }
  

  return (
    <div className="min-h-screen bg-slate-900 p-8">

        <div className="mb-10 flex justify-between items-center w-full">
            <h1 className="text-3xl md:text-3xl font-extrabold text-white tracking-tighter drop-shadow-lg">
                    Hoop<span className="text-orange-500">Zone</span>
            </h1>

            <div className="flex gap-4">
            <Link
                to="/signup"
                className="inline-flex justify-center items-center px-3 py-1 bg-orange-500 hover:bg-orange-600 transition-colors duration-300 text-white text-lg font-bold rounded-full shadow-xl hover:shadow-orange-300/30 hover:translate-y-0.5 transform">
                    Sign up
            </Link>

            <Link
                to="/login"
                className="inline-flex justify-center items-center px-3 py-1 bg-orange-500 hover:bg-orange-600 transition-colors duration-300 text-white text-lg font-bold rounded-full shadow-xl hover:shadow-orange-300/30 hover:translate-y-0.5 transform">
                    Log in
            </Link>
            </div>

        </div>

      <div className="max-w-6xl mx-auto mt-4">
        
        <h1 className="text-5xl font-extrabold text-white mb-10 tracking-tight">
          {totalCount} Available <span className="text-orange-500">Tournaments</span>
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-blue-500 text-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-xl text-slate-400 font-light animate-pulse">Loading the courts...</p>
        ) : (

            <>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tournaments.map((tournament) => (
              
              <div 
                key={tournament.tournamentId} 
                className="p-5 border border-slate-700 rounded-2xl shadow-lg flex items-center gap-6 bg-slate-800 hover:border-orange-500 transition-colors duration-300 group"
              >
                <div className="shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=500&auto=format&fit=crop"
                    alt={tournament.tournamentName}
                    className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex flex-col flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {tournament.tournamentName}
                  </h2>

                  <h3 className="text-lg text-slate-300 font-medium">
                    {tournament.tournamentLocation}
                  </h3>

                  <h3 className="text-slate-400 mb-5">
                    {new Date(tournament.tournamentDate).toLocaleDateString('en-gb')}
                  </h3>

                  <Link 
                    to={`/tournament/${tournament.tournamentId}`}
                    className="self-start bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-full shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transform transition-all duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>

            ))}
          </div>
          <div className="mt-12 flex items-center justify-center gap-6">
            <button
            onClick={handlePreviousPage}
            disabled={page===1}
            className="px-6 py-2 bg-slate-800 text-white font-semibold rounded-full border border-slate-700 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                &larr; Previous
            </button>

            <span className="text-slate-400 font-medium">
                Page <span className="text-white font-bold">{page}</span> of 
                <span className="text-white font-bold"> {totalPages}</span>
            </span>

            <button
            onClick={handleNextPage}
            disabled={page>=totalPages}
            className="px-6 py-2 bg-slate-800 text-white font-semibold rounded-full border border-slate-700 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                &rarr; Next
            </button>

          </div>

          </>
        )}
      </div>
    </div>
  );
}

export default TournamentList;