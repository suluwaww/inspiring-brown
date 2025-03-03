import { useState, useEffect } from "react";

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function SearchComponent() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    setLoading(true);
    fetch(`https://api.tvmaze.com/search/shows?q=${debouncedQuery}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.map((item) => item.show.name));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [debouncedQuery]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#1e1e2e",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "20px", color: "#ffcc00" }}>
        📺 ТВ-шоу Іздеу
      </h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ТВ-шоу атауын енгізіңіз..."
        style={{
          padding: "12px",
          fontSize: "18px",
          width: "350px",
          borderRadius: "10px",
          border: "none",
          outline: "none",
          backgroundColor: "#2e2e3e",
          color: "#ffffff",
          textAlign: "center",
        }}
      />
      {loading && <p style={{ marginTop: "10px" }}>⏳ Жүктелуде...</p>}
      <div
        style={{
          marginTop: "20px",
          width: "400px",
          backgroundColor: "#2e2e3e",
          borderRadius: "10px",
          padding: "15px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <ul style={{ listStyle: "none", padding: 0 }}>
          {results.length > 0
            ? results.map((item, index) => (
                <li
                  key={index}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #444",
                    textAlign: "center",
                    fontSize: "16px",
                  }}
                >
                  🎬 {item}
                </li>
              ))
            : !loading && (
                <p style={{ textAlign: "center" }}>❌ ондай шоу жоқ</p>
              )}
        </ul>
      </div>
    </div>
  );
}

export default SearchComponent;
