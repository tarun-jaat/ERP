import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { CSVLink } from "react-csv";
import axios from "axios";

const InventoryItems = () => {
  const [filter, setFilter] = useState("all");
  const [stock, setStock] = useState([]); // Stores all inventory items
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    sku: "",
    itemName: "",
    category: "",
    stockLevel: "",
    location: "",
  });

  // Fetch stock items from the backend on component mount
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get("http://localhost:9001/api/v1/items/items"); 
        setStock(response.data); // Set stock data to the response from the backend
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };
    fetchStock();
  }, []);

  // Handle filter change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Handle input changes for the new item form
  const handleNewItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  // Handle adding a new item to the inventory
  const handleAddItem = async () => {
    try {
      const response = await axios.post("http://localhost:9001/api/v1/items/items", newItem); // POST new item to the backend
      setStock([...stock, response.data]); // Add the new item to the existing stock list
      setModalIsOpen(false); // Close the modal after adding the item
      setNewItem({ sku: "", itemName: "", category: "", stockLevel: "", location: "" }); // Reset the form fields
    } catch (error) {
      console.error("Error adding new item:", error);
    }
  };

  return (
    <div className="w-full">
      {/* Modal for adding new item */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="flex justify-center items-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        ariaHideApp={false}
      >
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
          <h2 className="text-xl mb-4">Add New Item</h2>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              name="sku"
              placeholder="SKU"
              className="border p-2 rounded-lg"
              value={newItem.sku}
              onChange={handleNewItemChange}
            />
            <input
              type="text"
              name="itemName"
              placeholder="Item Name"
              className="border p-2 rounded-lg"
              value={newItem.itemName}
              onChange={handleNewItemChange}
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              className="border p-2 rounded-lg"
              value={newItem.category}
              onChange={handleNewItemChange}
            />
            <input
              type="number"
              name="stockLevel"
              placeholder="Stock Level"
              className="border p-2 rounded-lg"
              value={newItem.stockLevel}
              onChange={handleNewItemChange}
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              className="border p-2 rounded-lg"
              value={newItem.location}
              onChange={handleNewItemChange}
            />
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setModalIsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={handleAddItem}
              >
                Add Item
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Header with Filter and Buttons */}
      <header className="h-16 border-b-[0.5px] shadow-sm flex items-center justify-between px-8">
        <select
          className="border-blue-500 text-xl border-[0.5px] rounded-2xl p-3"
          value={filter}
          onChange={handleFilterChange}
        >
          <option className="text-sm" value="all">
            All Items
          </option>
          <option className="text-sm" value="active">
            Active Items
          </option>
          <option className="text-sm" value="inactive">
            Inactive Items
          </option>
        </select>
        <div className="flex items-center gap-4">
          <button
            className="bg-blue-600 p-1 text-white px-2 rounded-lg"
            onClick={() => setModalIsOpen(true)}
          >
            + New
          </button>
          <button className="bg-blue-600 p-1 text-white px-2 rounded-lg">
            + Import
          </button>
          <CSVLink
            data={stock}
            filename={"stock_data.csv"}
            className="bg-blue-600 p-1 text-white px-2 rounded-lg"
          >
            - Export
          </CSVLink>
        </div>
      </header>

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-sm text-gray-700">
              <th className="px-4 py-2">SKU</th>
              <th className="px-4 py-2">Item Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Stock Level</th>
              <th className="px-4 py-2">Location</th>
            </tr>
          </thead>
          <tbody>
            {stock.length > 0 ? (
              stock.map((item, index) => (
                <tr
                  key={index}
                  className="border-b text-center border-gray-200 hover:bg-gray-100"
                >
                  <td className="px-4 py-2">{item.sku}</td>
                  <td className="px-4 py-2">{item.itemName}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2">{item.stockLevel}</td>
                  <td className="px-4 py-2">{item.location}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryItems;
