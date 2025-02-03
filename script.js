document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("todo-form");
  const taskList = document.getElementById("todo-list");
  const calendarEl = document.getElementById("calendar");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Initialize Calendar
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "en",
    events: tasks.map((task, index) => ({
      title: task.title,
      start: task.deadline,
      description: task.comment,
      id: index.toString(),
    })),
    eventClick: function (info) {
      alert(`Task: ${info.event.title}\nComment: ${info.event.extendedProps.description}`);
    }
  });

  calendar.render();

  // Render task list
  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";
      li.innerHTML = `
        <div>
          <strong>${task.title}</strong> (Due: ${task.deadline}, Priority: ${task.priority})
          <p>${task.comment}</p>
        </div>
        <div class="actions">
          <button onclick="toggleComplete(${index})">${task.completed ? "Undo" : "Complete"}</button>
          <button onclick="deleteTask(${index})">Delete</button>
        </div>
      `;
      taskList.appendChild(li);
    });

    updateCalendar();
  }

  // Add new task
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("task-title").value;
    const deadline = document.getElementById("task-deadline").value;
    const priority = document.getElementById("task-priority").value;
    const comment = document.getElementById("task-comment").value;

    tasks.push({ title, deadline, priority, comment, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    form.reset();
  });

  // Toggle task completion
  window.toggleComplete = function (index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  };

  // Delete task
  window.deleteTask = function (index) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  };

  // Update calendar events
  function updateCalendar() {
    calendar.removeAllEvents();
    tasks.forEach((task, index) => {
      calendar.addEvent({
        title: task.title,
        start: task.deadline,
        description: task.comment,
        id: index.toString(),
      });
    });
  }

  renderTasks();
});
