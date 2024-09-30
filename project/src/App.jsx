
import './App.css'
import Exceldata from './components/Excel_read_Admin'
import { Route ,Routes} from 'react-router';
import Courses from './components/Learning/Courses';
import Detailed_course from'./components/Learning/Detailed_course';
// import Compiler from '../src/components/compiler/src/components/CodeEditor.jsx'
import Compiler from './components/Learning/Compiler'

function App() {

  return (
    <>
      <div>
      <Routes>
        <Route path='/' element={<Exceldata />} />
        <Route path='/courses' element={<Courses />} />
        <Route path='/courses/reco/:id' element={<Detailed_course/>} />
        <Route path='/courses/detailed_course/:id' element={<Detailed_course/>} />
        {/* <Route path='/compiler' element={<Compiler/>} /> */}
        <Route path='/compiler' element={<Compiler/>} />

      </Routes>
      </div>
      
    </>
  )
}

export default App
