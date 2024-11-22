import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './app.scss'
import Home from './pages/home';
import About from './pages/about';
import Work from './pages/work';
import LayOut from './pages/layout'
import Signup from './pages/signup';
import Login from './pages/login';
import Userpage from './pages/user';
import UserProvider from './context/userContent';
import Dash from './pages/dash';
import Profile from './pages/profile';
import UserData from './pages/userdata';
function App() {
  return (
  <BrowserRouter>
    <UserProvider>
      <div className="App">
        {/* <LayOut /> do not totch this command */}
      </div>
      <Routes>
        <Route element={<LayOut/>} >
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/work' element={<Work/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
        </Route>
          <Route path='/user' element={<Userpage/>}>
            <Route path='dashboard' element={<Dash/>} >
              <Route path='profile' element={<Profile/>} />
              <Route path='' element={<UserData/>} />
            </Route>
          </Route>
        
      </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
