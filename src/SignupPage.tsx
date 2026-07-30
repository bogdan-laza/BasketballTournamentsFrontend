import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "./utils/api";

function SignupPage(){
    const navigate=useNavigate();
    const [step, setStep]=useState(1);

    const [user, setUser]=useState({
        username:"",
        firstName:"",
        lastName:"",
        passwordHash:"",
        email:"",
        phoneNumber:"",
    });

    const [error, setError]=useState<string | null>(null);
    const [loading, setLoading]=useState(false);

     const navigation=useNavigate();
     const location=useLocation();
     const alertMessage=location.state?.alertMessage;

    const handleChange=(e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({...user, [e.target.name]:e.target.value});
    };

    const handleSubmit=async (e: React.SubmitEvent<HTMLFormElement>) =>{
        e.preventDefault();
        setError(null);
        setLoading(true);

        try{
            const finalPayload={
                ...user,
                userId:0,
                refreshToken:"",
                createdAt:new Date().toISOString(),
                personRole:"Player",
                isEmailVerified:false,
                refreshTokenExpiry:new Date().toISOString(),
            };

            const response=await api.post('/User', finalPayload);
            navigate("/login");
       } catch (err: any) {
            console.error("Sign-up error: ", err);

            if (err.response && err.response.data) {
                const errorData = err.response.data;

                if (errorData.detail) {
                    setError(errorData.detail);
                } 
                else if (errorData.errors && typeof errorData.errors === 'object') {
                    const firstErrorKey = Object.keys(errorData.errors)[0];
                    setError(errorData.errors[firstErrorKey][0]);
                } 
                else {
                    setError("Sign-up failed! Please try again.");
                }
            } 
            else {
                setError("Unable to connect to the server.");
            }
        } finally {
            setLoading(false);
        }
    }

    return(
         <div className="min-h-screen bg-slate-900 flex flex-col p-8">
        <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-white tracking-tighter">
                    Hoop<span className="text-orange-500">Zone</span>
                </h1>
                <p className="text-slate-400 mt-2">Create your player profile</p>
            </div>

            {alertMessage &&(
                <div className="bg-orange-500/20 border border-orange-500 text-orange-200 p-3 rounded-lg mb-6 text-sm text-center font-semibold animate-pulse">
                    {alertMessage}
                </div>
            )}

            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={step===2 ? handleSubmit : (e)=>{e.preventDefault();setStep(2);}}>
                {step===1 && (
                    <div className="space-y-4 animate-fadeIn">
                        <div>
                            <label className="block text-slate-300 text-sm font-bold mb-2">
                                First Name
                            </label>

                            <input required type="text" name="firstName" value={user.firstName} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors" placeholder="e.g. Lebron" />
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm font-bold mb-2">
                                Last Name
                            </label>

                            <input required type="text" name="lastName" value={user.lastName} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors" placeholder="e.g. James" />
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm font-bold mb-2">
                                Phone Number
                            </label>

                            <input required type="text" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors" placeholder="e.g. 0712345678" />
                        </div>

                        <button type="submit" className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow-lg transition-all">
                            Continue &rarr;
                        </button>
                    </div>
                )}

                {step===2 && (
                    <div className="space-y-4 animate-fadeIn">
                        <div>
                            <label className="block text-slate-300 text-sm font-bold mb-2">
                                Choose a unique username
                            </label>

                            <input required type="text" name="username" value={user.username} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors" placeholder="e.g. MiddyGod" />
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm font-bold mb-2">
                                Enter your email
                            </label>

                            <input required type="text" name="email" value={user.email} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors" placeholder="e.g. bron31@gmail.com" />
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm font-bold mb-2">
                                Create a password-at least 8 characters(2 digits and one special character)
                            </label>

                            <input required type="password" name="passwordHash" value={user.passwordHash} onChange={handleChange} className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors" placeholder="e.g. abcde12!" />
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-all">
                                &larr; Back
                            </button>

                            <button type="submit" disabled={loading} className="w-2/3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg shadow-lg transition-all">
                                {loading?"Creating...": "Create account"}
                            </button>
                        </div>
                    </div>
                )}
            </form>

            <p className="text-center text-slate-400 mt-8 text-sm">
                Already have an account? <Link to="/login" className="text-orange-500 hover:underline">Log in</Link>
            </p>

        </div>
        </div>
        </div>
    );
}

export default SignupPage;