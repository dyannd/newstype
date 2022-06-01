import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import words from './words.txt';
import $ from 'jquery';

function Home() {
    const [para, setPara] = useState([]);
    const [currentWordIdx, setCurrentWordIdx] = useState(0);
    const [currentInput, setCurrentInput] = useState("");
    const [currentHeightFromTop, setCurrentHeightFromTop] = useState(0);
    const [correctWords, setCorrectWords] = useState(0);
    const [totalWordsTyped, setTotalWordsTyped] = useState(0);
    const [startIdx, setStartIdx] = useState(0);
    const [endIdx, setEndIdx] = useState(0);
    const [gettingText, setGettingText] = useState(true);
    const [isCorrect, setIsCorrect] = useState(0);
    //perform only once when is HOme is mounted to tree, getText() and display it
    useEffect(() => {
        getText();
        console.log($("#word-1").position())
    }, [])

    //update related attributes when the currentwordIdx changes 
    useEffect(() => {
        console.log(gettingText);
        if (!gettingText) {
            //update current height from top of screen to the current word
            var element = document.getElementById("word-" + currentWordIdx)
            var heightToTop = element !== null ?
                element.getBoundingClientRect().top : 0;

            //determines new line if previous height reference is different from 
            //the new height to top, apart from the zero case (beginning)
            if (prevHeight.current < heightToTop && prevHeight.current !== 0) {

                // //if so, deletes all previous words (create new render line)
                // for (let idx = startIdx; idx < endIdx; idx++) {
                //     document.getElementById("word-" + idx).remove();
                // }

                //if so, deletes all previous words (create new render line)
                for (let idx = 0; idx < currentWordIdx; idx++) {
                    document.getElementById("word-" + idx).style.display = "none";
                }

                // //set startIdx to the current endIdx
                // setStartIdx(endIdx);
            }

            //updates height
            setCurrentHeightFromTop(heightToTop);

        } else { 
            //set getText to false
            setGettingText(false);
        }

    }, [currentWordIdx]);

    //create to save previous states of height 
    const prevHeight = useRef(0);
    useEffect(() => {
        prevHeight.current = currentHeightFromTop;
    }, [currentHeightFromTop])


    //randomize the text from the list to create a paragraph
    function getText() {
        //reset all states
        reset();

        //get words from file
        fetch(words)
            .then(r => r.text())
            .then(text => {
                //push the words to an array and save to textList state
                var wordArray = text.split(/\r\n/);
                var paragraph = []
                //generate 300 words paragraph from the array above
                for (let i = 0; i < 300; i++) {
                    //get a random indx from textlist
                    const randInt = Math.floor(Math.random() * wordArray.length);
                    paragraph.push(wordArray[randInt]);
                }

                //update current paragraph
                setPara(paragraph);
            })

    }

    //handle spacebar when receive input 
    function handleKeyPress(event) {
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
            //set end idx 
            setEndIdx(prev => prev + 1);
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
        console.log(currentWordIdx);
        //if input is the same, increase correct
        //also add the correct-word class in
        if (completeWord === para[currentWordIdx]) {
            setCorrectWords(prev => prev + 1);
            document.getElementById("word-" + currentWordIdx).style.color = "white";
        } else {
            //if not correct, add the wrong-word class 
            document.getElementById("word-" + currentWordIdx).style.color = "red";
        }
    }

    //reset all states and input
    function reset() {
        setGettingText(true);
        setCurrentWordIdx(0);
        setCorrectWords(0);
        setTotalWordsTyped(0);
        setCurrentInput("");
        // setStartIdx(0);
        // setEndIdx(0);
    }

    return (
        <section id="Home">
            <div className="text-controls" onClick={getText}>
                Generate
            </div>
            <div className="stat-indicator-tracker" >
                <span>
                    <h3>Time: </h3>
                </span>
                <span>
                    <h3>Correct: {correctWords}</h3>
                </span>
                <span>
                    <h3>Total: {totalWordsTyped}</h3>
                </span>
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
                }
                )}

            </div>
            <div className="main-text-input">
                <input type="text"
                    autoFocus
                    onKeyDown={handleKeyPress}
                    id="user-input"
                    onChange={handleChange}
                    value={currentInput}
                >

                </input>
            </div>
        </section>
    )
}

export default Home;