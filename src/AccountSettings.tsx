import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import api from "./utils/api";
import romaniaData from "./utils/romania.json";

const AccountSettings = () => {
    const { isAuthenticated, token } = useAuth();
    const [activeTab, setActiveTab] = useState("Personal Information");
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<number | null>(null);
    const [counties, setCounties] = useState<string[]>([]);
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [rawUser, setRawUser] = useState<any>(null);

    const [formData, setFormData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        birthDate: "",
        county: "",
        city: "",
        phoneNumber: ""
    });

   useEffect(() => {
        setCounties(Object.keys(romaniaData));
    }, []);

    useEffect(() => {
        if (isAuthenticated && token) {
            try {
                const payloadBase64 = token.split('.')[1];
                const decodedPayload = JSON.parse(atob(payloadBase64));

                const extractedUserId = decodedPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
                                     || decodedPayload.nameid 
                                     || decodedPayload.sub;

                if (extractedUserId) {
                    setUserId(extractedUserId);
                    api.get(`User/${extractedUserId}`)
                        .then((response) => {
                            const user = response.data;
                            setRawUser(user); 
                            
                            let formattedDate = "";
                            if (user.dateOfBirth) {
                                const d = new Date(user.dateOfBirth);
                                formattedDate = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                            }

                            setFormData({
                                username: user.username || "",
                                firstName: user.firstName || "",
                                lastName: user.lastName || "",
                                email: user.email || "",
                                birthDate: formattedDate,
                                county: user.county || "",
                                city: user.city || "",
                                phoneNumber: user.phoneNumber || ""
                            });

                            if (user.county && romaniaData[user.county as keyof typeof romaniaData]) {
                                setAvailableCities(romaniaData[user.county as keyof typeof romaniaData]);
                            }
                        })
                        .catch((error) => console.error("Error fetching user settings:", error))
                        .finally(() => setIsLoading(false));
                }
            } catch (error) {
                console.error("Failed to decode token:", error);
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated, token]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCountyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedCounty = e.target.value;
        setFormData({ ...formData, county: selectedCounty, city: "" }); 

        if (selectedCounty && romaniaData[selectedCounty as keyof typeof romaniaData]) {
            setAvailableCities(romaniaData[selectedCounty as keyof typeof romaniaData]);
        } else {
            setAvailableCities([]);
        }
    };

   const handleSaveChanges = async () => {
        setError(null);
        setSuccess(null);

        if (!formData.firstName.trim()) return setError("First name is required.");
        if (!formData.lastName.trim()) return setError("Last name is required.");
        if (!formData.county.trim()) return setError("County is required.");
        if (!formData.city.trim()) return setError("City is required.");

        setIsSaving(true);

        try {
            let isoDate = null;
            if (formData.birthDate) {
                const [day, month, year] = formData.birthDate.split('/');
                isoDate = `${year}-${month}-${day}`; 
            }

            const payload = {
                ...rawUser, 
                ...formData, 
                dateOfBirth: isoDate, 
                phoneNumber: formData.phoneNumber === "" ? null : formData.phoneNumber,
            };

            await api.put(`User/${userId}`, payload);
            
            setSuccess("Personal information updated successfully!");
            setTimeout(() => setSuccess(null), 3000);

        } catch (err: any) {
            console.error("Full backend error:", err.response?.data || err);
            
            if (err.response?.data?.errors && typeof err.response.data.errors === 'object') {
                const firstErrorKey = Object.keys(err.response.data.errors)[0];
                setError(err.response.data.errors[firstErrorKey][0]);
            } 
            else if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } 
            else if (typeof err.response?.data === 'string') {
                setError(err.response.data);
            } 
            else {
                setError("Failed to update profile. Please try again.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const menuOptions = [
        "Personal Information",
        "Player Settings",
        "Change Password"
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex justify-center items-center">
                <span className="text-white text-xl font-bold animate-pulse">Loading settings...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 p-8 md:p-12">
            
            <h1 className="text-5xl font-extrabold text-white mb-10 tracking-tight text-left">
                My Settings
            </h1>

            <div className="flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-72 flex flex-col gap-2">
                    {menuOptions.map((option) => (
                        <button
                            key={option}
                            onClick={() => setActiveTab(option)}
                            className={`text-left px-6 py-4 rounded-xl font-bold transition-all duration-200 ${
                                activeTab === option
                                    ? "bg-slate-800 text-white shadow-lg border-l-4 border-orange-500" 
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"     
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

               <div className="pl-0 md:pl-15 flex-1 max-w-3xl">
                    {activeTab === "Personal Information" && (
                        <div className="flex flex-col gap-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">Personal Information</h2>
                                <p className="text-slate-400">Update your profile here.</p>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl font-semibold">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-xl font-semibold">
                                    {success}
                                </div>
                            )}


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-400 pl-1">Username</label>
                                    <input type="text" name="username" value={formData.username} disabled className="bg-slate-900/50 border border-slate-800 text-slate-500 text-lg px-4 py-3 rounded-xl cursor-not-allowed" />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-400 pl-1">Email Address</label>
                                    <input type="email" name="email" value={formData.email} disabled className="bg-slate-900/50 border border-slate-800 text-slate-500 text-lg px-4 py-3 rounded-xl cursor-not-allowed" />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-400 pl-1">First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="bg-slate-800 border border-slate-700 text-white text-lg px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow" />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-400 pl-1">Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="bg-slate-800 border border-slate-700 text-white text-lg px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow" />
                                </div>

                               <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-400 pl-1">Birth Date</label>
                                    <input type="text" name="birthDate" value={formData.birthDate} disabled className="bg-slate-900/50 border border-slate-800 text-slate-500 text-lg px-4 py-3 rounded-xl cursor-not-allowed" />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-400 pl-1">Phone Number</label>
                                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="bg-slate-800 border border-slate-700 text-white text-lg px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow" />
                                </div>

                               <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-400 pl-1">County</label>
                                    <div className="relative">
                                        <input 
                                            required 
                                            list="counties-list" 
                                            name="county" 
                                            value={formData.county} 
                                            onChange={handleCountyChange} 
                                            placeholder="Type to search county..." 
                                            className="w-full bg-slate-800 text-white border border-slate-700 text-lg rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow [&::-webkit-calendar-picker-indicator]:opacity-0" 
                                        />
                                        <datalist id="counties-list">
                                            {counties.map(c => <option key={c} value={c} />)}
                                        </datalist>

                                        {formData.county ? (
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, county: "", city: "" }); 
                                                    setAvailableCities([]);
                                                }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                                                title="Clear county"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        ) : (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-400 pl-1">City</label>
                                    <div className="relative">
                                        <input 
                                            required 
                                            list="cities-list" 
                                            name="city" 
                                            value={formData.city} 
                                            onChange={handleInputChange} 
                                            disabled={!formData.county} 
                                            placeholder={formData.county ? "Type to search city..." : "Select a county first"} 
                                            className="w-full bg-slate-800 text-white border border-slate-700 text-lg rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-900/50 [&::-webkit-calendar-picker-indicator]:opacity-0" 
                                        />
                                        <datalist id="cities-list">
                                            {availableCities.map(c => <option key={c} value={c} />)}
                                        </datalist>

                                        {formData.city ? (
                                            <button 
                                                type="button"
                                                onClick={() => setFormData({ ...formData, city: "" })}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                                                title="Clear city"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        ) : (
                                            <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${!formData.county ? 'text-slate-600' : 'text-slate-400'}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-center">
                                <button 
                                    onClick={handleSaveChanges} 
                                    disabled={isSaving}
                                    className={`font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg ${
                                        isSaving 
                                            ? "bg-orange-400 cursor-not-allowed opacity-70" 
                                            : "bg-orange-500 hover:bg-orange-600 hover:shadow-orange-500/20 active:scale-95 text-white"
                                    }`}
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === "Player Settings" && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">Player Settings</h2>
                            <p className="text-slate-400">Form fields for height, handedness, level, etc. will go here.</p>
                        </div>
                    )}

                    {activeTab === "Change Password" && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>
                            <p className="text-slate-400">Current password and new password inputs will go here.</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AccountSettings;