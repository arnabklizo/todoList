const addBtn = document.querySelector('.addBtn');
const message = document.querySelector('.message');
const list = document.querySelector(".list");
const checkbox = document.querySelector('#checkbox');
const themeBox = document.querySelector('.themeBox');
const deleteSelectedBtn = document.querySelector('.deleteSelectedBtn');

const confirmationModal = document.querySelector(".confirmationModal");
const confirmDeleteBtn = document.querySelector("#confirmDeleteBtn");
const cancelDeleteBtn = document.querySelector("#cancelDeleteBtn");

// declarations completed 
let taskToDelete = null;

// set up local storage 
function setToLocalStorage(data) {
    localStorage.setItem("todolist", JSON.stringify(data));
}

// getting data from local storage 
function getFromLocalStorage() {
    return JSON.parse(localStorage.getItem("todolist")) || [];
}


// delete-button show hide 
function deleteShowHide(todolist) {
    deleteSelectedBtn.style.display = todolist.length < 2 ? 'none' : 'block';
}


// load task list from localStorage
function loadList() {
    const todolist = getFromLocalStorage();
    todolist.forEach(listItems => showInList(listItems.text, listItems.cmp, listItems.id));

    const mode = localStorage.getItem("mode");
    if (mode === 'dark') {
        document.body.classList.add('darkMode');
        checkbox.checked = true;
    }

    deleteShowHide(todolist);
}

document.addEventListener("DOMContentLoaded", loadList);

// theme changer 
themeBox.addEventListener('click', () => {
    document.body.classList.toggle('darkMode', checkbox.checked);
    localStorage.setItem("mode", checkbox.checked ? "dark" : "light");
});

addBtn.addEventListener('click', function () {
    const taskInput = document.querySelector("#inputText");
    const listText = taskInput.value.trim();

    if (listText === "") {
        message.style.display = 'block';
        message.textContent = 'Please enter task';

        setTimeout(function () {
            message.style.display = "none";
        }, 1000);
        return;
    }

    const newTaskId = Date.now();
    saveInLocalStorage(listText, newTaskId);
    showInList(listText, false, newTaskId);
    taskInput.value = "";
});

// save task in localStorage
function saveInLocalStorage(text, id) {
    const todolist = getFromLocalStorage();
    const newTask = { id, text, cmp: false };
    todolist.push(newTask);
    setToLocalStorage(todolist);
    deleteShowHide(todolist);
}

// display task in list
function showInList(text, cmp = false, id) {
    const li = document.createElement("li");
    li.className = cmp ? "completed" : "";
    li.dataset.id = id;

    const textspan = document.createElement("span");
    textspan.textContent = text;
    li.appendChild(textspan);

    const removeButton = document.createElement("button");
    removeButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    removeButton.onclick = () => removeList(li);

    const completeButton = document.createElement("button");
    completeButton.innerHTML = '<span></span><span></span>';
    completeButton.classList.add('tickBtn');
    completeButton.onclick = () => toggleComplete(li);

    const checkboxInput = document.createElement("input");
    checkboxInput.type = "checkbox";
    checkboxInput.classList.add("taskCheckbox");

    const totalTasks = document.querySelectorAll('.list li').length;


    li.appendChild(checkboxInput);


    const buttonspan = document.createElement("span");
    buttonspan.appendChild(completeButton);
    buttonspan.appendChild(removeButton);
    buttonspan.appendChild(checkboxInput);
    li.appendChild(buttonspan);

    const completeSpan = document.createElement('span');
    completeSpan.classList.add('completeSpan');
    completeSpan.innerText = 'Completed';
    li.appendChild(completeSpan);

    list.prepend(li);

}


// toggle task completion status
function toggleComplete(task) {
    const taskId = task.dataset.id;
    let todolist = getFromLocalStorage();
    todolist = todolist.map(item => {
        if (item.id === parseInt(taskId)) {
            item.cmp = !item.cmp;
        }
        return item;
    });
    setToLocalStorage(todolist);
    task.classList.toggle("completed");
}

// remove task from list
function removeList(task) {
    taskToDelete = task;
    confirmationModal.style.display = "flex";
}

// Cancel delete
cancelDeleteBtn.addEventListener('click', () => {
    taskToDelete = null;
    confirmationModal.style.display = "none";
});

// Confirm delete
confirmDeleteBtn.addEventListener('click', () => {
    if (taskToDelete) {
        const taskId = taskToDelete.dataset.id;
        let todolist = getFromLocalStorage();
        todolist = todolist.filter(list => list.id !== parseInt(taskId));
        setToLocalStorage(todolist);
        taskToDelete.remove();
        taskToDelete = null;
        confirmationModal.style.display = "none";
        deleteShowHide(todolist);
    }
});

// Delete selected tasks
deleteSelectedBtn.addEventListener("click", () => {
    const checkedTasks = document.querySelectorAll('.taskCheckbox:checked');

    if (checkedTasks.length === 0) {
        message.style.display = 'block';
        message.textContent = 'Nothing selected to delete';

        setTimeout(function () {
            message.style.display = "none";
        }, 1000);
        return;
    }

    if (checkedTasks.length < 2) {
        message.style.display = 'block';
        message.textContent = 'Please select more than one item to delete';

        setTimeout(function () {
            message.style.display = "none";
        }, 1000);
        return;
    }

    confirmationModal.style.display = "flex";

    const tasksToDelete = Array.from(checkedTasks).map(task => task.closest('li'));

    confirmDeleteBtn.onclick = () => {
        let todolist = getFromLocalStorage();
        tasksToDelete.forEach(task => {
            const taskId = task.dataset.id;
            todolist = todolist.filter(list => list.id !== parseInt(taskId)); // Remove by ID
            task.remove();
        });
        setToLocalStorage(todolist);
        confirmationModal.style.display = "none";
        deleteShowHide(todolist);
    };

    cancelDeleteBtn.onclick = () => {
        confirmationModal.style.display = "none";
    };
});

