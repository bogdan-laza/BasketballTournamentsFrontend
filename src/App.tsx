import { Routes, Route } from "react-router-dom";
import TournamentList from "./TournamentList";
import TournamentDetails from "./TournamentDetails";

function App(){
  return(
    <Routes>
      <Route path="/" element={<TournamentList />} />
      <Route path="/tournament/:id" element={<TournamentDetails />} />
    </Routes>
  );
}

export default App;