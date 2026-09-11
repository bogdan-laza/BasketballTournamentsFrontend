import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import api from "./utils/api";

interface User {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    personRole: string;
    createdAt: string;
    profileImageUrl?: string;
}

interface ReviewStats {
    numberOfReviews: number;
    avgSportsmanship: number;
    avgReliability: number;
    avgLevel: number;
}

const SegmentedStatBar = ({ label, value }: { label: string; value: number }) => {
    return (
        <div className="flex flex-col bg-slate-800/80 p-4 rounded-xl border border-slate-700 w-full sm:w-65 shadow-md">
            <div className="flex justify-between items-end mb-2 px-1">
                <span className="uppercase font-extrabold italic text-slate-200 tracking-wider text-sm">
                    {label}
                </span>
                <span className="text-orange-500 font-black text-sm">
                    {value.toFixed(1)}
                </span>
            </div>
            <div className="flex gap-1.5 h-5 px-1">
                {[0, 1, 2, 3, 4].map((index) => {
                    const fillPercentage = Math.min(Math.max(value - index, 0), 1) * 100;
                    
                    return (
                        <div 
                            key={index} 
                            className="relative flex-1 bg-slate-900 skew-x-[-15deg] overflow-hidden rounded-sm"
                        >
                            <div 
                                className="absolute inset-y-0 left-0 bg-orange-500 transition-all duration-500" 
                                style={{ width: `${fillPercentage}%` }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

function MyProfile(){
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [loading, setLoading] = useState(true);
    const { token, isAuthenticated } = useAuth();
    
    useEffect(() => {
        if (isAuthenticated && token) {
            try {
                const payloadBase64 = token.split('.')[1];
                const decodedPayload = JSON.parse(atob(payloadBase64));
                const userId = decodedPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
                            || decodedPayload.nameid 
                            || decodedPayload.sub;

                if (userId) {
                    Promise.all([
                        api.get(`User/${userId}`),
                        api.get(`Review/stats/${userId}`)
                    ])
                    .then(([userResponse, statsResponse]) => {
                        setUser(userResponse.data);
                        setStats(statsResponse.data);
                    })
                    .catch((error) => console.error("Error fetching profile data:", error))
                    .finally(() => setLoading(false));
                }
            } catch (error) {
                console.error("Failed to decode token:", error);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, token]);

    const getInitials = (first: string, last: string) => {
        return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <p className="text-xl text-slate-400 animate-pulse">Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <p className="text-xl text-red-400">Failed to load user data.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-4xl mx-auto mt-10">
                <div className="flex flex-col items-center justify-center mb-12">
                    <div className="relative h-40 w-40 rounded-full cursor-pointer group shadow-xl ring-4 ring-slate-800 hover:ring-orange-500 transition-all duration-300">
                        {user.profileImageUrl ? (
                            <img 
                                src={user.profileImageUrl} 
                                alt="Profile" 
                                className="h-full w-full object-cover rounded-full"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full w-full bg-slate-700 rounded-full">
                                <span className="text-5xl text-white font-bold tracking-wide">
                                    {getInitials(user.firstName, user.lastName)}
                                </span>
                            </div>
                        )}

                        <div className="absolute inset-0 bg-white/80 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-900 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm font-bold text-slate-900">
                                Change photo
                            </span>
                        </div>
                    </div>

                   

                    <h1 className="text-3xl font-extrabold text-white mt-4 tracking-tight">
                        {user.firstName} {user.lastName}
                    </h1>
                   
                     {stats && (
                    <div className="flex flex-col items-center">
                        <p className="text-slate-500 text-sm mb-4 mt-1 font-semibold">
                            Based on {stats.numberOfReviews} {stats.numberOfReviews === 1 ? 'review' : 'reviews'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center w-full">
                            <SegmentedStatBar label="Sportsmanship" value={stats.avgSportsmanship} />
                            <SegmentedStatBar label="Reliability" value={stats.avgReliability} />
                        </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}

export default MyProfile;