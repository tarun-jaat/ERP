import React, { useState, useEffect } from "react";
import axios from "axios";

const WarehouseLayout = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [newWarehouse, setNewWarehouse] = useState({ name: "", location: "" });
  const [newBin, setNewBin] = useState({
    name: "",
    warehouse: "",
    sections: [],
  });
  const [newSection, setNewSection] = useState({
    name: "",
    warehouse: "",
    bin: "",
  }); // Added warehouse to newSection state
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [isBinModalOpen, setIsBinModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false); // Modal state for sections
  const [error, setError] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  // Fetch all warehouses from the API
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9001/api/v1/warehouses/warehouses"
        );
        setWarehouses(response.data);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
      }
    };
    fetchWarehouses();
  }, []);

  // Handle input changes for new warehouse
  const handleWarehouseInputChange = (e) => {
    const { name, value } = e.target;
    setNewWarehouse((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for new bin
  const handleBinInputChange = (e) => {
    const { name, value } = e.target;
    setNewBin((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for new section
  const handleSectionInputChange = (e) => {
    const { name, value } = e.target;
    setNewSection((prev) => ({ ...prev, [name]: value }));
  };

  // Handle warehouse selection for adding a section
  const handleWarehouseSelection = (e) => {
    setSelectedWarehouse(e.target.value);
    setNewSection({ ...newSection, warehouse: e.target.value, bin: "" });
  };

  const addWarehouse = async () => {
    try {
      if (newWarehouse.name && newWarehouse.location) {
        const response = await axios.post(
          "http://localhost:9001/api/v1/warehouses/warehouses",
          newWarehouse,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setWarehouses((prev) => [...prev, response.data]); // Update state with the new warehouse
        setNewWarehouse({ name: "", location: "" });
        setIsWarehouseModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding warehouse:", error);
    }
  };

  // Handle adding a new bin
  const addBin = async () => {
    try {
      if (newBin.name && newBin.warehouse) {
        const response = await axios.post(
          "http://localhost:9001/api/v1/bins/bins",
          newBin,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setWarehouses((prev) =>
          prev.map((warehouse) =>
            warehouse._id === newBin.warehouse
              ? {
                  ...warehouse,
                  bins: [...(warehouse.bins || []), response.data],
                }
              : warehouse
          )
        );
        setNewBin({ name: "", warehouse: "", sections: [] });
        setIsBinModalOpen(false);
        setError(null); // Reset error state if successful
      } else {
        setError("Bin name and warehouse are required.");
      }
    } catch (error) {
      console.error("Error adding bin:", error);
      setError(
        "Error adding bin: " + error.response?.data?.error || error.message
      );
    }
  };



  // Handle capacity input change for new section
  const handleSectionCapacityChange = (e) => {
    const { value } = e.target;
    setNewSection((prev) => ({ ...prev, capacity: parseInt(value) }));
  };
  
  // Handle adding a new section
  const addSection = async () => {
    try {
      if (newSection.name && newSection.bin && newSection.capacity) {
        const response = await axios.post(
          "http://localhost:9001/api/v1/sections/sections",
          {
            name: newSection.name,
            bin: newSection.bin,
            capacity: newSection.capacity,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        // Update the warehouse state to include the new section in the correct bin
        setWarehouses((prev) =>
          prev.map((warehouse) =>
            warehouse._id === newSection.warehouse
              ? {
                  ...warehouse,
                  bins: warehouse.bins.map((bin) =>
                    bin._id === newSection.bin
                      ? { ...bin, sections: [...(bin.sections || []), response.data] }
                      : bin
                  ),
                }
              : warehouse
          )
        );
  
        setNewSection({ name: "", warehouse: "", bin: "", capacity: 0 });
        setIsSectionModalOpen(false);
        setError(null); // Reset error state if successful
      } else {
        setError("Section name, bin, and capacity are required.");
      }
    } catch (error) {
      console.error("Error adding section:", error);
      setError("Error adding section: " + error.response?.data?.error || error.message);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6">Warehouse Layout</h2>

      {/* Error Message */}
      {error && (
        <div className="bg-red-200 text-red-700 p-2 rounded mb-4">{error}</div>
      )}

      {/* Add New Warehouse Button */}
      <button
        onClick={() => setIsWarehouseModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 text-center rounded mb-6"
      >
        Add New Warehouse
      </button>

      {/* Add New Bin Button */}
      <button
        onClick={() => setIsBinModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 text-center rounded mb-6"
      >
        Add New Bin
      </button>

      {/* Add New Section Button */}
      <button
        onClick={() => setIsSectionModalOpen(true)}
        className="bg-yellow-500 text-white px-4 py-2 text-center rounded mb-6"
      >
        Add New Section
      </button>

      {/* Warehouse Table */}
      <div className="overflow-x-auto mb-8">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-sm text-gray-700">
              <th className="px-4 py-2 text-center">Warehouse Name</th>
              <th className="px-4 py-2 text-center">Bin Name</th>
              <th className="px-4 py-2 text-center">Section ID</th>
              <th className="px-4 py-2 text-center">Items</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((warehouse) => (
              <React.Fragment key={warehouse._id}>
                {warehouse.bins && warehouse.bins.length > 0 ? (
                  warehouse.bins.map((bin, binIndex) => (
                    <React.Fragment key={bin._id}>
                      {bin.sections && bin.sections.length > 0 ? (
                        bin.sections.map((section, sectionIndex) => (
                          <tr
                            key={section._id}
                            className="border-b border-gray-200 hover:bg-gray-100"
                          >
                            {sectionIndex === 0 && binIndex === 0 ? (
                              <td
                                className="px-4 py-2 text-center"
                                rowSpan={warehouse.bins.length}
                              >
                                {warehouse.name}
                              </td>
                            ) : null}
                            {sectionIndex === 0 ? (
                              <td
                                className="px-4 py-2 text-center"
                                rowSpan={bin.sections.length}
                              >
                                {bin.name}
                              </td>
                            ) : null}
                            <td className="px-4 py-2 text-center">{section.name}</td>
                            <td className="px-4 py-2 text-center">
                              {section.items && section.items.length > 0
                                ? section.items.join(", ")
                                : "No items"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border-b border-gray-200 hover:bg-gray-100">
                          <td className="px-4 py-2 text-center" rowSpan={1}>
                            {warehouse.name}
                          </td>
                          <td className="px-4 py-2 text-center">{bin.name}</td>
                          <td className="px-4 py-2 text-center">No sections</td>
                          <td className="px-4 py-2 text-center">No items</td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="px-4 py-2 text-center">{warehouse.name}</td>
                    <td className="px-4 py-2 text-center">No bins</td>
                    <td className="px-4 py-2 text-center">No sections</td>
                    <td className="px-4 py-2 text-center">No items</td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals for Adding Warehouse, Bin, Section */}
      {isWarehouseModalOpen && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Add New Warehouse</h3>
            <input
              type="text"
              name="name"
              placeholder="Warehouse Name"
              value={newWarehouse.name}
              onChange={handleWarehouseInputChange}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={newWarehouse.location}
              onChange={handleWarehouseInputChange}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={addWarehouse}
                className="bg-blue-500 text-white px-4 py-2 text-center rounded"
              >
                Add Warehouse
              </button>
              <button
                onClick={() => setIsWarehouseModalOpen(false)}
                className="ml-4 bg-gray-500 text-white px-4 py-2 text-center rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isBinModalOpen && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Add New Bin</h3>
            <input
              type="text"
              name="name"
              placeholder="Bin Name"
              value={newBin.name}
              onChange={handleBinInputChange}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />
            <select
              name="warehouse"
              value={newBin.warehouse}
              onChange={handleBinInputChange}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            >
              <option value="">Select Warehouse</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse._id} value={warehouse._id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end">
              <button
                onClick={addBin}
                className="bg-green-500 text-white px-4 py-2 text-center rounded"
              >
                Add Bin
              </button>
              <button
                onClick={() => setIsBinModalOpen(false)}
                className="ml-4 bg-gray-500 text-white px-4 py-2 text-center rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isSectionModalOpen && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Add New Section</h3>
            <input
              type="text"
              name="name"
              placeholder="Section Name"
              value={newSection.name}
              onChange={handleSectionInputChange}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />
            <select
              name="warehouse"
              value={selectedWarehouse}
              onChange={handleWarehouseSelection}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            >
              <option value="">Select Warehouse</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse._id} value={warehouse._id}>
                  {warehouse.name}
                </option>
              ))}
            </select>

            {/* Bin Selection */}
            <select
              name="bin"
              value={newSection.bin}
              onChange={handleSectionInputChange}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            >
              <option value="">Select Bin</option>
              {selectedWarehouse &&
                warehouses
                  .find((warehouse) => warehouse._id === selectedWarehouse)
                  ?.bins.map((bin) => (
                    <option key={bin._id} value={bin._id}>
                      {bin.name}
                    </option>
                  ))}
            </select>

            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={newSection.capacity}
              onChange={handleSectionCapacityChange}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />

            <div className="flex justify-end">
              <button
                onClick={addSection}
                className="bg-yellow-500 text-white px-4 py-2 text-center rounded"
              >
                Add Section
              </button>
              <button
                onClick={() => setIsSectionModalOpen(false)}
                className="ml-4 bg-gray-500 text-white px-4 py-2 text-center rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseLayout;
