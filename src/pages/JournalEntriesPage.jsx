import JournalEntriesTable from "../components/JournalEntriesTable.jsx";

function JournalEntriesPage({setActiveModal, setJournalEntryData}) {


  return (
    <>
      <JournalEntriesTable
        setActiveModal={setActiveModal}
        setJournalEntryData={setJournalEntryData}
      />
    </>
  );
}

export default JournalEntriesPage;
