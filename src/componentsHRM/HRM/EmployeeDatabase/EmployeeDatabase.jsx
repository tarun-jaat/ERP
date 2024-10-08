import React, { useState, useEffect } from "react"; // Added useEffect import
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineDateRange,
} from "react-icons/md";
import { Link } from "react-router-dom";

function EmployeeDatabase() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await fetch(
          "https://erp-backend-o5i3.onrender.com/api/employee/getEmployee"
        );
        const data = await response.json();
        setStaffData(data);
      } catch (error) {
        console.error("Error fetching staff data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = staffData.slice(indexOfFirstEntry, indexOfLastEntry);

  const handleSelectRow = (index) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const totalPages = Math.ceil(staffData.length / entriesPerPage);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Format the date to a readable format
  };

  return (
    <div className="w-full flex flex-col p-7">
      <div className="flex justify-between">
        <p className="font-serif font-semibold text-gray-700 text-xl">
          / Employee Database
        </p>
        <Link to="/hrm/add-employee">
          <button className="p-2 bg-cyan-500 text-white rounded-md">
            Add New Employee
          </button>
        </Link>
      </div>
      <div className="flex flex-row justify-between items-center mt-5">
        <p className="text-xl font-bold">All Employees</p>
        <div className="flex flex-row items-center gap-5">
          <button className="w-16 h-10 bg-cyan-500 text-white rounded-md">
            Filter
          </button>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-400">
              <IoIosSearch size={24} />
            </span>
            <input
              type="text"
              placeholder="Search or type a command (CTRL+G)"
              className="pl-10 pr-4 py-2 w-80 bg-white rounded-full focus:outline-none"
            />
          </div>
          <div className="relative">
            <button onClick={toggleMenu} className="text-gray-500">
              <HiOutlineDotsVertical size={24} color="black" />
            </button>

            {isMenuOpen && (
              <div className="absolute left-5 w-40 bg-white rounded-md shadow-lg z-10">
                <ul className="py-1">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                    Edit
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                    Delete
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                    Alter
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700 font-semibold">
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2 text-sm">S/N</th>
              <th className="px-4 py-2 text-sm">First Name</th>
              <th className="px-4 py-2 text-sm">Last Name</th>
              <th className="px-4 py-2 text-sm">Gender</th>
              <th className="px-4 py-2 text-sm">Employee ID</th>
              <th className="px-4 py-2 text-sm">Phone Number</th>
              <th className="px-4 py-2 text-sm">Role</th>
              <th className="px-4 py-2 text-sm">Designation</th>
              <th className="px-4 py-2 text-sm">Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((employee, index) => (
              <tr
                key={indexOfFirstEntry + index}
                className="text-gray-700 hover:bg-gray-50"
              >
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(indexOfFirstEntry + index)}
                    onChange={() => handleSelectRow(indexOfFirstEntry + index)}
                  />
                </td>
                <td className="px-4 py-2">{indexOfFirstEntry + index + 1}</td>
                <td className="px-4 py-2">{employee.firstName}</td>
                <td className="px-4 py-2">{employee.lastName}</td>
                <td className="px-4 py-2">
                  {employee.gender
                    ? employee.gender.charAt(0).toUpperCase() +
                      employee.gender.slice(1)
                    : "N/A"}
                </td>
                <td className="px-4 py-2">{employee.employeeID}</td>
                <td className="px-4 py-2">{employee.phone}</td>
                <td className="px-4 py-2">
                  {employee.role
                    ? employee.role.charAt(0).toUpperCase() +
                      employee.role.slice(1)
                    : "N/A"}
                </td>
                <td className="px-4 py-2">
                  {employee.position
                    ? employee.position.charAt(0).toUpperCase() +
                      employee.position.slice(1)
                    : "N/A"}
                </td>
                <td className="px-4 py-2 flex flex-row items-center gap-4">
                  {formatDate(employee.joinedDate)} <MdOutlineDateRange />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-around items-center mt-5 absolute bottom-10 w-[70%]">
          {/* <div className="flex items-center gap-2">
            <p className="text-sm">
              Showing{" "}
              <span className="font-semibold">{indexOfFirstEntry + 1}</span> to{" "}
              <span className="font-semibold">
                {Math.min(indexOfLastEntry, staffData.length)}
              </span>{" "}
              of <span className="font-semibold">{staffData.length}</span>{" "}
              entries
            </p>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="p-2 bg-white border rounded text-sm"
            >
              <option value={5}>5/page</option>
              <option value={10}>10/page</option>
              <option value={20}>20/page</option>
            </select>
          </div> */}
          <div className="flex gap-2 items-center">
            <MdKeyboardArrowLeft />
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`h-8 w-8 items-center justify-center rounded-md ${
                  currentPage === i + 1 ? "bg-gray-400" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
            <MdKeyboardArrowRight />
            <div className="flex items-center gap-5 text-sm">
              <p>Go to Page</p>
              <div className="bg-white items-center flex justify-center h-8 w-8 rounded-sm">
                <p>2</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDatabase;
