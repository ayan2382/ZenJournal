import { Link, useNavigate} from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import { checkForRegistration, logout, logoutImmediate } from "../store/slices/authSlice";
import { initialState } from "../store/slices/authSlice";
import { setTempMood, setTempText } from "../store/slices/JournalSlice";
import { User2Icon } from "lucide-react";
import { useState } from "react";   
import GenericPopup from "./GenericPopup";

function Navbar({showDropdownProp, setShowDropdownProp}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isSignedIn, user, name} = useSelector((state) => state.auth);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    console.log(user, initialState);
    
    // Clear temp journal data function
    const clearTempJournalData = () => {
        dispatch(setTempMood(null));
        dispatch(setTempText(""));
    };
    
    
    const dropDownForLogin = () => {
        return (
            <div className="absolute top-12 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <Link to="/journal" onClick={() => {setShowDropdownProp(false)}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Journal</Link>
                <Link onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</Link>
            </div>
        );
    }
    const handleLogout = async() => {
        setIsLoggingOut(true);
        console.log("Logging out...", isLoggingOut);
        try {
            // Try API logout first
            
            await dispatch(logout()).unwrap();
            setIsLoggingOut(false);
            console.log("API logout successful.");
        } catch (error) {
            console.error("API logout failed, using immediate logout:", error);
            // If API logout fails, use immediate logout
            
            dispatch(logoutImmediate());
            setIsLoggingOut(false);
            console.log("Immediate logout successful.");
        } finally {
            // Always navigate to login page
            navigate("/login");
        }
    };

    return(
        <nav className="flex flex-row h-20 items-center shadow-md">
            {isLoggingOut && (
                <GenericPopup>
                    <p>Logging out {name}.......</p>
                </GenericPopup>
            )}
            <Link onClick={clearTempJournalData} to="/" className="ml-4">
            <div className="flex flex-col cursor-pointer p-2 text-center hover:bg-red-200 rounded-md">
            <h1 className="text-2xl custom-color-font font-bold">ZenJournal</h1>
            <p className="text-xs custom-color-font">Write. Reflect. Grow.</p>
            </div>
            </Link>
            
            <div className="ml-auto mr-4 flex items-center">
                {isSignedIn && (
                <>
                <p className="mr-4 rounded px-2 h-full border-4 border-black-100 bg-red-200 cursor-pointer hover:bg-red-300" onClick={() => {
                    setShowDropdownProp(!showDropdownProp);
                }}>
                    <User2Icon className="inline-block mr-2 mb-1 w-4 h-4"/>
                    {name}</p>
                {showDropdownProp && dropDownForLogin()}
                </>
                )}
                {!isSignedIn &&(
                <>
                <Link onClick={clearTempJournalData} to="/signup" className="mr-4 button">Sign Up</Link>
                <Link onClick={clearTempJournalData} to="/login" className="button">Login</Link> 
                </>
                )}
                
            </div>
            
        </nav>
        )
}

export default Navbar;