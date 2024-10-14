import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const EnrollmentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { course_name, course_description, course_id } = location.state;

  const handleStartCourse = () => {
    navigate(`/courses/start/${course_id}`);
  };

  const handleBackToCourses = () => {
    navigate("/courses");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Enrollment Successful!</h1>
        <p className="text-xl text-gray-700 mb-6">
          You have successfully enrolled in <span className="font-bold">{course_name}</span>.
        </p>
        <p className="text-md text-gray-600 mb-4">{course_description}</p>
        <div className="flex justify-between space-x-4">
          <button
            onClick={handleStartCourse}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:ring focus:ring-indigo-300"
          >
            Start Course
          </button>
          <button
            onClick={handleBackToCourses}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 focus:ring focus:ring-gray-300"
          >
            Back to Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentSuccessPage;
