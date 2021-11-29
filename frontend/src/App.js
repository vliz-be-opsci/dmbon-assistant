import './App.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css'


function App() {

  //define all constants first
  const [spaceList, setSpacesList] = useState([]) 
  //All the functions here
  useEffect(() => {
    axios.get('http://localhost:6656/apiv1/spaces/')
      .then(res => {
        console.log(res.data)
        setSpacesList(res.data)
      })
  });




  return (
    <div className="App">
      Hello, world!
      <div className="container">
        <h1>Task Manager</h1>
        <h6 className="card text-white bg-primary">FastApi -React</h6>
        <h5 className="card text-white bg-dark">All spaces</h5>
        <div>
          <ul>
            {spaceList.map((space)=> 
              <li>
                {space}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
