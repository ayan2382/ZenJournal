import { useState, useEffect } from 'react'
import { checkForRegistration, registration } from './store/slices/authSlice'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Routes, Router, Route, BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import MainHub from './pages/mainHub'
import LoginPage from './pages/loginPage'
import SignUpPage from './pages/signUp'
import JournalPage from './Feature/JournalPage'
import ProtectedRoute from './components/ProtectedRoute'
import { set } from 'zod'

function App() {
    const dispatch = useDispatch();
    const {loading} = useSelector((state) => state.auth);
    const [showDropdown, setShowDropdown] = useState(false);
    useEffect(() => {
        const checkAuth = async () => {
            try {
                
                await dispatch(checkForRegistration()).unwrap();
                
            } catch (error) {
              
                console.error('Failed to check authentication:', error);
            }
        };
        
        checkAuth();
    }, [dispatch]);
    if (loading) {
        return( <div className="text-center p-4">
            <p className="text-lg">Loading...</p>
        </div> )
    }
    return(
        <>
        <div onClick={() => {if (showDropdown) {setShowDropdown(false)}}}>
          <Navbar showDropdownProp={showDropdown} setShowDropdownProp={setShowDropdown} /> 
            <Routes>
                <Route path="/" element={<MainHub />}></Route>
                <Route path="/login" element={<ProtectedRoute requireAuthentication={false}><LoginPage /></ProtectedRoute>}></Route>
                <Route path="/signup" element={<ProtectedRoute requireAuthentication={false}><SignUpPage /></ProtectedRoute>}></Route>
                <Route path="/journal" element={<ProtectedRoute requireAuthentication={true}><JournalPage /></ProtectedRoute>}></Route>  
                
                
            </Routes>  
        </div>
        
        </>   
            
        )
}

export default App