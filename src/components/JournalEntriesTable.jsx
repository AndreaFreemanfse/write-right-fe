import { useEffect, useState } from "react";
import { getJournalEntries } from "../services/api.js";
import JournalStats from "../components/JournalStats.jsx";
import Stack from "@mui/material/Stack";
import "./JournalEntriesTable.css";

function JournalEntriesTable() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const entriesPerPage = 6;

  useEffect(() => {
    async function loadEntries() {
      try {
        const data = await getJournalEntries();
        setEntries(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadEntries();
  }, []);

  console.log(entries);

  // Search filter
  const filteredEntries = entries.filter((entry) =>
    entry.original_text.toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);

  const startIndex = (currentPage - 1) * entriesPerPage;

  const currentEntries = filteredEntries.slice(
    startIndex,
    startIndex + entriesPerPage,
  );

  return (
    <div className="journal-page">
      <header className="journal-header">
        <h1>My Journal Entries</h1>

        {/* <button>+ New Entry</button> */}
        <input
          className="journal-search"
          type="text"
          placeholder="Search journal entries..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </header>

      <JournalStats entries={entries} />

      <table className="journal-table">
        <thead className="journal-table-header">
          <tr>
            <th>Entry</th>
            <th>Language</th>
            <th>Corrections</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {currentEntries.map((entry) => (
            <tr key={entry.id}>
              <td>
                <Stack
                  direction="row"
                  sx={{
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <div className="stat-icon entries-icon">📖</div>
                  {entry.original_text}
                </Stack>
              </td>

              <td>
                <span className={entry.target_language ? "vault-language" : ""}>
                  {entry.target_language}
                </span>
              </td>

              <td>{entry.mistakes.length}</td>

              <td>{new Date(entry.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`page-button ${
              currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default JournalEntriesTable;
