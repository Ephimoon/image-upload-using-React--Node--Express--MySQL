import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import config from '../config';

const Home = () => {
    // Insert form states
    const [showInsertForm, setShowInsertForm] = useState(false); // control form visibility
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState();

    // Edit form states
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editImage, setEditImage] = useState();
    const [editingId, setEditingId] = useState(null);

    // Employees data state
    const [initialName, setInitialName] = useState("");
    const [initialEmail, setInitialEmail] = useState("");
    const [initialImage, setInitialImage] = useState(null);

    const [employees, setEmployees] = useState([]); // store employees data to fetch and display
    const insertFileInputRef = useRef(null); // Ref for insert form file input
    const editFileInputRef = useRef(null); // Ref for edit form file input

    // Fetch employees on component mount
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = () => {
        axios.get(`${config.backendUrl}/employees`)
            .then((response) => setEmployees(response.data))
            .catch(err => console.log(err));
    };

    const upload = (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append("name", name);
        formdata.append("email", email);
        formdata.append('image', image);

        axios.post(`${config.backendUrl}/create`, formdata)
            .then((response) => {
                if (response.data.Status === 'Success') {
                    fetchEmployees();
                    resetForm(); // Clear form after successful upload
                } else {
                    console.log('Data save failed');
                }
            })
            .catch(err => console.log(err));
    };

    const updateEmployee = (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append("name", editName);
        formdata.append("email", editEmail);
    
        // Check if a new image is selected, else keep the existing image
        if (editImage) {
            formdata.append("image", editImage); // Upload new image
        } else {
            formdata.append("image", initialImage); // Send existing image filename
        }
    
        axios.post(`${config.backendUrl}/update/${editingId}`, formdata)
            .then((response) => {
                if (response.data.Status === 'Success') {
                    fetchEmployees();
                    resetForm();
                } else {
                    console.log('Data update failed');
                }
            })
            .catch(err => console.log(err));
    };
    

    const resetForm = () => {
        // Reset insert form states
        setName("");
        setEmail("");
        setImage(null);
        setShowInsertForm(false);

        // Reset edit form states
        setEditingId(null);
        setEditName("");
        setEditEmail("");
        setEditImage(null);

        // Clear file input for both forms if they exist
        if (insertFileInputRef.current) {
            insertFileInputRef.current.value = null; // Reset file input for insert form
        }
        if (editFileInputRef.current) {
            editFileInputRef.current.value = null; // Reset file input for edit form
        }
    };

    const handleEdit = (employee) => {
        setEditingId(employee.id);
        setEditName(employee.name);
        setEditEmail(employee.email);
        setEditImage(employee.image); // Keep the existing image
        if (editFileInputRef.current) {
            editFileInputRef.current.value = null; // Clear file input if already set
        }

            // Store initial values for comparison
            setInitialName(employee.name);
            setInitialEmail(employee.email);
            setInitialImage(employee.image);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            axios.delete(`${config.backendUrl}/delete/${id}`)
                .then((response) => {
                    if (response.data.Status === 'Success') {
                        fetchEmployees();
                    }
                })
                .catch(err => console.log(err));
        }
    };

    // // handle image change and validate image type
    // const handleImageChange = (e, setImageState) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         // Updated list of valid image types, including SVG
    //         const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg", "image/svg+xml"];
    //         if (!validImageTypes.includes(file.type)) {
    //             alert("Please upload a valid image file (JPEG, PNG, GIF, or SVG).");
    //             e.target.value = null; // Reset file input
    //             setImageState(null);
    //             return;
    //         }
    //         setImageState(file); // Set the image file if valid
    //     }
    // };
    

    return (
        <div>
            <h1>React, Node, Express, MySQL: Upload File, Insert, Edit, Remove Data</h1>
            
            {/* Button to show Insert Form */}
            {!showInsertForm && (
                <button onClick={() => setShowInsertForm(true)}>Insert Employee</button>
            )}

            {/* Conditional rendering for Insert Form */}
            {showInsertForm && (
                <form onSubmit={upload}>
                    <h2>Insert Employee</h2>
                    <div>
                        <label>Name*</label>
                        <input
                            type="text"
                            value={name}
                            placeholder="Enter Name"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Email*</label>
                        <input
                            type="email"
                            value={email}
                            placeholder="Enter Email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Upload File</label>
                        <input
                            type="file"
                            accept="image/jpeg, image/png, image/gif, image/jpg, image/svg+xml" // Accepts only image files
                            ref={insertFileInputRef} // Attach the ref to the file input
                            onChange={(e) => setImage(e.target.files[0])}
                            // onChange={(e) => handleImageChange(e, setImage)}
                        />
                    </div>
                    <button type="submit">Upload</button>
                    <button type="button" onClick={resetForm}>Cancel</button>
                </form>
            )}

            <div style={{ marginTop: "20px" }}>
                <h2>Employee List</h2>
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
                            {editingId !== employee.id && (
                                <>
                                <button onClick={() => handleEdit(employee)}>Edit</button>
                                <button onClick={() => handleDelete(employee.id)}>Delete</button>
                                </>
                            )}

                            {/* Edit Form inside each Card */}
                            {editingId === employee.id && (
                                <form onSubmit={updateEmployee}>
                                    <h2>Edit Employee</h2>
                                    <div>
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            value={editName}
                                            placeholder="Enter Name"
                                            onChange={(e) => setEditName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={editEmail}
                                            placeholder="Enter Email"
                                            onChange={(e) => setEditEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Upload New Image</label>
                                        <input
                                            type="file"
                                            ref={editFileInputRef}
                                            accept="image/jpeg, image/png, image/gif, image/jpg, image/svg+xml" // Accepts only image files
                                            onChange={(e) => setEditImage(e.target.files[0])}
                                            // onChange={(e) => handleImageChange(e, setEditImage)}
                                        />
                                    </div>
                                    <button type="submit" disabled={ editName === initialName && editEmail === initialEmail && editImage === initialImage }>Update</button>
                                    <button type="button" onClick={resetForm}>Cancel</button>
                                    <button onClick={() => handleDelete(employee.id)}>Delete</button>
                                </form>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;