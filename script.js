let monsters = document.querySelector("#monsters");
let question = document.querySelector("#question");
let answerInput = document.querySelector("#answer");
let submitButton = document.querySelector("button");
let modal = document.querySelector("#gameModal");
let modalTitle = document.querySelector("#modalTitle");
let modalMessage = document.querySelector("#modalMessage");
let wrongAnswerCount = 0;
let maxMonsters = 5;
let bgMusic = document.querySelector("#bg-music");
let musicButton = document.querySelector("#music-btn");
let isMusicPlaying = false;

document.addEventListener("DOMContentLoaded", function() {
    // Fetch stored username
    const storedUsername = localStorage.getItem("playerName");
    
    // Display username in profile section
    const usernameDisplay = document.getElementById("display-username");
    if (storedUsername && usernameDisplay) {
        usernameDisplay.innerHTML = `🚀Player:<strong>${storedUsername}</strong>`;
    }
});

// Initialize the game
function initGame() {
    generateQuestion();
    initializeLogoutButton();
}

// Generate a new question
function generateQuestion() {
    let difficulty = document.querySelector("#difficulty").value;
    let num1, num2;

    // Adjust number ranges based on difficulty
    switch (difficulty) {
        case "easy":
            num1 = Math.floor(Math.random() * 10) + 1; // 1 - 10
            num2 = Math.floor(Math.random() * 10) + 1;
            break;
        case "medium":
            num1 = Math.floor(Math.random() * 50) + 1; // 1 - 50
            num2 = Math.floor(Math.random() * 50) + 1;
            break;
        case "hard":
            num1 = Math.floor(Math.random() * 100) + 1; // 1 - 100
            num2 = Math.floor(Math.random() * 100) + 1;
            break;
    }

    let operation = document.querySelector("#operation").value;
    
    switch (operation) {
        case "addition":
            question.textContent = `What is ${num1} + ${num2}?`;
            question.answer = num1 + num2;
            break;
        case "subtraction":
            question.textContent = `What is ${num1} - ${num2}?`;
            question.answer = num1 - num2;
            break;
        case "multiplication":
            question.textContent = `What is ${num1} × ${num2}?`;
            question.answer = num1 * num2;
            break;
        case "division":
            num1 = num1 * num2; // Ensure divisible numbers
            question.textContent = `What is ${num1} ÷ ${num2}?`;
            question.answer = num1 / num2;
            break;
    }
}

// Function to create green blood splatter effect
function createBloodEffect(monster) {
    let bloodEffect = document.createElement("div");
    bloodEffect.classList.add("blood-effect");
    bloodEffect.style.left = `${monster.offsetLeft}px`;
    bloodEffect.style.top = `${monster.offsetTop}px`;
    monsters.appendChild(bloodEffect);

    // Remove blood effect after animation
    setTimeout(() => {
        bloodEffect.remove();
    }, 500);
}

// Check answer when the user submits
function checkAnswer() {
    let userAnswer = parseInt(answerInput.value);

    if (userAnswer === question.answer) {
        // Remove one monster with blood effect
        if (monsters.children.length > 0) {
            let monster = monsters.children[0];
            createBloodEffect(monster);
            monster.classList.add("disappear");

            // Delay monster removal but check win condition immediately
            setTimeout(() => {
                monster.remove();
                // Check if all monsters are gone *after* the removal
                if (monsters.children.length === 0) {
                    showModal("You Win!", "Congratulations, you defeated all monsters!");
                }
            }, 500);
        }
        wrongAnswerCount = 0; // Reset wrong answer count
    } else {
        // Increase monster count on wrong answer
        if (monsters.children.length < maxMonsters) {
            let newMonster = document.createElement("img");
            newMonster.src = "images/monster.png";
            newMonster.classList.add("monster");
            monsters.appendChild(newMonster);
        }
        wrongAnswerCount++;
    }

    // **Check for loss condition**
    if (wrongAnswerCount >= 3) {
        showModal("You Lose!", "Too many wrong answers! The monsters won.");
        return; // Stop execution
    }

    // Generate next question only if the game is still ongoing
    if (monsters.children.length > 0) {
        generateQuestion();
    }
    answerInput.value = "";
}

// Show modal with a message
function showModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.style.display = "flex";
}

// Background music toggle function
function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicButton.textContent = "🔇";
    } else {
        bgMusic.play();
        musicButton.textContent = "🔊";
    }
    isMusicPlaying = !isMusicPlaying;
}

function changeDifficultyColor(selectElement) {
    let difficulty = selectElement.value;
    selectElement.className = difficulty; // Use the CSS class defined in your stylesheet
}

// Function to handle logout with portal animation
function logoutWithPortal() {
    // Get the logout button
    const logoutBtn = document.getElementById('logout-btn');
    
    // Add the logging-out class to start the button animation
    logoutBtn.classList.add('logging-out');
    
    // Create and add the portal transition effect to the page
    const portalElement = document.createElement('div');
    portalElement.className = 'portal-transition';
    document.body.appendChild(portalElement);
    
    // Play special sound effect if available
    const portalSound = document.getElementById('portal-sound');
    if (portalSound) {
        portalSound.play();
    }
    
    // Activate the portal effect after a short delay
    setTimeout(() => {
        portalElement.classList.add('active');
        
        // Navigate to login page after animation completes
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1200); // This should match the portal animation duration
    }, 300);
}

// Function to initialize the logout button
function initializeLogoutButton() {
    // Create the logout button element
    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logout-btn';
    logoutBtn.className = 'cosmic-button';
    logoutBtn.innerHTML = '🚀 Exit Game';
    logoutBtn.onclick = logoutWithPortal;
    
    // Add the button to the document body
    document.body.appendChild(logoutBtn);
    
    // Create audio element for portal sound
    const portalSound = document.createElement('audio');
    portalSound.id = 'portal-sound';
    portalSound.preload = 'auto';
    
    // Try to use an existing sound from the game if available
    portalSound.src = 'sound/portal.mp3'; // Fallback to this if the file exists
    
    // Add the audio element to the body
    document.body.appendChild(portalSound);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initGame);

// Submit button event listener
submitButton.addEventListener("click", checkAnswer);

// Enter key event listener
answerInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});

// Update question immediately when changing difficulty or operation
document.querySelector("#difficulty").addEventListener("change", function() {
    generateQuestion();
    changeDifficultyColor(this);
});

document.querySelector("#operation").addEventListener("change", function() {
    generateQuestion();
});