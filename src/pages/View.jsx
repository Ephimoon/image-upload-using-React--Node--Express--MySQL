import React, { useEffect, useState } from 'react'
import axios from 'axios';
import config from '../config';

const View = () => {
  const [employees, setEmployees] = useState([]); // store employees data to fetch and display

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  
    const interval = setInterval(() => {
      fetchEmployees(); // Fetch employees every 5 seconds
    }, 5000);
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const fetchEmployees = () => {
    axios.get(`${config.backendUrl}/employees`)
      .then((response) => setEmployees(response.data))
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h1>View All Employees</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {employees.map((employee) => (
          <div key={employee.id} style={{ border: "1px solid #ccc", padding: "10px", width: "200px" }}>
            <h3>{employee.name}</h3>
            <p>Email: {employee.email}</p>
              {employee.image && (
                <img
                  src={`${config.backendUrl}/images/${employee.image}`}
                  alt={employee.name}
                  style={{ width: "100%", height: "auto" }}
                />
              )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default View
