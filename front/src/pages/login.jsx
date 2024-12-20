import { useContext, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../context/userContent";
import axios from 'axios';
import Captcha from "./captcha";

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
    const [isCaptchaValid, setCaptchaValid] = useState(false);
    
    const [step,setStep]= useState(1)
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
            if (!user.email.includes('@')||!allowedDomains.includes(user.email.split('@')[1]) ) {
                setemailerror(`We are sorry, only emails from the following domains are allowed: ${allowedDomains.map(domain => `@${domain}`).join(', ')}`);
                return true
            }
            setemailerror('')
        return false
    }

    function handSubmit0 (e){
        e.preventDefault()
       
        if(!Verfication()){
            setStep(2)
        }
    }
    function  handSubmit(e){
        e.preventDefault()
        
        if(isCaptchaValid){
          axios.post('http://localhost:5000/auth/login',{
            email : user.email,
            password : user.pass
          }).then(response =>{
            console.log(response.data);
            const info = {pass:true ,data: {info : response.data.info}}
            userAuth.setAuthor(info)
            navigate('/user/dashboard', {state : {isP:'yes' , info :response.data.info} })
          }).catch((err) => {
            setStep(1)
            console.log(err)
            if (err.response) {
                // Vérifie si l'erreur provient de la réponse HTTP du serveur
                console.error('Erreur HTTP:', err.response.status, err.response.data);
                // Vous pouvez aussi afficher l'erreur directement dans l'UI si nécessaire
                setpassworderror(err.response.data.error); // Par exemple, utilisez `err.response.data.error` si c'est ce qui est renvoyé par le serveur
              } else if (err.request) {
                // Si aucune réponse n'est reçue du serveur
                console.error('Erreur de requête:', err.request);
              } else {
                // Pour toutes autres erreurs (comme des erreurs de configuration ou autres)
                console.error('Erreur:', err.message);
              }
          });
           
          
        }

    }
    return (
        <div className="login">
            <div className="container">
                <div className="box">
                    <div className="left">
                        <p className="top">WelCome Back !</p>
                        <p className="text">You can enter your account from here , just enter your information</p>
                     {step == 1 ? 
                        <form onSubmit={handSubmit0}>
                            <label htmlFor="email">Your Email</label>
                            <input value={user.email} onChange={handlChange} id="email" type="text" placeholder="Email..." />
                            {emailerror? <p className="errore">{emailerror}</p> : null }
                            <label htmlFor="pass">Enter A Password</label>
                            <input value={user.pass} onChange={handlChange} type="password" id="pass" placeholder="password..." />
                            {passworderror? <p  className="errore">{passworderror}</p>:null}
                            
                            <button style={{minHeight:'46px'}} type="submit"> {isWaiting ? <span className="loader"></span> : 'Login'} </button>
                        </form>

                      : <form onSubmit={handSubmit}>
                        <Captcha onVerify={setCaptchaValid}  />
                        </form>
                        }
                    </div>
                    <div className="right">
                        <p>thanks for choosing us</p>
                    </div>
                </div>
            </div>
        </div>
    )
}