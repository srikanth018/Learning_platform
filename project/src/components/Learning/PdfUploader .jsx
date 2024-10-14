import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { pdfjs } from "react-pdf";
import { FaPlay, FaStop, FaFilePdf, FaMusic } from "react-icons/fa"; // Add music icons

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

const PdfUploader = () => {
  const [file, setFile] = useState(null);
  const [rate, setRate] = useState(250); // Default rate is 250 for 2.5x
  const [voice, setVoice] = useState("male");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [showPdf, setShowPdf] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for play/stop

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleShowPdf = () => {
    setShowPdf(!showPdf);
  };

  const handlePlay = async () => {
    if (!file) return;
    setLoading(true); // Set loading to true when starting to play
    const formData = new FormData();
    formData.append("pdfFile", file);
    formData.append("rate", rate);
    formData.append("voice", voice);

    fetch("http://localhost:5000/play-pdf", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setLoading(false); // Set loading to false after the response
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false); // Set loading to false on error
      });
  };

  const handleStop = async () => {
    setLoading(true); // Set loading to true when stopping audio
    fetch("http://localhost:5000/stop-pdf", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setLoading(false); // Set loading to false after the response
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false); // Set loading to false on error
      });
  };

  return (
    <div
      className={`min-h-screen w-full flex ${
        theme === "light" ? "bg-gray-100" : "bg-gray-900"
      }`}
    >
      <Sidebar theme={theme} />
      <div className="flex-1 flex flex-col">
        <Header theme={theme} dark={setTheme} />

        {/* Flex container to hold player and PDF viewer */}
        <div className="flex flex-1 p-8">
          {/* Music Player Container */}
          <div className="music-player-container bg-white p-8 rounded-lg shadow-lg w-1/2 mr-8 h-96">
        
          <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">LearnGlobs  PDF Reader</h1>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="mb-4 border border-blue-300 rounded p-2 w-full text-center file:bg-blue-100 file:text-blue-600 file:border-blue-500 file:py-1 file:px-4"
            />

            {/* Speech Rate Select */}
            <div className="mb-4 flex items-center justify-between">
              <label className="block text-sm font-medium">Speech Rate:</label>
              <select
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="border border-gray-300 rounded p-2 w-24"
              >
                <option value={100}>1x</option>
                <option value={150}>1.5x</option>
                <option value={200}>2x</option>
                <option value={250}>2.5x</option>
                <option value={300}>3x</option>
                <option value={350}>3.5x</option>
                <option value={400}>4x</option>
                <option value={450}>4.5x</option>
                <option value={500}>5x</option>
              </select>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <label className="block text-sm font-medium">Voice:</label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="border border-gray-300 rounded p-2 w-24"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePlay}
                disabled={!file || loading}
                className={`bg-blue-500 text-white px-4 py-2 rounded-full flex items-center ${
                  !file || loading ? "disabled:bg-gray-400" : ""
                }`}
              >
                {loading ? (
                  "Playing..."
                ) : (
                  <p className="flex items-center">
                    {" "}
                    <FaPlay className="mr-2" /> Play{" "}
                  </p>
                )}
              </button>
              <button
                onClick={handleStop}
                className={`bg-red-500 text-white px-4 py-2 rounded-full flex items-center ${
                  !file || loading ? "disabled:bg-gray-400" : ""
                }`}
              >
                <FaStop className="mr-2" /> Stop
              </button>
            </div>

            <button
              onClick={handleShowPdf}
              disabled={!file}
              className={`bg-green-500 text-white px-4 py-2 rounded-full mt-4 w-full flex items-center justify-center ${
                !file ? "disabled:bg-gray-400" : ""
              }`}
            >
              <FaFilePdf className="mr-2" /> Show PDF
            </button>
          </div>

          {/* PDF Viewer Container */}
          {showPdf && file && (
            <div className="pdf-viewer-container bg-white p-8 rounded-lg shadow-lg w-full">
              <div className="border border-gray-300 p-4 rounded overflow-auto h-screen">
                <Worker
                  workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`}
                >
                  <Viewer fileUrl={URL.createObjectURL(file)} />
                </Worker>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfUploader;
