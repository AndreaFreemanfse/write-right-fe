import JournalEntriesTable from "../components/JournalEntriesTable.jsx";

function JournalEntriesPage({setJournalEntryOpen, setJournalEntryData}) {

  return (
    <>
      <JournalEntriesTable
        setJournalEntryOpen={setJournalEntryOpen}
        setJournalEntryData={setJournalEntryData}
      />
    </>
  );
}

export default JournalEntriesPage;
