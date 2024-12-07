const scenarios = [
    {
        text: "You are in charge of a society with a food shortage. Make difficult decisions to balance happiness and stability.",
        startSlide: true // Special flag for the first slide
    },
    {
        text: "Do you want to install cameras?",
        option1: { text: "Install cameras (-10% happiness, -5% robbing)", happiness: -10, robbing: -5 },
        option2: { text: "Do not install cameras (+10% happiness, +10% robbing)", happiness: 10, robbing: 10 }
    },
    {
        text: "Install facial recognition with cameras?",
        option1: { text: "Install facial recognition (+5% camera, -20% happiness, -10% robbing)", happiness: -20, camera: 5, robbing: -10 },
        option2: { text: "Do not install facial recognition (no change)", happiness: 0 }
    },
    {
        text: "Employ extra police?",
        option1: { text: "Employ extra police (-15% happiness, +10% corruption, -5% robbing)", happiness: -15, corruption: 10, robbing: -5 },
        option2: { text: "Do not employ extra police (+10% happiness, +5% robbing)", happiness: 10, robbing: 5 }
    },
    {
        text: "Choose food distribution type.",
        option1: { text: "Choose bread (+5% happiness, +10% raccoon chance)", happiness: 5, racoon: 10 },
        option2: { text: "Choose lentils (-5% happiness, -5% robbing)", happiness: -5, robbing: -5 }
    },
    {
        text: "Who do you feed?",
        option1: { text: "Feed 5 old people (+5% happiness)", happiness: 5 },
        option2: { text: "Feed 3 strong men (+10% happiness)", happiness: 10 }
    },
    {
        text: "Feed starving person or moderately hungry people?",
        option1: { text: "Feed 1 starving person (+5% happiness)", happiness: 5 },
        option2: { text: "Feed 2 moderately hungry people (+10% happiness)", happiness: 10 }
    },
    {
        text: "Distribute expired food?",
        option1: { text: "Keep distributing expired food (+20% happiness, +50% sickness)", happiness: 20, sickness: 50 },
        option2: { text: "Throw out expired food (-15% happiness, +20% raccoon chance)", happiness: -15, racoon: 20 }
    },
    {
        text: "Host death ceremonies?",
        option1: { text: "Host ceremonies (+5% happiness, +5% robbing)", happiness: 5, robbing: 5 },
        option2: { text: "Do not host ceremonies (-5% happiness)", happiness: -5 }
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
let eventPending = false; // Track if a random event is pending

function updateStats() {
    document.getElementById("happiness").textContent = happiness;
}

function randomEvent(callback) {
    const roll = Math.random() * 100;
    let cumulativeChance = 0;
    for (const event of randomEvents) {
        cumulativeChance += event.chance;
        if (roll <= cumulativeChance) {
            happiness += event.effect.happiness;
            summary.push({ text: `Random Event: ${event.name} (-10% happiness)`, color: "orange" });

            // Show random event screen
            const scenarioContainer = document.getElementById("scenario-container");
            const optionsContainer = document.getElementById("options-container");

            scenarioContainer.innerHTML = `<p>Random Event: ${event.name} occurred!</p>`;
            optionsContainer.innerHTML = `<button id="continue-button">Continue</button>`;

            document.getElementById("continue-button").onclick = () => {
                updateStats();
                callback();
            };

            eventPending = true; // Mark that the event has been handled
            return;
        }
    }
    callback(); // No random event, proceed normally
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
    summary.push({
        text: choice.text,
        color: choice.happiness > 0 ? "green" : choice.happiness < 0 ? "red" : "black"
    });

    // Trigger random event with a 50% probability
    randomEvent(() => {
        currentScenario++;
        updateStats();
        loadScenario(currentScenario);
    });
}

function loadSummary() {
    const gameContainer = document.getElementById("game-container");
    const summaryDiv = document.createElement("div");

    // Robot decisions for comparison
    const robotDecisions = [
        { text: "No surveillance (-10% happiness)", color: "red" },
        { text: "No police (+10% happiness)", color: "green" },
        { text: "Bread (+5% happiness)", color: "green" },
        { text: "3 strong men (+10% happiness)", color: "green" },
        { text: "2 moderately hungry people (+10% happiness)", color: "green" },
        { text: "Distribute expired food (+20% happiness, +50% sickness)", color: "green" },
        { text: "Host ceremonies (+5% happiness)", color: "green" }
    ];
    const robotHappiness = 70 - 10 + 10 + 5 + 10 + 10 + 20 + 5; // Calculate robot's happiness

    summaryDiv.id = "summary";
    summaryDiv.innerHTML = `
        <h2>Game Over</h2>
        <h3>Your Decisions:</h3>
        <div>${summary
            .map(item => `<p style="color: ${item.color};">${item.text}</p>`)
            .join("")}</div>
        <h3>Robot Decisions:</h3>
        <div>${robotDecisions
            .map(item => `<p style="color: ${item.color};">${item.text}</p>`)
            .join("")}</div>
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
