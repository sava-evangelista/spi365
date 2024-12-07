const scenarios = [
    {
        text: "You are in charge of a society with a food shortage. Make difficult decisions to balance happiness and stability.",
        startSlide: true // Special flag for the first slide
    },
    {
        text: "Do you want to install cameras?",
        option1: { text: "Install cameras", happiness: -10, robbing: -5 },
        option2: { text: "Do not install cameras", happiness: 10, robbing: 10 }
    },
    {
        text: "Install facial recognition with cameras?",
        option1: { text: "Install facial recognition", happiness: -20, camera: 5, robbing: -10 },
        option2: { text: "Do not install facial recognition", happiness: 0 }
    },
    {
        text: "Employ extra police?",
        option1: { text: "Employ extra police", happiness: -15, corruption: 10, robbing: -5 },
        option2: { text: "Do not employ extra police", happiness: 10, robbing: 5 }
    },
    {
        text: "Choose food distribution type.",
        option1: { text: "Choose bread", happiness: 5, racoon: 10 },
        option2: { text: "Choose lentils", happiness: -5, robbing: -5 }
    },
    {
        text: "Who do you feed?",
        option1: { text: "Feed 5 old people", happiness: 5 },
        option2: { text: "Feed 3 strong men", happiness: 10 }
    },
    {
        text: "Feed starving person or moderately hungry people?",
        option1: { text: "Feed 1 starving person", happiness: 5 },
        option2: { text: "Feed 2 moderately hungry people", happiness: 10 }
    },
    {
        text: "Distribute expired food?",
        option1: { text: "Keep distributing expired food", happiness: 20, sickness: 50 },
        option2: { text: "Throw out expired food", happiness: -15, racoon: 20 }
    },
    {
        text: "Host death ceremonies?",
        option1: { text: "Host ceremonies", happiness: 5, robbing: 5 },
        option2: { text: "Do not host ceremonies", happiness: -5 }
    }
];

let randomEvents = [
    { name: "Robbing", chance: 15, effect: { happiness: -10 } },
    { name: "Corruption", chance: 15, effect: { happiness: -10 } },
    { name: "Camera breaks", chance: 15, effect: { happiness: -10 } },
    { name: "Raccoon steals food", chance: 15, effect: { happiness: -10 } }
];

let currentScenario = 0;
let happiness = 70;
let summary = [];
let decisionsMade = 0; // Counter for decisions made

const robotDecisions = [
    { text: "Do not install cameras", happiness: 10, robbing: 10 },
    { text: "Do not employ extra police", happiness: 10, robbing: 5 },
    { text: "Choose bread", happiness: 5, racoon: 10 },
    { text: "Feed 3 strong men", happiness: 10 },
    { text: "Feed 2 moderately hungry people", happiness: 10 },
    { text: "Keep distributing expired food", happiness: 20, sickness: 50 },
    { text: "Host ceremonies", happiness: 5, robbing: 5 }
];

let robotHappiness = 70;
let robotSummary = [];
let robotDecisionsMade = 0;

function adjustEventChances(effect) {
    if (effect.robbing !== undefined) {
        const event = randomEvents.find(e => e.name === "Robbing");
        if (event) event.chance = Math.max(0, Math.min(100, event.chance + effect.robbing));
    }
    if (effect.corruption !== undefined) {
        const event = randomEvents.find(e => e.name === "Corruption");
        if (event) event.chance = Math.max(0, Math.min(100, event.chance + effect.corruption));
    }
    if (effect.camera !== undefined) {
        const event = randomEvents.find(e => e.name === "Camera breaks");
        if (event) event.chance = Math.max(0, Math.min(100, event.chance + effect.camera));
    }
    if (effect.racoon !== undefined) {
        const event = randomEvents.find(e => e.name === "Raccoon steals food");
        if (event) event.chance = Math.max(0, Math.min(100, event.chance + effect.racoon));
    }
}

function randomEvent(callback) {
    if (decisionsMade <= 3) {
        callback(); // Skip random events
        return;
    }

    const triggeredEvents = randomEvents.filter(event => Math.random() * 100 < event.chance);

    if (triggeredEvents.length > 0) {
        const event = triggeredEvents[Math.floor(Math.random() * triggeredEvents.length)];
        happiness += event.effect.happiness;
        summary.push({ text: `Random Event: ${event.name} (-10% happiness)`, color: "orange" });

        const scenarioContainer = document.getElementById("scenario-container");
        const optionsContainer = document.getElementById("options-container");

        scenarioContainer.innerHTML = `<p>Random Event: ${event.name} occurred!</p>`;
        optionsContainer.innerHTML = `<button id="continue-button">Continue</button>`;

        document.getElementById("continue-button").onclick = () => {
            callback();
        };
    } else {
        callback(); // No random event, proceed normally
    }
}

function simulateRobotEvents() {
    const triggeredEvents = randomEvents.filter(event => Math.random() * 100 < event.chance);

    if (triggeredEvents.length > 0) {
        const event = triggeredEvents[Math.floor(Math.random() * triggeredEvents.length)];
        robotHappiness += event.effect.happiness;
        robotSummary.push({ text: `Random Event: ${event.name} (-10% happiness)`, color: "orange" });
    }
}

function simulateRobotDecision(decision) {
    robotHappiness += decision.happiness || 0;
    robotSummary.push({
        text: `${decision.text} (${decision.happiness > 0 ? "+" : ""}${decision.happiness}% happiness)`,
        color: decision.happiness > 0 ? "green" : decision.happiness < 0 ? "red" : "black"
    });

    robotDecisionsMade++;

    if (robotDecisionsMade > 3) {
        simulateRobotEvents();
    }
}

function simulateRobot() {
    for (let i = 0; i < robotDecisions.length; i++) {
        simulateRobotDecision(robotDecisions[i]);
    }
}

function loadScenario(index) {
    if (index >= scenarios.length) {
        loadSummary();
        return;
    }

    const scenario = scenarios[index];
    const scenarioContainer = document.getElementById("scenario-container");
    const optionsContainer = document.getElementById("options-container");

    if (scenario.startSlide) {
        scenarioContainer.innerHTML = `<p>${scenario.text}</p>`;
        optionsContainer.innerHTML = `<button id="start-button">Start</button>`;
        document.getElementById("start-button").onclick = () => {
            currentScenario++;
            loadScenario(currentScenario);
        };
        return;
    }

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
        text: `${choice.text} (${choice.happiness > 0 ? "+" : ""}${choice.happiness}% happiness)`,
        color: choice.happiness > 0 ? "green" : choice.happiness < 0 ? "red" : "black"
    });

    decisionsMade++;
    adjustEventChances(choice);

    randomEvent(() => {
        currentScenario++;
        loadScenario(currentScenario);
    });
}

function loadSummary() {
    const gameContainer = document.getElementById("game-container");
    const summaryDiv = document.createElement("div");

    simulateRobot(); // Simulate the robot's decisions and events

    summaryDiv.id = "summary";
    summaryDiv.innerHTML = `
        <h2>Game Over</h2>
        <h3>Your Decisions:</h3>
        <div>${summary
            .map(item => `<p style="color: ${item.color};">${item.text}</p>`)
            .join("")}</div>
        <h3>Robot Decisions:</h3>
        <div>${robotSummary
            .map(item => `<p style="color: ${item.color};">${item.text}</p>`)
            .join("")}</div>
        <h3>Results:</h3>
        <p>Your Final Public Happiness: ${happiness}%</p>
        <p>Robot's Final Public Happiness: ${robotHappiness}%</p>
    `;

    gameContainer.innerHTML = "";
    gameContainer.appendChild(summaryDiv);
}

loadScenario(0);
