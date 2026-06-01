//------------GLOBAL VARIABLES------------

const form = document.getElementById("newTaskForm");
const url = "https://todoapp25-23.onrender.com";


//------------HELPER FUNCTIONS-----------

// Formats the UI layout of each task
function formatTask(task) {
  const tr = document.createElement("tr");
  tr.classList.add("align-middle");
  const isComplete = task.completed;
  const complete = isComplete ? "text-decoration-line-through" : "";
  tr.innerHTML = `
  <th scope="row" class="${complete} text-truncate w-75" style="max-width: 200px;">${task.title}</th>
  <td class="${complete}">${new Date(task.dueDate).toLocaleDateString()}</td>
  <td class="text-end">
  <div class="d-flex justify-content-end">
  ${isComplete ?
    `<button class="btn btn-icon px-2" onClick="incompleteTask('${task._id}')"><i class="bi bi-x-square text-white"></i></button>`:
    `<button class="btn btn-icon px-2" onClick="completeTask('${task._id}')"><i class="bi bi-check-square text-white"></i></button>`
    }
    <button class="btn btn-icon px-2" onClick="openModal('${task._id}', '${task.title}', '${task.dueDate.slice(0, 10)}')"><i class="bi bi-pencil-square text-white"></i></button>
    <button class="btn btn-icon px-2" onClick="deleteTask('${task._id}')"><i class="bi bi-trash text-white"></i></button>
  </div>
  </td>
  `;
  return tr;
}


// Gets all tasks and display them in the page
async function displayTasks() {
const tasks = await getTasks();
const toDoList = document.getElementById("toDoList");

toDoList.innerHTML = ""; // Clearing the table / Starting fresh

tasks.forEach(item => {
  toDoList.appendChild(formatTask(item));
});
}

// Opens the 'Edit' modal with pre population task info
let editingId = null;
function openModal(id, title, date) {
  editingId = id;
  document.getElementById("editTitle").value = title;
  document.getElementById("editDate").value = date;
  new bootstrap.Modal(document.getElementById("editModal")).show();
}

// -------EVENT LISTENERS (TRIGGERS)---------

window.addEventListener("DOMContentLoaded", () => {
  displayTasks();
  form.reset();
  document.getElementById("taskFilter").value = ""; // Reset to "All" on page load
  document.getElementById("sortDueDate").checked = false; // unchecks the sort button on page load

  document.getElementById("taskFilter").addEventListener("change", displayTasks);
  document.getElementById("sortDueDate").addEventListener("change", displayTasks);
});


// Submits task form and creates a new task
form.addEventListener("submit", (event) => {
  event.preventDefault();
  createTask();
});


// ----------------------- TASK FUNCTIONS / API Calls---------------------

async function getTasks() {
  try {
    const params = new URLSearchParams();
    const completed = document.getElementById("taskFilter").value;
    if (completed) params.set("completed", completed);
    if (document.getElementById("sortDueDate").checked) params.set("sort", "dueDate");

    const response = await fetch(`${url}/tasks?${params}`); //-> -> ->
    
    if (!response.ok) {
    const err = await response.json();
    return console.error(err.message);
    }

    const data = await response.json(); // <- <- <-
    return data.tasks;
    
  } catch (error) {
    console.error("Failed to get tasks", error);
  }
}


async function createTask() {
try {
  const taskData = {
    title: form.title.value.trim(),
    dueDate: form.dueDate.value
  }

  const response = await fetch("http://localhost:3000/tasks/new", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(taskData)
  });

  if (!response.ok) {
    const err = await response.json();
    return console.error(err.message);
  }

  const data = await response.json();
  displayTasks();
  form.reset();
  console.log(data.message, data.task);


} catch (error) {
  console.error("Failed to create task", error);
}
}


async function completeTask(id) {
  try {
  const response = await fetch(`${url}/tasks/complete/${id}`, { method: "PATCH" });
  
  if (!response.ok) {
    const err = await response.json();
    return console.error(err.message);
  }

  const data = await response.json();
  displayTasks();
  console.log(data.message, data.task);

} catch (error) {
    console.error("Failed to complete task", error);
  }
}


async function incompleteTask(id) {
  try {
    const response = await fetch(`${url}/tasks/incomplete/${id}`, { method: "PATCH" });

    if (!response.ok) {
      const err = await response.json();
      return console.error(err.message);
    }

    const data = await response.json();
    displayTasks();
    console.log(data.message, data.task);

  } catch (error) {
    console.error("Failed to set task to incomplete", error);
  }
}


async function deleteTask(id) {
  try {
    const response = await fetch(`${url}/tasks/delete/${id}`, { method: "DELETE" });

    if (!response.ok) {
      const err = await response.json();
      return console.error(err.message);
    }

    const data = await response.json();
    displayTasks();
    console.log(data.message, data.task);

  } catch (error) {
    console.error("Failed to delete task", error);
  }
}


async function editTask() {
  try {
    const taskData = {
      title: document.getElementById("editTitle").value.trim(),
      dueDate: document.getElementById("editDate").value
    }

    const response = await fetch(`${url}/tasks/edit/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData)
    });

    if (!response.ok) {
      const err = await response.json();
      return console.error(err.message);
    }

    const data = await response.json();
    console.log(data.message, data.task);
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
    displayTasks();

  } catch (error) {
    console.error("Failed to edit task", error);
  }
}

