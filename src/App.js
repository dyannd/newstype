import Home from "./Components/Home";
import NavBar from "./Components/Nav";
import './styles/index.css';
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  //colors 
  //DEFAULT
  const chineseBlack = "#1B1D1B";
  const chineseWhite = "#E1E1E1";
  const gray = "#7f7f7f";
  const dullRed = "#EC4D37";

  //PA THEME
  const darkPink = "#3b1b25";
  const lightPink = "#DF9F9E";
  const regularPink = "#BB5769";
  const pastelOrange = "#f7c44d";

  //beige
  const brown = "#a65e46";
  const lightBeige = "#f1d2b6";
  const lightBrown = "#a38e7a";
  const smokyBlue = "#90b2ca";

  //darkblue
  const darkBlue = "#242F41";
  const darkGrey = "#8399A5";
  const mildWhite = "#E7E6E8";
  const gold = "#FEC155";

  //themes
  var defaultTheme = {
    name: "BnW",
    label: "BnW",
    correct: gray,
    main: chineseWhite,
    background: chineseBlack,
    wrong: dullRed
  }

  var paTheme = {
    name: "pinky",
    label: "pinky",
    correct: regularPink,
    main: lightPink,
    background: darkPink,
    wrong: pastelOrange
  }

  var beige = {
    name: "beige",
    label: "beige",
    correct: lightBrown,
    main: brown,
    background: lightBeige,
    wrong: smokyBlue,
  }

  var kip = {
    name: "kip",
    label: "kip",
    correct: darkGrey,
    main: mildWhite,
    background: darkBlue,
    wrong: gold
  }

  //theme array, containing all available theme for users
  const themeList = [defaultTheme, paTheme, beige, kip];

  //current theme, default as BnW
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  //option of timing, default to 30 sec
  const [option, setOption] = useState("30");

  //set the theme at first launch
  useEffect(() => {
    setCurrentTheme(currentTheme);
    setBodyTheme(currentTheme);
  }, [])

  //applying theme for body
  function setBodyTheme(theme) {
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.main;
  }

  //change the whole page's theme when a choice is made from Home component
  function handleChangeTheme(theme) {
    setCurrentTheme(theme);
    setBodyTheme(theme);
  }


  return (

    <Router>
      <div className="App">
        <NavBar theme={currentTheme}
          changeOption={(option) => setOption(option)}
        />
        <Routes>
          <Route path="/"
            element={
              <Home theme={currentTheme}
                option={option}
                themeOptions={themeList}
                changeTheme={handleChangeTheme}
              />
            } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
