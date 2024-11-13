import { Route, Routes } from "react-router";
import "./App.css";
import Dashboard from "./components/Excel_read_Admin";
import Courses from "./components/Learning/Courses";
import Detailed_course from "./components/Learning/Detailed_course";
// import Compiler from '../src/components/compiler/src/components/CodeEditor.jsx'
import AiChatBot from "./components/Learning/AiChatBot";
import Compiler from "./components/Learning/Compiler";
import Dashboard_learner from "./components/Learning/Dashboard-learner";
import EnrollmentSuccessPage from "./components/Learning/EnrollmentSuccessPage";
import Home from "./components/Learning/Home";
import Pdf from "./components/Learning/PdfUploader ";
import Speech_Rego from "./components/Learning/Speech_Rego";
import Start_course from "./components/Learning/Start_course";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/student-dashboard"
            element={
              <PrivateRoute>
                <Dashboard_learner />
              </PrivateRoute>
            }
          />
          <Route
            path="/start_course/:course_id"
            element={
              <PrivateRoute>
                <Start_course />
              </PrivateRoute>
            }
          />
          <Route path="/speech" element={<Speech_Rego />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <PrivateRoute>
                <Courses />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses/detailed_course/:id"
            element={
              <PrivateRoute>
                <Detailed_course />
              </PrivateRoute>
            }
          />
          <Route
            path="/compiler"
            element={
              <PrivateRoute>
                <Compiler />
              </PrivateRoute>
            }
          />
          <Route
            path="/bot"
            element={
              <PrivateRoute>
                <AiChatBot />
              </PrivateRoute>
            }
          />
          <Route
            path="/pdfreader"
            element={
              <PrivateRoute>
                <Pdf />
              </PrivateRoute>
            }
          />
          <Route
            path="/enrollment-success"
            element={
              <PrivateRoute>
                <EnrollmentSuccessPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
