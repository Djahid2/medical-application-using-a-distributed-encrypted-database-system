import Bar from "../components/bartask"
import { Outlet } from "react-router-dom"
export default function Dash() {
    return (
        <div className="dash">
            <Bar />
            <Outlet />
        </div>
    )
}