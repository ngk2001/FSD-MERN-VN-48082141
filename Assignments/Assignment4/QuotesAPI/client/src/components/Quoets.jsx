import React, { useState, useEffect } from "react";
import axios from "axios";

function Quotes() {
  const [quote, setQuote] = useState([]);

  const fetchQuotes = async () => {
    try {
      const response = await axios.get("https://dummyjson.com/quotes");
      setQuote(response.data.quotes);
    } catch (error) {
      console.log("Error fetching quotes:", error);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#111",
        color: "white",
        minHeight: "100vh",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <h2>QUOTES</h2>

      {quote.length === 0 ? (
        <p>Loading...</p>
      ) : (
        quote.map((qut) => (
          <div
            key={qut.id}
            style={{
              backgroundColor: "#1e1e1e",
              padding: "20px",
              borderRadius: "10px",
              width: "60%",
              boxShadow: "0 4px 10px rgba(255, 255, 255, 0.1)",
            }}
          >
            <h3 style={{ fontWeight: "normal", lineHeight: "1.5" }}>
              "{qut.quote}"
            </h3>
            <p style={{ color: "#aaa", marginTop: "8px" }}>— {qut.author}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Quotes;
