import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import api from "./utils/api";

export default function Navbar(){
    const {isAuthenticated, logout}=useAuth();
    const navigate=useNavigate();

    const handleLogout=async ()=>{
        try{
            await api.post("Auth/logout");
        }catch(error){
            console.error("Backend logout failed, but clearing local session anyway.", error);
        } finally{
            logout();
            navigate("/login");
        }
    };

    return (
        <nav className="bg-slate-900 border-b border-slate-800 text-white px-8 py-4 flex items-center justify-between">
            <div  className="text-3xl md:text-3xl font-extrabold text-white tracking-tighter drop-shadow-lg">
                    Hoop<span className="text-orange-500">Zone</span>
            </div>

            <div className="hidden md:flex gap-8 font-semibold text-slate-300">
                {isAuthenticated? (
                <>
                    <Link to="/mytournaments" className="hover:text-orange-400 transition-colors">My Tournaments</Link>
                    <Link to="/myteams" className="hover:text-orange-400 transition-colors">My Teams</Link>
                    <Link to="/mystatistics" className="hover:text-orange-400 transition-colors">My Statistics</Link>
                </>
                ):(
                    <>
                        <Link to="/tournaments" className="hover:text-orange-400 transition-colors">See tournaments</Link>
                    </>
                )
                }
            </div>

            <div className="flex items-center gap-4">
                {isAuthenticated?(
                    <>
                        <Link to="myaccount" className="text-slate-300 hover:text-white font-medium px-3 py-2 transition-colors">
                            My Account
                        </Link>

                        <button onClick={handleLogout} className="inline-flex justify-center items-center px-3 py-1 bg-red-500 hover:bg-red-700 transition-colors duration-300 text-white text-lg font-bold rounded-full transform">
                            Log Out
                        </button>
                    </>
                ):
                (
                    <>
                       <Link
                        to="/signup"
                        className="inline-flex justify-center items-center px-3 py-1 bg-orange-500 hover:bg-orange-600 transition-colors duration-300 text-white text-lg font-bold rounded-full transform">
                            Sign up
                    </Link>

                    <Link
                        to="/login"
                        className="inline-flex justify-center items-center px-3 py-1 bg-orange-500 hover:bg-orange-600 transition-colors duration-300 text-white text-lg font-bold rounded-full transform">
                            Log in
                    </Link>
                    </>
                )
                }
            </div>
        </nav>
    );
}