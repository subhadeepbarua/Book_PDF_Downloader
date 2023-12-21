import { useState } from "react";
import './App.css'
const App = () => {
  const [bookName, setBookName] = useState('');
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // Added state for tracking search

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set loading to true when starting data fetch
    setLoading(true);

    const formData = {
      bookName: bookName,
    };

    try {
      const response = await fetch('https://bookpdfdown.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Data sent successfully');
        setBookData(data.bookData);
        setSearched(true); // Set searched to true when data is fetched
        setBookName('');
      } else {
        console.error('Failed to send data:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending data:', error.message);
    } finally {
      // Whether the fetch is successful or not, set loading back to false
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="BookContainer">
        <form className="bookForm" onSubmit={handleSubmit}>
          <label className='bookFormHeading'> Enter the name of the book </label>
          <input
            id='book'
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            className='bookFormInput'
            type='text'
          ></input>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="results">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : searched && bookData.length > 0 ? ( // Added condition to check if searched and bookData has items
          <ol className="bookList">
            {bookData.map((data, index) => (
              <li key={index}>
                <div className="book-download">
                  <h3>
                    {index+1} <a href={data.file_link} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </h3>
                  <p>File Size: {data.file_size}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : searched ? ( // Added condition to check if searched, but bookData is empty
          <p>PDF not found (check if the name is correct)</p>
        ) : null}
      </div>
    </div>
  );
};

export default App;