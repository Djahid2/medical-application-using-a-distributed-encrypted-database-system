import {useReducer , useState } from "react"
import { NavLink } from "react-router-dom"
import v from '../photos/lading.mp4'
export default function Signup() {
    const [haserror , setHaserror] = useState(false)
    const [merror , setMerror] = useState('')
    const [isWaiting , setWaiting] = useState(false)
    const init = {
        name:'',
        email:'',
        pass:'',
        passr:'',
        passdelete:'',
        passdeleter:'',
        passadd:'',
        passaddr:'',
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
    }
    
    function handSubmit(e) {
        e.preventDefault()
        // console.log(newUser)
        setWaiting(true)
        setTimeout(()=>{
            setHaserror(false)
                    if (newUser.name === '') { 
                            setHaserror(true)
                            setMerror('we are sory , you have to write your name')
                    } else if (newUser.pass.toString().length < 6) {
                            setHaserror(true)
                            setMerror('The two password shoud be more than 6 caracters')
                    } else if (newUser.pass !== newUser.passr) { 
                            setHaserror(true)
                            setMerror('The two password are not the same')
                    } else {
                        // this palace is for the request api
                        console.log(newUser)
                    }
                    
                    if (haserror) {
                        console.log('error')
                    } 
                    setWaiting(false)
        },2000)
        
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
                    <div className="f">
                        <p className="top">Get Stared Now </p>
                        <p className="text">Enter your information and be a member of our Company</p>
                        <form onSubmit={handSubmit}>
                            <label htmlFor="name">Your Name</label>
                            <input value={newUser.name} onChange={handlChange}  id="name" type="text" placeholder="Name..." />
                            <label htmlFor="email">Your Email</label>
                            <input value={newUser.email} onChange={handlChange} id="email" type="email" placeholder="Email..." />
                            <label htmlFor="pass">Enter A Password</label>
                            <input value={newUser.pass} onChange={handlChange} type="password" id="pass" placeholder="password..." />
                            <label htmlFor="passr">confirm password</label>
                            <input value={newUser.passr} onChange={handlChange} id='passr' type="password" placeholder="confirm password..." />
                            {/* ################ 1dec */}
                            <label htmlFor="passr">deletion password</label>
                            <input value={newUser.passdelete} onChange={handlChange} id='passdelete' type="password" placeholder="deletion password..." />
                            <label htmlFor="passr">confirm deletion password</label>
                            <input value={newUser.passdeleter} onChange={handlChange} id='passdeleter' type="password" placeholder="confirm deletion password..." />
                            <label htmlFor="passr">addition password</label>
                            <input value={newUser.passadd} onChange={handlChange} id='passadd' type="password" placeholder="deletion password..." />
                            <label htmlFor="passr">confirm addtion password</label>
                            <input value={newUser.passaddr} onChange={handlChange} id='passaddr' type="password" placeholder="confirm addition password..." />
                            {/* ################ */}
                            <button style={{minHeight:'46px'}} type="submit">{isWaiting ? <span className="loader"></span> : 'Login'} </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}