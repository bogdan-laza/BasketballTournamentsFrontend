import { useEffect, useState } from "react";
import { data, Link } from 'react-router-dom';
import api from "./utils/api";

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
  const [searchName, setSearchName]=useState("");
  const [searchLocation, setSearchLocation]=useState("")
  const [submittedSearchLocation, setSubmittedSearchLocation]=useState("");
  const [submittedSearchName, setSubmittedSearchName]=useState("");

 useEffect(() => {
    setLoading(true);

    api.get(`/Tournament?page=${page}&pageSize=${pageSize}&tournamentName=${submittedSearchName}&tournamentLocation=${submittedSearchLocation}`)
      .then((response) => {
        const data = response.data; 

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
        
        const errorMessage = error.response?.data?.detail || error.message;
        setError(errorMessage);
      })
      .finally(() => { 
        setLoading(false); 
      });
  }, [page, pageSize, submittedSearchName, submittedSearchLocation]);

  const handlePreviousPage=()=> {
    setPage((prev)=>Math.max(1, prev-1));
}

  const handleNextPage=()=>{
    setPage((cur)=>cur+1)
  }
  

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto mt-4">

        <div className="mb-5 mt-5 w-full max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-55">
                    <input 
                    type="text"
                    placeholder="Tournament name"
                    value={searchName}
                    onChange={(e)=>setSearchName(e.target.value)}
                    className="w-full px-5 py-4 pr-12 bg-slate-800 text-white text-lg font-semibold rounded-md border border-slate-600 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-400 shadow-sm"
                    /> 

                    {searchName && (
                        <button 
                        onClick={()=>{
                            setSearchName("");
                            setSubmittedSearchName("");
                            setPage(1);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                        title="Clear search"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                    <div className="relative flex-1 min-w-55">
                        <input 
                        type="text"
                        placeholder="Tournament location"
                        value={searchLocation}
                        onChange={(e)=>setSearchLocation(e.target.value)}
                        className="w-full px-5 py-4 pr-12 bg-slate-800 text-white text-lg font-semibold rounded-md border border-slate-600 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-400 shadow-sm"
                        /> 

                        {searchLocation && (
                            <button 
                            onClick={()=>{
                                setSearchLocation("");
                                setSubmittedSearchLocation("");
                                setPage(1);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                            title="Clear search"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                <button
                onClick={()=>{
                    setSubmittedSearchName(searchName);
                    setSubmittedSearchLocation(searchLocation);
                    setPage(1);
                }}
                className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-md transition-colors duration-300 shadow-sm"
                >
                    Search
                </button>
            </div>
        </div>
        
        <h1 className="text-5xl font-extrabold text-white mb-10 tracking-tight">
          {totalCount} Available <span className="text-orange-500">{totalCount>1 ? "Tournaments" : "Tournament"}</span>
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
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
                    className="self-start bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-full hover:-translate-y-0.5 transform transition-all duration-300"
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