import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

function Dashboard() {
  const [error, setError] = useState('');
  const [admin, setAdmin] = useState(null);
  const [departments, setDepartments] = useState([]); // Store departments
  const [departmentName, setDepartmentName] = useState('');
  const [departmentDescription, setDepartmentDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!token) {
      navigate('/login');
    } else {
      axios.get('http://localhost:3001/verify-token', {
        headers: { Authorization: `Bearer ${token}`, 'x-refresh-token': refreshToken },
      })
        .then((response) => {
          setAdmin(response.data.admin);
          if (response.headers['x-access-token']) {
            localStorage.setItem('authToken', response.headers['x-access-token']);
          }
          if (response.headers['x-refresh-token']) {
            localStorage.setItem('refreshToken', response.headers['x-refresh-token']);
          }
        })
        .catch((error) => {
          setError(error.response ? error.response.data.message : 'An error occurred');
          navigate('/login');
        });
    }

    // Fetch departments list
    if (token && refreshToken) {
      axios.get('http://localhost:3001/departments', {
        headers: { Authorization: `Bearer ${token}`, 'x-refresh-token': refreshToken },
      })
        .then((response) => {
          setDepartments(response.data);
        })
        .catch(() => {
          setDepartments([]);
        });
    }
  }, [navigate]);

  const handleAddDepartment = () => {
    setIsModalOpen(true); // Open modal when "Add Department" is clicked
  };

  const handleAddEmployee = () => {
    navigate('/add-employee');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation for empty fields
    if (!departmentName || !departmentDescription) {
      setError('Please fill in both fields.');
      return;
    }

    const departmentData = {
      name: departmentName,
      description: departmentDescription,
    };

    const token = localStorage.getItem('authToken');
    const refreshToken = localStorage.getItem('refreshToken');

    axios.post('http://localhost:3001/departments', departmentData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-refresh-token': refreshToken,
      },
    })
      .then((response) => {
        console.log('Department added successfully');
        setIsModalOpen(false); // Close modal after success
        setDepartmentName(''); // Reset input fields
        setDepartmentDescription('');
        setError(''); // Reset error message
        // Optionally fetch updated departments list
        axios.get('http://localhost:3001/departments', {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-refresh-token': refreshToken,
          },
        })
          .then((response) => setDepartments(response.data));
      })
      .catch((error) => {
        console.error('Error adding department:', error);
        setError('Failed to add department. Please try again later.');
      });
  };

  return (
    <div className="container">
      {error && <p className="error">{error}</p>}

      {admin ? (
        <>
          <div className="welcome-msg">
            <h1>Welcome to the Dashboard, {admin.username}</h1>
          </div>
          <h2>Departments</h2>
          {departments.length > 0 ? (
            <ul className="departments-list">
              {departments.map((dept) => (
                <li key={dept._id}>{dept.name}</li>
              ))}
            </ul>
          ) : (
            <p>No departments available.</p>
          )}

          {/* Add Department Button */}
          <button className="fab add-department" onClick={handleAddDepartment}>Add Department</button>
          {/* Modal for Adding Department */}
          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <h2>Add New Department</h2>
                <form onSubmit={handleSubmit}>
                  <div>
                    <input
                      type="text"
                      placeholder="Department Name"
                      value={departmentName}
                      onChange={(e) => setDepartmentName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Department Description"
                      value={departmentDescription}
                      onChange={(e) => setDepartmentDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <button type="submit">Add Department</button>
                  </div>
                  <div>
                    <button type="button" onClick={() => setIsModalOpen(false)}>Close</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboard;
