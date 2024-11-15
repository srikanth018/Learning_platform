import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import axios from "axios";
function Dashboard() {
  const [productionData, setProductionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // const [pendingData, setPendingData] = useState([]);
  const [departmentData, setDepartmentData] = useState({});
  // const[avg_prod,setAvg_prod] = useState(0);
  const [pendingDepartmentData, setPendingDepartmentData] = useState({});
  const [viewData, setviewData] = useState(false);
  const [search, setSearch] = useState('');
  // const navigate = useNavigate(); 
  const [skeleton, setSkeleton] = useState(true);
  const[filter_on,setFilter_on] = useState(false);
  const[theme, setTheme] = useState(()=>{
    return localStorage.getItem('theme') || 'light';
  });
  const [sortConfig, setSortConfig] = useState({ key: 'Production Qty', direction: 'ascending' });

  const handleFilter = async (newFilter) => {
    setFilter_on(newFilter);  // Update the filter state
    
    // Apply filter to the data
    const filteredProductionData = productionData.filter(/* logic to filter productionData based on newFilter */);
    setFilteredData(filteredProductionData);
  };
  
  const handleDateRangeChange = async (fromDate, toDate) => {
    try {
      const response = await axios.get('http://localhost:8081/filtered_production_data', {
        params: {
          startDate: fromDate,
          endDate: toDate
        }
      });
      setFilteredData(response.data); // Update the filteredData state
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };
  
  useEffect(() => {
    fetch('http://localhost:8081/filtered_production_data')
      .then(response => response.json())
      .then(data => {
        const mappedData = {
          CAD: data.CAD?.total_qty || 0,
          PRBOM: data.PRBOM?.total_qty || 0,
          CAM: data.CAM?.total_qty || 0,
          MFD: data.MFD?.total_qty || 0,
          SFD: data.SFD?.total_qty || 0,
          DIE: data.DIE?.total_qty || 0,
          MP: data.MP?.total_qty || 0,
          WAX: data.WAX?.total_qty || 0,
          CAST: data.CAST?.total_qty || 0,
          SEP: data.SEP?.total_qty || 0,
          ASY: data.ASY?.total_qty || 0,
          BP: data.BP?.total_qty || 0,
          COR: data.COR?.total_qty || 0,
          SST: data.SST?.total_qty || 0,
          BUF: data.BUF?.total_qty || 0,
          TXT: data.TXT?.total_qty || 0,
          CORR: data.CORR?.total_qty || 0,
          SISM: data.SISM?.total_qty || 0,
          IND: data.IND?.total_qty || 0,
          MMD1: data.MMD1?.total_qty || 0,
          MMD2: data.MMD2?.total_qty || 0,
        };

        setProductionData(mappedData);
      })
      .catch(error => {
        console.error("Error fetching production data:", error);
      });
  }, []);

  
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  useEffect(() => {
    setSkeleton(true)
    fetch("http://localhost:8081/filtered_pending_data")
      
      .then((res) => res.json())
      .then((data) => {
        console.log("Pending Data:", data);
  
        if (typeof data === 'object' && !Array.isArray(data)) {
          const groupedPendingData = Object.keys(data).reduce((acc, dept) => {
            acc[dept] = data[dept].total_qty || 0; 
            return acc;
          }, {});
  
          setPendingDepartmentData(groupedPendingData);
          console.log("Grouped Pending Data:", groupedPendingData);
        } else {
          console.log("Pending Data is not in expected format or is empty:", data);
        }
      setSkeleton(false)

      })
      .catch((err) => console.log("Error fetching pending data:", err));
  }, []);
    
  const sortedData = () => {
    const sortableItems = Object.keys(productionData).map((dept) => ({
      dept,
      productionQty: productionData[dept],
      pendingQty: pendingDepartmentData[dept] || 0,
    }));
  
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  };
  
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  const renderTable = () => (
    <div className="flex justify-center items-center h-full">
      <div
        className={`p-2 rounded-lg shadow-md flex flex-col justify-center items-center m-0 w-[50%] 
          ${theme === 'light' ? 'bg-white text-gray-700' :' bg-gray-900 text-gray-300'}`}
      >
        <table
          className={`w-[100%] text-sm text-left 
            ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
        >
          <thead
            className={`text-base uppercase 
              ${theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-300'}`}
          >
            <tr>
              <th scope="col" className="px-2 py-3">Warehouse</th>
              <th scope="col" className="px-2 py-3 cursor-pointer" onClick={() => handleSort('productionQty')}>
                Production Qty
              </th>
              <th scope="col" className="px-2 py-3 cursor-pointer" onClick={() => handleSort('pendingQty')}>
                Pending Qty
              </th>
            </tr>
          </thead>
          <tbody>
  {sortedData()
    .filter((item) =>
      search.toLowerCase() === '' ? item.dept : item.dept.toLowerCase().includes(search.toLowerCase())
    )
    .map((item, index) => (
      <tr
        key={item.dept}
        className={`border-b border-solid 
          ${theme === 'light' ? (index % 2 === 0 ? 'bg-gray-200 text-gray-700 border-slate-200' : 'bg-white text-gray-700 border-slate-100') : 
          (index % 2 === 0 ? 'bg-gray-800 text-gray-300 border-slate-900' : 'bg-gray-900 text-gray-300 border-gray-500')}`}
      >
        <td className="px-6 py-3">{item.dept}</td>
        <td className="px-6 py-3">{item.productionQty}</td>
        <td className="px-6 py-3">{item.pendingQty}</td>
      </tr>
    ))}
</tbody>

        </table>
      </div>
    </div>
  );
  const renderCards = () => {
    const departments = Object.keys(productionData).filter((dept) =>
      search.toLowerCase() === '' ? dept : dept.toLowerCase().includes(search.toLowerCase())
    );
      
  
    return departments.map((dept) => {
      const productionQty = productionData[dept];
      const pendingQty = pendingDepartmentData[dept] || 0;
      const avgProduction = productionQty > 0
      ? (((productionQty + pendingQty) / productionQty) * 1).toFixed(1)
      : 'N/A'; 
      const Target = 100;
      const efficiency = ((productionQty / Target)).toFixed(2);  
      return (
        <div key={dept} className={`p-4 rounded-lg shadow-md flex flex-col justify-between 
          ${theme === 'light' ? 'bg-white' : 'bg-slate-600'}`} 
          style={{ minWidth: "150px", minHeight: "180px" }}
        >
          <h2 className={`font-bold text-lg uppercase text-center rounded-md shadow-md 
            ${theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-slate-900 text-gray-100'}`}>
            {dept}
          </h2>
          
          <div className="flex mt-3 space-x-2 justify-between">
            <Link to={`/department/${dept}/production`} className="w-1/2">
              <div className={`rounded-lg shadow-md  border-solid border  w-[100%] mr-1 hover:scale-95
                ${theme === 'light'
                  ? 'bg-[#c1fbce92] border-[rgba(0,255,55,0.62)]'
                  : 'bg-gray-800 border-[#0e902a] text-green-300 shadow-xl shadow-gray-700 hover:shadow-none'}`}>
                <p className="font-normal text-sm text-center p-2">
                  Production: <span className="font-bold">{productionQty}</span>
                </p>
              </div>
            </Link>
            <Link to={`/department/${dept}/pending`} className="w-1/2">
              <div className={`rounded-lg shadow-md border-solid border  w-[100%] ml-1 hover:scale-95
                ${theme === 'light'
                  ? 'bg-[#feffd1] border-[#e5ff00]'
                  : 'bg-gray-800 border-[#7d8808] text-amber-300 shadow-xl shadow-gray-700 hover:shadow-none'}`}>
                <p className="font-normal text-sm text-center p-2">
                  Pending: <span className="font-bold">{pendingQty}</span>
                </p>
              </div>
            </Link>
          </div>
  
          <div className="flex justify-between mt-3">
            <div className={`rounded-lg shadow-md  border-solid border  w-[80%] mr-1 h-7
              ${theme === 'light'
                ? 'bg-[#fbc6c191] border-[#ff00009e]'
                : 'bg-gray-800 border-[#7a0e0e] text-red-300'}
              `}>
              <p className="font-normal text-sm text-center py-1">
                Target: <span className="font-bold">100</span>
              </p>
            </div>
            <div className={`rounded-lg shadow-md  border-solid border  w-[80%] ml-1 h-7
              ${theme === 'light'
                ? 'bg-cyan-50 border-cyan-500'
                : 'bg-gray-800 border-cyan-700 text-cyan-300'}
              `}>
              <p className="font-normal text-sm text-center p-1">
                Avg Prod: <span className="font-bold">{avgProduction}</span>
              </p>
            </div>
          </div>
  
          <div className="flex mt-3 justify-center">
            <div className={`rounded-lg shadow-md  border-solid border  w-full
              ${theme === 'light'
                ? 'bg-fuchsia-100 border-fuchsia-500'
                : 'bg-gray-800 border-fuchsia-700 text-fuchsia-300'}
              `}>
              <p className="font-normal text-sm text-center p-2">
                Efficiency: <span className="font-bold">{efficiency}</span>
              </p>
            </div>
          </div>
        </div>
      );
    });
  };
  

  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={` w-[100%] min-h-screen flex overflow-auto ${theme==='light'?'bg-gray-100 ':
    'bg-gray-800 '} `}>
      {/* Sidebar */}
    <Sidebar theme={theme} />
      {/* Main content */}
      <div className="flex-1 flex flex-col">
      <Header onSearch = {setSearch} onView = {setviewData} view = {viewData} theme = {theme} dark = {setTheme} on_filter = {setFilter_on} filter={filter_on} onDateRangeChange={handleDateRangeChange}/>
        <main className={`flex-1 px-4 overflow-y-auto ${filter_on===true?'opacity-10':'opacity-100'}`}>
        
          {/* Department Cards */}
          {/* <div className={`${viewData ? 'relative overflow-x-auto':'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2'}`}>
        {viewData
          ? renderTable(departmentData, pendingDepartmentData)
          : renderCards(departmentData, pendingDepartmentData)}
</div> */}

{/* ///////////////////////////////////////// */}


<div className="max-w-full">
  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
    Our service statistics
  </h2>
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mt-4">
    <div className="bg-white overflow-hidden shadow-lg border border-gray-200 sm:rounded-lg dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform transform hover:scale-105 duration-200">
      <div className="px-6 py-8 sm:p-10">
        <dl>
          <dt className="text-lg leading-5 font-medium text-gray-500 truncate dark:text-gray-400">Total Courses offered</dt>
          <dd className=" text-4xl leading-9 font-semibold text-indigo-600 dark:text-indigo-400 mt-4">100</dd>
        </dl>
      </div>
    </div>
    <div className="bg-white overflow-hidden shadow-lg border border-gray-200 sm:rounded-lg dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform transform hover:scale-105 duration-200">
      <div className="px-6 py-8 sm:p-10">
        <dl>
          <dt className="text-lg leading-5 font-medium text-gray-500 truncate dark:text-gray-400">Total Tutors</dt>
          <dd className=" text-4xl mt-4 leading-9 font-semibold text-indigo-600 dark:text-indigo-400">19</dd>
        </dl>
      </div>
    </div>
    <div className="bg-white overflow-hidden shadow-lg border border-gray-200 sm:rounded-lg dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform transform hover:scale-105 duration-200">
      <div className="px-6 py-8 sm:p-10">
        <dl>
          <dt className="text-lg leading-5 font-medium text-gray-500 truncate dark:text-gray-400">Enrolled Courses</dt>
          <dd className=" text-4xl mt-4 leading-9 font-semibold text-indigo-600 dark:text-indigo-400">71</dd>
        </dl>
      </div>
    </div>
    <div className="bg-white overflow-hidden shadow-lg border border-gray-200 sm:rounded-lg dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform transform hover:scale-105 duration-200">
      <div className="px-6 py-8 sm:p-10">
        <dl>
          <dt className="text-lg leading-5 font-medium text-gray-500 truncate dark:text-gray-400">Completed Courses</dt>
          <dd className=" text-4xl mt-4 leading-9 font-semibold text-indigo-600 dark:text-indigo-400">16</dd>
        </dl>
      </div>
    </div>
  </div>
</div>




<div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <a href="#">
        <img class="rounded-t-lg" src="https://imgs.search.brave.com/r5ocd6T0ptqpInOe1ZQuvqsnIyWMCZdBIAck-Sw3CH8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9ibG9n/LmxvZ3JvY2tldC5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjIvMDQvUHJvZ3Jl/c3NpdmUtaW1hZ2Ut/bG9hZGluZy1SZWFj/dC10dXRvcmlhbC5w/bmc" alt="" />
    </a>
    <div class="p-5">
        <a href="#">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technology acquisitions 2021</h5>
        </a>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
        <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Read more
             <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
        </a>
    </div>
</div>


    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {isPlaying ? (
        <div className="relative w-full h-0" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/NH6pOQpHvqE?autoplay=1"
            title="YouTube Video Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <button onClick={() => setIsPlaying(true)} className="w-full">
          <img
            className="w-full h-48 object-cover"
            src="https://img.youtube.com/vi/NH6pOQpHvqE/hqdefault.jpg"
            alt="YouTube Thumbnail"
          />
        </button>
      )}
      <div className="p-4">
        <h2 className="text-xl font-bold">YouTube Video Title</h2>
        <p className="mt-2 text-gray-600">This is a brief description of the video.</p>
        <a
          href="https://youtu.be/NH6pOQpHvqE?si=GItf8-Qm2tozRTLD"
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 bg-blue-500 text-white text-center py-2 rounded"
        >
          Watch on YouTube
        </a>
      </div>
    </div>
{/* ////////////////////////////////////////// */}
        </main>
      </div>

      {/* View Switcher */}
      
    </div>
  );
}

export default Dashboard;
