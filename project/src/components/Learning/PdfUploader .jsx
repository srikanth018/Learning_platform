import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
// import { Document, Page } from 'react-pdf';

const PdfUploader = () => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rate, setRate] = useState(200);
  const [voice, setVoice] = useState("male");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePlay = async () => {
    const formData = new FormData();
    formData.append("pdfFile", file);
    formData.append("rate", rate);
    formData.append("voice", voice);

    fetch("http://localhost:5000/play-pdf", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));

      const highlightInterval = setInterval(() => {
        setCurrentPage((prevPage) => {
          if (prevPage < numPages) {
            return prevPage + 1;
          } else {
            clearInterval(highlightInterval); // Stop the interval if the last page is reached
            return prevPage;
          }
        });
      }, (60000 / rate)); // Update based on speech rate (in words per minute)
  
      return () => clearInterval(highlightInterval);

  };

  const handleStop = async () => {
    fetch("http://localhost:5000/stop-pdf", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className={`min-h-screen w-full flex ${theme === "light" ? "bg-gray-100" : "bg-gray-900"}`}>
      <Sidebar theme={theme} />
      <div className="flex-1 flex flex-col">
        <Header theme={theme} dark={setTheme} />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">PDF Orateur</h1>
          <h2 className="text-lg mb-4">A simple PDF Audio Reader for you!</h2>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="mb-4 border border-gray-300 rounded p-2"
          />
          <div className="mb-4">
            <label className="block mb-2">
              Enter Rate of Speech:
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                min="100"
                className="ml-2 border border-gray-300 rounded p-2"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block mb-2">
              Voice:
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="ml-2 border border-gray-300 rounded p-2"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
          </div>
          <button
            onClick={handlePlay}
            disabled={!file}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2 disabled:bg-gray-400"
          >
            Play PDF Audio
          </button>
          <button
            onClick={handleStop}
            disabled={!file}
            className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Stop PDF Audio
          </button>
        </div>
        <div className="flex-1">
          {file && (
            <Document
              file={file}
              onLoadSuccess={handleLoadSuccess}
              className="pdf-viewer"
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  className={currentPage === index + 1 ? "highlight" : ""}
                />
              ))}
            </Document>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfUploader;
