import {useContext, useEffect} from 'react'
import {MyContext} from '../contexts/MyContext'
import {useNavigate} from 'react-router-dom'

// Importing the Login & Register Component
import Login from '../components/Login'
import Register from '../components/Register'

function Home(){

    const {rootState,logoutUser} = useContext(MyContext);
    const {isAuth,theUser,showLogin} = rootState;

    // Hook from react-router-dom
    const navigate = useNavigate();

    useEffect(() => {
      // If user Logged in
      if(isAuth)
      {
          // Navigate to Dashboard
          navigate(`${import.meta.env.VITE_REACT_APP_PATH_CLIENT}`);
      }
    }, [isAuth, navigate]);

    // Showing Login Or Register Page According to the condition
    if(showLogin){
        return (
            <div>                
                <Login/>
            </div>
        
        );
    }
    else{
        return (
            <div>
               <Register/> 
            </div>
        
        );
    }
}

export default Home;