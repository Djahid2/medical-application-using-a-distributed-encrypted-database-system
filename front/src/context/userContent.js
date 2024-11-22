import { createContext, useState } from "react";

export  const User = createContext(null)

export default function UserProvider({children}) {
    const [author , setAuthor] = useState({})
    return (<User.Provider value={{author , setAuthor}}>{children}</User.Provider>)
}
