import { useContext, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../context/userContent";
import axios from 'axios';


export default function Login() {
    const init = {
        email:'',
        pass:'',
    }
    const userAuth = useContext(User)
    const [isWaiting , setWaiting] = useState(false)
    const [emailerror ,setemailerror] = useState()
    const [passworderror ,setpassworderror ] = useState()
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
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
    function Verfication() {
        // this palace for the user to enter his espace
        setWaiting(true)
        setTimeout(()=>{
            if (!user.email.includes('@')||!allowedDomains.includes(user.email.split('@')[1]) ) {
                setemailerror(`We are sorry, only emails from the following domains are allowed: ${allowedDomains.map(domain => `@${domain}`).join(', ')}`);
            }else if(user.pass === 'admin'){
                setemailerror(null)
                setpassworderror(null)
               
            }else{
                setemailerror(null)
                setpassworderror('Invalide password')
                
            }
            setWaiting(false)
        },2000)
    }
    function  handSubmit(e){
        e.preventDefault()
        Verfication()
        if(!emailerror && !passworderror){
          axios.post('http://localhost:5000/auth/login',{
            email : user.email,
            password : user.pass
          }).then(response =>{
            console.log(response.data);
            const info = {pass:true ,data: {name : response.data.username , email:user.email}}
            userAuth.setAuthor(info)
            navigate('/user/dashboard', {state : {isP:'yes' , name: response.data.username}})
          }).catch((err)=>{
            console.log(err)
          })
           
          
        }

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
                            <input value={user.email} onChange={handlChange} id="email" type="text" placeholder="Email..." />
                            {emailerror? <p className="errore">{emailerror}</p> : null }
                            <label htmlFor="pass">Enter A Password</label>
                            <input value={user.pass} onChange={handlChange} type="password" id="pass" placeholder="password..." />
                            {passworderror? <p  className="errore">{passworderror}</p>:null}
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