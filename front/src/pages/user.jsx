import { useEffect, useContext } from "react"
import { User } from "../context/userContent"
import { Outlet, useNavigate } from "react-router-dom"
export default function Userpage() {
    const data = useContext(User)
    const navigate = useNavigate()
    console.log(data.author)
    useEffect(()=> {
       /* if (!data.author.pass) {
            navigate('/')
        } else {

        }*/
    },[])
    return (
        <div className="userpage">
            <Outlet/>
        </div>
    )
}