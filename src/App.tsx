import { Routes, Route } from "react-router-dom";
import TournamentList from "./TournamentList";
import TournamentDetails from "./TournamentDetails";
import TournamentRules from "./TournamentRules";
import WelcomePage from "./WelcomePage";
import SignupPage from "./SignupPage";
import LogInPage from "./LogInPage";
import Navbar from "./Navbar";
import VerifyEmailPage from "./VerifyEmailPage";

function App(){
  return(
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/tournaments" element={<TournamentList />} />
        <Route path="/tournament/:tournamentId" element={<TournamentDetails />} />
        <Route path="/tournament/:tournamentId/rules" element={<TournamentRules />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Routes>
    </>
  );
}

export default App;