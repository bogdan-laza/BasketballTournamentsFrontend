import { useState, useEffect } from "react";
import api from "./utils/api";

const calculateAge = (birthString: string | null) => {
    if (!birthString) return "N/A";
    const birth = new Date(birthString);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

const Community = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!debouncedTerm.trim()) {
                setUsers([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await api.get('User', {
                    params: {
                        page: 1,
                        pageSize: 50,
                        searchTerm: debouncedTerm,
                    }
                });

                const fetchedUsers = response.data.items || response.data.data || response.data;
                setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
            } catch (error) {
                console.error("Error fetching users:", error);
                setUsers([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [debouncedTerm]);

    const getInitials = (first: string, last: string) => {
        return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase();
    };

    return (
        <div className="min-h-screen bg-slate-900 p-8 md:p-12 font-sans">
            <div className="max-w-4xl flex flex-col gap-6 pl-50">

                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight text-left">
                    Find Players
                </h1>

                <div className="relative w-200">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        placeholder="Search by username, name or email" 
                        className="w-full bg-slate-800 border border-slate-700 text-white text-lg rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-lg placeholder-slate-500"
                    />

                    {searchTerm && (
                        <button 
                            onClick={() => {
                                setSearchTerm("");
                                setUsers([]);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}

                    {showDropdown && searchTerm && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-50 overflow-hidden">
                            
                            {isLoading ? (
                                <div className="p-6 text-center text-slate-400 font-medium animate-pulse">
                                    Searching for players...
                                </div>
                            ) : users.length > 0 ? (
                                <div className="flex flex-col py-2">
                                    {users.map((user, index) => (
                                        <div 
                                            key={user.userId || index}
                                            className="flex items-center gap-4 px-6 py-4 border border-transparent hover:border-orange-500/50 cursor-pointer transition-all duration-200"
                                        >
                                            <div className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden bg-slate-700 border border-slate-600">
                                                {user.profileImage ? (
                                                    <img src={user.profileImage} alt={user.username} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full w-full bg-slate-700 rounded-full">
                                                        <span className="text-xl text-white font-bold tracking-wide">
                                                            {getInitials(user.firstName, user.lastName)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col flex-1 justify-center">
                                                <span className="text-lg font-bold text-white leading-tight">
                                                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
                                                </span>
                                                <span className="text-sm font-medium text-slate-400 mt-0.5">
                                                    {calculateAge(user.dateOfBirth)} — {user.city || "N/A"} — Level: <span className="font-bold">{user.playerLevel || 1}</span>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-slate-400 font-medium">
                                    No players found for "{searchTerm}"
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Community;