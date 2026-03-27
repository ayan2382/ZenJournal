import { MoonIcon, SmileIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { journalSchema } from "../store/schemas/journalSchema";
import { useSelector, useDispatch } from "react-redux";
import { setTempMood } from "../store/slices/JournalSlice";

const Moods = ["Depressed", "Sad", "Neutral", "Good", "Great!"];
const emojis4Moods = ["😞", "😐", "😑", "😊", "😁"];
const colorWhenHovering = ["hover:bg-blue-300", " hover:bg-indigo-300", "hover:bg-gray-300", "hover:bg-yellow-300", "hover:bg-green-300"];


const MoodSelectionScreen = ({mood, setMood}) => {
    const dptch = useDispatch();
    const { tempMood } = useSelector((state) => state.journal);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(journalSchema),
        defaultValues: {
          text: "",
          mood: tempMood ||"",
          tags: ""
        }
      });
      
      const MoodButton = ({tempMood, mood, emoji, hoverColor}) => {
    return(
        <button onClick={() => {
            console.log("Setting mood to:", mood, tempMood);
            dptch(setTempMood(mood));
            setValue("mood", mood);
            }} className={`feeling-button flex flex-col items-center ${hoverColor}`}>
                {tempMood == mood && <span className="selected-indicator"></span>}
                     <p>{emoji}</p>
                     <p>{mood}</p>
                 </button>
    )
}
    return(
        <div className="text-center p-2 flex-col">
             <div className="flex flex-row justify-center mt-1 space-x-3">
                 
                {Moods.map((moodOption, index) => {
                    return <MoodButton key={moodOption} tempMood={tempMood} mood={moodOption} emoji={emojis4Moods[index]} hoverColor={colorWhenHovering[index]} />;
                })}
                </div>
                <div className="mt-6 flex justify-center text-center">
                   <button className="p-5 border-2 border-zen-300 flex items-center justify-center">Feeling {tempMood != null ? tempMood : "nothing"} today</button> 
                   <button onClick={() => {setMood(null); dptch(setTempMood(null));}} className="p-5 ml-7 border-2 border-zen-300 flex items-center justify-center">Reset</button> 
                </div>
                
         </div>
    )
}

const MoodWindow = ({mood, setMood, size = "small"}) => {
    if (size === "small") {
        return(
            <div className="signedInSection text-center p-6 flex-col mb-4">
                <SmileIcon className="mx-auto mb-2" size={48} />
                <h2 className="text-xl font-bold mb-2">How are you feeling today?</h2>
                <p className="text-gray-600 text-sm mb-4">Select a mood to reflect your current state of mind.</p>
                <MoodSelectionScreen mood={mood} setMood={setMood} />
            </div>
        )
    } else if (size === "large") {
        return(
            <div className="signedInSection text-center p-10 flex-col mb-4">
                <SmileIcon className="mx-auto mb-2" size={48} />
                <h2 className="text-2xl font-bold mb-2">How are you feeling today?</h2>
                <p className="text-gray-600 mb-4">Select a mood to reflect your current state of mind.</p>
                <MoodSelectionScreen mood={mood} setMood={setMood} />
            </div>
        )
    }
}
export default MoodWindow;