import { useEffect, useState } from "react";
import { getJournalEntries, deleteJournalEntry } from "../services/api.js";
import JournalStats from "../components/JournalStats.jsx";
import Stack from "@mui/material/Stack";
import FilterListIcon from '@mui/icons-material/FilterList';
import "./JournalEntriesTable.css";

function JournalEntriesTable({ setJournalEntryOpen, setJournalEntryData }) {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState([]);
  const [dateSort, setDateSort] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);
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

  // Close filter dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (filterOpen && !e.target.closest(".journal-filter-dropdown")) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [filterOpen]);

  // Delete selected journal entry
  const handleDelete = async (entry) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${entry.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteJournalEntry(entry.id);

      setEntries((currentEntries) =>
        currentEntries.filter((currentEntry) => currentEntry.id !== entry.id),
      );
    } catch (error) {
      console.error("Failed to delete journal entry:", error);
      alert("Something went wrong while deleting your journal entry.");
    }
  };

  // Get unique languages from entries
  const languages = [...new Set(entries.map((e) => e.target_language).filter(Boolean))];

  // Filter and sort entries
  let filteredEntries = entries.filter((entry) => {
    const matchesSearch = entry.title.toLowerCase().includes(search.toLowerCase());
    const matchesLanguage = languageFilter.length === 0 || languageFilter.includes(entry.target_language);
    return matchesSearch && matchesLanguage;
  });

  // Sort by date
  filteredEntries.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateSort === "newest" ? dateB - dateA : dateA - dateB;
  });

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

        <div className="journal-search-row">
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

          <div className="journal-filter-dropdown">
            <button
              className="journal-filter-button"
              onClick={(e) => {
                e.stopPropagation();
                setFilterOpen(!filterOpen);
              }}
            >
              <FilterListIcon/>
            </button>
            {filterOpen && (
            <div className="journal-filter-menu">
              <div className="journal-filter-section">
                <label>Language</label>
                <div className="journal-language-checkboxes">
                  {languages.map((lang) => (
                    <label key={lang} className="journal-language-checkbox">
                      <input
                        type="checkbox"
                        checked={languageFilter.includes(lang)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (languageFilter.length < 10) {
                              setLanguageFilter([...languageFilter, lang]);
                            }
                          } else {
                            setLanguageFilter(languageFilter.filter((l) => l !== lang));
                          }
                          setCurrentPage(1);
                        }}
                      />
                      {lang}
                    </label>
                  ))}
                </div>
              </div>
              <div className="journal-filter-section">
                <label>Date</label>
                <select
                  value={dateSort}
                  onChange={(e) => setDateSort(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          )}
        </div>
        </div>
      </header>

      <JournalStats entries={entries} />

      {(languageFilter.length > 0 || dateSort !== "newest") && (
        <div className="journal-active-filters">
          {languageFilter.map((lang) => (
            <span key={lang} className="vault-language">
              {lang}
              <button
                className="filter-badge-remove"
                onClick={() => setLanguageFilter(languageFilter.filter((l) => l !== lang))}
              >
                ×
              </button>
            </span>
          ))}
          {dateSort !== "newest" && (
            <span className="journal-date-badge">
              {dateSort === "oldest" ? "Oldest First" : "Newest First"}
              <button
                className="filter-badge-remove"
                onClick={() => setDateSort("newest")}
              >
                ×
              </button>
            </span>
          )}
          {(languageFilter.length > 1 || (languageFilter.length > 0 && dateSort !== "newest")) && (
            <button
              className="journal-clear-filters"
              onClick={() => {
                setLanguageFilter([]);
                setDateSort("newest");
              }}
            >
              Clear all
            </button>
          )}
        </div>
      )}

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
    </div>
  );
}

export default JournalEntriesTable;
