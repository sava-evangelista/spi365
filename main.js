const scenarios = [
    {
        text: "You are in charge of a society with a food shortage. Make difficult decisions to balance happiness and stability.",
        startSlide: true // Special flag for the first slide
    },
    {
        text: "Do you want to install cameras?",
        option1: { text: "Yes", happiness: -10, robbing: -5 },
        option2: { text: "No", happiness: 10, robbing: 10 }
    },
    {
        text: "Install facial recognition with cameras?",
        option1: { text: "Yes", happiness: -20, camera: 5, robbing: -10 },
        option2: { text: "No", happiness: 0 }
    },
    {
        text: "Employ extra police?",
        option1: { text: "Yes", happiness: -15, corruption: 10, robbing: -5 },
        option2: { text: "No", happiness: 10, robbing: 5 }
    },
    {
        text: "Choose food distribution type.",
        option1: { text: "Bread", happiness: 5, racoon: 10 },
        option2: { text: "Lentils", happiness: -5, robbing: -5 }
    },
    {
        text: "Who do you feed?",
        option1: { text: "5 old people", happiness: 5 },
        option2: { text: "3 strong men", happiness: 10 }
    },
    {
        text: "Feed starving person or moderately hungry people?",
        option1: { text: "1 starving person", happiness: 5 },
        option2: { text: "2 moderately hungry people", happiness: 10 }
    },
    {
        text: "Distribute expired food?",
        option1: { text: "Keep distributing", happiness: 20, sickness: 50 },
        option2: { text: "Throw it out", happiness: -15, racoon: 20 }
    },
    {
        text: "Host death ceremonies?",
        option1: { text: "Yes", happiness: 5, robbing: 5 },
        option2: { text: "No", happiness: -5 }
    }
];

const randomEvents = [
    { name: "Robbing", chance: 15, effect: { happiness: -10 } },
    { name: "Corruption", chance: 15, effect: { happiness: -10 } },
    { name: "Camera breaks", chance: 15, effect: { happiness: -10 } },
    { name: "Raccoon steals food", chance: 15, effect: { happiness: -10 } }
];

let currentScenario = 0;
let happiness = 70;
let summary = [];

function updateStats() {
    document.getElementById("happiness").textContent = happiness;
}

function randomEvent() {
    const roll = Math.random() * 100;
    let cumulativeChance = 0;
    for (const event of randomEvents) {
        cumulativeChance += event.chance;
        if (roll <= cumulativeChance) {
            happiness += event.effect.happiness;
            summary.push(`Random Event: ${event.name} (-10% happiness)`);
            updateStats();
            return;
        }
    }
}

function loadScenario(index) {
    if (index >= scenarios.length) {
        loadSummary(); // Transition to the summary screen
        return;
    }

    const scenario = scenarios[index];
    const scenarioContainer = document.getElementById("scenario-container");
    const optionsContainer = document.getElementById("options-container");

    // Handle the first slide with a "Start" button
    if (scenario.startSlide) {
        scenarioContainer.innerHTML = `<p>${scenario.text}</p>`;
        optionsContainer.innerHTML = `<button id="start-button">Start</button>`;
        document.getElementById("start-button").onclick = () => {
            currentScenario++;
            loadScenario(currentScenario);
        };
        return;
    }

    // For other slides
    scenarioContainer.innerHTML = `<p>${scenario.text}</p>`;
    optionsContainer.innerHTML = `
        <button id="option1">${scenario.option1.text}</button>
        <button id="option2">${scenario.option2.text}</button>
    `;

    document.getElementById("option1").onclick = () => handleChoice(scenario.option1);
    document.getElementById("option2").onclick = () => handleChoice(scenario.option2);
}

function handleChoice(choice) {
    happiness += choice.happiness || 0;
    summary.push(choice.text + ` (${choice.happiness || 0}% happiness)`);

    // Trigger random event with a 50% probability
    if (Math.random() < 0.5) randomEvent();

    currentScenario++;
    updateStats();
    loadScenario(currentScenario);
}

function loadSummary() {
    const gameContainer = document.getElementById("game-container");
    const summaryDiv = document.createElement("div");

    // Robot decisions for comparison
    const robotDecisions = [
        "No surveillance (-10% happiness)",
        "No police (+10% happiness)",
        "Bread (+5% happiness)",
        "3 strong men (+10% happiness)",
        "2 moderately hungry people (+10% happiness)",
        "Distribute expired food (+20% happiness, +50% sickness)",
        "Host ceremonies (+5% happiness)"
    ];
    const robotHappiness = 70 - 10 + 10 + 5 + 10 + 10 + 20 + 5; // Calculate robot's happiness

    summaryDiv.id = "summary";
    summaryDiv.innerHTML = `
        <h2>Game Over</h2>
        <h3>Your Decisions:</h3>
        <ul>${summary.map(item => `<li>${item}</li>`).join("")}</ul>
        <h3>Robot Decisions:</h3>
        <ul>${robotDecisions.map(item => `<li>${item}</li>`).join("")}</ul>
        <h3>Results:</h3>
        <p>Your Final Public Happiness: ${happiness}%</p>
        <p>Robot's Final Public Happiness: ${robotHappiness}%</p>
    `;

    gameContainer.innerHTML = ""; // Clear the game container
    gameContainer.appendChild(summaryDiv); // Show the summary
}

// Initialize the game
updateStats();
loadScenario(0);
