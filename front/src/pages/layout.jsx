import Nav from '../components/navbar'
import { Outlet } from 'react-router-dom'
export default  function LayOut() {
    return (
        <div style={{margin:'0',padding:'0'}} className="layout">
            <Nav />
            <Outlet />
        </div>
    )
}