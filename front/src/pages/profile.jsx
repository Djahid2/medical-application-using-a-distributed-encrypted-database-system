import photo from '../photos/avatr-3.jpg'
import { User } from '../context/userContent'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'



export default function Profile() {
    const user = useContext(User)
    const navigate = useNavigate()
    function handClickOut() { 
        console.log(user)
        const info = {pass:false ,data: {name : '' , email:''}}
        user.setAuthor(info)
        navigate('/')
    }
    return (
        <div className="profile">
            <div className="card">
                <button className='logout' onClick={handClickOut} >Logout</button>
                <div className="image">
                    <img src={photo} alt="photo" />
                </div>
                <div className="right">
          
                        <h3>Firstname Lastname</h3>
                   
                    <p>email : testingEmail@gamil.com</p>
                </div>
            </div>
        </div>
    )
}