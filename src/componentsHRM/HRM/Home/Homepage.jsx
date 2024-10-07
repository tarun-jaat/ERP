import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Dashboard from "../Dashboard/Dashboard";
import Jobposting from "../Recruitment/Jobposting";
import InterviewSchedul from "../Recruitment/InterviewSchedul";
import Onboarding from "../Recruitment/Onboarding";
import AddEmployee from "../EmployeeDatabase/AddEmployee";
import EmployeeDatabase from "../EmployeeDatabase/EmployeeDatabase";

const Homepage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow mt-16">
        <Sidebar />
        <div className="flex-grow ml-72 p-4 bg-gray-100 h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employee-database" element={<EmployeeDatabase />} />
            <Route path="new-hire" element={<Jobposting />} />
            <Route path="documentation" element={<InterviewSchedul />} />
            <Route path="orientation" element={<Onboarding />} />
            <Route path="add-employee" element={<AddEmployee />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
