    const todoForm = document.getElementById("todoForm");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const emptyMessage = document.getElementById("emptyMessage");
    const statusMessage = document.getElementById("statusMessage");

    let tasks = JSON.parse(localStorage.getItem("floralTasks")) || [];

    function saveTasks() {
      localStorage.setItem("floralTasks", JSON.stringify(tasks));
    }

    function announce(message) {
      statusMessage.textContent = message;
    }

    function updateEmptyState() {
      emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
    }

    function escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    }

    function displayTasks() {
      taskList.innerHTML = "";

      tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "task-item";
        if (task.completed) {
          li.classList.add("completed");
        }

        const taskId = `task-${index}`;
        const safeText = escapeHtml(task.text);

        li.innerHTML = `
          <div class="task-content">
            <label class="task-label" for="${taskId}">
              <input
                class="task-checkbox"
                type="checkbox"
                id="${taskId}"
                ${task.completed ? "checked" : ""}
              />
              <span class="task-text">${safeText}</span>
            </label>

            <button
              type="button"
              class="delete-btn"
              aria-label="Supprimer la tâche : ${safeText}"
            >
              Supprimer
            </button>
          </div>
        `;

        const checkbox = li.querySelector(".task-checkbox");
        const deleteBtn = li.querySelector(".delete-btn");

        checkbox.addEventListener("change", () => {
          toggleTask(index);
        });

        deleteBtn.addEventListener("click", () => {
          deleteTask(index);
        });

        taskList.appendChild(li);
      });

      updateEmptyState();
    }

    function addTask() {
      const text = taskInput.value.trim();

      if (text === "") {
        announce("Le champ est vide. Écris une tâche avant d’ajouter.");
        return;
      }

      tasks.push({
        text,
        completed: false
      });

      saveTasks();
      displayTasks();
      announce(`Tâche ajoutée : ${text}`);
      taskInput.value = "";
      taskInput.focus();
    }

    function toggleTask(index) {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      displayTasks();

      const state = tasks[index].completed ? "terminée" : "remise en cours";
      announce(`Tâche ${state} : ${tasks[index].text}`);
    }

    function deleteTask(index) {
      const deletedTask = tasks[index].text;
      tasks.splice(index, 1);
      saveTasks();
      displayTasks();
      announce(`Tâche supprimée : ${deletedTask}`);
    }

    todoForm.addEventListener("submit", (event) => {
      event.preventDefault();
      addTask();
    });

    displayTasks();
    announce("La liste de tâches est prête.");