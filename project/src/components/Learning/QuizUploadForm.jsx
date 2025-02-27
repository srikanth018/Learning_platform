import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import Header from "../Header";
import Sidebar from "../Sidebar";

function QuizUploadForm() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      answer: "",
      selectedCourse: "",
    },
  ]);

  useEffect(() => {
    axios
      .get("/api/courses_list_quizz")
      .then((response) => {
        if (Array.isArray(response.data)) {
          const sample = response.data.slice(0, 21);
          setCourses(
            sample.map((course) => ({
              label: course.course_name,
              value: course.course_id,
            }))
          );
        } else {
          console.error("Expected an array but received:", response.data);
          setCourses([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setCourses([]);
      });
  }, []);

  const handleCourseChange = (selectedOption) => {
    setSelectedCourse(selectedOption ? selectedOption.value : "");
  };

  const handleInputChange = (index, field, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) =>
        i === index
          ? { ...q, [field]: value, selectedCourse: selectedCourse }
          : q
      )
    );
  };

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        answer: "",
        selectedCourse: selectedCourse,
      },
    ]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare quizData from questions
    const quizData = questions.map((question) => ({
        course_id: selectedCourse,
        question_text: question.question,
        options: [
            { option_text: question.optionA, option_label: 'A' },
            { option_text: question.optionB, option_label: 'B' },
            { option_text: question.optionC, option_label: 'C' },
            { option_text: question.optionD, option_label: 'D' },
        ],
        correct_answer: question.answer,
    }));

    console.log('Quiz Data:', quizData);  // Log quizData to verify its structure

    try {
        const response = await axios.post('/api/submit_quiz', quizData);
        console.log('Quiz submitted successfully:', response.data);
    } catch (error) {
        console.error('Error submitting quiz:', error.response ? error.response.data : error.message);
    }
};



  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  return (
    <div
      className={`min-h-screen w-full flex ${
        theme === "light" ? "bg-gray-100" : "bg-gray-900"
      }`}
    >
      <Sidebar theme={theme} />
      <div className="flex-1 flex flex-col">
        <Header theme={theme} dark={setTheme} />
        <div className="p-5 shadow-xl rounded-lg mx-5 my-10 lg:mx-10 mb-10 lg:mb-20 bg-white">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Upload Quiz Questions
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="py-4">
              <label className="block text-base font-bold text-gray-700 mb-2">
                Select Course
              </label>
              <Select
                options={courses}
                value={courses.find(
                  (course) => course.value === selectedCourse
                )}
                onChange={handleCourseChange}
                className="w-full text-gray-700"
                placeholder="Select a course"
                isClearable
              />
            </div>

            {questions.map((q, index) => (
              <div key={index} className="mb-8 border-b pb-4">
                <div className="py-4">
                  <label className="block text-base font-bold text-gray-700 mb-2">
                    Question {index + 1}
                  </label>
                  <textarea
                    value={q.question}
                    onChange={(e) =>
                      handleInputChange(index, "question", e.target.value)
                    }
                    className="w-full border rounded py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none"
                    placeholder="Enter your question"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">
                  {["A", "B", "C", "D"].map((option) => (
                    <div key={option}>
                      <label className="block text-base font-bold text-gray-700 mb-2">
                        Option {option}
                      </label>
                      <input
                        type="text"
                        value={q[`option${option}`]}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            `option${option}`,
                            e.target.value
                          )
                        }
                        className="w-full border rounded py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none"
                        placeholder={`Enter option ${option}`}
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="py-4">
                  <label className="block text-base font-bold text-gray-700 mb-2">
                    Correct Answer
                  </label>
                  <select
                    name={`answer-${index}`}
                    value={q.answer}
                    onChange={(e) =>
                      handleInputChange(index, "answer", e.target.value)
                    }
                    className="w-full border rounded py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none"
                    required
                  >
                    <option value="">Select the correct answer</option>
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addNewQuestion}
              className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 focus:outline-none"
            >
              Add New Question
            </button>

            <button
              type="submit"
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              Submit All Questions
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default QuizUploadForm;
