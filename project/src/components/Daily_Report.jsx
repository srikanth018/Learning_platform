import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Daily_Report() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [search, setSearch] = useState("");
  const [pendingData, setPendingData] = useState([]);
  const [departmentMappings, setDepartmentMappings] = useState({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  
    Promise.all([
      fetch("http://localhost:8081/department-mappings").then((response) =>
        response.json()
      ),
      fetch("http://localhost:8081/pending_data").then((response) =>
        response.json()
      ),
    ])
      .then(([deptMappings, pending]) => {
        console.log("Pending data:", pending); // Log the response to check its structure
  
        const normalizedMappings = Object.entries(deptMappings).reduce(
          (acc, [key, value]) => {
            if (value.to) {
              value.to.forEach((dept) => {
                acc[dept] = key;
              });
            }
            return acc;
          },
          {}
        );
  
        setDepartmentMappings(normalizedMappings);
        setPendingData(Array.isArray(pending) ? pending : []); // Ensure pending is an array
        setIsDataLoaded(true);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [theme]);
  

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date.getFullYear() > 1900;
  };

  const filteredPendingData = pendingData.filter((item) =>
    isValidDate(item.RECVDATE1)
  );

  const getDaysRange = (recvdate1) => {
    const today = new Date();
    const recvDate = new Date(recvdate1);
    const diffTime = today - recvDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 10) return "1 to 10";
    if (diffDays <= 15) return "11 to 15";
    if (diffDays <= 20) return "16 to 20";
    if (diffDays <= 25) return "21 to 25";
    if (diffDays <= 50) return "25 to 50";
    if (diffDays <= 100) return "51 to 100";
    if (diffDays <= 150) return "101 to 150";
    if (diffDays <= 200) return "151 to 200";
    return "200+";
  };

  const groupedData = filteredPendingData.reduce((acc, item) => {
    const range = getDaysRange(item.RECVDATE1);
    const toDept = item.TODEPT;
    const departmentName = departmentMappings[toDept] || "Unknown";

    if (!acc[departmentName]) {
      acc[departmentName] = {
        "1 to 10": 0,
        "11 to 15": 0,
        "16 to 20": 0,
        "21 to 25": 0,
        "25 to 50": 0,
        "51 to 100": 0,
        "101 to 150": 0,
        "151 to 200": 0,
        "200+": 0,
      };
    }

    acc[departmentName][range] += 1;
    return acc;
  }, {});

  const filteredGroupedData = Object.keys(groupedData)
    .filter((dept) => dept !== "Unknown")
    .reduce((acc, dept) => {
      acc[dept] = groupedData[dept];
      return acc;
    }, {});

  const searchLower = search.toLowerCase();
  const searchedGroupedData = Object.keys(filteredGroupedData)
    .filter((dept) => dept.toLowerCase().includes(searchLower))
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc, dept) => {
      acc[dept] = filteredGroupedData[dept];
      return acc;
    }, {});

  const allRanges = [
    "1 to 10",
    "11 to 15",
    "16 to 20",
    "21 to 25",
    "25 to 50",
    "51 to 100",
    "101 to 150",
    "151 to 200",
    "200+",
  ];

  return (
    <div
      className={`min-h-screen flex ${
        theme === "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-800 text-gray-100"
      }`}
    >
      <Sidebar theme={theme} />
      <div className="flex-1 flex flex-col">
        <Header onSearch={setSearch} theme={theme} dark={setTheme} />
        <main className="flex-1 p-6 overflow-y-auto">
          {!isDataLoaded ? (
            <div className="text-center text-lg font-semibold">
              <div
                className={`border fixed shadow rounded-md p-4 max-w-full min-h-full inset-0 z-50 w-full md:w-[90%]  ml-0 md:ml-52 mx-auto ${
                  theme === "dark"
                    ? "bg-gray-900 border-gray-800 "
                    : "bg-white border-gray-200"
                } sm:ml-0`}
              >
                <div className="animate-pulse flex space-x-4 mt-16">
                  <div className={`rounded-fullh-10 w-10`}></div>
                  <div className="flex-1 space-y-6 py-10 md:py-1">
                    <div
                      className={`h-2 w-[90%] ${
                        theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                      } rounded`}
                    ></div>
                    <div className="space-y-5 md:space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div
                          className={`h-2 ${
                            theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                          } rounded col-span-2`}
                        ></div>
                        <div
                          className={`h-2 w-[70%] ${
                            theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                          } rounded col-span-1`}
                        ></div>
                      </div>
                      <div
                        className={`h-2 w-[90%] ${
                          theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                        } rounded`}
                      ></div>
                      <div
                        className={`h-2 w-[90%] ${
                          theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                        } rounded`}
                      ></div>
                      <div
                        className={`h-2 w-[90%] ${
                          theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                        } rounded`}
                      ></div>
                      <div
                        className={`h-2 w-[90%] ${
                          theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                        } rounded`}
                      ></div>
                      <div className="grid grid-cols-3 gap-4">
                        <div
                          className={`h-2 ${
                            theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                          } rounded`}
                        ></div>
                        <div
                          className={`h-2  ${
                            theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                          } rounded`}
                        ></div>
                      </div>

                      <div
                        className={`h-2 w-[90%] ${
                          theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                        } rounded`}
                      ></div>
                      <div
                        className={`h-2 w-[90%] ${
                          theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                        } rounded`}
                      ></div>
                      <div
                        className={`h-2 w-[90%] ${
                          theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                        } rounded`}
                      ></div>
                      <div className="grid grid-cols-3 gap-4">
                        <div
                          className={`h-2  ${
                            theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                          } rounded`}
                        ></div>
                        <div
                          className={`h-2 ${
                            theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                          } rounded`}
                        ></div>
                      </div>
                      <div
                        className={`h-2 w-[90%] ${
                          theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                        } rounded`}
                      ></div>
                      <div
                        className={`h-2 w-[90%] ${
                          theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                        } rounded`}
                      ></div>
                      <div
                        className={`h-2 w-[90%] ${
                          theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                        } rounded`}
                      ></div>
                      <div
                        className={`h-2 w-[90%] ${
                          theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                        } rounded`}
                      ></div>
                      <div
                        className={`h-2 w-[90%] ${
                          theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                        } rounded`}
                      ></div>
                      <div className="grid grid-cols-3 gap-4">
                        <div
                          className={`h-2 ${
                            theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                          } rounded`}
                        ></div>
                        <div
                          className={`h-2  ${
                            theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                          } rounded`}
                        ></div>
                      </div>
                      <div
                        className={`h-2 w-[90%] ${
                          theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                        } rounded`}
                      ></div>
                      <div
                        className={`h-2 w-[90%] ${
                          theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                        } rounded`}
                      ></div>
                      <div
                        className={`h-2 w-[90%] ${
                          theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                        } rounded`}
                      ></div>
                      <div
                        className={`h-2 w-[90%] ${
                          theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                        } rounded`}
                      ></div>
                      <div className="grid grid-cols-3 gap-4">
                        <div
                          className={`h-2 ${
                            theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                          } rounded`}
                        ></div>
                        <div
                          className={`h-2  ${
                            theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                          } rounded`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead
                    className={` ${
                      theme === "light"
                        ? "bg-gray-200 text-gray-800"
                        : "bg-gray-700 text-gray-200"
                    }`}
                  >
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
                      >
                        Department
                      </th>
                      {allRanges.map((range) => (
                        <th
                          key={range}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
                        >
                          {range}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody
                    className={` ${
                      theme === "light"
                        ? "bg-white divide-gray-200 text-gray-900"
                        : "bg-gray-700 divide-gray-600"
                    } divide-y`}
                  >
                    {Object.keys(searchedGroupedData).length > 0 ? (
                      Object.entries(searchedGroupedData).map(
                        ([department, data], index) => (
                          <tr
                            key={department}
                            className={`${
                              index % 2 === 0
                                ? theme === "light"
                                  ? "bg-gray-100"
                                  : "bg-gray-600"
                                : theme === "light"
                                ? "bg-white"
                                : "bg-gray-700"
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {department}
                            </td>
                            {allRanges.map((range) => (
                              <td
                                key={range}
                                className="px-6 py-4 whitespace-nowrap text-sm"
                              >
                                {data[range] || 0}
                              </td>
                            ))}
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan={allRanges.length + 1}
                          className="px-6 py-4 text-center"
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Daily_Report;
