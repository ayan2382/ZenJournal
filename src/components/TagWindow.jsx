import { useState } from "react";
import { XCircleIcon } from "lucide-react";


const TagWindow = ({ allTags, filterNotes }) => {
    const [selectedTag, didHeSelectaTag] = useState("");
    const uniqueTags = Array.from(new Set(allTags));
    return (
        console.log("Rendering TagWindow with tags:", uniqueTags),
        <>
        <div className="tag-window">
            {uniqueTags.length != 0 ? uniqueTags.map((tag, index) => (
                <span key={index} className="tag" onClick={() => {filterNotes(tag); didHeSelectaTag(tag)}}>
                    {tag}
                </span>
            )) : <p className="w-full text-gray-500 flex justify-center text-center items-center"><strong>No tags available</strong></p>}
            
        </div>
        {selectedTag && <button onClick={() => {didHeSelectaTag(""); filterNotes(null)}} className="button flex flex-row">
            <XCircleIcon className="mr-2"/>
            {selectedTag}
            </button>}
        </>
        
    )
}
export default TagWindow;