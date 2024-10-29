/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

// Mixed word list with animals and household items
const words = [
  "chair", "dog", "pencil", "cat", "bottle",
  "lion", "table", "sofa", "tiger", "lamp",
  "elephant", "book", "spoon", "giraffe", "clock",
  "rabbit", "phone", "pillow", "mouse", "wallet",
  "panther", "piano", "carpet", "horse", "mirror",
  "kangaroo", "cup", "curtain", "sheep", "door"
];

const App = () => {
  const [currentWord, setCurrentWord] = React.useState('');
  const [scrambledWord, setScrambledWord] = React.useState('');
  const [guess, setGuess] = React.useState('');
  const [score, setScore] = React.useState(parseInt(localStorage.getItem('score')) || 0);
  const [strikes, setStrikes] = React.useState(parseInt(localStorage.getItem('strikes')) || 0);
  const [passes, setPasses] = React.useState(parseInt(localStorage.getItem('passes')) || 3);
  const [gameOver, setGameOver] = React.useState(false);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    const savedWords = JSON.parse(localStorage.getItem("wordsLeft")) || words;
    setGameOver(savedWords.length === 0);
    getNextWord(savedWords);
  }, []);

  const getNextWord = (wordsLeft) => {
    const nextWord = wordsLeft[Math.floor(Math.random() * wordsLeft.length)];
    setCurrentWord(nextWord);
    setScrambledWord(shuffle(nextWord));
    saveProgress({ wordsLeft: wordsLeft.filter(w => w !== nextWord) });
  };

  const guessHandler = () => {
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      setScore(score + 1); 
      setMessage("Correct! Next Word");
      getNextWord(JSON.parse(localStorage.getItem("wordsLeft")));
    } else {
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      if (newStrikes >= 3) {
        setGameOver(true);
      }
      setMessage("Wrong! Try Again");
    }
    setGuess("");
  };

  const passHandler = () => {
    if (passes > 0) {
      setPasses(passes - 1); 
      setMessage("Pass used! Next word.");
      getNextWord(JSON.parse(localStorage.getItem("wordsLeft")));
    } else {
      setMessage("No more passes available.");
    }
  };

  const restartGame = () => {
    localStorage.clear();
    setScore(0);
    setStrikes(0);
    setPasses(3);
    setGameOver(false);
    setGuess("");
    setMessage("");
    getNextWord(words);
  };

  const saveProgress = (gameState) => {
    localStorage.setItem("wordsLeft", JSON.stringify(gameState.wordsLeft));
  };

  return (
    <div className="game-container">
      <h1>Welcome to Scramble</h1>
      <div className="score-strikes">
        <div>
          <p>{score}</p>
          <span>POINTS</span>
        </div>
        <div>
          <p>{strikes}</p>
          <span>STRIKES</span>
        </div>
      </div>
      {gameOver ? (
        <div>
          <h2>Game Over!</h2>
          <button onClick={restartGame}>Play Again</button>
        </div>
      ) : (
        <div>
          <h2 className="scrambled-word">{scrambledWord}</h2>
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && guessHandler()}
          />
          <div className="buttons">
            <button onClick={guessHandler}>Guess</button>
            <button onClick={passHandler} className="pass-button" disabled={passes <= 0}>
              Pass ({passes} Remaining)
            </button>
          </div>
          <p className="message">{message}</p>
        </div>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
