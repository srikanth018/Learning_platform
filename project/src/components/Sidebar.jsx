import { useState, useEffect } from 'react';
import { GrProjects } from "react-icons/gr";
import { ImHome } from 'react-icons/im';
import { BsGear, BsListTask, BsEye, BsPlusCircleDotted } from 'react-icons/bs';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoStop } from "react-icons/go";
import { CgIfDesign } from "react-icons/cg";
import { RiFolderReceivedLine } from "react-icons/ri";
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { MdDriveFolderUpload } from "react-icons/md";
import { MdSchedule } from 'react-icons/md';

function Sidebar({ theme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [spin, setSpin] = useState(false);
  const [active, setActive] = useState('home');
  const [taskExpanded, setTaskExpanded] = useState(false);
  const [activeSubTask, setActiveSubTask] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  const [role, setRole] = useState('');
  
  


  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActive('home');
      setActiveSubTask('');
    } else if (path === '/courses') {
      setActive('courses');
      setActiveSubTask('');
    }else if (path === '/compiler') {
      setActive('compiler');
      setActiveSubTask('');
    } else if (path === '/bot') {
      setActive('bot');
      setActiveSubTask('');
    } else if (path === '/pdfreader') {
      setActive('pdfreader');
      setActiveSubTask('');
    }
    else if (path === '/settings') {
      setActive('settings');
      setActiveSubTask('');
    } 
    
  }, [location.pathname]);


  useEffect(()=>{
    const roles = localStorage.getItem('role')
    setRole(roles);
    console.log(role);
  },[role])

  const handleNavigation = (path, name) => {
    if (name !== 'task') {
      setTaskExpanded(false);
      setActiveSubTask('');
    }
    setSpin(true);
    navigate(path);
    setSpin(false);
    setIsMobileMenuOpen(false); 
  };



  const getActiveClass = (name) => {
    if (active === name) {
      return theme === 'light' ? 'bg-slate-200' : 'bg-gray-800';
    }
    return '';
  };


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 z-50 p-4">
        <button onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </button>
      </div>



      <aside className={`hidden md:block w-48 border-r h-full ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-gray-700 border-slate-400 '}`}>
        <div className="p-4 px-6">
          <h1 className={`text-xl font-thin ${theme === 'light' ? 'text-slate-800' : 'text-slate-400'}`}>
            <span className={`eb-garamond-normal font-bold ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-300'} text-3xl`}>Learn</span>
            <span className='text-lg font-semibold'>Globs</span>
          </h1>
        </div>
        <nav className="mt-5">
        <nav className="mt-5">
        {<a
            href="#"
            className={`block py-2 px-4 rounded transition duration-200 ${getActiveClass('home')} ${theme === 'light' ? 'text-black hover:bg-slate-100 hover:text-gray-600' : ' text-slate-300 hover:bg-gray-900'}`}
            onClick={() => handleNavigation('/', 'home')}
          >
            <div className='flex flex-row p-2'>
              <div className='mt-1 px-2'>
                <ImHome />
              </div>
              Home
            </div>
          </a>}
          


          <a
            href="#"
            className={`block py-2 px-4 rounded transition duration-200 ${getActiveClass('courses')} ${theme === 'light' ? 'text-black hover:bg-slate-100 hover:text-gray-600' : ' text-slate-300 hover:bg-gray-900'}`}
            onClick={() => handleNavigation('/courses', 'courses')}
          >
            <div className='flex flex-row p-2'>
              <div className='mt-1 px-2'>
                <GrProjects />
              </div>
              Courses
            </div>
          </a>

          <a
            href="#"
            className={`block py-2 px-4 rounded transition duration-200 ${getActiveClass('compiler')} ${theme === 'light' ? 'text-black hover:bg-slate-100 hover:text-gray-600' : ' text-slate-300 hover:bg-gray-900'}`}
            onClick={() => handleNavigation('/compiler', 'compiler')}
          >
            <div className='flex flex-row p-2'>
              <div className='mt-1 px-2'>
                <ImHome />
              </div>
              Compiler
            </div>
          </a>

          <a
            href="#"
            className={`block py-2 px-4 rounded transition duration-200 ${getActiveClass('bot')} ${theme === 'light' ? 'text-black hover:bg-slate-100 hover:text-gray-600' : ' text-slate-300 hover:bg-gray-900'}`}
            onClick={() => handleNavigation('/bot', 'bot')}
          >
            <div className='flex flex-row p-2'>
              <div className='mt-1 px-2'>
                <ImHome />
              </div>
              AI Chatbot
            </div>
          </a>

          <a
            href="#"
            className={`block py-2 px-4 rounded transition duration-200 ${getActiveClass('pdfreader')} ${theme === 'light' ? 'text-black hover:bg-slate-100 hover:text-gray-600' : ' text-slate-300 hover:bg-gray-900'}`}
            onClick={() => handleNavigation('/pdfreader', 'pdfreader')}
          >
            <div className='flex flex-row p-2'>
              <div className='mt-1 px-2'>
                <GrProjects />
              </div>
              PDF Reader
            </div>
          </a>


          {<a
            href="#"
            className={`block py-2 px-4 rounded transition duration-200 ${getActiveClass('settings')} ${theme === 'light' ? 'text-black hover:bg-slate-100 hover:text-gray-600' : ' text-slate-300 hover:bg-gray-900'}`}
            onClick={() => handleNavigation('/settings', 'settings')}
          >
            <div className='flex flex-row p-2'>
              <div className='mt-1 px-2'>
                <BsGear />
              </div>
              Settings
            </div>
          </a>}
        </nav>

        </nav>
      </aside>
    </div>
  );
}

export default Sidebar;
