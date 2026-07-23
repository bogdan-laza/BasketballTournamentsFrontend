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

    return(
        <div className="p-8">
            <Link to="/" className="text-blue-600 hover:underline mb-4 block">
            &larr; Back to dashboard
            </Link>

            <h1 className="text-4xl font-bold">{tournament.tournamentName}</h1>
        </div>
    );
}

export default TournamentDetails;