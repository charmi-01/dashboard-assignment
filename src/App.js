// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";


import axios from 'axios';


const App = () => {

  const url = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"


  const [data, setData] = useState([]);
  const [query, setQuery] = useState('')
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRow, setEditingRow] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const itemsPerPage = 10;

  const fetchInfo = () => {
    let data = axios.get(url).then((response) => { setData(response.data); setFilteredData(response.data) })
    console.log(data);
    return data
  }

  useEffect(() => {
    fetchInfo();
  }, [])

  const handleSearch = (query) => {
    const filtered = data.filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSelectAll = () => {
    const allRows = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const allSelected = selectedRows.length === allRows.length;
    const newSelectedRows = allSelected ? [] : allRows.map(row => row.id);
    setSelectedRows(newSelectedRows);
  };

  const handleSelectRow = (id) => {
    const isSelected = selectedRows.includes(id);
    const newSelectedRows = isSelected
      ? selectedRows.filter(rowId => rowId !== id)
      : [...selectedRows, id];
    setSelectedRows(newSelectedRows);
  };

  const handleDeleteSelected = () => {
    const updatedData = data.filter(row => !selectedRows.includes(row.id));
    setData(updatedData);
    setFilteredData(updatedData);
    setSelectedRows([]);
  };

  const handleDeleteRow = (id) => {
    const updatedData = data.filter(row => row.id !== id);
    setData(updatedData);
    setFilteredData(updatedData);
    setSelectedRows(selectedRows.filter(rowId => rowId !== id));
  };

  const handleEditRow = (row) => {
    setEditingRow(row.id);
    setEditedValues({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
    });
  };
  const handleSaveEdit = () => {
    const updatedData = data.map((row) =>
      row.id === editingRow ? { ...row, ...editedValues } : row
    );
    setData(updatedData);
    setFilteredData(updatedData);
    setEditingRow(null);
    setEditedValues({});
  };
  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditedValues({});
  };

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentData = filteredData.slice(start, end);


  return (
    <div>
      <div>


        <input
          type="text"
          value={query}
          placeholder="Search..."
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query);
            }
          }}
        />
        <button onClick={() => handleSearch(query)} className="search-button" >
          search
        </button>
        <button onClick={() => { handleSearch(""); setQuery('') }} className="clear-button">
          clear
        </button>
      </div>
      <table className="data-table">
        {/* Table headers */}
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedRows.length === itemsPerPage}
                className="select-all-checkbox"
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody>
          {currentData.map((row) =>
            editingRow === row.id ? (
              <tr key={`${row.id}-edit`} className="edit-row">
                <td></td>
                <td className='edit-row-entry'>
                  <input
                    type="text"
                    value={editedValues.id}
                    onChange={(e) => setEditedValues({ ...editedValues, id: e.target.value })}

                  />
                </td>
                <td className='edit-row-entry'>
                  <input
                    type="text"
                    value={editedValues.name}
                    onChange={(e) => setEditedValues({ ...editedValues, name: e.target.value })}
                  />
                </td>
                <td className='edit-row-entry'>
                  <input
                    type="text"
                    value={editedValues.email}
                    onChange={(e) => setEditedValues({ ...editedValues, email: e.target.value })}
                  />
                </td>
                <td className='edit-row-entry'>
                  <input
                    type="text"
                    value={editedValues.role}
                    onChange={(e) => setEditedValues({ ...editedValues, role: e.target.value })}
                  />
                </td>
                <td className='edit-row-entry'>
                  <button className="save-button" onClick={handleSaveEdit}>
                    Save
                  </button>
                  <button className="cancel-button" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={row.id} className={selectedRows.includes(row.id) ? 'selected-row' : ''}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleSelectRow(row.id)}
                    checked={selectedRows.includes(row.id)}
                    className="row-checkbox"
                  />
                </td>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.role}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEditRow(row)}>
                    <FaRegEdit size={15} />
                  </button>
                  <button className="delete-button" onClick={() => handleDeleteRow(row.id)}><MdDeleteOutline size={15} color='red' /></button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <div className="footer-container">
        {/* Delete Selected button */}
        <button
          className="delete-selected-button"
          onClick={handleDeleteSelected}
          disabled={selectedRows.length === 0}
        >
          Delete Selected
        </button>
        {/* Pagination */}
        <div className="pagination">
          <button
            className="pagination-button first-page"
            onClick={() => handlePagination(1)}
          >
            First
          </button>
          <button
            className="pagination-button previous-page"
            onClick={() => handlePagination(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="current-page">page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}</span>
          <button
            className="pagination-button next-page"
            onClick={() => handlePagination(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
          >
            Next
          </button>
          <button
            className="pagination-button last-page"
            onClick={() => handlePagination(Math.ceil(filteredData.length / itemsPerPage))}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
