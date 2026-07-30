import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType{
    isAuthenticated: boolean;
    login: (token: string, refreshToken: string)=>void;
    logout: ()=>void;
}

const authContext=createContext<AuthContextType | undefined>(undefined);

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
        <authContext.Provider value={{isAuthenticated, login, logout}}>
            {children}
        </authContext.Provider>
    );
};

export const useAuth=()=>{
    const context=useContext(authContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
