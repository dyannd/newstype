import Home from "./Components/Home";
import NavBar from "./Components/Nav";
import './styles/index.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
function App() {
  return (
    <Router>
    <div className="App">
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>
       
    </div>
  </Router>
  );
}

export default App;
