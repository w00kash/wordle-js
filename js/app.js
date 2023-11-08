const createGrid = (container) => {
  state.grid.forEach((row, rowIndex) => {
    const rowElement = document.createElement("div");
    rowElement.setAttribute("id", "row-" + rowIndex);

    row.forEach((tile, tileIndex) => {
      const tileElement = document.createElement("div");
      tileElement.setAttribute(
        "id",
        "row-" + rowIndex + "-tile-" + tileIndex
      );
      tileElement.classList.add("tile");
      rowElement.append(tileElement);
    });

    container.append(rowElement);
  });
};

const handleClick = (key) => {

  if (!state.gameOver) {
    if (key === "«") {
      deleteLetter();
    } else if (key === "ENTER") {
      checkRow();
    } else {
      addLetter(key);
    }
  }
};

const createKey = (container, key) => {
  const buttonKey = document.createElement("button");
  buttonKey.textContent = key;
  buttonKey.setAttribute("id", key);
  buttonKey.addEventListener("click", () => handleClick(key));

  container.append(buttonKey);

  return buttonKey;
};

const createKeyboard = (container) => {
  const keys = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "ENTER",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
    "«",
  ];

  keys.forEach((key) => {
    createKey(container, key);
  });
};

const addLetter = (letter) => {
  if (state.currentTile < 5 && state.currentRow < 6) {
    const tile = document.getElementById(
      `row-${state.currentRow}-tile-${state.currentTile}`
    );
    tile.textContent = letter;
    tile.setAttribute("data", letter);

    setTimeout(() => {
      tile.classList.add("zoom");
    }, 100);

    setTimeout(() => {
      tile.classList.remove("zoom");
    }, 200);

    state.grid[state.currentRow][state.currentTile] = letter;
    state.currentTile++;
  }
};

const deleteLetter = () => {
  if (state.currentTile > 0) {
    state.currentTile--;
    const tile = document.getElementById(
      `row-${state.currentRow}-tile-${state.currentTile}`
    );
    tile.textContent = '';
    tile.setAttribute('data', '');
  }
};

const checkRow = () => {
  if (state.currentTile > 4) {
    const guess = state.grid[state.currentRow].join("");

    checkWord(guess);

    console.log('validWord: ', validWord);

    if (true) {

      validWord = false;

      flipTiles();

      if (guess == state.wordle) {

        const rowTiles = document.querySelector("#row-" + state.currentRow).childNodes;

        rowTiles.forEach((tile, index) => {
          setTimeout(() => {
            tile.classList.add("bounce");
          }, 2500 + (200 * index));
        });

        showMessage("Excellent!");
        state.gameOver = true;

      } else {
        if (state.currentRow >= 5) {
          showMessage("Game Over. The world was: " + state.wordle);
        } else {
          state.currentRow++;
          state.currentTile = 0;
        }
      }
    }
  }
};

const showMessage = (message) => {
    const messageBox = document.createElement('p');
    messageBox.textContent = message;
    messageContainer.append(messageBox);
    setTimeout(() => messageContainer.removeChild(messageBox), 8000);
}

const addColorToKey = (keyLetter, color) => {
  const key = document.getElementById(keyLetter)
  key.classList.add(color)
}

const flipTiles = () => {
  const rowTiles = document.querySelector("#row-" + state.currentRow).childNodes;
  let checkWord = state.wordle;

  const guess = Array();

  rowTiles.forEach((tile, index) => {

    guess.push({ letter: tile.getAttribute("data"), color: "grey-overlay" });

    guess.forEach((guess, index) => {
      if (guess.letter == state.wordle[index]) {
        guess.color = "green-overlay";
        checkWord = checkWord.replace(guess.letter, "");
      }
    });

    guess.forEach((guess) => {
      if (checkWord.includes(guess.letter)) {
        guess.color = "yellow-overlay";
        checkWord = checkWord.replace(guess.letter, "");
      }
    });

    rowTiles.forEach((tile, index) => {
      setTimeout(() => {
        tile.classList.add("flip");
        tile.classList.add(guess[index].color);
        addColorToKey(guess[index].letter, guess[index].color);
      }, 500 * index);
    });
  });
};

const isLetter = (key) => {
    return key.length === 1 && key.match(/[a-z]/i);
}

const registerKeyboardEvents = () => {
  document.body.onkeydown = (e) => {
    const key = e.key;
    if (!state.gameOver) {
      if (key === "Enter") {
        checkRow();
      } else if (key === "Backspace") {
        deleteLetter(key);
      } else if (isLetter(key)) {
        addLetter(key.toUpperCase() + "");
      }
    }
  };
};

const wordContainesLetter = (word, letter) => {
    if(word.includes(letter)) {
      return true;
    } else {
      return false;
    }
}

const checkWord = (word) => {

  const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word;

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = (e) => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      let apiResponse = JSON.parse(xhttp.responseText);
      
      console.log(apiResponse);
      validWord = true;
      
    } else {
      validWord = false;
    }
  };

  try {
    xhttp.open("GET", url);
    xhttp.send();
  } catch (error) {
    console.log(error);
    validWord = false;
  }


  // axios
  // .get(url)
  // .then((response) => {
  //   if(response.status == 200) {
  //     console.log(response);
  //     return (1 > 0);
  //   } else {
  //     return (1 < 0);
  //   }
  // })
  // .catch((err) => {
  //   console.log(err);
  //   return (1 < 0);
  // });
}

const encode = (txt) => {
    return btoa(txt);
}

function decode() {
  return atob(txt);
}

const getWordle = () => {
  fetch("https://random-word-api.herokuapp.com/word?length=5&lang=en")
    .then((response) => response.json())
    .then((json) => {
      state.wordle = json.pop().toUpperCase();
      //let encodedValue = btoa(state.wordle);
      //console.log(encodedValue);
      console.log(state.wordle);
    })
    .catch((err) => console.log(err));
};

const init = () => {
  createKeyboard(keyboardContainer);
  createGrid(tileContainer);
}

/* Main code */

const keyboardContainer = document.querySelector(".keyboard-container");
const tileContainer = document.querySelector(".tile-container");
const messageContainer = document.querySelector(".message-container");

var validWord = false;

// Game state data
const state = {
  grid: Array(6)
    .fill()
    .map(() => Array(5).fill("")),
  currentRow: 0,
  currentTile: 0,
  gameOver: false,
  wordle: ''
};

init();

getWordle();
registerKeyboardEvents();
