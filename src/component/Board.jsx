import { useState, useRef, useEffect } from "react";
import Button from "./Button";
import Card from "./Card";
import "./Board.css";
import "../App.css";
import gif from "../assets/gold-winner.gif";

// shuffle the cardValue array
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

// method to check {} is empty or not
function isObjectEmpty(value) {
  return (
    Object.prototype.toString.call(value) === "[object Object]" &&
    JSON.stringify(value) === "{}"
  );
}

// creating values of the card
const createCardValue = (cardLevel) => {
  const card = [];
  for (let i = 1; i <= cardLevel; i++) {
    card.push({
      flip: false,
      value: Math.ceil(i / 2),
    });
  }
  shuffle(card); //initial game start
  return card;
};

function Board({ playerName }) {
  const easyLevel = 8,
    mediumLevel = 16,
    hardLevel = 24; // initialinzing state

  const [gameStart, setgameStart] = useState(true);
  const [cardLevel, setCardLevel] = useState(easyLevel);
  const [cardDeck, setCardDeck] = useState(createCardValue(cardLevel));
  const [compareCardArr, setCompareCardArr] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [heading, setHeading] = useState("");
  const [pairCounter, setPairCounter] = useState(1);
  const [movesCounter, setMovesCounter] = useState(0);
  const [customeLevel, setcustomeLevel] = useState(easyLevel); // Restarting the game after game is over
  const [bgPosition, setBgPosition] = useState({ x: 50, y: 50 });

  const boardRootRef = useRef(null);

  useEffect(() => {
    const boardDiv = boardRootRef.current;
    if (!boardDiv) return;
    function handleMove(e) {
      const rect = boardDiv.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      boardDiv.style.setProperty("--bg-x", `${x}%`);
      boardDiv.style.setProperty("--bg-y", `${y}%`);
    }
    boardDiv.addEventListener("mousemove", handleMove);

    function handleLeave() {
      boardDiv.style.setProperty("--bg-x", "50%");
      boardDiv.style.setProperty("--bg-y", "50%");
    }
    boardDiv.addEventListener("mouseleave", handleLeave);

    return () => {
      boardDiv.removeEventListener("mousemove", handleMove);
      boardDiv.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const restartGame = (level) => {
    resetGame(level);
    setHeading(`Hello! ${playerName}, Let's Rock!!🚀🚀`);
    setGameOver(false);
  }; // Resetting the game if player want to start over again.

  const resetGame = (level) => {
    // shuffle(card);
    setCardDeck(createCardValue(level));
    setCompareCardArr({});
    setPairCounter(1);
    setMovesCounter(0);
  };

  const scoreCalculation = () => {
    let baseScore = cardLevel / 2 - 1;
    return Math.round((baseScore / movesCounter) * 100);
  }; // function to check game is ended or not

  const gameEnd = () => {
    if (pairCounter >= cardLevel / 2) {
      setHeading(`Hurrah! 🎉 You won with ${scoreCalculation()}% accuracy`);
      setTimeout(() => {
        setGameOver(true);
      }, 1500);
    }
  }; // Starting game according to level or custome input

  const levelSetUp = (level) => {
    setCardLevel(level);
    restartGame(level);
  };

  const customLevelSetup = (event) => {
    setcustomeLevel(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHeading(`Hello! ${playerName}, Let's Rock!!🚀🚀`);
    setgameStart(true);
  };

  const setCompareArr = (newState) => {
    // updating CardDeck value according to new state value
    setCardDeck(
      cardDeck.map((item, id) => {
        if (id === newState.id) {
          item.flip = newState.flip;
          return item;
        } else {
          return item;
        }
      })
    ); // comparring previous click with new click and assigning value accordingly
    setCompareCardArr((preState) => {
      if (isObjectEmpty(preState)) {
        return newState; // prev state is empty so returing new state value
      } else if (preState.id === newState.id) {
        return preState; // prev click and new click on same card, returning same value
      } else if (preState.value === newState.value) {
        setPairCounter(pairCounter + 1); // increasing pairCounter if preValue and newValue is same.
        setMovesCounter(movesCounter + 1);
        gameEnd();
        return {};
      } else {
        setMovesCounter(movesCounter + 1);
        setTimeout(() => {
          // setting card value to previous state as pair is not found
          setCardDeck(
            cardDeck.map((item, id) => {
              if (id === preState.id || id === newState.id) {
                item.flip = false;
                return item;
              } else {
                return item;
              }
            })
          );
        }, 500);
        return {};
      }
    });
  };

  return (
    <>
       {" "}
      <div className="board-root" ref={boardRootRef}>
        {" "}
        <div className="levels-panel">
          {" "}
          <button
            className={`level-button${
              cardLevel === easyLevel ? " active" : ""
            }`}
            onClick={() => levelSetUp(easyLevel)}
          >
            Easy{" "}
          </button>{" "}
          <button
            className={`level-button${
              cardLevel === mediumLevel ? " active" : ""
            }`}
            onClick={() => levelSetUp(mediumLevel)}
          >
            Medium{" "}
          </button>{" "}
          <button
            className={`level-button${
              cardLevel === hardLevel ? " active" : ""
            }`}
            onClick={() => levelSetUp(hardLevel)}
          >
            Hard{" "}
          </button>{" "}
        </div>{" "}
        <div className="board-center">
          {" "}
          <div className="moves-row">
            {" "}
            <button className="moves-btn" disabled>
              Moves: {movesCounter}{" "}
            </button>{" "}
            <Button
              handleClick={() => resetGame(cardLevel)}
              disabled={gameOver}
              title="Reset"
            />{" "}
          </div>{" "}
          {gameOver ? (
            <div className="winnerContainer">
              {" "}
              <iframe
                title="winner Gif"
                src={gif}
                className="winnerGif"
              ></iframe>{" "}
              <br></br>
              <Button
                handleClick={() => restartGame(cardLevel)}
                title="Play Again"
              />{" "}
            </div>
          ) : (
            <div
              className={`board-game ${cardLevel >= 18 ? "hard-board" : ""}`}
            >
              {" "}
              {cardDeck.map((item, id) => (
                <Card
                  key={id}
                  cardDeck={cardDeck}
                  {...item}
                  id={id}
                  compareCardArr={compareCardArr}
                  setCompareArr={setCompareArr}
                />
              ))}{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </>
  );
}

export default Board;
