import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });

async function askQuestion(question) {
    return await rl.question(question);
}

import { ANSI } from './ansi.mjs';
import { HANGMAN_UI } from './graphics.mjs';

const arrayOfWords = ["cat", "dog", "sun", "run", "cup", "bat", "pen", "map", "car", "box",
    "red", "top", "net", "sit", "hat", "bee", "wet", "key", "bus", "log",
    "bag", "pot", "pin", "fit", "hit", "lip", "tap", "bed", "jet", "fun",
    "bit", "fog", "cut", "jar", "bar", "dot", "hop", "can", "jam", "pad",
    "rug", "zip", "tag", "pie", "toy", "bun", "rod", "fix", "oak", "fox"]; 

let randomlyPickedAnswer = arrayOfWords[Math.floor(Math.random() * arrayOfWords.length)];
let correctWord = randomlyPickedAnswer.toLowerCase();
let numberOfCharInWord = correctWord.length;
let guessedWord = "".padStart(correctWord.length, "_"); 
let wordDisplay = "";
let isGameOver = false;
let wasGuessCorrect = false;
let wrongGuesses = [];
const PLAYER_MESSAGES = {
WIN: "Congratulation, you guessed the right word!",
GAME_END: "Game Over",
INSERT_CHAR_OR_WORD: "Guess a char or the word : ",
CORRECT_GUESSES: "You guessed correct this many times : ",
WRONG_GUESSES: "You guessed wrong this many times : ",
REPLAY: "Type yes if you want to play again. : ",
REPLAY_ANSWER: "yes",
};
const CHAR = {
SPACE: " ",
LINES: "_",
PLAYER_TYPED_WORD: ""
};
let wrongGuessCount = 0;
let correctGuessCount = 0;

function drawWordDisplay() {

    wordDisplay = CHAR.PLAYER_TYPED_WORD;

    for (let i = 0; i < numberOfCharInWord; i++) {

        if (guessedWord[i] != CHAR.LINES) {
            wordDisplay += ANSI.COLOR.GREEN;
        }
        wordDisplay = wordDisplay + guessedWord[i] + CHAR.SPACE;
        wordDisplay += ANSI.RESET;
    }

    return wordDisplay;
}

async function gameStart() {
    let wantToReplay = "";
        do {
                randomlyPickedAnswer = arrayOfWords[Math.floor(Math.random() * arrayOfWords.length)];
                correctWord = randomlyPickedAnswer.toLowerCase();
                numberOfCharInWord = correctWord.length;
                guessedWord = "".padStart(correctWord.length, "_");
                wordDisplay = "";
                isGameOver = false;
                wasGuessCorrect = false;
                wrongGuesses = [];

                await game();

                wantToReplay = (await askQuestion(PLAYER_MESSAGES.REPLAY)).toLowerCase();
                wrongGuessCount = 0;
                correctGuessCount = 0;
            } while (wantToReplay == "yes")

            process.exit();
    }
    function drawList(list, color) {
        let output = "";
        for (let i = 0; i < list.length; i++) {
            output += list[i] + CHAR.SPACE;
        } 
        return color + output + ANSI.RESET; //there is a m in the ANSI for the color, and so if the player guess m it bugs
    }
async function game() {
            while (!isGameOver) {
            console.log(ANSI.CLEAR_SCREEN);
            console.log(drawWordDisplay());
            console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
            console.log(HANGMAN_UI[wrongGuesses.length]);

            const answer = (await askQuestion(PLAYER_MESSAGES.INSERT_CHAR_OR_WORD)).toLowerCase();

            if (answer === correctWord) {
                isGameOver = true;
                wasGuessCorrect = true;
            } else if (ifPlayerGuessedLetter(answer)) {
                let org = guessedWord;
                guessedWord = CHAR.PLAYER_TYPED_WORD;

                let isCorrect = false;
                for (let i = 0; i < correctWord.length; i++) {
                    if (correctWord[i] == answer) {
                        guessedWord += answer;
                        isCorrect = true;
                        correctGuessCount++;
                    } else {
                        guessedWord += org[i];
                    }
                }

                if (isCorrect == false) {
                    wrongGuesses.push(answer);
                    wrongGuessCount++;
                } else if (guessedWord === correctWord) {
                    isGameOver = true;
                    wasGuessCorrect = true;
                }
            }

            if (wrongGuesses.length === HANGMAN_UI.length) {
                isGameOver = true;
            }
        }
        console.log(ANSI.CLEAR_SCREEN);
        console.log(drawWordDisplay());
        console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
        console.log(HANGMAN_UI[wrongGuesses.length]);

        if (wasGuessCorrect) {
            console.log(ANSI.COLOR.YELLOW + PLAYER_MESSAGES.WIN);
        
        }
        
        console.log(PLAYER_MESSAGES.GAME_END);
        console.log(PLAYER_MESSAGES.CORRECT_GUESSES + correctGuessCount);
        console.log(PLAYER_MESSAGES.WRONG_GUESSES + wrongGuessCount);

        }



        function ifPlayerGuessedLetter(answer) {
            return answer.length === 1;
        }

        await gameStart();