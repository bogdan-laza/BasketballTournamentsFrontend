import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface Tournament{
  tournamentId:number;
  tournamentName:string;
  tournamentDate:string;
  tournamentLocation:string;
  entryFee:number;
  prize:number;
  tournamentFormat:string;
  createdByUserId:number;
  maximumNumberOfTeams:number;
  status:string;
  registrationDeadline:string;
  rules:string;
  tournamentImageUrl:string;
}

function TournamentRules(){
    const {tournamentId}=useParams();
    const [tournament, setTournament]=useState<Tournament | null>(null);

    useEffect(()=>{
        fetch(`http://localhost:5265/api/Tournament/${tournamentId}`)
        .then((res)=>res.json())
        .then((data)=>setTournament(data));
    }, [tournamentId])

    return (
        <div className="p-8 bg-slate-900 min-h-screen"> 
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
            <h1 className="text-4xl font-bold text-white text-center mb-8"> {tournament?.tournamentName} Rules </h1>
            <div className="text-xl text-white"> {tournament?.rules}</div>
        </div>
    );
}

export default TournamentRules;