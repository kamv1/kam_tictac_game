// Oyuncular ve oyun durumu
let currentPlayer = "X"; // Varsayılan başlangıç
let playerSymbol = null; // Oyuncunun seçimi
let machineSymbol = null; // Makinenin oynayacağı sembol
let difficulty = null; // Zorluk seviyesi
let board = ["", "", "", "", "", "", "", "", ""]; // Oyun tahtası
let running = false; // Oyun durumu
let walletConnected = false; // Wallet bağlantısı

// HTML öğelerini seçme
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const chooseXButton = document.getElementById("choose-x");
const chooseOButton = document.getElementById("choose-o");
const difficultyButtons = document.querySelectorAll(".difficulty-button");
const startGameButton = document.getElementById("start-game");
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const connectWalletButton = document.getElementById("connect-wallet");
const walletStatusText = document.getElementById("wallet-status");

// İkon bağlantıları
const luncIcon = '<img src="https://s2.coinmarketcap.com/static/img/coins/200x200/4172.png" alt="LUNC" style="width: 30px; height: 30px;">';
const ustcIcon = '<img src="https://s2.coinmarketcap.com/static/img/coins/200x200/7129.png" alt="USTC" style="width: 30px; height: 30px;">';

// Oyuncu seçimi
[chooseXButton, chooseOButton].forEach(button => {
    button.addEventListener("click", () => {
        [chooseXButton, chooseOButton].forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
        playerSymbol = button.id === "choose-x" ? "X" : "O";
        machineSymbol = playerSymbol === "X" ? "O" : "X";
        checkStartButton();
    });
});

// Zorluk seçimi
difficultyButtons.forEach(button => {
    button.addEventListener("click", () => {
        difficultyButtons.forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
        difficulty = button.id.replace("difficulty-", "");
        checkStartButton();
    });
});

// "Play" butonunu kontrol et
function checkStartButton() {
    if (playerSymbol && difficulty && walletConnected) {
        startGameButton.classList.add("enabled");
        startGameButton.disabled = false;
    } else {
        startGameButton.classList.remove("enabled");
        startGameButton.disabled = true;
    }
}

// Oyunu başlatma
startGameButton.addEventListener("click", () => {
    startGame();
});

function startGame() {
    currentPlayer = "X"; // X her zaman önce başlar
    startScreen.style.display = "none"; // Başlangıç ekranını gizle
    gameContainer.style.display = "block"; // Oyun ekranını göster
    updateStatusText(); // Durum metnini güncelle
    running = true; // Oyunun başladığını işaretle

    // Eğer oyuncu "O" seçtiyse, yapay zeka ilk hamleyi yapar
    if (playerSymbol === "O") {
        setTimeout(() => {
            machineMove(); // Yapay zekanın hamlesini yap
            updateStatusText(); // Durum metnini güncelle
        }, 500); // 500ms gecikme ile hamle yap
    }
}

// Hücre tıklama işlemi
function cellClicked() {
    const cellIndex = this.getAttribute("data-index");

    if (board[cellIndex] !== "" || !running || currentPlayer !== playerSymbol) {
        return;
    }

    updateCell(this, cellIndex);
    if (!checkWinner()) {
        setTimeout(machineMove, 500); // Makine hamlesini gecikmeli yapar
    }
}

// Hücreyi güncelleme
function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.classList.add(currentPlayer === "X" ? "x" : "o");
    checkWinner();
    if (running) changePlayer();
}

// Oyuncu değiştirme
function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatusText();
}

// Durum metnini güncelleme (ikonlarla)
function updateStatusText() {
    if (!running) return; // Eğer oyun durmuşsa metni güncelleme
    const currentIcon = currentPlayer === "X" ? luncIcon : ustcIcon;
    statusText.innerHTML = `${currentIcon} Turn`;
}

// Kazanan kontrolü
function checkWinner() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Yatay
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Dikey
        [0, 4, 8], [2, 4, 6]            // Çapraz
    ];

    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            const winner = board[a];
            const winnerIcon = winner === "X" ? luncIcon : ustcIcon;
            statusText.innerHTML = `${winnerIcon} Wins!`;
            running = false; // Oyunu durdur
            return true;
        }
    }

    // Eğer tüm hücreler doluysa ve kazanan yoksa, berabere
    if (!board.includes("")) {
        statusText.textContent = "Draw!";
        running = false; // Oyunu durdur
        return true;
    }

    return false; // Oyun devam ediyor
}

// Makine hamlesi
function machineMove() {
    if (!running || currentPlayer !== machineSymbol) return;

    const emptyCells = board.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);
    if (emptyCells.length === 0) return;

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cellIndex = emptyCells[randomIndex];
    const cell = cells[cellIndex];
    updateCell(cell, cellIndex);
}

// WalletConnect: Bağlantı kurma
async function connectWallet() {
    try {
        if (typeof window.ethereum !== "undefined") {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            walletStatusText.textContent = "Wallet connected!";
            walletConnected = true;
            checkStartButton();
        } else {
            walletStatusText.textContent = "No wallet detected!";
        }
    } catch (error) {
        walletStatusText.textContent = "Wallet connection failed.";
    }
}

// Oyunu yeniden başlatma
function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""]; // Tahtayı sıfırla
    running = false; // Oyunu durdur
    currentPlayer = "X";

    startScreen.style.display = "block"; // Başlangıç ekranını göster
    gameContainer.style.display = "none"; // Oyun ekranını gizle

    cells.forEach(cell => {
        cell.classList.remove("x", "o");
    });
}

// Hücre tıklama işlemini hücrelere bağlama
cells.forEach(cell => cell.addEventListener("click", cellClicked));

// WalletConnect düğmesini bağlama
connectWalletButton.addEventListener("click", connectWallet);

// Oyunu yeniden başlat düğmesini bağlama
restartBtn.addEventListener("click", restartGame);
