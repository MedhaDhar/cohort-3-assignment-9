
// =======================================================
// SELECTORS
// =======================================================

const homePage = document.getElementById("homePage");
const dashboard = document.getElementById("dashboard");
const featureContainer = document.getElementById("featureContainer");

const featureCards = document.querySelectorAll(".card");
const features = document.querySelectorAll(".feature");

const backBtn = document.getElementById("backBtn");

const themeBtn = document.getElementById("themeBtn");
const dateTime = document.getElementById("dateTime");



// =======================================================
// DASHBOARD NAVIGATION
// =======================================================

function openFeature(id){

    homePage.classList.add("hidden");

    featureContainer.classList.remove("hidden");

    features.forEach(feature=>{

        feature.classList.add("hidden");

    });

    document
    .getElementById(id)
    .classList.remove("hidden");

}


featureCards.forEach(card=>{

    card.addEventListener("click",()=>{

        openFeature(card.dataset.feature);

    });

});



backBtn.addEventListener("click",()=>{

    featureContainer.classList.add("hidden");

    homePage.classList.remove("hidden");

});




// =======================================================
// DATE & TIME
// =======================================================

function updateDateTime(){

    const now = new Date();

    const date = now.toLocaleDateString("en-IN",{

        weekday:"long",

        day:"numeric",

        month:"long",

        year:"numeric"

    });


    const time = now.toLocaleTimeString("en-IN",{

        hour:"2-digit",

        minute:"2-digit",

        second:"2-digit",

        hour12:true

    });


    dateTime.innerHTML=`

        <div>${date}</div>

        <div>${time}</div>

    `;

}


updateDateTime();

setInterval(updateDateTime,1000);




// =======================================================
// THEME
// =======================================================

// =======================================================
// THEME
// =======================================================

function applyTheme(theme){

    if(theme === "dark"){

        document.body.classList.add("dark");

        themeBtn.innerHTML = '<i class="ri-sun-fill"></i>';

    }

    else{

        document.body.classList.remove("dark");

        themeBtn.innerHTML = '<i class="ri-moon-fill"></i>';

    }

    changeBackground();

}

const savedTheme = localStorage.getItem("theme") || "light";

applyTheme(savedTheme);

themeBtn.addEventListener("click",()=>{

    const newTheme = document.body.classList.contains("dark")

        ? "light"

        : "dark";

    localStorage.setItem("theme", newTheme);

    applyTheme(newTheme);

});





// =======================================================
// DYNAMIC BACKGROUND
// =======================================================
function changeBackground() {

    const hour = new Date().getHours();

    document.body.classList.remove(
        "morning",
        "afternoon",
        "evening",
        "night"
    );

    if(hour >= 5 && hour < 12){

        document.body.classList.add("morning");

    }

    else if(hour >= 12 && hour < 17){

        document.body.classList.add("afternoon");

    }

    else if(hour >= 17 && hour < 20){

        document.body.classList.add("evening");

    }

    else{

        document.body.classList.add("night");

    }

}

changeBackground();

setInterval(changeBackground,60000);



// =======================================================
// LOCAL STORAGE HELPERS
// =======================================================

function saveData(key,data){

    localStorage.setItem(

        key,

        JSON.stringify(data)

    );

}


function loadData(key){

    return JSON.parse(

        localStorage.getItem(key)

    );

}

// =======================================================
// TODO LIST
// =======================================================

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

let todos = loadData("todos") || [];

function renderTodos() {

    taskList.innerHTML = "";

    if (todos.length === 0) {

        taskList.innerHTML =
        "<li>No tasks added yet.</li>";

        return;

    }

    todos.forEach((todo, index) => {

        const li = document.createElement("li");

        li.innerHTML = `

            <span class="${todo.completed ? "completed" : ""} ${todo.important ? "important" : ""}">

                ${todo.text}

            </span>

            <div class="taskBtns">

                <button class="importantBtn" data-index="${index}">
                    ⭐
                </button>

                <button class="completeBtn" data-index="${index}">
                    ✔
                </button>

                <button class="deleteBtn" data-index="${index}">
                    🗑
                </button>

            </div>

        `;

        taskList.appendChild(li);

    });

}

function addTask() {

    const text = taskInput.value.trim();

    if (!text) {

        taskInput.focus();

        return;

    }

    todos.push({

        id: Date.now(),

        text,

        completed: false,

        important: false

    });

    saveData("todos", todos);

    taskInput.value = "";

    renderTodos();

}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", e => {

    if (e.key === "Enter") {

        addTask();

    }

});

taskList.addEventListener("click", e => {

    const index = Number(e.target.dataset.index);

    if (isNaN(index)) return;

    if (e.target.classList.contains("deleteBtn")) {

        todos.splice(index, 1);

    }

    if (e.target.classList.contains("completeBtn")) {

        todos[index].completed = !todos[index].completed;

    }

    if (e.target.classList.contains("importantBtn")) {

        todos[index].important = !todos[index].important;

    }

    saveData("todos", todos);

    renderTodos();

});

renderTodos();



// =======================================================
// DAILY PLANNER
// =======================================================

const plannerContainer =
document.getElementById("plannerContainer");

const plannerHours = [

    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM"

];

let plannerData =
loadData("planner") || {};

function getCurrentHour() {

    const hour =
    new Date().getHours();

    if (hour === 12) return "12:00 PM";

    if (hour > 12)
        return `${hour - 12}:00 PM`;

    return `${hour}:00 AM`;

}

function renderPlanner() {

    plannerContainer.innerHTML = "";

    const currentHour =
    getCurrentHour();

    plannerHours.forEach(hour => {

        const row =
        document.createElement("div");

        row.className = "timeSlot";

        if (hour === currentHour) {

            row.style.border =
            "2px solid var(--primary)";

        }

        row.innerHTML = `

            <label>

                ${hour}

            </label>

            <textarea

                rows="2"

                data-hour="${hour}"

                placeholder="Write your plan..."

            >${plannerData[hour] || ""}</textarea>

        `;

        plannerContainer.appendChild(row);

    });

}

plannerContainer.addEventListener("input", e => {

    if (e.target.tagName !== "TEXTAREA") return;

    plannerData[e.target.dataset.hour] =
    e.target.value.trim();

    saveData(
        "planner",
        plannerData
    );

});

renderPlanner();


// =======================================================
// DAILY GOALS
// =======================================================

const goalInput = document.getElementById("goalInput");
const addGoalBtn = document.getElementById("addGoal");
const goalList = document.getElementById("goalList");
const goalProgress = document.getElementById("goalProgress");

let goals = loadData("goals") || [];

function updateGoalProgress() {

    const completed = goals.filter(goal => goal.completed).length;

    goalProgress.textContent =
        `${completed} / ${goals.length} Completed`;

}

function renderGoals() {

    goalList.innerHTML = "";

    if (goals.length === 0) {

        goalList.innerHTML =
            "<li>No goals added yet.</li>";

        updateGoalProgress();

        return;

    }

    goals.forEach((goal, index) => {

        const li = document.createElement("li");

        li.innerHTML = `

            <span class="${goal.completed ? "completed" : ""}">

                ${goal.text}

            </span>

            <div class="taskBtns">

                <button class="goalComplete" data-index="${index}">
                    ✔
                </button>

                <button class="goalDelete" data-index="${index}">
                    🗑
                </button>

            </div>

        `;

        goalList.appendChild(li);

    });

    updateGoalProgress();

}

function addGoal() {

    const text = goalInput.value.trim();

    if (!text) {

        goalInput.focus();

        return;

    }

    goals.push({

        id: Date.now(),

        text,

        completed: false

    });

    saveData("goals", goals);

    goalInput.value = "";

    renderGoals();

}

addGoalBtn.addEventListener("click", addGoal);

goalInput.addEventListener("keydown", e => {

    if (e.key === "Enter") {

        addGoal();

    }

});

goalList.addEventListener("click", e => {

    const index = Number(e.target.dataset.index);

    if (isNaN(index)) return;

    if (e.target.classList.contains("goalComplete")) {

        goals[index].completed = !goals[index].completed;

    }

    if (e.target.classList.contains("goalDelete")) {

        goals.splice(index, 1);

    }

    saveData("goals", goals);

    renderGoals();

});

renderGoals();



// =======================================================
// POMODORO TIMER
// =======================================================

const timerDisplay = document.getElementById("timer");

const startBtn = document.getElementById("startTimer");
const pauseBtn = document.getElementById("pauseTimer");
const resetBtn = document.getElementById("resetTimer");

const sessionType = document.getElementById("sessionType");

let totalSeconds = 25 * 60;

let timerInterval = null;

function updateTimerDisplay() {

    const minutes = Math.floor(totalSeconds / 60);

    const seconds = totalSeconds % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}

function startTimer() {

    if (timerInterval) return;

    timerInterval = setInterval(() => {

        totalSeconds--;

        updateTimerDisplay();

        if (totalSeconds <= 0) {

            clearInterval(timerInterval);

            timerInterval = null;

            alert("🎉 Pomodoro Session Completed!");

            sessionType.textContent = "Session Completed";

        }

    }, 1000);

}

function pauseTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

}

function resetTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

    totalSeconds = 25 * 60;

    sessionType.textContent = "Work Session";

    updateTimerDisplay();

}

startBtn.addEventListener("click", startTimer);

pauseBtn.addEventListener("click", pauseTimer);

resetBtn.addEventListener("click", resetTimer);

updateTimerDisplay();



// =======================================================
// MOTIVATION QUOTES
// =======================================================

const quoteText = document.getElementById("quoteText");
const author = document.getElementById("author");
const newQuoteBtn = document.getElementById("newQuote");

async function getQuote() {

    quoteText.textContent = "Loading quote...";
    author.textContent = "";

    try {

        const response = await fetch(
            "https://dummyjson.com/quotes/random"
        );

        if (!response.ok) {
            throw new Error("Unable to fetch quote");
        }

        const data = await response.json();

        quoteText.textContent = `"${data.quote}"`;
        author.textContent = `— ${data.author}`;

    } catch (error) {

        quoteText.textContent =
            "Unable to load quote.";

        author.textContent = "";

        console.error(error);

    }

}

newQuoteBtn.addEventListener("click", getQuote);



// =======================================================
// WEATHER
// =======================================================

const city = document.getElementById("city");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");



const WEATHER_API_KEY = "5bb5fce773ba3199d18fa1dceb728fee";

async function getWeather(lat, lon) {

    try {

        const response = await fetch(

`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`

        );

        const data = await response.json();

        city.textContent = data.name;

        temperature.textContent =
            `${Math.round(data.main.temp)}°C`;

        condition.textContent =
            data.weather[0].main;

        humidity.textContent =
            `Humidity ${data.main.humidity}%`;

        wind.textContent =
            `Wind ${data.wind.speed} km/h`;

    }

    catch {

        document.getElementById("weather").innerHTML =

        "<p>Unable to load weather.</p>";

    }

}

function loadWeather() {

    if (!navigator.geolocation) {

        document.getElementById("weather").innerHTML =

        "<p>Location not supported.</p>";

        return;

    }

    navigator.geolocation.getCurrentPosition(

        position => {

            getWeather(

                position.coords.latitude,

                position.coords.longitude

            );

        },

        () => {

            document.getElementById("weather").innerHTML =

            "<p>Location permission denied.</p>";

        }

    );

}



// =======================================================
// APP INITIALIZATION
// =======================================================

window.addEventListener("load", () => {

    renderTodos();

    renderPlanner();

    renderGoals();

    updateDateTime();

    changeBackground();

    getQuote();

    loadWeather();

});