import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";


const UserContext=createContext();

const UserContextProvider=({children})=>{

    const [loading,setLoading]=useState(true);
    const [user,setUser]=useState(null);

    useEffect(()=>{
        const getUser=async()=>{
            const url=`${import.meta.env.VITE_BACKEND_URL}/api/user/getUser`;
            const {data}=await axios.get(url,{withCredentials:true});
            if(data.success){
                setUser(data.user);
            }
            setLoading(false);
            console.log(data);
        };

        getUser();
    },[])

    return (
        <UserContext.Provider value={{user,setUser,loading}}>
            {children}
        </UserContext.Provider>
    )
}

const useUserContext=()=>(useContext(UserContext));


export {UserContext,UserContextProvider,useUserContext};

