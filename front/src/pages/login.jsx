import { useContext, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../context/userContent";
export default function Login() {
    const init = {
        email:'',
        pass:'',
    }
    const userAuth = useContext(User)
    const [isWaiting , setWaiting] = useState(false)
    const navigate = useNavigate()
    function reducer(user , action) {
        if (action.type === 'user') {
            return {...user , [action.fild]:action.payload}
        }
    } 
    const [user , dispatsh] = useReducer(reducer , init)
    function handlChange(e) {
        dispatsh({
            type:'user',
            fild: e.target.id,
            payload: e.target.value
        })
        
    }
    function handSubmit(e) {
        e.preventDefault()
        // this palace for the user to enter his espace
        setWaiting(true)
        setTimeout(()=>{
            if (user.email === 'admin@f.f' && user.pass === 'admin') {
                const info = {pass:true ,data: {name : 'admin' , email:'admin@f.f'}}
                userAuth.setAuthor(info)
                navigate('/user/dashboard', {state : {isP:'yes' , name:'admin'}})
            }
            setWaiting(false)
        },2000)
    }
    return (
        <div className="login">
            <div className="container">
                <div className="box">
                    <div className="left">
                        <p className="top">WelCome Back !</p>
                        <p className="text">You can enter your account from here , just enter your information</p>
                        
                        <form onSubmit={handSubmit}>
                            <label htmlFor="email">Your Email</label>
                            <input value={user.email} onChange={handlChange} id="email" type="email" placeholder="Email..." />
                            <label htmlFor="pass">Enter A Password</label>
                            <input value={user.pass} onChange={handlChange} type="password" id="pass" placeholder="password..." />
                            <button style={{minHeight:'46px'}} type="submit"> {isWaiting ? <span className="loader"></span> : 'Login'} </button>
                        </form>
                        
                    </div>
                    <div className="right">
                        <p>thanks for choosing us</p>
                    </div>
                </div>
            </div>
        </div>
    )
}