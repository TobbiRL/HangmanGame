import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });

async function askQuestion(question) {
    return await rl.question(question);
}

//#endregion

import { ANSI } from './ansi.mjs';
import { HANGMAN_UI } from './graphics.mjs';

/*
    1. Pick a word
    2. Draw one "line" per char in the picked word.
    3. Ask player to guess one char || the word (knowledge: || is logical or)
    4. Check the guess.
    5. If guess was incorect; continue drawing 
    6. Update char display (used chars and correct)
    7. Is the game over (drawing complete or word guessed)
    8. if not game over start at 3.
    9. Game over
*/

let arrayOfWords = ["cat", "dog", "sun", "run", "cup", "bat", "pen", "map", "car", "box",
    "red", "top", "net", "sit", "hat", "bee", "wet", "key", "bus", "log",
    "bag", "pot", "pin", "fit", "hit", "lip", "tap", "bed", "jet", "fun",
    "bit", "fog", "cut", "jar", "bar", "dot", "hop", "can", "jam", "pad",
    "rug", "zip", "tag", "pie", "toy", "bun", "rod", "fix", "oak", "fox"]; //used chatgpt to generate the words

let randomlyPickedAnswer = arrayOfWords[Math.floor(Math.random() * arrayOfWords.length)];

let correctWord = randomlyPickedAnswer.toLowerCase();
let numberOfCharInWord = correctWord.length;
let guessedWord = "".padStart(correctWord.length, "_"); // "" is an empty string that we then fill with _ based on the number of char in the correct word.
let wordDisplay;
let isGameOver = false;
let wasGuessCorrect = false;
let wrongGuesses = [];
let winnerMessage = "Congratulation, winner winner chicken dinner";
let gameEndMessage = "Game Over";
let insertCharOrWord = "Guess a char or the word : ";
let charSpace = " ";
let charLines = "_";
let playerTypedWord = ""; 


//wordDisplay += ANSI.COLOR.GREEN;

function drawWordDisplay() {

    wordDisplay = playerTypedWord;

    for (let i = 0; i < numberOfCharInWord; i++) {
        //i == 0, wordDisplay == "", guessedWord[0] == "_";
        //i == 1, wordDisplay == "_ ", guessedWord[1] == "_";
        //i == 2, wordDisplay == "_ _ ", guessedWord[2] == "_";
        if (guessedWord[i] != charLines) {
            wordDisplay += ANSI.COLOR.GREEN;
        }
        wordDisplay = wordDisplay + guessedWord[i] + charSpace;
        wordDisplay += ANSI.RESET;
        //i == 0, wordDisplay == "_ ", guessedWord[0] == "_";
        //i == 1, wordDisplay == "_ _ ", guessedWord[1] == "_";
        //i == 2, wordDisplay == "_ _ _", guessedWord[2] == "_";
    }

    return wordDisplay;
}

function drawList(list, color) {
    let output = color;
    for (let i = 0; i < list.length; i++) {
        output += list[i] + charSpace;
    }

    return output + ANSI.RESET;
}

// Continue playing until the game is over. 
while (isGameOver == false) {

    console.log(ANSI.CLEAR_SCREEN);
    console.log(drawWordDisplay());
    console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
    console.log(HANGMAN_UI[wrongGuesses.length]);

    const answer = (await askQuestion(insertCharOrWord)).toLowerCase();

    if (answer == correctWord) {
        isGameOver = true;
        wasGuessCorrect = true;
    } else if (ifPlayerGuessedLetter(answer)) {

        let org = guessedWord;
        guessedWord = playerTypedWord;

        let isCorrect = false;
        for (let i = 0; i < correctWord.length; i++) {
            if (correctWord[i] == answer) {
                guessedWord += answer;
                isCorrect = true;
            } else {
                // If the currents answer is not what is in the space, we should keep the char that is already in that space. 
                guessedWord += org[i];
            }
        }

        if (isCorrect == false) {
            wrongGuesses.push(answer);
        } else if (guessedWord == correctWord) {
            isGameOver = true;
            wasGuessCorrect = true;
        }
    }

    // Read as "Has the player made to many wrong guesses". 
    // This works because we cant have more wrong guesses then we have drawings. 
    if (wrongGuesses.length == HANGMAN_UI.length) {
        isGameOver = true;
    }

}

// OUR GAME HAS ENDED.

console.log(ANSI.CLEAR_SCREEN);
console.log(drawWordDisplay());
console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
console.log(HANGMAN_UI[wrongGuesses.length]);

if (wasGuessCorrect) {
    console.log(ANSI.COLOR.YELLOW + winnerMessage);
}
console.log(gameEndMessage);
process.exit();



function ifPlayerGuessedLetter(answer) {
    return answer.length == 1
}

