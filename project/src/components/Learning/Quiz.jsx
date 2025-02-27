import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Quiz = ({ courseName, userName }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [passed, setPassed] = useState(false);
  const certificateRef = useRef();

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await axios.get("http://localhost:5000/api/quiz/C1");
      setQuestions(res.data);
    };
    fetchQuestions();
  }, []);

  const handleOptionChange = (questionId, optionLabel) => {
    setAnswers({ ...answers, [questionId]: optionLabel });
  };

  const handleSubmit = async () => {
    const res = await axios.post("http://localhost:5000/api/quiz/submit", { answers });
    setScore(res.data);
    setPassed(res.data.score >= 1); // Assume passingScore is provided by API
  };

  const handleDownloadCertificate = () => {
    html2canvas(certificateRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save("certificate.pdf");
    });
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Web Technology Quiz</h1>
      {currentQuestion && (
        <div className="mb-8 p-4 bg-white rounded-md shadow-md border">
          <p className="text-xl font-semibold text-gray-800 mb-4">{currentQuestion.question_text}</p>
          <div className="space-y-2">
            {currentQuestion.options.map((option) => (
              <label key={option.option_id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${currentQuestion.question_id}`}
                  value={option.option_label}
                  checked={answers[currentQuestion.question_id] === option.option_label}
                  onChange={() => handleOptionChange(currentQuestion.question_id, option.option_label)}
                  className="form-radio text-blue-600 h-4 w-4 transition duration-150 ease-in-out"
                />
                <span className="text-gray-700">{option.option_text}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-between mb-6">
        <button
          onClick={() => setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0))}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition duration-200 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1))}
          disabled={currentIndex === questions.length - 1}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {currentIndex === questions.length - 1 && (
        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
        >
          Submit
        </button>
      )}
      {score && (
        <div className="mt-6 p-4 bg-green-100 rounded-md text-center">
          <p className="text-xl font-semibold text-green-700">
            Your score: {score.score} / {score.total}
          </p>
          {passed && (
            <>
              <div ref={certificateRef} className="p-6 mt-4 bg-white rounded-lg shadow-md border text-center">
                <h2 className="text-2xl font-bold text-blue-600 mb-2">Certificate of Completion</h2>
                <p className="text-lg">This certifies that</p>
                <p className="text-xl font-semibold text-gray-800">{userName}</p>
                <p className="text-lg">has successfully completed the course</p>
                <p className="text-xl font-semibold text-gray-800">{courseName}</p>
                <p className="mt-4 text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
              </div>
              <button
                onClick={handleDownloadCertificate}
                className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-200 mt-6"
              >
                Download Certificate
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
