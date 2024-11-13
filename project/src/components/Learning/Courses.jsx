import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { useNavigate } from "react-router-dom";

function Courses() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [search, setSearch] = useState("");
  const [overAllData, setoverAllData] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const userId = localStorage.getItem("userID");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUploads();
    fetchEnrolledCourses();
  }, []);

  const fetchUploads = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses_list");
      const filteredData = response.data.slice(0, 21);
      setoverAllData(filteredData);
    } catch (error) {
      console.error("Error fetching uploads:", error);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/enrolled_courses/${userId}`);
      const enrolledCourseIds = response.data.map((course) => course.course_id);
      setEnrolledCourses(enrolledCourseIds);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    }
  };

  const handleEnroll = (course_id) => {
    if (enrolledCourses.includes(course_id)) {
      // Navigate to Start_course page if already enrolled
      navigate(`/start_course/${course_id}`);
    } else {
      // Navigate to detailed_course page if not enrolled
      navigate(`/courses/detailed_course/${course_id}`, {
        state: { course_id },
      });
    }
  };

  return (
    <div className={`min-h-screen w-full flex ${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}>
      <Sidebar theme={theme} />
      <div className="flex-1 flex flex-col">
        <Header onSearch={setSearch} theme={theme} dark={setTheme} />
        <h1 className="font-bold text-xl mx-4 mt-4">Courses Overview</h1>
        <div className="grid grid-cols-4 gap-4 m-6">
          {overAllData.map((course) => (
            <div key={course.course_id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-10">
              <a href="#">
                <img className="rounded-t-lg w-full h-64" src={course.image_url} alt={course.course_name} />
              </a>
              <div className="p-5">
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {course.course_id} - {" "}{course.course_name}
                  </h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {course.course_description}
                </p>
                <button
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium text-center ${
                    enrolledCourses.includes(course.course_id)
                      ? "bg-blue-200 border-blue-500 text-blue-800 hover:bg-blue-300"
                      : "bg-green-200 border-green-500 text-green-800 hover:bg-green-300"
                  } border-2 rounded-lg focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800`}
                  onClick={() => handleEnroll(course.course_id)}
                >
                  {enrolledCourses.includes(course.course_id) ? "Continue Learning" : "Enroll"}
                  <svg
                    className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none" 
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Courses;
