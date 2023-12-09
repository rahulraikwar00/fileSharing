import React, { useState } from "react";
import "./styles/App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    // Handle file selection
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    // Handle file upload logic
    if (selectedFile) {
      try {
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append("file", selectedFile);

        // Show loading indicator
        setLoading(true);

        // Send the file to the server using fetch
        const response = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: formData,
        });

        // Check the response status
        if (response.ok) {
          const result = await response;
          console.log("File uploaded. File link:", result);
        } else {
          // Handle server error
          const errorMessage = await response.text();
          setError(`File upload failed. Server returned: ${errorMessage}`);
        }
      } catch (error) {
        // Handle network or other errors
        setError(`Error uploading file: ${error.message}`);
      } finally {
        // Hide loading indicator
        setLoading(false);
      }
    } else {
      console.log("Please select a file");
    }
  };

  return (
    <div className="app-container">
      <h1>File Sharing App</h1>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default App;
