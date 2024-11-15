import './App.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = 'https://your-deployed-api.com/employees';



function EmployeeManagementApp() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    username: '',
    email: '',
    status: 'active',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(apiUrl);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 const addEmployee = async () => {
    const { id, ...newEmployeeData } = formData;
    
    try {
      const response = await axios.post(apiUrl, newEmployeeData);
      console.log('Employee added:', response.data);  
      fetchEmployees();
      resetForm();
    } catch (error) {
      console.error('Error adding employee:', error.response ? error.response.data : error.message);
    }
};



  const editEmployee = (employee) => {
    setFormData(employee);
    setIsEditing(true);
  };

  const deleteEmployee = async (id) => {
    console.log('Deleting employee with ID:', id); 
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error.response?.data || error.message);
    }
  };
  
  const updateEmployee = async () => {
    console.log('Updating employee with ID:', formData.id); 
    try {
      await axios.put(`${apiUrl}/${formData.id}`, formData);
      fetchEmployees();
      resetForm();
    } catch (error) {
      console.error('Error updating employee:', error.response?.data || error.message);
    }
  };
  
  
  const resetForm = () => {
    setFormData({ id: '', username: '', email: '', status: 'active' });
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateEmployee();
    } else {
      addEmployee();
    }
  };

  return (
    <div className="EmployeeManagementApp">
      <h1>Employee Management</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button type="submit">{isEditing ? 'Update' : 'Add'} Employee</button>
      </form>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.username}</td>
              <td>{employee.email}</td>
              <td>{employee.status}</td>
              <td>
                <button onClick={() => editEmployee(employee)}>Edit</button>
                <button onClick={() => deleteEmployee(employee.id)}>Delete</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeManagementApp;
