import {useReducer , useState } from "react"
import { NavLink } from "react-router-dom"
import v from '../photos/lading.mp4'
import axios from 'axios';

export default function Signup() {
    const [haserror , setHaserror] = useState(false)
    const [merror , setMerror] = useState('')
    const [isWaiting , setWaiting] = useState(false)
    const [passerror , setpasserror ] = useState()
    const [etatpass , setetatpass] = useState(false)
    const [Code , setCode] = useState()
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    const [step, setStep] = useState(1);
    const init = {
        name:'',
        email:'',
        pass:'',
        passr:'',
        passmanager:'',
        passmanagerr:'',
        passEditor:'',
        passEditorr:'',
    }
    function reducer(newUser , action) {
        if (action.type === 'newUser') {
            return {...newUser , [action.fild]:action.payload}
        }
    } 
    const [newUser , dispatsh] = useReducer(reducer , init)
    function handlChange(e) {
        dispatsh({
            type:'newUser',
            fild: e.target.id,
            payload: e.target.value
        })
        if (e.target.id === "pass") {
            checkPasswordStrength(e.target.value); // Vérification uniquement pour le mot de passe
        }
    }

    const checkPasswordStrength = (password) => {
        if (password === "") {
            setpasserror(null);
            return;
        }

        const lowercase = /[a-z]/;
        const uppercase = /[A-Z]/;
        const digit = /[0-9]/;
        const specialChar = /[—’!"#$%&`()*+,\-./:;<=>?@\[\\\]^_'{|}~]/;

        let score = 0;
        let missingCriteria = [];

        if (lowercase.test(password)) score++;
        else missingCriteria.push("lowercase letters");

        if (uppercase.test(password)) score++;
        else missingCriteria.push("uppercase letters");

        if (digit.test(password)) score++;
        else missingCriteria.push("numbers");

        if (specialChar.test(password)) score++;
        else missingCriteria.push("special characters");

        if (password.length < 6) missingCriteria.push(" Password must contain at least 6 characters ");
            
        if (score === 4) {
            setpasserror(`Your password is Very Strong. ${missingCriteria.join(", ")}`);
            setetatpass(false);
        } else if (score === 3) {
            setpasserror(`Your password is Strong. Try adding: ${missingCriteria.join(", ")}`);
            setetatpass(false)
        } else if (score === 2) {
            setpasserror(`Your password is Weak. Consider adding: ${missingCriteria.join(", ")}`);
            setetatpass(true)
        } else {
            setpasserror(`Your password is Very Weak<. Try including: ${missingCriteria.join(", ")}`);
            setetatpass(true)
        }
    };
    function Verfication() {
      
        // console.log(newUser)
        setWaiting(true)
        setTimeout(()=>{
            setHaserror(false)
                    if (newUser.name === '') { 
                            setHaserror(true)
                            setMerror('we are sory , you have to write your name')
                    }else if(!newUser.email.includes('@')||!allowedDomains.includes(newUser.email.split('@')[1])){
                        setHaserror(true)
                        setMerror(`We are sorry, only emails from the following domains are allowed: ${allowedDomains.map(domain => `@${domain}`).join(', ')}`);
                    } else if (newUser.pass.toString().length < 6) {
                            setHaserror(true)
                            setMerror('The two password shoud be more than 6 caracters')
                    } else if (newUser.pass !== newUser.passr) { 
                            setHaserror(true)
                            setMerror('The two password are not the same')
                    } else if(newUser.passEditor !== newUser.passEditorr)  {
                        setHaserror(true)
                        setMerror('The two password Editor  are not the same')
                     // this palace is for the request api
                        console.log(newUser)
                    }else if(newUser.passmanager!== newUser.passmanagerr) {
                        setHaserror(true)
                        setMerror('The two password manager  are not the same')
                    }
                    
                    if (haserror) {
                        console.log('error')
                    } 
                    setWaiting(false)
        },2000)
        
    }
function handSubmit(e){
    e.preventDefault()
    Verfication();
    console.log(haserror)
    if(!haserror && !etatpass){
        axios.post('http://localhost:5000/auth/register',{
            username:newUser.name,
            email:newUser.email,
            password:newUser.pass,
            passEditor:newUser.passEditor,
            passManager:newUser.passmanager
        }).then(response => {
            setStep(2)
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
            
        })
    }
    console.log(step)
}
function handSubmit2(e){
    setWaiting(true)
    e.preventDefault()
        axios.post('http://localhost:5000/auth/verify-code',{
           Code : Code,
           email:newUser.email,
        }).then(response => {
            setWaiting(false)
            console.log("Response:", response.data);
        }).catch((error) => {

            console.log(error)
            if( error.response.data.error){
                setHaserror(true)
                setMerror( error.response.data.error)
            }
            setWaiting(false)
        })
    
}
    
    
    return (
        <div className="signup">
            <div className="container">
                <div className="box">
                    <div className="v">
                        <NavLink to='/login'>
                            I have an Account
                        </NavLink>
                        <video autoPlay muted loop src={v}></video>
                        <div className="error">
                            {haserror ? <p>{merror}</p> : null}
                        </div>
                    </div>
                    {step === 1 ?(
                    <div className="f">
                        <p className="top">Get Stared Now </p>
                        <p className="text">Enter your information and be a member of our Company</p>
                        <form onSubmit={handSubmit}>
                            <label htmlFor="name">Your Name</label>
                            <input value={newUser.name} onChange={handlChange}  id="name" type="text" placeholder="Name..." />
                            <label htmlFor="email">Your Email</label>
                            <input value={newUser.email} onChange={handlChange} id="email" type="text" placeholder="Email..." />
                            <label htmlFor="pass">Enter A Password</label>
                            <input value={newUser.pass} onChange={handlChange} type="password" id="pass" placeholder="password..." />
                            {passerror ? <p className="passerror"  style={{color: etatpass? "red":"green" }}>{passerror}</p> : null}
                            <label htmlFor="passr">confirm password</label>
                            <input value={newUser.passr} onChange={handlChange} id='passr' type="password" placeholder="confirm password..." />
                            {/* ################ 1dec */}
                            <label htmlFor="passr">Manager  Password</label>
                            <input value={newUser.passmanager} onChange={handlChange} id='passmanager' type="password" placeholder=" Manager Password..." />
                            <label htmlFor="passr">confirm Manager  Password</label>
                            <input value={newUser.passmanagerr} onChange={handlChange} id='passmanagerr' type="password" placeholder="confirm Manager  Password..." />
                            <label htmlFor="passr">Editor Password </label>
                            <input value={newUser.passEditor} onChange={handlChange} id='passEditor' type="password" placeholder="Editor Password..." />
                            <label htmlFor="passr">confirm Editor Password</label>
                            <input value={newUser.passEditorr} onChange={handlChange} id='passEditorr' type="password" placeholder="confirm Editor Password..." />
                            {/* ################ */}
                            <button style={{minHeight:'46px'}} type="submit">{isWaiting ? <span className="loader"></span> : 'Login'} </button>
                        </form>
                        
                    </div>
                    ):(
                        <div className="f">
                            <p className="top">Check your email </p>
                        <p className="text">Enter your Code </p>
                        <form onSubmit={handSubmit2}>
                            <label htmlFor="Code">confirm password</label>
                            <input value={Code} onChange={(e) => setCode(e.target.value) } id='Code' type="text"   />
                            <button style={{minHeight:'46px'}} type="submit">{isWaiting ? <span className="loader"></span> : 'Confirm Code'} </button>
                        </form>
                        </div>                    )}
                </div>
            </div>
        </div>
    )
}