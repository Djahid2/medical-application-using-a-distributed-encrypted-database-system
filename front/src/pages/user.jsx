import { useEffect, useContext } from "react";
import { User } from "../context/userContent";
import { Outlet, useNavigate } from "react-router-dom";
export default function Userpage() {
    const data = useContext(User);
    const navigate = useNavigate();
    useEffect(() => {
         const savedInfo = JSON.parse(localStorage.getItem("userAuth"));
         console.log("User : ", savedInfo);
         if (!savedInfo.pass) {
             // main
             navigate("/");
         } else {
        }
    }, []);
    return (
        <div className="userpage">
            <Outlet />
        </div>
    );
}
