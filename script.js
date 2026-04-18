const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");
const taskTitle = document.getElementById("task-title");
const allCompleteMessage = document.getElementById("all-complete-message");


function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#list-container li").forEach(li => {
        tasks.push({
            text:li.querySelector(".task-text").textContent, 
            completed: li.classList.contains("completed"),
            important: li.classList.contains("important")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem("tasks");
    if (!saved) return;
    JSON.parse(saved).forEach(task => {
        addTask(task.text, task.completed, task.important);
    });
}

inputBox.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

function addTask(savedText = null, savedCompleted = false, savedImportant = false) {
    const task = savedText || inputBox.value.trim();
    if (!task) {
        alert("Please write down a task");
        return;
    }

    const li = document.createElement("li");
    li.innerHTML = `
    <div class="task-left">
        <span class="star-btn">☆</span>
        <label>
            <input type="checkbox">
            <span class="task-text">${task}</span>
        </label>
    </div>
    <div class = "task-buttons">
        <span class="edit-btn">Edit</span>
        <span class="delete-btn">Delete</span>
    </div>
    `;

    const checkbox = li.querySelector("input");
    const editBtn = li.querySelector(".edit-btn");
    const taskSpan = li.querySelector(".task-text");
    const deleteBtn = li.querySelector(".delete-btn");
    const starBtn = li.querySelector(".star-btn");

    starBtn.addEventListener("click", function() {
        li.classList.toggle("important");
        if (li.classList.contains("important")) {
            starBtn.textContent = "★";
        } else {
            starBtn.textContent = "☆";
        }
        saveTasks();
    })

    checkbox.checked = savedCompleted;
    if (savedCompleted) li.classList.add("completed");

    if (savedImportant) li.classList.add("important");
    if (savedImportant) starBtn.textContent = "★";

    checkbox.addEventListener("click", function() {
        li.classList.toggle("completed", checkbox.checked);
        updateCounters();
        saveTasks();
    });

    editBtn.addEventListener("click", function() {
        const update = prompt("Edit task: ", taskSpan.textContent);
        if (update !== null && update.trim() !== "") {
            taskSpan.textContent = update.trim();
            li.classList.remove("completed");
            checkbox.checked = false;
        }
        updateCounters();
        saveTasks();
    });

    deleteBtn.addEventListener("click", function() {
        if (confirm("Are you sure you want to delete this task?")) {
            li.remove();
            updateCounters();
            saveTasks();
        }
    });

    listContainer.appendChild(li);
    inputBox.value = "";
    updateCounters();

    if (!savedText) inputBox.value = "";
    saveTasks();
}

function updateCounters() {
    const totalTasks = document.querySelectorAll("#list-container li").length;
    const completedTasks = document.querySelectorAll("#list-container li.completed").length;
    const uncompletedTasks = totalTasks - completedTasks;

    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = uncompletedTasks;

    if (totalTasks > 0 && completedTasks === totalTasks) {
        allCompleteMessage.style.display = "block";
    } else {
        allCompleteMessage.style.display = "none";
    }
}

function resetTasks() {
    if (confirm("Are you sure you want to clear all tasks?")) {
        listContainer.innerHTML = "";
        localStorage.clear();
        updateCounters();
    }
}
loadTasks();

function toggleChat() {
    const chatWindow = document.getElementById("chat-window");
    chatWindow.style.display = chatWindow.style.display === "none" ? "block" : "none";
}

async function sendMessage() {
    const input = document.getElementById("chat-input");
    const messages = document.getElementById("chat-messages");
    const message = input.value.trim();
    if (!message) return;

    // Get current tasks
    const tasks = [];
    document.querySelectorAll("#list-container li").forEach(li => {
        tasks.push({
            text: li.querySelector(".task-text").textContent,
            completed: li.classList.contains("completed"),
            important: li.classList.contains("important")
        });
    });

    // Build message with task context
    const fullMessage = `
You are a helpful to-do list assistant. Here are the user's current tasks:
${tasks.map(t => `- ${t.text} (completed: ${t.completed}, starred: ${t.important})`).join("\n")}

User message: ${message}`;

    messages.innerHTML += `<div class="user-message">${message}</div>`;
    input.value = "";

    const typingDiv = document.createElement("div");
    typingDiv.className = "ai-message";
    typingDiv.textContent = "Typing...";
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;

    const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: fullMessage })
    });

    const data = await response.json();
    typingDiv.innerHTML = formatMessage(data.reply);
    messages.scrollTop = messages.scrollHeight;
}

function formatMessage(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>")
        .replace(/^\d+\.\s/gm, "<br>• ");
}