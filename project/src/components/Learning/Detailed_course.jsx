import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { useLocation } from "react-router-dom";
import { TiTick } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
const Detailed_course = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [search, setSearch] = useState("");
  const [overAllData, setOverAllData] = useState({});
  const location = useLocation();
  const { id } = useParams();

  const  course_id = id;

  const userId = localStorage.getItem("userID");

  const [instructor, setInstructor] = useState({});
  const [course_modules, setCourseModules] = useState([]);
  const [course_outcome, setCourseOutcome] = useState([]);
  const [recommended_courses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/courses_list");
      const userResponse = await axios.get("http://localhost:5000/api/users");
      const courseModulesRes = await axios.get("http://localhost:5000/api/course_modules");
      const courseOutcomeRes = await axios.get("http://localhost:5000/api/course_outcome");

      // const filteredCourseModulesRes = courseModulesRes.data.filter((module) => module.course_id === course_id);
      const filteredCourseOutcomeRes = courseOutcomeRes.data.filter((outcome) => outcome.course_id === course_id);
      const filteredCourseModulesRes = courseModulesRes.data.filter((course_outcome, index) => {
        return index % 5 === 0 && course_outcome.course_id === course_id;
      });
      

      setCourseModules(filteredCourseModulesRes);
      setCourseOutcome(filteredCourseOutcomeRes);

      const instructorData = userResponse.data.find((user) =>
        response.data.some((course) => course.course_id === course_id && course.instructor_id === user.user_id)
      );

      const correct = response.data.slice(0, 21);
      const shuffledCourses = correct.sort(() => 0.5 - Math.random());
      const validCount = Math.min(4, shuffledCourses.length);
      const recommended = shuffledCourses.slice(0, validCount);
      setRecommendedCourses(recommended);

      const data = response.data.find((course) => course.course_id === course_id);
      setOverAllData(data);
      setInstructor(instructorData);
    } catch (err) {
      setError("Error fetching data");
      console.error("Error fetching uploads:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async(course_id) => {
    try {
      // Assuming a backend API call to enroll the user
      await axios.post(`http://localhost:5000/enroll`, { userId, course_id });
  
      // Navigate to the success page
      navigate(`/enrollment-success`, {
        state: { 
          course_name: overAllData.course_name, 
          course_description: overAllData.course_description,
          course_id: course_id
        },
      });
    } catch (err) {
      console.error("Error enrolling in course:", err);
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={`min-h-screen w-full flex ${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}>
      <Sidebar theme={theme} />
      <div className="flex-1 flex flex-col">
        <Header onSearch={setSearch} theme={theme} dark={setTheme} />
        <div className="bg-gradient-to-t from-gray-100 via-gray-100 to-indigo-500 p-1 rounded-3xl">
          <div className="flex flex-col items-center p-8">
            <div className="max-w-4xl bg-white shadow-md rounded-lg p-6">
              <h1 className="text-5xl font-bold text-indigo-600">{overAllData.course_name}</h1>
              <p className="mt-4 text-gray-600">{overAllData.course_description}</p>
              <div className="flex items-center mt-4">
                <p>
                  Instructor: <span className="text-blue-600">{instructor.username} (LearnGlobs)</span>
                </p>
              </div>
              <div className="mt-6">
                <button className="py-3 px-6 w-full inline-flex items-center text-xl font-medium text-center bg-green-200 border-green-500 border-2 rounded-lg hover:bg-green-300 focus:ring-4 focus:outline-none focus:ring-green-300 text-green-800"
                onClick={()=>handleEnroll(course_id)}>
                  Enroll for Free
                  <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                  </svg>
                </button>
              </div>
              <p className="mt-4 text-gray-500">12 already enrolled</p>
              <div className="mt-6 grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="font-bold text-lg">9 course series</p>
                  <p className="text-sm text-gray-500">Earn a career credential</p>
                </div>
                <div>
                  <p className="font-bold text-lg">4.6 ★</p>
                  <p className="text-sm text-gray-500">92 reviews</p>
                </div>
                <div>
                  <p className="font-bold text-lg">Beginner level</p>
                  <p className="text-sm text-gray-500">Recommended experience</p>
                </div>
                <div>
                  <p className="font-bold text-lg">4 months</p>
                  <p className="text-sm text-gray-500">At 10 hours a week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-40 max-w-6xl bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="font-bold text-2xl">Course Outcomes:</h1>
          <ul className="list-none ml-8 mt-4">
            {course_outcome.map((outcome) => (
              <li key={outcome.course_outcome_id} className="flex items-center my-1 text-lg">
                <TiTick className="text-green-500 text-2xl mr-2" />
                {outcome.outcomes}
                
              </li>
            ))}
          </ul>
        </div>
        <div className="ml-40 max-w-6xl bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="font-bold text-2xl">Course Modules:</h1>
          <div className="flex justify-between">
            <ul className="list-none ml-8 mt-4">
              {course_modules.map((module) => (
                <li key={module.course_outcome_id} className="flex items-center my-1 text-lg">
                  <TiTick className="text-green-500 text-2xl mr-2" />
                  {module.modules}
                </li>
              ))}
            </ul>
            <img className="rounded-lg w-1/2 h-80" src={overAllData.image_url} alt={overAllData.course_name} />
          </div>
        </div>
        <h1 className="font-bold text-2xl ml-6">Users also visit</h1>
        <div className="grid grid-cols-4 gap-4 m-6">
          {recommended_courses.map((course) => course.course_id !== course_id && (
            <div key={course.course_id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-10">
              <a href="#">
                <img className="rounded-t-lg w-full h-64" src={course.image_url} alt={course.course_name} />
              </a>
              <div className="p-5">
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {course.course_id} - {course.course_name}
                  </h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{course.course_description}</p>
                <button
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center bg-green-200 border-green-500 border-2 rounded-lg hover:bg-green-300 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700"
                  // onClick={() => handleEnroll(course.course_id)}
                >
                  Enroll
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Detailed_course;
