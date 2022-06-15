import React, { useState, useEffect, useRef } from 'react';
import Result from './Result.jsx';
import words from './words.txt';
import Select from 'react-select';

function Home(props) {
    const timerOption = props.option;
    const [currentTheme, setCurrentTheme] = useState(props.theme);
    const themeOptions = props.themeOptions;
    const [defaultTimer, setDefaultTimer] = useState("01:00");
    const [para, setPara] = useState([]); //set texts to paragraph for typing
    const [currentWordIdx, setCurrentWordIdx] = useState(0); //keeps track of position of text in the paragraph
    const [currentInput, setCurrentInput] = useState(""); //keeps track of current input as in the box
    const [currentHeightFromTop, setCurrentHeightFromTop] = useState(0); //keeps track of height of word to top of page to determine row number
    const [correctWords, setCorrectWords] = useState(0); //count correct words
    const [totalWordsTyped, setTotalWordsTyped] = useState(0); //count total words typed
    const [startIdx, setStartIdx] = useState(0); //keep track of start idx of a row
    const [endIdx, setEndIdx] = useState(0); //end idx of a row
    const [lineCounter, setLineCounter] = useState(1); //count row number, starting at 1
    const [gettingText, setGettingText] = useState(true); //boolean to run getText
    const [isTyping, setIsTyping] = useState(false); //keep track of typing action
    const [timer, setTimer] = useState(defaultTimer); //set time of timer
    const [showResult, setShowResult] = useState(false); //logic to show result UI/ typing UI
    const [wpm, setWpm] = useState(0); //calculate wpm
    const [acc, setAcc] = useState(0); //calculate accuracy
    const [correctChar, settCorrectChar] = useState(0);
    const [hoverReset, setHoverReset] = useState(false);
    const [inputFocus, setInputFocus] = useState(true);

    //styling for React-Select
    const selectStyles = {
        option: (provided, state) => ({
            ...provided,
            color: currentTheme.correct,
            backgroundColor: currentTheme.main,
            border: "none",
            borderLeft: state.isSelected ? "solid 2px " + currentTheme.wrong : "none",
            transition: "all 0.2s",
            "&:hover": {
                backgroundColor: currentTheme.wrong,
                color: currentTheme.main,
            },

        }),


        //for the control (main box that we see without any selections)
        control: (provided) => ({
            ...provided,
            backgroundColor: currentTheme.backgroundColor,
            color: currentTheme.wrong,
            border: "none",
            boxShadow: 0,
        }),

        //value inside the control box
        singleValue: provided => ({
            ...provided,
            color: currentTheme.main,
        }),

        //the whoel dropdown menu
        menuList: provided => ({
            ...provided,
            padding: 0,
        }),

        //styling the arrow
        dropdownIndicator: (provided, state) => ({
            ...provided,
            color: currentTheme.correct,
            transition: "all 0.2s",
            "&:hover": {
                color: currentTheme.wrong,
            }
        }),

        //styling the separator between selected value and arrow
        indicatorSeparator: provided => ({
            width: 0,
        })
    }

    //change timer based on timer option 
    useEffect(() => {
        if (timerOption === "30") {
            setDefaultTimer("00:30");
        }
        if (timerOption === "60") {
            setDefaultTimer("01:00");
        }
        if (timerOption === "120") {
            setDefaultTimer("02:00");
        }
        setTimer(defaultTimer);
    }, [timerOption, defaultTimer])



    //update related attributes when the currentwordIdx changes 
    useEffect(() => {
        // if we are not getting text, meaning is typing
        if (isTyping) {
            //update current height from top of screen to the current word
            var element = document.getElementById("word-" + currentWordIdx)
            var heightToTop = element !== null ? element.getBoundingClientRect().top : 0;

            //determines new line if previous height reference is different from 
            //the new height to top, apart from the zero case (beginning)
            if (prevHeight.current < heightToTop && prevHeight.current !== 0) {

                //if a new line is spotted, check the current lineCounter
                //if 1, meaning first line, then no updates are made, 
                //but keep track of the endIdx
                if (lineCounter === 1) {
                    setEndIdx(currentWordIdx);
                    //increase the line counter
                    setLineCounter(2);
                }


                //if 2, then delete the first line (from startIdx to endIdx)
                if (lineCounter === 2) {
                    for (let idx = startIdx; idx < endIdx; idx++) {
                        document.getElementById("word-" + idx).style.display = "none";
                    }
                    //setStartIdx to endIdx+1 (new line)
                    setStartIdx(endIdx);
                }
            }

            //updates height
            setCurrentHeightFromTop(heightToTop);

        }

    }, [currentWordIdx]);

    //useEffect hook to update endIdx when startIdx is updated
    useEffect(() => {
        //setEndIdx to currentWordIdx
        setEndIdx(currentWordIdx);
    }, [startIdx])

    //create to save previous states of tracking row height
    const prevHeight = useRef(0);
    useEffect(() => {
        prevHeight.current = currentHeightFromTop;
    }, [currentHeightFromTop])

    //stopwatch, run when typing starts
    useEffect(() => {
        let interval;
        if (isTyping) {
            startTimer(timerOption);
            //start the timer
            //input: duration: in seconds
            //display: a string to display
            function startTimer(duration) {
                var timer = duration;
                var minutes, seconds;

                //update the timer every 1 sec
                interval = setInterval(() => {
                    minutes = parseInt(timer / 60, 10);
                    seconds = parseInt(timer % 60, 10);

                    minutes = minutes < 10 ? "0" + minutes : minutes;
                    seconds = seconds < 10 ? "0" + seconds : seconds;

                    let display = minutes + ":" + seconds;

                    setTimer(display);

                    //timer ends
                    if (--timer < 0) {
                        //clear interval
                        clearInterval(interval);
                        setIsTyping(false);

                        //shows the result
                        setShowResult(true);
                    }
                }, 1000)
            }
        }

        //clean up, making sure stopwatch only run once
        return () => {
            clearInterval(interval);
        }
    }, [isTyping])


    //handle getting Text when switching display from Result to Home 
    useEffect(() => {
        //reset display after seeing showResult has changed to false & getText to true
        if (!showResult && gettingText) {
            resetParaDisplay();
        }

        //show result is true, calculate the stats
        if (showResult) {
            let netWords = correctChar > 0 ? correctChar / 5 : 0;
            //calculate wpm and accuracy
            let accuracy = correctWords / totalWordsTyped;
            let accRounded = Math.round(accuracy * 100)
            let netWordsPM = Math.round(netWords * 60 / parseInt(timerOption));
            setAcc(accRounded);
            setWpm(netWordsPM);
        }
    }, [showResult, gettingText])

    //handle getting text 
    useEffect(() => {
        if (gettingText) {
            getText();
        }
    }, [gettingText])

    //runs when we choose a theme with React-Select
    useEffect(() => {
        props.changeTheme(currentTheme);
        //change styling for all words in the paragraph
        for (let idx = 0; idx < para.length; idx++) {
            let element = document.getElementById("word-" + idx);
            element.style.color = currentTheme.main;
        }
    }, [currentTheme])

    //randomize the text from the list to create a paragraph
    function getText() {
        //get words from file
        fetch(words)
            .then(r => r.text())
            .then(text => {
                //push the words to an array and save to textList state
                var wordArray = text.split(/\r\n/);
                var paragraph = []
                //generate 1000 words paragraph from the array above
                for (let i = 0; i < 1000; i++) {
                    //get a random indx from textlist
                    const randInt = Math.floor(Math.random() * wordArray.length);
                    paragraph.push(wordArray[randInt]);
                }

                //update current paragraph
                setPara(paragraph);

                //done getting text
                setGettingText(false);
            })
        //shift focus to user input
        document.getElementById("user-input").focus();
    }

    //handle spacebar when receive input 
    function handleKeyPress(event) {
        //set typing to true at first type
        if (isTyping === false) {
            setIsTyping(true);
        }
        //if is spacebar
        if (event.keyCode === 32) {
            //verify word if correct
            verifyWord(currentInput);
            //update current word
            setCurrentWordIdx(prev => prev + 1);
            //clear text input
            setCurrentInput("");
            //update number of total words
            setTotalWordsTyped(prev => prev + 1);

        }
    }

    //updates the text in the input box by changing 
    //input's value attribute 
    function handleChange(evt) {
        setCurrentInput(evt.target.value);

    }

    //verify the word input from the form with the current word 
    function verifyWord(word) {
        //slice the spaces away 
        var completeWord = word.split(" ").join("");
        // //get the array of input chars
        // var completeWordArray = [...completeWord];
        // //COUNTING CHARS
        // var correctCount = 0; 
        // //loop thru all chars from input, check how many is in currentWord
        // for (let i = 0; i < completeWordArray.length; i++){

        // }


        //COUNTING WORDS 
        //if input is the same, increase correct words by 1
        //also add the correct-word class in
        if (completeWord === para[currentWordIdx]) {
            setCorrectWords(prev => prev + 1);
            settCorrectChar(prev => prev + completeWord.length + 1); //+1 includes the spacebar
            document.getElementById("word-" + currentWordIdx).style.color
                = currentTheme.correct;
        } else {
            //if not correct, add the wrong-word class 
            document.getElementById("word-" + currentWordIdx).style.color
                = currentTheme.wrong;
        }
    }



    //reset all states and input
    function reset() {
        //handling result display, if IS showing result, do this
        if (showResult === true) {
            setShowResult(false);
            setGettingText(true);

        } else {//if not showing result, only get a new text and will be good
            resetParaDisplay();
            setGettingText(true);
        }
    }

    //reset the display and styling of all hidden blocks
    function resetParaDisplay() {

        //make hidden lines appear again with correct styling
        for (let idx = 0; idx < currentWordIdx; idx++) {
            let element = document.getElementById("word-" + idx);
            //reset display
            element.style.display = "block";
            //reset styling 
            element.style.color = currentTheme.main;
        }

        setCurrentWordIdx(0);
        settCorrectChar(0);
        setCorrectWords(0);
        setTotalWordsTyped(0);
        setCurrentInput("");
        setLineCounter(1);
        setStartIdx(0);
        setIsTyping(false);
        setTimer(defaultTimer);
    }

    return (
        <section id="Home">
            <div className="text-controls"
                onClick={reset}
                style={{
                    color: !hoverReset ? currentTheme.correct : currentTheme.main,
                }}

            >

                <i className="fa-solid fa-repeat icon"
                    onMouseEnter={() => setHoverReset(true)}
                    onMouseLeave={() => setHoverReset(false)}
                ></i>

            </div>
            {!showResult ?
                <>
                    <div className="stat-indicator-tracker" >

                        <h1>{timer}</h1>
                        <Select
                            value={currentTheme}
                            onChange={setCurrentTheme}
                            options={themeOptions}
                            styles={selectStyles}
                        />
                    </div>

                    <div className="main-text-display">
                        {para.map((word, idx) => {
                            return (

                                <div className={idx === currentWordIdx ?
                                    "word current-word" : "word"}
                                    key={idx}
                                    id={"word-" + idx}>
                                    {word}
                                </div>
                            )
                        })}
                    </div>
                </>
                :
                <Result
                    wpm={wpm}
                    acc={acc}
                    theme={currentTheme}
                />
            }
            <div className="main-text-input" style={{ display: showResult ? "none" : "block" }}>
                <i className="fa-solid fa-keyboard icon"
                    style={{ color: inputFocus ? currentTheme.main : currentTheme.correct }}></i>
                <input type="text"
                    autoFocus
                    onKeyDown={handleKeyPress}
                    id="user-input"
                    onChange={handleChange}
                    value={currentInput}
                    onFocus={() => setInputFocus(true)}
                    onBlur={() => setInputFocus(false)}
                    style={{
                        color: currentTheme.main,
                        border: "3px solid " + currentTheme.main,
                        borderColor: inputFocus? currentTheme.main : currentTheme.correct
                    }}>
                </input>
                <p style={{color: currentTheme.correct}}>version 0.1</p>
            </div>

        </section>
    )
}

export default Home;