import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getJournalEntries, deleteJournalEntry } from "../services/api.js";
import JournalStats from "../components/JournalStats.jsx";
import Stack from "@mui/material/Stack";
import "./JournalEntriesTable.css";

function JournalEntriesTable({ setJournalEntryOpen, setJournalEntryData }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const entriesPerPage = 6;

  const { data: entries = [], isLoading, error } = useQuery({
    queryKey: ["journal-entries"],
    queryFn: getJournalEntries,
    staleTime: 0, // Always fetch fresh data so new entries appear immediately
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJournalEntry,
    onMutate: async (entryId) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["journal-entries"] });
      // Optimistically remove the entry from the UI immediately
      queryClient.setQueryData(["journal-entries"], (old) =>
        old.filter((entry) => entry.id !== entryId)
      );
    },
    onSettled: () => {
      // Refetch after server responds to ensure true server state
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
    },
  });

  // Delete selected journal entry
  const handleDelete = (entry) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${entry.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(entry.id);
  };

  // Memoize filtered entries to avoid recalculating on every render
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) =>
      entry.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [entries, search]);

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);

  const startIndex = (currentPage - 1) * entriesPerPage;

  // Memoize current page entries
  const currentEntries = useMemo(() => {
    return filteredEntries.slice(startIndex, startIndex + entriesPerPage);
  }, [filteredEntries, startIndex, entriesPerPage]);

  // Reset page when search changes
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

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
          onChange={handleSearchChange}
        />
      </header>

      <JournalStats entries={entries} />

      {isLoading ? (
        <p>Loading entries...</p>
      ) : error ? (
        <p>Error loading entries: {error.message}</p>
      ) : (
        <>
          <table className="journal-table">
            <thead className="journal-table-header">
              <tr>
                <th>Entry</th>
                <th>Language</th>
                <th>Corrections</th>
                <th>Date</th>
                {/* empty space for the delete icon */}
                <th></th>
              </tr>
            </thead>

            <tbody>
              {currentEntries.map((entry) => (
                <tr key={entry.id}>
                  <td className="journal-table-title">
                    <Stack
                      direction="row"
                      sx={{
                        gap: "1rem",
                        alignItems: "center",
                      }}
                      onClick={() => {
                        setJournalEntryOpen(true);
                        setJournalEntryData(entry);
                      }}
                    >
                      <div className="stat-icon entries-icon">📖</div>
                      {entry.title}
                    </Stack>
                  </td>

                  <td>
                    <span className={entry.target_language ? "vault-language" : ""}>
                      {entry.target_language}
                    </span>
                  </td>

                  <td>{entry.mistakes.length}</td>

                  <td>{new Date(entry.created_at).toLocaleDateString()}</td>
                  <td className="delete-entry-cell">
                    <button
                      type="button"
                      className="delete-entry-button"
                      onClick={() => handleDelete(entry)}
                      aria-label={`Delete ${entry.title}`}
                    >
                      X
                    </button>
                  </td>
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
        </>
      )}
    </div>
  );
}

export default JournalEntriesTable;