import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType{
    isAuthenticated: boolean;
    login: (token: string, refreshToken: string)=>void;
    logout: ()=>void;
}

const AuthContext=createContext<AuthContextType | undefined>(undefined);

export const AuthProvider=({ children }: { children:React.ReactNode})=>{
    const [isAuthenticated, setIsAuthenticated]=useState(false);

    useEffect(()=>{
        const token=localStorage.getItem("token");
        if(token){
            setIsAuthenticated(true);
        }
    }, []);

    const login=(token:string, refreshToken:string)=>{
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        setIsAuthenticated(true);
    }

    const logout=()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
    }

    return(
        <AuthContext.Provider value={{isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth=()=>{
    const context=useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
