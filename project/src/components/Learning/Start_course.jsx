import React, { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { FaFilePdf } from "react-icons/fa";

function Start_course() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [search, setSearch] = useState("");
  //   const { course_id } = useParams();
  const course_id = "C1";
  const [course, setCourse] = useState(null);
  const [courseModules, setCourseModules] = useState([]);

  const [activeIndex1, setActiveIndex1] = useState(null);

  const toggleAccordion1 = (index) => {
    setActiveIndex1(activeIndex1 === index ? null : index);
  };
  const [showPdf, setShowPdf] = useState(false);

  const handleShowPdf = () => {
    setShowPdf(!showPdf);
  };

  useEffect(() => {
    // Fetch the course by its ID
    fetch(`http://localhost:5000/api/courses_list/${course_id}`)
      .then((response) => response.json())
      .then((data) => {
        setCourse(data);
        // console.log("Course data:", data);
      })
      .catch((error) => console.error("Error fetching the course:", error));

    // Fetch the modules of the course
  }, [course_id]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/courses_modules/${course_id}`)
      .then((response) => response.json())
      .then((data) => {
        setCourseModules(data);
        // console.log("Course modules:", data); // Log modules to check if it's being fetched correctly
      })
      .catch((error) =>
        console.error("Error fetching the course modules:", error)
      );
  }, [course_id]);

  const extractYouTubeID = (url) => {
    const regExp =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);

    return match ? match[1] : null;
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  const videoID = extractYouTubeID(course.vdo_url);

  return (
    <>
      <div
        className={`min-h-screen w-full flex ${
          theme === "light" ? "bg-gray-100" : "bg-gray-800"
        }`}
      >
        <Sidebar theme={theme} />
        <div className="flex-1 flex flex-col">
          <Header onSearch={setSearch} theme={theme} dark={setTheme} />
          
          <div className="bg-white mx-10 p-4 m-10 border border-gray-300 rounded-3xl flex flex-col items-center">
            <h1 className="text-2xl text-blue-500 font-bold mb-4">
              {course.course_name}
            </h1>
            {videoID ? (
              <iframe
                className="h-96 aspect-video rounded-2xl border border-gray-300 p-4"
                src={`https://www.youtube.com/embed/${videoID}`}
                title={course.course_name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <p>Video unavailable or videoID is invalid</p>
            )}

          </div>
          <div
            className={`mx-8 my-2 mb-6 px-10 py-7 border rounded-3xl ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600 "
                : "bg-white border-gray-300 "
            } shadow-lg`}
          >
            <h1 className="text-2xl font-semibold pb-5">
                  Course <span className="text-blue-500">Modules</span>
            </h1>
            {courseModules.map((module, index) => {
              // Check if the index is divisible by 5
              if (index % 5 === 0) {
                return (
                  <div>
                    <div
                      key={module.id}
                      className={`mx-6 my-5 px-10 border rounded-lg ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-600 "
                          : "bg-white border-gray-300 "
                      } shadow-lg`}
                    >
                      {/* Display the title at index divisible by 5 */}
                      <div>
                        <button
                          onClick={() => toggleAccordion1(index)}
                          className={`w-full flex justify-between items-center py-5 ${
                            theme === "dark" ? "text-white" : "text-slate-800"
                          }`}
                        >
                          <span
                            className={`text-lg font-semibold ${
                              theme === "dark" ? "text-white" : "text-slate-800"
                            }`}
                          >
                            {module.modules} {/* Dynamic title from module */}
                          </span>
                          <span
                            className={`transition-transform duration-300 ${
                              theme === "dark" ? "text-white" : "text-slate-800"
                            }`}
                          >
                            {activeIndex1 === index ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                              </svg>
                            )}
                          </span>
                        </button>
                        <div
                          className={`${
                            activeIndex1 === index ? "max-h-screen" : "max-h-0"
                          } overflow-hidden transition-all duration-300 ease-in-out`}
                        >
                          <div
                            className={`pb-6 ${
                              theme === "dark" ? "text-white" : "text-gray-800"
                            }`}
                          >
                            <ul className="list-none ml-8">
                              {courseModules
                                .slice(index + 1, index + 5)
                                .map((nextModule) => (
                                  <li
                                    key={nextModule.id}
                                    className="flex items-center my-2 text-lg border-b border-slate-200 dark:border-slate-600 py-2 transition-transform duration-300 ease-in-out hover:translate-x-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-md"
                                  >
                                    <TiTick className="text-green-500 text-2xl mr-3" />
                                    <span className="text-slate-700 dark:text-slate-300">
                                      {nextModule.modules}
                                    </span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return null; // Return null for other indices
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Start_course;