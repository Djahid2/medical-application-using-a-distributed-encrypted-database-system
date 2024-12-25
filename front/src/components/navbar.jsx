import { NavLink , useLocation } from 'react-router-dom';
import logo from '../photos/file.png';
import { useOnClickOutside } from 'usehooks-ts'
import { useRef } from 'react';
export default function Nav() {
    
    const ul = useRef(null)
    const icn = useRef(null)
    function out() {
        icn.current.classList.remove('active')
    }
    useOnClickOutside([ul,icn],out)
    function handIconClick(e) {
        e.target.classList.toggle('active')
    }
    
    return (
            <div className="navbar" >
                <div className="container">
                    <div className="left">
                        <div className="logo">
                            <img src={logo} alt="logo" />
                        <span className='logo-text'>Secur</span>
                        </div>
                    </div>
                    <div className="center-bar">
                        <ul>
                            <NavLink to='/'>
                                <li>Home</li>
                            </NavLink>
                            <NavLink to='/work'>
                                <li>How It Works</li>
                            </NavLink>
                            <NavLink to='/about'>
                                <li>About</li>
                            </NavLink>
                        </ul>
                    </div>
                    <div className="right">
                        <i onClick={handIconClick} ref={icn}  className='fa-solid fa-user'></i>
                        <ul ref={ul}>
                            <NavLink to='/login'>
                                <li>Login</li>
                            </NavLink>
                            <NavLink to='/signup'>
                                <li>Sign Up</li>
                            </NavLink>
                        </ul>
                    </div>
                </div>
            </div>
        )
    
    
}