import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { FaBook, FaCheckCircle, FaChartLine } from 'react-icons/fa'; // Import icons
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Sidebar from '../Sidebar';
import Header from '../Header';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [courseCount, setCourseCount] = useState(0);

  const userId = localStorage.getItem('userID');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [search, setSearch] = useState('');
  const [userName, setUserName] = useState('');
  useEffect(() => {
    axios.get(`http://localhost:5000/api/get-courses?userId=${userId}`)
      .then(response => {
        if (Array.isArray(response.data)) {
          setCourses(response.data);
          setCourseCount(response.data.length);
        } else {
          setCourses([]);
        }
      })
      .catch(error => {
        setCourses([]);
      });

      const users = axios.get(`http://localhost:5000/api/users`);
      users.then((response) => {
        const user = response.data.find((user) => user.user_id === userId);
        console.log(user);
        setUserName(user.username);
      });

  }, [userId]);

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
    <div className={`min-h-screen w-full flex ${theme === "light" ? "bg-gray-100" : "bg-gray-900"}`}>
      <Sidebar theme={theme} />
      <div className="flex-1 flex flex-col">
        <Header onSearch={setSearch} theme={theme} dark={setTheme} />
        <div className="p-6">
          <h1 className="text-3xl font-semibold text-blue-500"><span className='text-gray-500 text-xl'>Hey!!! </span>{userName} </h1>
          <p className='mb-6 text-gray-500'>Welcome's you Your Learning Dashboard</p>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-r from-gray-100 to-blue-300 p-6 rounded-lg shadow-lg text-white transform hover:scale-105 transition-transform flex gap-4 items-center justify-between border border-border-blue-600">
              
              <div>
              <h2 className="text-2xl font-semibold mb-2 text-blue-600">Total Registered Courses</h2>
              <p className="text-5xl font-bold text-indigo-600">{courseCount}</p>
              </div>
              <FaBook className="text-7xl" />
            </div>
            <div className="bg-gradient-to-r from-gray-100 to-blue-500 p-6 rounded-lg shadow-lg text-white transform hover:scale-105 transition-transform flex gap-4 items-center justify-between">
              
              <div >
              <h2 className="text-2xl font-semibold mb-2 text-blue-600">In Progress Courses</h2>
              <p className="text-5xl font-bold text-indigo-600">{Math.floor(Math.random() * courseCount)}</p>
              </div>
              <FaChartLine className="text-5xl mb-4" />
            </div>
            <div className="bg-gradient-to-r from-gray-100 to-green-500 p-6 rounded-lg shadow-lg text-white transform hover:scale-105 transition-transform flex gap-4 items-center justify-between">
              
              <div >
              <h2 className="text-2xl font-semibold mb-2 text-green-600">Completed Courses</h2>
              <p className="text-5xl font-bold text-green-600">{Math.floor(Math.random() * courseCount)}</p>
              </div>
              <FaCheckCircle className="text-5xl mb-4" />
            </div>
          </div>
          
          <div className='flex gap-6'>
            {/* Course Registration Graph */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Registered Courses Chart</h2>
              {/* {courses.length > 0 ? (
                <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
              ) : (
                <p>No courses to display in chart.</p>
              )} */}
            </div>

            {/* Courses Table */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Enrolled Courses</h2>
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
