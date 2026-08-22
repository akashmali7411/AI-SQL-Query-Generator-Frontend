import React, { useState } from "react";
import "./App.css";

function App() {
  const [database, setDatabase] = useState("MSSQL");
  const [description, setDescription] = useState("");
  const [schema, setSchema] = useState("");
  const [sql, setSql] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSql = async () => {
    if (!description.trim()) {
      alert("Please enter your query description.");
      return;
    }

    setLoading(true);
    setSql("");

    try {
      const response = await fetch(
        "https://localhost:7126/api/Sql/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            database: database,
            description: description,
            schema: schema
          })
        }
      );

      if (!response.ok) {
        throw new Error("API request failed.");
      }

      const data = await response.json();

      setSql(data.sql || "No SQL generated.");
    } catch (error) {
      console.error(error);
      alert("Unable to generate SQL. Please make sure the API is running.");
    } finally {
      setLoading(false);
    }
  };

  const copySql = () => {
    if (!sql) return;

    navigator.clipboard.writeText(sql);
    alert("SQL copied successfully.");
  };

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <h1>AI SQL Query Generator</h1>
        <p>Generate SQL queries using Natural Language</p>
      </header>

      <div className="container">

        {/* Left Side */}
        <div className="card">

          <div className="title-row">
            <h2>Generate SQL Query</h2>
            <span className="badge">AI Powered</span>
          </div>

          {/* Database */}
          <label>Database</label>

          <select
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
          >
            <option value="MSSQL">MSSQL</option>
            <option value="MySQL">MySQL</option>
            <option value="SQLite">SQLite</option>
          </select>

          {/* Schema */}
          <label>Database Schema</label>

          <textarea
            className="schema-input"
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            placeholder="Paste your database schema here..."
          />

          {/* Description */}
          <label>Describe your query</label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Example: Show employee name and mobile number"
          />

          {/* Generate */}
          <button
            onClick={generateSql}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate SQL"}
          </button>

        </div>

        {/* Right Side */}
        <div className="card">

          <div className="title-row">
            <h2>Generated SQL</h2>

            <button
              className="copy-button"
              onClick={copySql}
              disabled={!sql}
            >
              Copy
            </button>
          </div>

          <pre className="sql-output">
            {sql || "Your generated SQL query will appear here..."}
          </pre>

        </div>

      </div>
    </div>
  );
}

export default App;