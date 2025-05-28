import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";


type AuthContextType = {
    isLogin : boolean;
    setIsLogin : (isLogin :boolean) => void
}

const AuthContext = createContext<AuthContextType>({
    isLogin: false,
    setIsLogin: () => {}          
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children } : { children : React.ReactNode }) => {
    const [isLogin, setIsLoginState] = useState<boolean>(false)

    useEffect(() => {
        const loadLoginState = async () => {
            const saved = await AsyncStorage.getItem('isLogin')
            setIsLoginState(saved === 'true')
        }
        loadLoginState()
    },[])

    const setIsLogin = async (value : boolean) =>{
        setIsLoginState(value);
        await AsyncStorage.setItem('isLogin',value ? 'true' : 'false')
    }

    return (
        <AuthContext.Provider value={{ isLogin, setIsLogin }}>
            {children}
        </AuthContext.Provider>
    )
}   