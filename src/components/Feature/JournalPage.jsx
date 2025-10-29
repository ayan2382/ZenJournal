import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addEntry, updateEntry, deleteEntry } from "./journalSlice";
import JournalForm from "./JournalForm";
import JournalList from "./JournalList";

export default function JournalPage() {
  const dispatch = useDispatch();
  const entries = useSelector(state => state.journal.entries);
  const [editing, setEditing] = useState(null);

  const handleAdd = (title, content) => {
    dispatch(addEntry(title, content));
  };
  

  const handleUpdate = (id, title, content) => {
    dispatch(updateEntry({ id, title, content }));
    setEditing(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteEntry(id));
  };

  return (
    <div>
      <h2>Zainjournal Configuration</h2>
      <JournalForm onAdd={handleAdd} />
      <JournalList
        entries={entries}
        onEdit={setEditing}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        editing={editing}
      />
    </div>
  );
}
