    const form = document.querySelector("#todo-form");
    const taskInput = document.querySelector("#task-input");
    const taskList = document.querySelector("#task-list");
    const taskCount = document.querySelector("#task-count");
    const emptyMessage = document.querySelector("#empty-message");
    const clearButton = document.querySelector("#clear-completed");
    const storageKey = "todo-tasks";

    let tasks = loadTasks();

    function loadTasks() {
      try {
        return JSON.parse(localStorage.getItem(storageKey)) || [];
      } catch {
        return [];
      }
    }

    function saveTasks() {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    }

    function renderTasks() {
      taskList.innerHTML = "";

      tasks.forEach((task) => {
        const item = document.createElement("li");
        item.classList.toggle("completed", task.completed);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", `Mark ${task.text} complete`);
        checkbox.addEventListener("change", () => toggleTask(task.id));

        const text = document.createElement("span");
        text.className = "task-text";
        text.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", `Delete ${task.text}`);
        deleteButton.addEventListener("click", () => deleteTask(task.id));

        item.append(checkbox, text, deleteButton);
        taskList.append(item);
      });

      const remaining = tasks.filter((task) => !task.completed).length;
      taskCount.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} left`;
      emptyMessage.hidden = tasks.length > 0;
      clearButton.hidden = !tasks.some((task) => task.completed);
    }

    function addTask(text) {
      tasks.push({
        id: Date.now(),
        text,
        completed: false
      });
      saveTasks();
      renderTasks();
    }

    function toggleTask(id) {
      const task = tasks.find((item) => item.id === id);
      if (task) task.completed = !task.completed;
      saveTasks();
      renderTasks();
    }

    function deleteTask(id) {
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks();
      renderTasks();
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = taskInput.value.trim();
      if (!text) return;

      addTask(text);
      form.reset();
      taskInput.focus();
    });

    clearButton.addEventListener("click", () => {
      tasks = tasks.filter((task) => !task.completed);
      saveTasks();
      renderTasks();
    });

    renderTasks();
  