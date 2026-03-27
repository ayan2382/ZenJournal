import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { is } from "zod/locales";
import { PlusCircleIcon, Calendar } from "lucide-react";
import MoodWindow from "../components/MoodWindow.jsx";
import JournalText from "../components/JournalText.jsx";
import { setTempMood, setTempText } from "../store/slices/JournalSlice.js";
import NewEntryPopup from "../components/NewEntryPopup.jsx";
import GenericPopup from "../components/GenericPopup.jsx";


function SignedInPage() {
    const dptch = useDispatch();
    const [mood, setMood] = useState(null);
    const [showNewEntryPopup, setShowNewEntryPopup] = useState(false);
    
    // Clear temp journal data
    const clearTempJournalData = () => {
        dptch(setTempMood(null));
        dptch(setTempText(""));
    };
    
    function DetermineMoodMessage(mood) {

    switch(mood) {
        case "very low":
            return "We're here for you. Remember, every day is a new opportunity.";
        case "low":
            return "It's okay to have off days. Take a deep breath and keep going.";
        case "neutral":
            return "A balanced day is a good day. Keep maintaining your equilibrium.";
        case "good":
            return "Great to hear! Keep up the positive vibes and continue your journey.";
        case "great":
            return "Fantastic! Your positivity is contagious. Keep shining!";
        default:
            return "Select your mood to receive a personalized message.";
        
    }
}
// function MoodWindow() {
//     return(
//         <div className="signedInSection text-center p-10 flex-col">
//             <h1 className="text-2xl font-bold">How are you feeling today?</h1>
//             <p className="text-sm mt-3">Select your current mood to track your emotional journey.</p>
//             <div className="flex justify-center mt-6 space-x-3">
//                 <button onClick={() => setMood("very low")} className="feeling-button flex flex-col items-center">
//                     {mood === "very low" && <span className="selected-indicator"></span>}
//                     <p>😞</p>
//                     <p>Very Low</p>
//                 </button>
//                 <button onClick={() => setMood("low")} className="feeling-button flex flex-col items-center">
//                     {mood === "low" && <span className="selected-indicator"></span>}
//                     <p>😞</p>
//                     <p>Low</p>
//                 </button>
//                 <button onClick={() => setMood("neutral")} className="feeling-button flex flex-col items-center">
//                     {mood === "neutral" && <span className="selected-indicator"></span>}
//                     <p>😐</p>
//                     <p>Neutral</p>
//                 </button>
//                 <button onClick={() => setMood("good")} className="feeling-button flex flex-col items-center">
//                     {mood === "good" && <span className="selected-indicator"></span>}
//                     <p>😊</p>
//                     <p>Good</p>
//                 </button>
//                 <button onClick={() => setMood("great")} className="feeling-button flex flex-col items-center">
//                     {mood === "great" && <span className="selected-indicator"></span>}
//                     <p>😊</p>
//                     <p>Great</p>
//                 </button>
//                 </div>
//                 <div className="mt-6 flex justify-center text-center">
//                    <button className="p-5 border-2 border-zen-300 flex items-center justify-center">Feeling {mood != null ? mood : "nothing"} today</button> 
//                 </div>
                
//         </div>
//     )
// }


function MoodPopup({mood}) {
    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">{DetermineMoodMessage(mood)}</h2>
                <Link to="/journal" className="button">Write in your journal</Link>
                <button className="ml-4 button" onClick={() => {
                    setMood(null);
                    console.log("Mood popup closed");
                }}>Close</button>
                </div>
        </div>
    )
}
    return(
        <>
        <div className="h-1/9 border-4 border-red-200 shadow-lg mt-2 pb-0 rounded-lg w-4/6 flex flex-row align-center justify-start mx-auto" onClick={() => {
            setMood(null);
            console.log("Mood popup closed");
        } }>
        <button onClick={() => {setShowNewEntryPopup(true)}} className="button m-4">Today</button>
        <Link to="/journal" className="button m-4">Journal</Link>
        {/* <Link to="/journal/settings"  className="button m-4">Insights</Link> */}
        
        </div>
        <MoodWindow mood={mood} setMood={setMood} size="large" />
        {showNewEntryPopup && <NewEntryPopup mood={mood} setMood={setMood} clearTempJournalData={clearTempJournalData} setShowNewEntryPopup={setShowNewEntryPopup} defaultID={null} />}
        {/* {mood != null ? <MoodPopup mood={mood} /> : null} */}

        
        <div className="signedInSection p-5 justify-between">
            <div>
              <h1 className="text-2xl font-bold">Daily Reflection</h1>
            <p className="text-sm mt-3">Take a moment to reflect on your day. Writing down your thoughts can help you process emotions and gain clarity.</p>  
            </div>
            
            <div onClick={() => {setShowNewEntryPopup(true); dptch(setTempMood(null)); }} className="mt-6 flex justify-center text-center">
                   <button className="button flex items-center justify-center hover:bg-zen-100">
                    <PlusCircleIcon className="mr-2" />New Entry</button> 
                </div>
        </div>

        </>
        
    )
}
function SignedOutPage() {
    
    return(
        <>
        <div className="special-section text-center h-3/4 bg-red-100 ml-auto mr-auto">
            <h1 className="text-4xl">A trusted, safe space</h1>
            <p className="text-lg mt-3">Your personal space to relax and reflect.</p>
            <div className="flex justify-center mt-4">
                <Link to="/signup" className="button mt-4">Get Started</Link>
                <Link to="/login" className="button mt-4 ml-4">Login</Link>
            </div>
            </div>
            <div className="special-section text-center h-3/4 bg-red-100 ml-auto mr-auto">
            <h1 className="text-4xl">Accredited by many</h1>
            <p className="text-lg mt-3">Why don't you hop in?</p>
            <div className="flex justify-center mt-4">
                <Link to="/signup" className="button mt-4">Get Started</Link>
                <Link to="/login" className="button mt-4 ml-4">Login</Link>
            </div>
            </div>
        </>
    )
}

function MainHub() {
    const {isSignedIn, user, name, howManyLogins} = useSelector((state) => state.auth);
    
    return(
        <div className="body">
            <div className="special-section h-1/5 ml-auto mr-auto">
            <h1 className="text-4xl">{isSignedIn ? `Welcome back, ${name}` : "Welcome to ZenJournal"}</h1>
            <p className="text-lg mt-3">{isSignedIn ? `How are you feeling today, ${name == "Ayuub Yusuf" ? "man": name}? Take a moment to reflect and write.` : "Your place to relax and reflect."}</p>
            </div>
            {isSignedIn ? <SignedInPage /> : <SignedOutPage />}
          </div>  
    )
}

export default MainHub;