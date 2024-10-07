import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../Components/TableComponentWithCheckBox";
import axios from "axios";

const columns = [
  { Header: "Lead Name", accessor: "assignedTo" },
  { Header: "Company", accessor: "name" },
  { Header: "Email", accessor: "email" },
  { Header: "Phone Number", accessor: "phone" },
  { Header: "Lead Status", accessor: "status" },
];

function LeadsHome() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const handleImportClick = () => {
    navigate("add-leads");  
  };

  useEffect(() => {
    axios.get('http://localhost:9001/api/v1/contact/getLeads') 
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className="w-full h-[90vh] pb-8">
      <div className="text-white mb-4 gap-10 font-medium flex justify-end">
        <button className="bg-[#0097AB] w-[213px] h-[38px] rounded-full">
          - Export
        </button>
        <button
          className="bg-[#0097AB] w-[213px] h-[38px] rounded-full"
          onClick={handleImportClick}
        >
          + Import
        </button>
      </div>
      <div className="bg-white h-[90vh] rounded-2xl">
        <TableComponent columns={columns} data={data} />
      </div>
    </div>
  );
}

export default LeadsHome;
