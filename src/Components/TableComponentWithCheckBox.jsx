import React, { useState } from "react";

const TableComponent = ({ columns, data }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectRow = (rowId) => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.includes(rowId)) {
        return prevSelected.filter((id) => id !== rowId);
      }
      return [...prevSelected, rowId];
    });
  };

  return (
    <table className="min-w-full rounded-2xl bg-white ">
      <thead>
        <tr>
          <th className="p-4  text-left">
            <input
              className="h-5 w-5"
              type="checkbox"
              onChange={(e) => {
                const isChecked = e.target.checked;
                setSelectedRows(isChecked ? data.map((row) => row.id) : []);
              }}
              checked={selectedRows.length === data.length && data.length > 0}
            />
          </th>
          {columns.map((col) => (
            <th key={col.accessor} className="p-2  text-left">
              {col.Header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="">
        {data.map((row) => (
          <tr key={row._id} className="hover:bg-gray-100">
            <td className="p-4  text-left">
              <input
                className="h-5 w-5"
                type="checkbox"
                checked={selectedRows.includes(row._id)}
                onChange={() => handleSelectRow(row._id)}
              />
            </td>
            {columns.map((col) => (
              <td key={col.accessor} className="p-2  text-left">
                {row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
