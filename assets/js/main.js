const addBtn = document.querySelector('.addBtn');
const message = document.querySelector('.message');
const list = document.querySelector(".list");
const checkbox = document.querySelector('#checkbox');
const themeBox = document.querySelector('.themeBox')
const deleteSelectedBtn = document.querySelector('.deleteSelectedBtn')


const confirmationModal = document.querySelector(".confirmationModal");
const confirmDeleteBtn = document.querySelector("#confirmDeleteBtn");
const cancelDeleteBtn = document.querySelector("#cancelDeleteBtn");


// declarations completed 
let taskToDelete = null;


// geting data from local storage 
function getFromLocalStorage() {
    let todolist = JSON.parse(localStorage.getItem("todolist")) || [];
    return todolist
}

// set to local storage 
function setToLoaclStorage(data) {
    localStorage.setItem("todolist", JSON.stringify(data));
}

// delete-button show hide 
function deleteShowHide(todolist) {
    if (todolist.length === 0) {
        deleteSelectedBtn.style.display = 'none'
    }
    else {
        deleteSelectedBtn.style.display = 'block'
    }
}


function loadList() {
    const todolist = getFromLocalStorage()

    todolist.forEach(listItems => showInList(listItems.text, listItems.cmp, listItems.id));

    const mode = localStorage.getItem("mode");
    if (mode == 'dark') {
        document.body.classList.add('darkMode');
        checkbox.checked = true;
    }

    // delete-button show hide 
    deleteShowHide(todolist)
}


document.addEventListener("DOMContentLoaded", loadList); // on load data from local store will refresh



// theme changer 
themeBox.addEventListener('click', themechanger)
function themechanger() {  // on click checkbox
    document.body.classList.toggle('darkMode', checkbox.checked);
    localStorage.setItem("mode", checkbox.checked ? "dark" : "light");
}



// after click on add-task button 
addBtn.addEventListener('click', function () {
    const taskInput = document.querySelector("#inputText");
    const listText = taskInput.value.trim();                    //get input value and trim

    if (listText === "") {                                      // if input value is empty
        message.style.display = 'block';
        message.textContent = 'Please enter task';

        setTimeout(function () {
            message.style.display = "none";
        }, 1000); // Hide the message after 1 second
        return;
    }


    const newTaskId = Date.now();
    saveInSpan(listText, newTaskId);
    showInList(listText, false, newTaskId);
    taskInput.value = ""; //make input value=blank
})



// save the list 
function saveInSpan(text) {


    const todolist = getFromLocalStorage()
    const newTask = {
        id: Date.now(),
        text,
        cmp: false
    };
    todolist.push(newTask);
    setToLoaclStorage(todolist)

    // delete-button show hide 
    deleteShowHide(todolist);
}


// display list 

function showInList(text, cmp = false, id) {
    const li = document.createElement("li");
    li.className = cmp ? "completed" : "";
    li.dataset.id = id;  // Store the task's unique ID in the data attribute


    const textspan = document.createElement("span");
    textspan.textContent = text;
    li.appendChild(textspan);

    const removeButton = document.createElement("button");
    removeButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    removeButton.onclick = () => removeList(li);

    const completeButton = document.createElement("button");
    completeButton.innerHTML = '<span></span><span></span>';
    completeButton.classList.add('tickBtn');
    completeButton.onclick = () => tickCross(li);

    const checkboxInput = document.createElement("input");
    checkboxInput.type = "checkbox";
    checkboxInput.classList.add("taskCheckbox");


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


// cross/save btn 
function tickCross(tsk) {                                  // on click tick/cross button
    const taskId = tsk.dataset.id;
    let todolist = getFromLocalStorage()

    todolist = todolist.map(list => {
        if (list.id === parseInt(taskId)) {
            list.cmp = !list.cmp;
        }
        return list;
    });

    setToLoaclStorage(todolist)
    tsk.classList.toggle("completed");
}


// for remove 
function removeList(rmvtsk) {
    taskToDelete = rmvtsk;
    confirmationModal.style.display = "flex";
}

// if clicked on no 
cancelDeleteBtn.addEventListener('click', () => {
    taskToDelete = null;
    confirmationModal.style.display = "none";
});


// Set up the event listeners for the buttons
confirmDeleteBtn.addEventListener('click', () => {
    if (taskToDelete) {
        const taskId = taskToDelete.dataset.id;


        let todolist = getFromLocalStorage();
        todolist = todolist.filter(list => list.id !== parseInt(taskId));
        setToLoaclStorage(todolist);

        taskToDelete.remove();
        taskToDelete = null;


        confirmationModal.style.display = "none";

        // Delete-button show hide 
        deleteShowHide(todolist);
    }
});






// Update the deleteSelectedBtn event listener
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


    confirmationModal.style.display = "flex";


    const tasksToDelete = Array.from(checkedTasks).map(task => task.closest('li'));


    confirmDeleteBtn.onclick = () => {
        let todolist = getFromLocalStorage();

        tasksToDelete.forEach(task => {
            const taskId = task.dataset.id;
            todolist = todolist.filter(list => list.id !== parseInt(taskId)); // Remove by ID
            task.remove();
        });


        setToLoaclStorage(todolist);


        confirmationModal.style.display = "none";


        deleteShowHide(todolist);
    };


    cancelDeleteBtn.onclick = () => {
        confirmationModal.style.display = "none";
    };
});
