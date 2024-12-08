const scenarios = [
    {
    text: "Welcome to Survival Choices, a decision-making game where you take on the role of leader in a society teetering on the brink of collapse. A devastating food shortage has gripped your community, forcing you to make critical decisions that will shape the future of your people. Every choice you make not only impacts survival but also the morale and unity of your people. Can you navigate these challenges while keeping the community happy?",
    startSlide: true // Special flag for the first slide
    },
    {
    text: "First, you must decide how much security should be installed to look over the food reserves.",
    option1: { text: "Install cameras", happiness: -10, robbing: -5 },
    option2: { text: "Do not install cameras", happiness: 10, robbing: 10, camera: -15 },
    image: "fixed1.png"
    },
    {
    text: "Some of your peers are worried simple cameras aren't enough, should they install facial recognition software for the camera system?",
    option1: { text: "Install facial recognition", happiness: -20, camera: 5, robbing: -10 },
    option2: { text: "Do not install facial recognition", happiness: 0 },
    image: "fixed2.png"
    },
    {
    text: "Several rule-abiding citizens insist that there still isn't enough security preventing others from stealing food, should police be placed near the food reserves?",
    option1: { text: "Employ extra police", happiness: -15, corruption: 10, robbing: -5 },
    option2: { text: "Do not employ extra police", happiness: 10, robbing: 5 },
    image: "fixed3.png"
    },
    {
    text: "What food should the community stock up on and distribute? While lentils are packed with nutrients and can feed much more, white bread tastes a lot better.",
    option1: { text: "Choose bread", happiness: 5, racoon: 10 },
    option2: { text: "Choose lentils", happiness: -5, robbing: -5 },
    image: "food.png"
    },
    {
    text: "There isn't enough food to go around at breakfast, you must pick one of these groups to feed, while the other stays hungry.",
    option1: { text: "Feed 5 elderly", happiness: 5 },
    option2: { text: "Feed 3 strong men", happiness: 10 },
    image: "old.png"
    },
    {
    text: "We've misplaced some rations of food during the day, and now it is dinner time. You must pick another one of these groups to feed.",
    option1: { text: "Feed 1 starving person", happiness: 5 },
    option2: { text: "Feed 2 moderately hungry people", happiness: 10 },
    image: "starving.png"
    },
    {
    text: "You've found the missing food rations, but they look past their due date. What do you do with the expired food?",
    option1: { text: "Distributed the expired food", happiness: 20, sickness: 50 },
    option2: { text: "Throw out the expired food", happiness: -15, racoon: 20 },
    image: "fixedexpired.png"
    },
    {
    text: "Because of the long lasting starvation, some members of the community have passed away. Despite the desire to honor their deaths, it will take a lot of energy, and therefore food, to host ceremonies. What should the community do?",
    option1: { text: "Host ceremonies", happiness: 5, robbing: 5 },
    option2: { text: "Do not host ceremonies", happiness: -5 },
    image: "fixeddeath.png"
    }
    ];
    
    let randomEvents = [
        { name: "Oh no! Burglars from another group have stolen some of your food. I guess you didn't install enough security...", summaryName: "Robbing", chance: 15, effect: { happiness: -10 }, image: "robbers.png" },
        { name: "Oh no! Some of the people in the community have stolen extra rations. I guess you didn't install enough security...", summaryName: "Corruption", chance: 15, effect: { happiness: -10 }, image: "fixedcorruption.png" },
        { name: "Oh no! Some of the surveillance cameras are malfunctioning. Maybe we shouldn't have wasted money on them...", summaryName: "Broken Cameras", chance: 15, effect: { happiness: -10 }, image: "fixedbroken.png" },
        { name: "Oh no! Some raccoons got in our food reserve and spoiled the food.", summaryName: "Raccoons", chance: 15, effect: { happiness: -10 }, image: "fixedracoon.png" }
    ];
    
    
    let currentScenario = 0;
    let happiness = 70;
    let summary = [];
    let decisionsMade = 0; // Counter for decisions made
    
    const robotDecisions = [
    { text: "Do not install cameras", happiness: 10, robbing: 10 },
    { text: "Do not install facial recognition", happiness: 0 },
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
            summary.push({ text: `Random Event: ${event.summaryName} (-10% happiness)`, color: "orange" });
    
            const scenarioContainer = document.getElementById("scenario-container");
            const optionsContainer = document.getElementById("options-container");
            const scenarioImage = document.getElementById("scenario-image");
    
            scenarioContainer.querySelector("#scenario-text").innerHTML = `
                <h2 style="font-size: 24px; font-weight: bold;">Random Event</h2>
                <p>${event.name}</p>
            `;
            scenarioImage.src = event.image || ""; // Set the image if it exists
            scenarioImage.style.display = event.image ? "block" : "none"; // Show or hide the image
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
    
            // Add the simplified random event name to the robot's summary
            robotSummary.push({ text: `Random Event: ${event.summaryName} (-10% happiness)`, color: "orange" });
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
        const scenarioImage = document.getElementById("scenario-image");
    
        if (scenario.startSlide) {
            scenarioContainer.querySelector("#scenario-text").innerHTML = scenario.text;
            optionsContainer.innerHTML = `<button id="start-button">Start</button>`;
            scenarioImage.src = scenario.image || ""; // Set the image if it exists
            scenarioImage.style.display = scenario.image ? "block" : "none"; // Show or hide the image
    
            document.getElementById("start-button").onclick = () => {
                currentScenario++;
                loadScenario(currentScenario);
            };
            return;
        }
    
        scenarioContainer.querySelector("#scenario-text").innerHTML = scenario.text;
        scenarioImage.src = scenario.image || ""; // Set the image if it exists
        scenarioImage.style.display = scenario.image ? "block" : "none"; // Show or hide the image
    
        optionsContainer.innerHTML = `
            <button id="option1">${scenario.option1.text}</button>
            <button id="option2">${scenario.option2.text}</button>
        `;
    
        document.getElementById("option1").onclick = () => handleChoice(scenario.option1);
        document.getElementById("option2").onclick = () => handleChoice(scenario.option2);
    }
    

    function triggerSicknessEvent() {
        if (Math.random() < 0.5) { // 50% chance
            happiness -= 15; // Decrease happiness by 15
            summary.push({ text: "Random Event: Sickness (-15% happiness)", color: "orange" });
        }
    }

    function loadWhatsNext() {
        const gameContainer = document.getElementById("game-container");
    
        gameContainer.innerHTML = `
            <h2>What's Next?</h2>
            <p>
                Congratulations on completing the game! Your decisions shaped the outcome of your society.
                Reflect on what went well and what could have been done differently. Would you make the same
                choices if you played again?
            </p>
        `;
    }
    
    function handleChoice(choice) {
        happiness += choice.happiness || 0;
        summary.push({
            text: `${choice.text} (${choice.happiness > 0 ? "+" : ""}${choice.happiness}% happiness)`,
            color: choice.happiness > 0 ? "green" : choice.happiness < 0 ? "red" : "black"
        });
    
        decisionsMade++;
        adjustEventChances(choice);
    
        // Special case: Skip facial recognition question if cameras are not installed
        if (currentScenario === 1 && choice.text === "Do not install cameras") {
            currentScenario++; // Skip to the next question after facial recognition
        }
    
        // Special case: Expired food decision
        if (choice.text === "Keep distributing expired food") {
            triggerSicknessEvent(); // Trigger the sickness event
        }
    
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
            <div style="display: flex; justify-content: space-between;">
                <div style="width: 45%;">
                    <h3>Your Decisions:</h3>
                    <div>${summary
                        .map(item => `<p style="color: ${item.color};">${item.text.replace("Random Event: ", "")}</p>`)
                        .join("")}</div>
                </div>
                <div style="width: 45%;">
                    <h3>Robot's Decisions:</h3>
                    <div>${robotSummary
                        .map(item => `<p style="color: ${item.color};">${item.text.replace("Random Event: ", "")}</p>`)
                        .join("")}</div>
                </div>
            </div>
            <h3>Results:</h3>
            <div style="text-align: center;">
                <p><strong>Your Final Public Happiness:</strong> ${happiness}%</p>
                <p><strong>Robot's Final Public Happiness:</strong> ${robotHappiness}%</p>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button id="whats-next-button" style="padding: 10px 20px; font-size: 16px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">What's Next?</button>
            </div>
        `;
    
        gameContainer.innerHTML = ""; // Clear the game container
        gameContainer.appendChild(summaryDiv);
    
        document.getElementById("whats-next-button").onclick = loadWhatsNext;
    }
    
    
    
    
    loadScenario(0);