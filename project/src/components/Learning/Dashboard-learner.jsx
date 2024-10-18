import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [courseCount, setCourseCount] = useState(0);

  const userId = localStorage.getItem('userID');

  useEffect(() => {
    // Fetch enrolled courses
    axios.get(`http://localhost:5000/api/get-courses?userId=${userId}`)
      .then(response => {
        console.log('API Response:', response.data);  
        if (Array.isArray(response.data)) {
          setCourses(response.data);
          setCourseCount(response.data.length);
        } else {
          setCourses([]); 
        }
      })
      .catch(error => {
        console.error('Error fetching courses', error);
        setCourses([]); 
      });
  }, [userId]);

  // Chart data
  const chartData = {
    labels: courses.map((course) => course.course_name),
    datasets: [
      {
        label: 'Courses Registered',
        data: courses.map(() => 1),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Learner Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Total Registered Courses</h2>
          <p className="text-4xl font-bold">{courseCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Progress</h2>
          <p className="text-4xl font-bold">{Math.floor(Math.random() * 100)}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Completed Courses</h2>
          <p className="text-4xl font-bold">{Math.floor(Math.random() * courseCount)}</p>
        </div>
      </div>

      {/* Course Registration Graph */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Registered Courses Chart</h2>
        {courses.length > 0 ? (
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
        ) : (
          <p>No courses to display in chart.</p>
        )}
      </div>

      {/* Courses Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Enrolled Courses</h2>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Course Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Image</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <tr key={index} className="bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="border px-4 py-2">{course.course_name}</td>
                  <td className="border px-4 py-2">{course.course_description}</td>
                  <td className="border px-4 py-2">
                    <img src={course.image_url} alt={course.course_name} className="w-16 h-16 rounded-md transition-transform transform hover:scale-110" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">No registered courses yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
