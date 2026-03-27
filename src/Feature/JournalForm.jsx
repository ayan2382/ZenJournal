import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { journalSchema } from "../store/schemas/journalSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { addEntry, setTempText } from "../store/slices/JournalSlice";
import JournalText from "../components/JournalText";

export default function JournalForm() {
  const {tempText, tempMood} = useSelector((state) => state.journal);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      text: tempText || "",
      mood: tempMood || "",
      tags: ""
    }
  });

  // Sync tempText from Redux to form when it changes
  useEffect(() => {
    console.log("Setting form text value to:", tempText);
    setValue("text", tempText || "");
  }, [tempText, setValue]);
  const onSubmit = async (data) => {
    // Handle form submission
    console.log("🎉 onSubmit called! Form passed validation!");
    try {
      console.log("Form data before dispatch:", data);
      console.log("data.tags type:", typeof data.tags, "value:", data.tags);
      
      // Process tags: handle different data types
      let tagsArray = [];
      if (data.tags) {
        if (typeof data.tags === 'string') {
          // If it's a string, split by commas
          tagsArray = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        } else if (Array.isArray(data.tags)) {
          // If it's already an array, use it as is
          tagsArray = data.tags.filter(tag => tag && tag.length > 0);
        } else {
          console.warn("Unexpected tags type:", typeof data.tags, data.tags);
        }
      }
      
      const entryData = {
        text: data.text,
        mood: data.mood,
        tags: tagsArray
      };
      
      console.log("Processed entry data:", entryData);
      await dispatch(addEntry(entryData)).unwrap();
      reset();
      dispatch(setTempText("")); // Clear tempText after successful submission
      alert('Journal entry added successfully!');
    } catch (error) {
      console.error('Failed to add entry:', error);
      alert('Failed to add journal entry. Please try again.');
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full max-w-2xl mx-auto border-2 border-gray-300 rounded p-4 mb-6">
      <JournalText
        register={register("text")}
        changeTempText={true}
        presetValue={tempText}
      />
      {errors.text && <p className="text-red-500 mb-3">{errors.text.message}</p>}
      <select
        className="bg-gray-50 p-3 mt-3 mb-3 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...register("mood")}
      >
        <option value="">Select your mood...</option>
        <option value="Depressed">� Depressed</option>
        <option value="Sad">😐 Sad</option>
        <option value="Neutral">� Neutral</option>
        <option value="Good">😊 Good</option>
        <option value="Great!">Great!</option>
      </select>
      {errors.mood && <p className="text-red-500 mb-3">{errors.mood.message}</p>}
      
      <input
        type="text"
        className="bg-gray-50 p-3 mb-3 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Tags (optional, comma-separated)"
        {...register("tags")}
      />
      
      <button type="submit" className="button">Submit</button>
      
      {/* Debug button to test form validation */}
      { /* <button 
        type="button" 
        onClick={() => console.log("Current form errors:", errors)}
        className="mt-2 px-4 py-2 bg-gray-500 text-white rounded text-sm"
      >
        Debug: Check Form Errors
      </button>
      */ }
    </form>
  );
}
