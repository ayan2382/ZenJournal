import { Calendar } from "lucide-react";
import MoodWindow from "./MoodWindow.jsx";
import JournalText from "./JournalText.jsx";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateEntry, getAllJournals } from "../store/slices/JournalSlice.js";
import { useState, useEffect } from "react";


function NewEntryPopup({mood, setMood, clearTempJournalData, setShowNewEntryPopup, defaultID, defaultText, defaultMood, defaultTags}) {
    const dispatch = useDispatch();
    const { tempText } = useSelector((state) => state.journal);
    const [editedText, setEditedText] = useState(defaultText || "");
    const [editedMood, setEditedMood] = useState(defaultMood || "");
    const [editedTags, setEditedTags] = useState(defaultTags || []);

    // Update local state when defaults change
    useEffect(() => {
        setEditedText(defaultText || "");
        setEditedMood(defaultMood || "");
        setEditedTags(defaultTags || []);
    }, [defaultText, defaultMood, defaultTags]);

    // Sync tempText to editedText when user types
    useEffect(() => {
        if (defaultID) {
            setEditedText(tempText || defaultText || "");
        }
    }, [tempText, defaultID, defaultText]);

    const onEdit = async () => {
        if (!editedText.trim()) {
            alert('Journal entry cannot be empty');
            return;
        }
        
        if (!editedMood) {
            alert('Please select a mood');
            return;
        }

        if (window.confirm('Are you sure you want to edit this journal entry?')) {
            console.log("Editing entry with ID:", defaultID);
            console.log("Updated text:", editedText);
            console.log("Updated mood:", editedMood);
            console.log("Updated tags:", editedTags);
            
            try {
                await dispatch(updateEntry({ 
                    id: defaultID, 
                    text: editedText, 
                    mood: editedMood,
                    tags: editedTags 
                })).unwrap();
                setShowNewEntryPopup(false);
                window.alert("Journal entry updated successfully!");
            } catch (error) {
                console.error("Failed to edit entry:", error);
                alert("Failed to update journal entry. Please try again.");
            }   
        }
    }
    return(
        <div onClick={() => {setShowNewEntryPopup(false)}} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div onClick={(e) => e.stopPropagation()} className="new-entry-popup">
            <h2 className="text-xl font-bold mb-4 flex flex-row">
                <Calendar className="mr-2"></Calendar> 
                {new Date().toLocaleDateString()} {defaultID != null ? " - Edit Entry" : " - New Entry"}
                </h2>
                <MoodWindow mood={editedMood || mood} setMood={defaultID ? setEditedMood : setMood} size="small" />
                <JournalText presetValue={editedText} register={{}} changeTempText={true} />
                <p className="text-sm">This text will be shown on journal window.</p>
            <div className="mt-4 flex justify-end">
                {defaultID != null ? <button className="button" onClick={onEdit}>Edit Journal</button> : <Link to="/journal" className="button">Write in your journal</Link>}
                <button className="ml-4 button" onClick={() => {
                    clearTempJournalData();
                    setShowNewEntryPopup(false);
                    console.log("New Entry popup closed");
                }}>Close</button>
            </div>
        </div>
        </div>
    )
}
export default NewEntryPopup;

