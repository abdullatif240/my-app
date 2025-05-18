import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // State to hold the data fetched from the API
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for the form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch data from the API using useEffect
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => {
        setData(data);  // Store the fetched data in the state
        setLoading(false);  // Set loading to false once data is fetched
      })
      .catch((error) => {
        setError(error);  // Handle any errors that occur
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs once when the component mounts

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission for creating or updating user
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Update the existing user
      setData(data.map(user =>
        user.id === currentUserId ? { ...user, ...formData } : user
      ));
      setIsEditing(false); // Exit editing mode
    } else {
      // Create a new user
      setData([
        ...data,
        { ...formData, id: data.length + 1 } // Dummy ID (in real case, it would come from an API)
      ]);
    }

    // Clear the form
    setFormData({ name: '', email: '', phone: '', website: '' });
  };

  // Start editing an existing user
  const startEditing = (user) => {
    setIsEditing(true);
    setCurrentUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      website: user.website
    });
  };

  // Handle user deletion
  const handleDelete = (userId) => {
    const updatedData = data.filter(user => user.id !== userId);
    setData(updatedData); // Update state to remove the deleted user
  };

  // Render the loading, error, or data states
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error fetching data: {error.message}</div>;

  return (
    <div className="App">
      {/* Navbar */}
      <header className="navbar">
        <h2>My React App</h2>
        <nav>
          <a href="/">Home</a>
          <a href="/">About</a>
          <a href="/">Contact</a>
        </nav>
      </header>

      <div className="main-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul>
            <li><a href="/">Dashboard</a></li>
            <li><a href="/">Settings</a></li>
            <li><a href="/">Profile</a></li>
          </ul>
        </aside>

        {/* Main Content */}
        <div className="content">
          <h1>User Data Grid</h1>

          {/* Form for Creating or Editing a User */}
          <form onSubmit={handleFormSubmit} className="user-form">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              required
            />
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="Website"
              required
            />
            <button type="submit">{isEditing ? 'Update User' : 'Create User'}</button>
          </form>

          <div className="grid">
            {data.map((user) => (
              <div key={user.id} className="card">
                <h3 className="card-title">{user.name}</h3>
                <p className="card-email">{user.email}</p>
                <p className="card-phone">{user.phone}</p>
                <p className="card-website">{user.website}</p>
                <button onClick={() => startEditing(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
