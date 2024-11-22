import { NavLink, Route } from "react-router-dom"
import logo from '../photos/file.png'
export default function Bar() {
    return (
        <div className="bar">
            <div className="logo">
                <img src={logo} alt="" />
            </div>
            <ul>
                <li><NavLink to='' data='Dashboard'> <i class="fa-solid fa-table-columns"></i> </NavLink></li>
                <li><NavLink to='profile' data='Profile'> <i class="fa-solid fa-user-doctor"></i> </NavLink></li>
            </ul>
        </div>
    )
}