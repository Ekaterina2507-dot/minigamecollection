document.addEventListener('DOMContentLoaded', function() {
  setupNavigation();
  initRockPaperScissors();
  initMemoryGame();
  initTicTacToe();
  initHangman();
  initPuzzle15();
  initPuzzle();
});

const gameCards = document.querySelectorAll('.game-card');
const screens = document.querySelectorAll('.screen');

gameCards.forEach(card => {
  card.addEventListener('click', () => {
    const gameId = card.getAttribute('data-game');
    screens.forEach(screen => screen.classList.remove('active'));
    document.getElementById(gameId).classList.add('active');
    
    if (gameId === 'hangman') {
      initHangman();
    } else if (gameId === 'puzzle-15') {
      initPuzzle15();
    }
  });
});

// Navigation setup for all games
function setupNavigation() {
  const gameCards = document.querySelectorAll('.game-card');
  gameCards.forEach(card => {
    card.addEventListener('click', () => {
      const gameId = card.getAttribute('data-game');
      navigateToScreen(gameId);
    });
  });

  const backButtons = document.querySelectorAll('.back-button');
  backButtons.forEach(button => {
    button.addEventListener('click', () => {
      navigateToScreen('main-menu');
    });
  });

  const startButtons = document.querySelectorAll('.startGame');
  startButtons.forEach(button =>{
    button.addEventListener('click', () =>{
      navigateToScreen('.game-content')
    })
  })
}

function navigateToScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

// Rock Paper Scissors Game
function initRockPaperScissors() {
  const choices = document.querySelectorAll('.choice');
  const playerChoiceDisplay = document.getElementById('player-choice-display');
  const computerChoiceDisplay = document.getElementById('computer-choice-display');
  const resultMessage = document.getElementById('result-message');
  const userScoreElement = document.getElementById('user-score');
  const computerScoreElement = document.getElementById('computer-score');

  let userScore = 0;
  let computerScore = 0;

  choices.forEach(choice => {
    choice.addEventListener('click', () => {
      const playerChoice = choice.getAttribute('data-choice');
      playRockPaperScissors(playerChoice);
    });
  });

  function playRockPaperScissors(playerChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];

    playerChoiceDisplay.textContent = getEmoji(playerChoice);
    computerChoiceDisplay.textContent = getEmoji(computerChoice);

    const result = getResult(playerChoice, computerChoice);

    if (result === 'win') {
      userScore++;
      resultMessage.textContent = 'You win!';
    } else if (result === 'lose') {
      computerScore++;
      resultMessage.textContent = 'You lose!';
    } else {
      resultMessage.textContent = "It's a draw!";
    }

    userScoreElement.textContent = userScore;
    computerScoreElement.textContent = computerScore;
  }

  function getEmoji(choice) {
    switch(choice) {
      case 'rock': return '✊';
      case 'paper': return '✋';
      case 'scissors': return '✌️';
      default: return '?';
    }
  }

  function getResult(player, computer) {
    if (player === computer) return 'draw';
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 'win';
    }
    return 'lose';
  }
}

// Memory Game with customizable settings
function initMemoryGame() {
  const cardsContainer = document.getElementById('memory-cards');
  const movesCounter = document.getElementById('moves-count');
  const timeCounter = document.getElementById('time');
  const restartButton = document.getElementById('restart-memory');
  const boardSizeSelect = document.getElementById('board-size');
  const difficultySelect = document.getElementById('difficulty');
  const settingsForm = document.getElementById('game-settings');
  const gameContainer = document.getElementById('game-container');
  const settingsContainer = document.getElementById('settings-container');
  const backToSettingsButton = document.getElementById('back-to-settings');

  let cards = [];
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let matches = 0;
  let timer = null;
  let timeLeft = 0;
  let boardSize = 4;
  let totalPairs = 0;

  const allCardIcons = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🦁', '🐮', '🐷', '🐸', '🐵', '🦄', '🐙', '🦋', '🐢', '🦀', '🐬', '🦈', '🦜', '🦚', '🦉', '🐝', '🦇', '🐺', '🐗', '🦒', '🦓', '🦍'];

  const difficultySettings = {
    'easy': { 3: 120, 4: 180, 5: 240 },
    'medium': { 3: 90, 4: 120, 5: 180 },
    'hard': { 3: 60, 4: 90, 5: 120 },
    'custom': 0
  };

  function showSettings() {
    gameContainer.style.display = 'none';
    settingsContainer.style.display = 'block';
  }

  function startGame(e) {
    if (e) e.preventDefault();
    
    boardSize = parseInt(boardSizeSelect.value);
    const difficulty = difficultySelect.value;
    
    if (difficulty === 'custom') {
      const customTimeInput = document.getElementById('custom-time');
      timeLeft = parseInt(customTimeInput.value) || 120;
    } else {
      timeLeft = difficultySettings[difficulty][boardSize];
    }
    
    const totalCells = boardSize * boardSize;
    totalPairs = totalCells % 2 === 0 ? totalCells / 2 : (totalCells - 1) / 2;
    
    settingsContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    
    startMemoryGame();
  }

  function toggleCustomTimeInput() {
    const customTimeGroup = document.getElementById('custom-time-group');
    customTimeGroup.style.display = difficultySelect.value === 'custom' ? 'block' : 'none';
  }

  function startMemoryGame() {
    resetMemoryGame();
    generateCards();
    startTimer();
  }

  function generateCards() {
    if (totalPairs > allCardIcons.length) {
      alert('Not enough icons for the selected board size!');
      showSettings();
      return;
    }

    const selectedIcons = allCardIcons.slice(0, totalPairs);
    cards = [...selectedIcons, ...selectedIcons];
    
    const totalCells = boardSize * boardSize;
    if (totalCells % 2 !== 0) {
      cards.push('empty'); // Special card for odd grid size
    }
    
    cards.sort(() => Math.random() - 0.5);

    cardsContainer.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    cardsContainer.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;
    cardsContainer.style.gap = '5px';
    cardsContainer.innerHTML = '';

    cards.forEach((icon, index) => {
      const card = document.createElement('div');
      card.classList.add('memory-card');
      card.dataset.index = index;
      
      if (icon === 'empty') {
        card.classList.add('empty-card');
        card.dataset.value = 'empty';

        const front = document.createElement('div');
        front.classList.add('front', 'empty-front');
        front.innerHTML = '';

        const back = document.createElement('div');
        back.classList.add('back', 'empty-back');
        back.innerHTML = '';

        card.appendChild(front);
        card.appendChild(back);
      } else {
        card.dataset.value = icon;

        const front = document.createElement('div');
        front.classList.add('front');
        front.textContent = icon;

        const back = document.createElement('div');
        back.classList.add('back');
        back.textContent = '?';

        card.appendChild(front);
        card.appendChild(back);
        card.addEventListener('click', flipCard);
      }
      
      cardsContainer.appendChild(card);
    });

    const cardElements = document.querySelectorAll('.memory-card');
    cardElements.forEach(card => {
      if (boardSize === 3) {
        card.style.width = '90px';
        card.style.height = '90px';
        card.style.fontSize = '24px';
      } else if (boardSize === 4) {
        card.style.width = '70px';
        card.style.height = '70px';
        card.style.fontSize = '20px';
      } else if (boardSize === 5) {
        card.style.width = '60px';
        card.style.height = '60px';
        card.style.fontSize = '16px';
      }

      if (card.classList.contains('empty-card')) {
        card.style.backgroundColor = '#f0f0f0';
        card.style.border = '2px dashed #ccc';
        card.style.cursor = 'default';
        card.style.opacity = '0.5';
      }
    });
  }

  function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains('flipped') || this.classList.contains('empty-card')) return;

    this.classList.add('flipped');

    if (!firstCard) {
      firstCard = this;
      return;
    }

    secondCard = this;
    lockBoard = true;
    moves++;
    movesCounter.textContent = moves;
    checkForMatch();
  }

  function checkForMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
      disableCards();
      matches++;

      if (matches === totalPairs) {
        setTimeout(() => {
          clearInterval(timer);
          alert(`Congratulations! You found all pairs in ${moves} moves!`);
          showSettings();
        }, 500);
      }
    } else {
      unflipCards();
    }
  }

  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetBoard();
  }

  function unflipCards() {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetBoard();
    }, 1000);
  }

  function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }

  function startTimer() {
    clearInterval(timer);
    updateTimerDisplay();

    timer = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        alert('Time is up! Try again.');
        showSettings();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeCounter.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  function resetMemoryGame() {
    clearInterval(timer);
    moves = 0;
    matches = 0;
    movesCounter.textContent = moves;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  restartButton.addEventListener('click', startMemoryGame);
  settingsForm.addEventListener('submit', startGame);
  difficultySelect.addEventListener('change', toggleCustomTimeInput);
  backToSettingsButton.addEventListener('click', showSettings);

  toggleCustomTimeInput();
  showSettings();
}

document.addEventListener('DOMContentLoaded', initMemoryGame);


function initTicTacToe() {
  const settings = document.getElementById('tic-tac-toe-settings');
  const gameplayArea = document.getElementById('tic-tac-toe-gameplay');
  const board = document.getElementById('tic-tac-toe-board');
  const cells = board.querySelectorAll('.cell');
  const status = document.getElementById('game-status');
  const gameModeSelect = document.getElementById('gameMode');
  const difficultySelect = document.getElementById('difficulty');
  const difficultySetting = document.getElementById('difficultySetting');
  const startGameBtn = document.getElementById('startGame');
  const resetGameBtn = document.getElementById('reset-tictactoe');
  
  let currentMode = 'vsComputer';
  let currentDifficulty = 'easy';
  let currentPlayer = 'X';
  let gameBoard = Array(9).fill('');
  let gameActive = false;
  
  const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
      [0, 4, 8], [2, 4, 6]             // diagonal
  ];
  
  gameModeSelect.addEventListener('change', (e) => {
      currentMode = e.target.value;
      difficultySetting.style.display = currentMode === 'vsComputer' ? 'block' : 'none';
  });
  
  difficultySelect.addEventListener('change', (e) => {
      currentDifficulty = e.target.value;
  });
  
  startGameBtn.addEventListener('click', startGame);
  resetGameBtn.addEventListener('click', resetGame);
  
  cells.forEach(cell => {
      cell.addEventListener('click', () => handleCellClick(cell));
  });
  
  function startGame() {
      settings.style.display = 'none';
      gameplayArea.style.display = 'block';
      gameActive = true;
      currentPlayer = 'X';
      gameBoard = Array(9).fill('');
      updateStatus();
      
      cells.forEach(cell => {
          cell.textContent = '';
      });
  }
  
  function resetGame() {
      settings.style.display = 'block';
      gameplayArea.style.display = 'none';
      gameActive = false;
  }
  
  function handleCellClick(cell) {
      const index = cell.dataset.index;
      
      if (gameBoard[index] === '' && gameActive) {
          makeMove(index, currentPlayer);
          
          if (!checkGameOver()) {
              if (currentMode === 'vsComputer' && currentPlayer === 'O') {
                  setTimeout(() => computerMove(), 500);
              }
          }
      }
  }
  
  function makeMove(index, player) {
      gameBoard[index] = player;
      cells[index].textContent = player;
      
      if (player === 'X') {
          cells[index].style.color = '#e74c3c';
      } else {
          cells[index].style.color = '#3498db';
      }
      
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      updateStatus();
  }
  
  function updateStatus() {
      status.textContent = `Turn: ${currentPlayer}`;
  }
  
  function checkGameOver() {
      for (const pattern of winPatterns) {
          const [a, b, c] = pattern;
          if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
              endGame(`${gameBoard[a]} wins!`);
              return true;
          }
      }
      
      if (!gameBoard.includes('')) {
          endGame('Draw!');
          return true;
      }
      
      return false;
  }
  
  function endGame(message) {
      status.textContent = message;
      gameActive = false;
  }
  
  function computerMove() {
      if (!gameActive) return;
      
      let index;
      
      switch (currentDifficulty) {
          case 'easy':
              index = getRandomMove();
              break;
          case 'medium':
              index = Math.random() < 0.5 ? getSmartMove() : getRandomMove();
              break;
          case 'hard':
              index = getSmartMove();
              break;
          default:
              index = getRandomMove();
      }
      
      makeMove(index, 'O');
      checkGameOver();
  }
  
  function getRandomMove() {
      const availableMoves = gameBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }
  
  function getSmartMove() {
      // Look for winning move
      const winMove = findWinningMove('O');
      if (winMove !== null) return winMove;
      
      // Block opponent's winning move
      const blockMove = findWinningMove('X');
      if (blockMove !== null) return blockMove;
      
      // Take center if available
      if (gameBoard[4] === '') return 4;
      
      // Prefer corners
      const corners = [0, 2, 6, 8];
      const availableCorners = corners.filter(corner => gameBoard[corner] === '');
      if (availableCorners.length > 0) {
          return availableCorners[Math.floor(Math.random() * availableCorners.length)];
      }
      
      return getRandomMove();
  }
  
  function findWinningMove(player) {
      for (const pattern of winPatterns) {
          const [a, b, c] = pattern;
          const cells = [gameBoard[a], gameBoard[b], gameBoard[c]];
          
          if (cells.filter(cell => cell === player).length === 2 && cells.includes('')) {
              if (gameBoard[a] === '') return a;
              if (gameBoard[b] === '') return b;
              if (gameBoard[c] === '') return c;
          }
      }
      
      return null;
  }
}

// Hangman Game with multiple categories
function initHangman() {
  const hangmanWord = document.getElementById('hangman-word');
  const hangmanMessage = document.getElementById('hangman-message');
  const attemptsLeft = document.getElementById('attempts-left');
  const hangmanKeyboard = document.getElementById('hangman-keyboard');
  const newGameButton = document.getElementById('new-hangman-game');
  const categorySelector = document.getElementById('word-category');
  const hangmanParts = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];
  
  let currentWord = '';
  let guessedLetters = [];
  let incorrectGuesses = 0;
  let gameOver = false;
  
  const wordCategories = {
    animals: ['elephant', 'giraffe', 'penguin', 'dolphin', 'leopard', 'kangaroo', 'squirrel', 'zebra', 'rhinoceros', 'crocodile'],
    countries: ['france', 'brazil', 'australia', 'canada', 'japan', 'mexico', 'italy', 'egypt', 'thailand', 'sweden'],
    fruits: ['apple', 'banana', 'orange', 'strawberry', 'pineapple', 'watermelon', 'kiwi', 'mango', 'grape', 'peach'],
    sports: ['basketball', 'tennis', 'swimming', 'football', 'volleyball', 'hockey', 'cricket', 'boxing', 'golf', 'rugby'],
    jobs: ['doctor', 'teacher', 'engineer', 'chef', 'programmer', 'journalist', 'electrician', 'architect', 'dentist', 'scientist']
  };
  
  function createKeyboard() {
    hangmanKeyboard.innerHTML = '';
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    
    for (let letter of alphabet) {
      const letterButton = document.createElement('button');
      letterButton.textContent = letter;
      letterButton.classList.add('letter-btn');
      letterButton.dataset.letter = letter;
      letterButton.addEventListener('click', () => handleLetterGuess(letter));
      hangmanKeyboard.appendChild(letterButton);
    }
  }
  
  function startNewGame() {
    guessedLetters = [];
    incorrectGuesses = 0;
    gameOver = false;
    
    hangmanMessage.textContent = 'Guess the word by selecting letters!';
    attemptsLeft.textContent = '6';
    
    hangmanParts.forEach(part => {
      document.getElementById(part).classList.add('hidden');
    });
    
    const category = categorySelector.value;
    const words = wordCategories[category];
    currentWord = words[Math.floor(Math.random() * words.length)];
    
    updateWordDisplay();
    createKeyboard();
  }
  
  function updateWordDisplay() {
    let display = '';
    for (let letter of currentWord) {
      if (guessedLetters.includes(letter)) {
        display += `<span class="letter">${letter}</span>`;
      } else {
        display += `<span class="letter">_</span>`;
      }
    }
    hangmanWord.innerHTML = display;
  }
  
  function handleLetterGuess(letter) {
    if (gameOver || guessedLetters.includes(letter)) return;
    
    guessedLetters.push(letter);
    
    const letterButton = document.querySelector(`.letter-btn[data-letter="${letter}"]`);
    letterButton.disabled = true;
    
    if (currentWord.includes(letter)) {
      letterButton.classList.add('correct');
      updateWordDisplay();
      
      const isWordComplete = [...currentWord].every(l => guessedLetters.includes(l));
      
      if (isWordComplete) {
        gameOver = true;
        hangmanMessage.textContent = 'Congratulations! You guessed the word!';
        hangmanMessage.className = 'hangman-message win';
      }
    } else {
      letterButton.classList.add('incorrect');
      incorrectGuesses++;
      attemptsLeft.textContent = (6 - incorrectGuesses).toString();
      
      document.getElementById(hangmanParts[incorrectGuesses - 1]).classList.remove('hidden');
      
      if (incorrectGuesses >= 6) {
        gameOver = true;
        hangmanMessage.textContent = `Game over! The word was "${currentWord}".`;
        hangmanMessage.className = 'hangman-message lose';
      }
    }
  }
  
  newGameButton.addEventListener('click', startNewGame);
  categorySelector.addEventListener('change', startNewGame);
  
  startNewGame();
}

// 15 Puzzle with customizable board size
function initPuzzle15() {
  const puzzleBoard = document.getElementById('puzzle-board');
  const puzzleMovesCount = document.getElementById('puzzle-moves-count');
  const puzzleTimer = document.getElementById('puzzle-timer');
  const shuffleButton = document.getElementById('shuffle-puzzle');
  const solveButton = document.getElementById('solve-puzzle');
  const sizeSelector = document.getElementById('puzzle-size');
  
  let size = parseInt(sizeSelector.value);
  let tiles = [];
  let emptyTile = { row: size - 1, col: size - 1 };
  let moves = 0;
  let isSolved = false;
  let timerInterval;
  let startTime;
  
  function createBoard() {
    puzzleBoard.innerHTML = '';
    puzzleBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    
    tiles = [];
    for (let i = 0; i < size; i++) {
      tiles[i] = [];
      for (let j = 0; j < size; j++) {
        const tileNumber = i * size + j + 1;
        if (tileNumber < size * size) {
          tiles[i][j] = tileNumber;
        } else {
          tiles[i][j] = 0; // Empty tile
        }
      }
    }
    
    emptyTile = { row: size - 1, col: size - 1 };
    renderBoard();
  }
  
  function renderBoard() {
    puzzleBoard.innerHTML = '';
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const tileValue = tiles[i][j];
        
        if (tileValue !== 0) {
          const tile = document.createElement('div');
          tile.classList.add('puzzle-tile');
          tile.textContent = tileValue;
          tile.dataset.row = i;
          tile.dataset.col = j;
          
          const correctRow = Math.floor((tileValue - 1) / size);
          const correctCol = (tileValue - 1) % size;
          if (i === correctRow && j === correctCol) {
            tile.classList.add('correct-position');
          }
          
          tile.addEventListener('click', () => moveTile(i, j));
          puzzleBoard.appendChild(tile);
        } else {
          const emptySpace = document.createElement('div');
          emptySpace.classList.add('empty-tile');
          puzzleBoard.appendChild(emptySpace);
        }
      }
    }
  }
  
  function moveTile(row, col) {
    if (isSolved) return;
    
    if (
      (row === emptyTile.row && Math.abs(col - emptyTile.col) === 1) ||
      (col === emptyTile.col && Math.abs(row - emptyTile.row) === 1)
    ) {
      if (moves === 0) {
        startTimer();
      }
      
      tiles[emptyTile.row][emptyTile.col] = tiles[row][col];
      tiles[row][col] = 0;
      emptyTile = { row, col };
      moves++;
      puzzleMovesCount.textContent = moves;
      renderBoard();
      checkSolution();
    }
  }
  
  function shufflePuzzle() {
    resetGame();
    
    const shuffleMoves = 100 * size;
    for (let i = 0; i < shuffleMoves; i++) {
      const adjacentTiles = [];
      
      if (emptyTile.row > 0) {
        adjacentTiles.push({ row: emptyTile.row - 1, col: emptyTile.col });
      }
      if (emptyTile.row < size - 1) {
        adjacentTiles.push({ row: emptyTile.row + 1, col: emptyTile.col });
      }
      if (emptyTile.col > 0) {
        adjacentTiles.push({ row: emptyTile.row, col: emptyTile.col - 1 });
      }
      if (emptyTile.col < size - 1) {
        adjacentTiles.push({ row: emptyTile.row, col: emptyTile.col + 1 });
      }
      
      const randomTile = adjacentTiles[Math.floor(Math.random() * adjacentTiles.length)];
      
      tiles[emptyTile.row][emptyTile.col] = tiles[randomTile.row][randomTile.col];
      tiles[randomTile.row][randomTile.col] = 0;
      emptyTile = { row: randomTile.row, col: randomTile.col };
    }
    
    renderBoard();
  }
  
  function checkSolution() {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const expected = i * size + j + 1;
        if (i === size - 1 && j === size - 1) {
          if (tiles[i][j] !== 0) return;
        } else if (tiles[i][j] !== expected) {
          return;
        }
      }
    }
    
    isSolved = true;
    clearInterval(timerInterval);
    
    setTimeout(() => {
      alert(`Puzzle solved! Moves: ${moves}, Time: ${puzzleTimer.textContent}`);
    }, 100);
  }
  
  function resetGame() {
    moves = 0;
    isSolved = false;
    puzzleMovesCount.textContent = moves;
    clearInterval(timerInterval);
    puzzleTimer.textContent = '00:00';
  }
  
  function startTimer() {
    clearInterval(timerInterval);
    startTime = Date.now();
    
    timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
      const seconds = (elapsed % 60).toString().padStart(2, '0');
      puzzleTimer.textContent = `${minutes}:${seconds}`;
    }, 1000);
  }
  
  function solvePuzzle() {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const tileNumber = i * size + j + 1;
        if (tileNumber < size * size) {
          tiles[i][j] = tileNumber;
        } else {
          tiles[i][j] = 0;
        }
      }
    }
    
    emptyTile = { row: size - 1, col: size - 1 };
    renderBoard();
  }
  
  shuffleButton.addEventListener('click', shufflePuzzle);
  solveButton.addEventListener('click', solvePuzzle);
  
  sizeSelector.addEventListener('change', () => {
    size = parseInt(sizeSelector.value);
    resetGame();
    createBoard();
  });
  
  createBoard();
  shufflePuzzle();
}