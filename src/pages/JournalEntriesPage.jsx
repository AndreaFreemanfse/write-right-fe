import { useEffect, useState } from "react";
import JournalStats from "../components/JournalStats.jsx";
import JournalEntriesTable from "../components/JournalEntriesTable.jsx";
import { getJournalEntries } from "../services/api.js";

function JournalEntriesPage() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    async function loadEntries() {
      try {
        const data = await getJournalEntries();
        setEntries(data);
      } catch (error) {
        console.error("Failed to load entries:", error);
      }
    }

    loadEntries();
  }, []);

  return (
    <>
      <JournalEntriesTable entries={entries} />
    </>
  );
}

export default JournalEntriesPage;
