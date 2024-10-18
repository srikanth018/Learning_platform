import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <div className="bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100 min-h-screen">
        {/* Header Section */}
        <header className="bg-white shadow-md">
          <div className="container mx-auto flex justify-between items-center py-4 px-6">
            <div className="text-2xl font-bold text-purple-600">
              <h1 className="text-3xl font-bold text-indigo-600">Learn<span className='text-lg font-semibold text-slate-800'>Globs</span></h1>
            </div>

            <div className="flex space-x-4">
              <Link to="/login" className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition duration-300">Log In</Link>
              <Link to="/register" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300">Register</Link>
            </div>
          </div>
        </header>

        {/* Main Hero Section */}
        <main className="container mx-auto mt-12 px-6 flex flex-col justify-center items-center text-center min-h-screen">
          <h1 className="text-6xl font-bold text-gray-800 leading-tight">
            Develop Your Skills in a <span className="text-purple-600">New and Unique Way</span>
          </h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
            Discover an innovative approach to online learning. Unleash your potential with our curated courses and industry experts.
          </p>
          <Link to="/courses" className="mt-8 px-8 py-4 bg-purple-600 text-white rounded-lg text-xl hover:bg-purple-700 transition duration-300">
            Browse Courses
          </Link>

          {/* <img src="https://img.freepik.com/premium-vector/overwork-overload-work-make-employee-exhausted_1134986-7948.jpg?w=740" alt="Learning Hero" className="mt-12 w-full max-w-lg" /> */}

        </main>

        {/* Benefits Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800">Why Learn with Us?</h2>
            <p className="text-gray-500 mt-4">We offer a personalized learning experience tailored to your needs.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="p-6 bg-purple-50 rounded-lg">
                <h3 className="text-2xl font-semibold text-purple-600">Expert Instructors</h3>
                <p className="text-gray-500 mt-2">Learn from industry leaders and certified instructors.</p>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg">
                <h3 className="text-2xl font-semibold text-purple-600">Hands-On Learning</h3>
                <p className="text-gray-500 mt-2">Engage in interactive projects and real-world exercises.</p>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg">
                <h3 className="text-2xl font-semibold text-purple-600">Flexible Scheduling</h3>
                <p className="text-gray-500 mt-2">Access courses anytime, anywhere, and at your own pace.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-gradient-to-r from-purple-100 to-pink-100 py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800">What Our Students Say</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white shadow-md p-6 rounded-lg">
                <p className="text-gray-500">"LearnGlobs has transformed the way I learn. The courses are in-depth and easy to follow!"</p>
                <h3 className="mt-4 text-purple-600 font-bold">- Alex R.</h3>
              </div>
              <div className="bg-white shadow-md p-6 rounded-lg">
                <p className="text-gray-500">"The hands-on approach helped me master new skills quickly. Highly recommend!"</p>
                <h3 className="mt-4 text-purple-600 font-bold">- Maria P.</h3>
              </div>
              <div className="bg-white shadow-md p-6 rounded-lg">
                <p className="text-gray-500">"Fantastic platform! The instructors are knowledgeable, and the courses are well-structured."</p>
                <h3 className="mt-4 text-purple-600 font-bold">- John D.</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section className="py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800">Featured Courses</h2>
            <p className="text-gray-500 mt-4">Explore our most popular courses across various fields.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <img src="/images/course1.jpg" alt="Course 1" className="w-full h-48 object-cover rounded-md" />
                <h3 className="mt-4 text-xl font-semibold text-purple-600">Web Development Bootcamp</h3>
                <p className="text-gray-500 mt-2">Master the latest web technologies with our expert-led bootcamp.</p>
                <Link to="/course/1" className="mt-4 inline-block text-purple-600 hover:underline">Learn More</Link>
              </div>
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <img src="/images/course2.jpg" alt="Course 2" className="w-full h-48 object-cover rounded-md" />
                <h3 className="mt-4 text-xl font-semibold text-purple-600">Data Science & Machine Learning</h3>
                <p className="text-gray-500 mt-2">Dive into the world of data with hands-on ML projects.</p>
                <Link to="/course/2" className="mt-4 inline-block text-purple-600 hover:underline">Learn More</Link>
              </div>
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <img src="/images/course3.jpg" alt="Course 3" className="w-full h-48 object-cover rounded-md" />
                <h3 className="mt-4 text-xl font-semibold text-purple-600">Cybersecurity Essentials</h3>
                <p className="text-gray-500 mt-2">Learn how to secure systems and protect data from cyber threats.</p>
                <Link to="/course/3" className="mt-4 inline-block text-purple-600 hover:underline">Learn More</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-purple-600 py-8">
          <div className="container mx-auto text-center text-white">
            <p>&copy; 2024 LearnGlobs. All Rights Reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
              <Link to="#" className="hover:underline">Privacy Policy</Link>
              <Link to="#" className="hover:underline">Terms of Service</Link>
              <Link to="#" className="hover:underline">Contact Us</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Home;
