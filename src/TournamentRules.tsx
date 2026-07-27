import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
        <div> 
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-8"> {tournament?.tournamentName} Rules </h1>
            <div className="text-xl text-gray-800"> {tournament?.rules}</div>
        </div>
    );
}

export default TournamentRules;