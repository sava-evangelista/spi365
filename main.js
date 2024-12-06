const scenarios = [
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
        endGame();
        return;
    }
    const scenario = scenarios[index];
    document.getElementById("scenario-text").textContent = scenario.text;
    document.getElementById("option1").textContent = scenario.option1.text;
    document.getElementById("option2").textContent = scenario.option2.text;

    // Ensure click handlers are updated correctly for each scenario
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

function endGame() {
    const summaryDiv = document.createElement("div");
    summaryDiv.id = "summary";
    summaryDiv.innerHTML = `<h2>Game Over</h2>
        <h3>Your Decisions:</h3>
        <ul>${summary.map(item => `<li>${item}</li>`).join("")}</ul>`;
    document.getElementById("game-container").appendChild(summaryDiv);
    document.getElementById("options-container").remove();
}

// Initialize the game
updateStats();
loadScenario(0);
