import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllJournals, updateEntry } from "../store/slices/JournalSlice";
import { deleteEntry } from "../store/slices/JournalSlice";
import NewEntryPopup from "../components/NewEntryPopup";


export default function JournalList({entries}) {
  const dispatch = useDispatch();
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [defaultID, setDefaultID] = useState(null);
  const [defaultText, setDefaultText] = useState("");
  const [defaultMood, setDefaultMood] = useState("");
  const [defaultTags, setDefaultTags] = useState([]);

  // Function to convert timestamp to readable date and time
  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    const date = new Date(timestamp);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) return 'Invalid date';
    
    // Format options
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    
    return date.toLocaleDateString('en-US', options);
  };
  // const {entries} = useSelector(state => state.journal);
  // useEffect(() => {
  //   const checkForJournals = async () => {
  //     console.log("Current journal entries:", entries);
  //     try {
  //       if (entries.length === 0) {
  //         console.log("No journal entries found.");
  //       }
  //       await dispatch(getAllJournals()).unwrap();
  //     } catch (error) {
  //       console.error("Failed to fetch journal entries:", error);
  //     }
  //   }
  //   checkForJournals();
  // }, [dispatch]);

  if (entries.length === 0) {
    return <p className="mt-4 font-bold text-xl">No journal entries found.</p>;
  }
  console.log("Rendering JournalList with entries:", entries);
  const onDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        console.log("Attempting to delete entry with ID:", id);
        await dispatch(deleteEntry(id)).unwrap();
        console.log("Entry deleted successfully from API");
        // Redux will automatically update the entries array in the deleteEntry.fulfilled case
      } catch (error) {
        console.error("Failed to delete entry:", error);
        alert('Failed to delete entry. Please try again.');
      }
    }
  };
  const onEdit = async (id, newText, newMood, newTags) => {
    setDefaultID(id);
    setDefaultText(newText);
    setDefaultMood(newMood);
    setDefaultTags(newTags || []);
    setShowEditPopup(true);
    console.log("Opening edit popup for entry ID:", id, "Text:", newText, "Mood:", newMood, "Tags:", newTags);
  } 

  // Sort entries by ID before rendering
  const sortedEntries = [...entries].sort((a, b) => {
    // Sort by ID in ascending order
    if (a._creationTime < b._creationTime) return -1;
    if (a._creationTime > b._creationTime) return 1;
    return 0;
  });

  return (
    <>
    {showEditPopup && <NewEntryPopup mood={defaultMood} setMood={setDefaultMood} clearTempJournalData={() => {}} setShowNewEntryPopup={setShowEditPopup} defaultID={defaultID} defaultText={defaultText} defaultMood={defaultMood} defaultTags={defaultTags} />}
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedEntries.map((entry, index) => (
        <div key={entry.id} className="border-2 bg-blue-100 px-2 border-red-200 py-4 w-full text-center flex flex-col items-center">
          <p>#{index + 1}</p>
          <h3 className="text-lg font-semibold">{entry.text}</h3>
          <p className="text-gray-600 border-2 border-gray-500 p-2 bg-red-100 rounded w-fit mt-4">{entry.mood}</p>
          
          {/* Display creation time */}
          {entry._creationTime && (
            <p className="text-xs text-gray-500 mt-2">
              Created: {formatDateTime(entry._creationTime)}
            </p>
          )}
          
          {entry.tags && entry.tags.length > 0 && entry.tags.map((tag, index) => (
            <span key={index} className="text-sm text-blue-500 mr-2 mt-1">#{tag}</span>
          ))}
          <button
            onClick={() => onDelete(entry._id)}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => onEdit(entry._id, entry.text, entry.mood, entry.tags)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
        </div>
        
      ))}
      
    </div>
    </>
  );
}

  
