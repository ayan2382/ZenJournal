
import { useState } from "react";

const GenericPopup = ({ children }) => {
    const [showPopup, setShowPopup] = useState(true);
    return (
        showPopup && (<div onClick={() => {setShowPopup(false); console.log("Popup removed. State of popup: ",showPopup )}} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
            <div 
                className="bg-white p-6 rounded-lg shadow-lg max-h-screen overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                >
                {children}
                </div>
        </div>)
    );
}
export default GenericPopup;