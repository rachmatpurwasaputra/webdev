import logo from './logo.svg';
import './App.css';
import BlueButton from './components/button';
import React, { useState, useEffect } from 'react';
const db = require ('./db'); // Import the database connection

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Example query to retrieve data from the database
    db.query('SELECT * FROM barang')
      .then((result) => {
        setData(result);
      })
      .catch((error) => {
        console.error('Error retrieving data:', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Sunting <code>src/App.js</code> dan simpan untuk reload.
        </p>
        <BlueButton />
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
