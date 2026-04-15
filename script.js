const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");
const taskTitle = document.getElementById("task-title");
const allCompleteMessage = document.getElementById("all-complete-message");

function addTask() {
    const task = inputBox.value.trim();
    if (!task) {
        alert("Please write down a task");
        return;
    }

    const li = document.createElement("li");
    li.innerHTML = `
    <label>
        <input type="checkbox">
        <span>${task}</span>
    </label>
    <span class="edit-btn">Edit</span>
    <span class="delete-btn">Delete</span>
    `;

    const checkbox = li.querySelector("input");
    const editBtn = li.querySelector(".edit-btn");
    const taskSpan = li.querySelector("label span");
    const deleteBtn = li.querySelector(".delete-btn");

    checkbox.addEventListener("click", function() {
        li.classList.toggle("completed", checkbox.checked);
        updateCounters();
    });

    editBtn.addEventListener("click", function() {
        const update = prompt("Edit task: ", taskSpan.textContent);
        if (update !== null && update.trim() !== "") {
            taskSpan.textContent = update.trim();
            li.classList.remove("completed");
            checkbox.checked = false;
        }
        updateCounters();
    });

    deleteBtn.addEventListener("click", function() {
        if (confirm("Are you sure you want to delete this task?")) {
            li.remove();
            updateCounters();
        }
    });

    listContainer.appendChild(li);
    inputBox.value = "";
    updateCounters();
}

function updateCounters() {
    const totalTasks = document.querySelectorAll("#list-container li").length;
    const completedTasks = document.querySelectorAll("#list-container li.completed").length;
    const uncompletedTasks = totalTasks - completedTasks;

    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = uncompletedTasks;

    if (totalTasks > 0 && completedTasks === totalTasks) {
        taskTitle.style.display = "none";
        listContainer.style.display = "none";
        allCompleteMessage.style.display = "block";
    } else {
        taskTitle.style.display = "block";
        listContainer.style.display = "block";
        allCompleteMessage.style.display = "none";
    }
}