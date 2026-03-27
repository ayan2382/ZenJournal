import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTempText } from "../store/slices/JournalSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { journalSchema } from "../store/schemas/journalSchema";

const JournalText = ({ changeTempText = false, presetValue}) => {
    const dispatch = useDispatch();
    const {tempText} = useSelector((state) => state.journal);
    const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      text: (presetValue !== "" ? presetValue : tempText) || "",
      mood: "",
      tags: ""
    }
  });
    console.log('JournalText tempText:', tempText, "presetValue:", presetValue);
    
    return (
        <div className="journal-text-container">
            <textarea
                className="journal-text-area"
                placeholder="Start writing your journal entry here..."
                {...register("text")}
                onChange={(e) => {
                    // Then update Redux if changeTempText is true
                    if (changeTempText) {
                        dispatch(setTempText(e.target.value));
                    }
                }}
            ></textarea>
        </div>
    );
}
export default JournalText;