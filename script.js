// Load existing tasks on startup
window.onload = function () {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    storedTasks.forEach(task => createTaskElement(task));
};

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const priorityInput = document.getElementById("priorityInput");
    const dueDateInput = document.getElementById("dueDateInput");

    const taskText = taskInput.value.trim();
    const priority = priorityInput.value;
    const dueDate = dueDateInput.value;


  

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        text: taskText,
        priority: priority,
        dueDate: dueDate,
        completed: false
    };

    createTaskElement(task);
    saveTask(task);

    // Clear fields
    taskInput.value = "";
    priorityInput.value = "Low";
    dueDateInput.value = "";
}

function createTaskElement(task) {
    const taskList = document.getElementById("taskList");

    const taskItem = document.createElement("div");
    taskItem.className = `task-item priority-${task.priority}`;

    const taskInfo = document.createElement("div");
    taskInfo.className = "task-info";
    if (task.completed) taskInfo.classList.add("completed");

    const taskText = document.createElement("span");
    taskText.textContent = task.text;

    const taskMeta = document.createElement("small");
    taskMeta.textContent = task.dueDate ? `Due: ${task.dueDate}` : "";

    taskInfo.appendChild(taskText);
    taskInfo.appendChild(taskMeta);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => {
        taskInfo.classList.toggle("completed");
        task.completed = checkbox.checked;
        updateStorage();
    };

    function filterTasks() {
        const searchValue = document.getElementById('searchInput').value.toLowerCase();
        const tasks = document.querySelectorAll('.task-item');

        tasks.forEach(task => {
            const text = task.querySelector('span').textContent.toLowerCase();
            task.style.display = text.includes(searchValue) ? 'flex' : 'none';
        });
    }

    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    editButton.textContent = "Edit";
    editButton.onclick = () => {
        const newTask = prompt("Edit your task:", task.text);
        if (newTask !== null && newTask.trim() !== "") {
            task.text = newTask.trim();
            taskText.textContent = task.text;
            updateStorage();
        }
    };

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => {
        taskItem.remove();
        removeTask(task);
    };

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "task-buttons";
    buttonGroup.appendChild(checkbox);
    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);

    taskItem.appendChild(taskInfo);
    taskItem.appendChild(buttonGroup);

    taskList.appendChild(taskItem);
}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStorage() {
    const taskElements = document.querySelectorAll(".task-item");
    const updatedTasks = [];

    taskElements.forEach(item => {
        const taskText = item.querySelector("span").textContent;
        const dueText = item.querySelector("small").textContent;
        const dueDate = dueText.replace("Due: ", "");
        const completed = item.querySelector("input[type='checkbox']").checked;
        const priority = [...item.classList].find(cls => cls.startsWith("priority-")).split("-")[1];

        updatedTasks.push({
            text: taskText,
            dueDate: dueDate,
            completed: completed,
            priority: priority
        });
    });

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function removeTask(taskToRemove) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = tasks.filter(task => task.text !== taskToRemove.text || task.dueDate !== taskToRemove.dueDate);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

const voiceInputButton = document.getElementById('voiceInputButton');
const taskInput = document.getElementById('taskInput');

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    voiceInputButton.addEventListener('click', () => {
        recognition.start();
        voiceInputButton.textContent = '🎙️ Listening...';
    });

    recognition.addEventListener('result', (event) => {
        const transcript = event.results[0][0].transcript;
        taskInput.value = transcript;
        voiceInputButton.textContent = '🎤';
    });

    recognition.addEventListener('end', () => {
        voiceInputButton.textContent = '🎤';
    });
} else {
    voiceInputButton.disabled = true;
    voiceInputButton.title = "Speech Recognition not supported in this browser";
}
