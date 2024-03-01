import {activeBtnElement, allBtnElement, clearCompletedElement,
    completedBtnElement, getCheckboxIcons, getDeleteIcons, inputElement,
    numberLeftTasks, themeButton, themeElement, todoListElement } from "./scripts/elements.js";

const toggleDarkMode = () => {
  themeElement.classList.toggle("dark-theme");
  saveToDB("darkModeFlag", themeElement.classList.contains("dark-theme"));
};

themeButton.addEventListener("click", () => toggleDarkMode());

const fetchData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : false;
};

const renderTaskList = (tasks) => {
  let taskItem = "";
    tasks.forEach((task, index) => {
    taskItem += `
      <li class="todo-item" id="${index}" draggable="true">
        <div class="check-icon-box ${task.isCompleted ? " task-completed" : ""}">
          <div class="check-icon-btn" tabindex="0" role="button">
            <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="11" height="9">
              <path class="check-icon-path" fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/>
            </svg>
          </div>
          <p class="todo-task-value">${task.value}</p>
        </div>
        <img
          class="delete-icon"
          src="images/icon-cross.svg"
          alt="cross icon"
        />
      </li>
    `
    });

    todoListElement.innerHTML = taskItem;
    inputElement.value = "";
  };


const addTask = () => {
  const taskValue = inputElement.value;

  if (!taskValue) return;

  const task = {
    value: taskValue,
    isCompleted: false,
  }

  const tasks = fetchData("tasks") || [];

  tasks.push(task);
  saveToDB("tasks", tasks);

  initTaskList(tasks);
};

const deleteTask = (event, index) => {
  const answer = confirm("هل انت متأكد من حذف المهمة؟");
  if(!answer) return;
  const tasks = fetchData("tasks");

  tasks.splice(index, 1);
  saveToDB("tasks", tasks);
  initTaskList(tasks);
};

const initTaskListeners = () => {
  getDeleteIcons().forEach((icon, index) => {
    icon.addEventListener("click", (event) => deleteTask(event, index));
  });

  getCheckboxIcons().forEach((box, index) => {
    box.addEventListener("click", (event) => toggleTask(event, index))
  })
};


inputElement.addEventListener("keydown", (event) => {
  if(event.key === "Enter") {
    event.preventDefault();
    addTask();
  }
});


const saveToDB = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};


const initDataStratup = () => {
  fetchData("darkModeFlag") && toggleDarkMode();
  initTaskList(fetchData("tasks"));
};

const renderEmptyState = () => {
  todoListElement.innerHTML = `<li class='EmptyList'>
   <p>The task list is empty</p>
  </li>
  `
};

const initTaskList = (tasks) => {
  if(tasks?.length){
    renderTaskList(tasks);
    initTaskListeners();
    initDragAndDrop();
  } else {
    renderEmptyState();
  }
  numberTasks();
};

const toggleTask = (event, index) => {
  event.currentTarget.parentElement.classList.toggle("task-completed");
  const tasks = fetchData("tasks");
  tasks[index].isCompleted = !tasks[index].isCompleted;
  saveToDB("tasks", tasks);
  numberTasks();
};


const numberTasks = () => {
  const tasks = fetchData("tasks");
  const changeTasks = tasks.filter((task) => !task.isCompleted);
  numberLeftTasks.textContent = changeTasks.length;
};


const allTasks = () => {
  const tasks = fetchData("tasks");
  const changeTasks = tasks.filter((task) => task.value);
  initTaskList(changeTasks);
}
allBtnElement.addEventListener("click", () => allTasks());


const activeTasks = () => {
  const tasks = fetchData("tasks");
  const changeTasks = tasks.filter((task) => !task.isCompleted);
  initTaskList(changeTasks);
};
activeBtnElement.addEventListener("click", () => activeTasks());


const CompletedTasks = () => {
  const tasks = fetchData("tasks");
  const changeTasks = tasks.filter((task) => task.isCompleted);
  initTaskList(changeTasks);
}
completedBtnElement.addEventListener("click", () => CompletedTasks());


const clearCompletedTasks = () => {
  const tasks = fetchData("tasks");
  const changeTasks = tasks.filter((task) => !task.isCompleted);
  saveToDB("tasks", changeTasks);
  initTaskList(changeTasks);
};
clearCompletedElement.addEventListener("click", () => clearCompletedTasks());


const initDragAndDrop = () => {
  const listItems = document.querySelectorAll(".todo-item");

  listItems.forEach((item) => {
    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", item.id);
    });

    item.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    item.addEventListener("drop", (e) => {
      e.preventDefault();
      const draggedItemId = e.dataTransfer.getData("text/plain");
      const draggedItem = document.getElementById(draggedItemId);
      const dropTarget = e.target.closest(".todo-item");

      if (draggedItem && dropTarget) {
        const tasks = fetchData("tasks");
        const draggedIndex = parseInt(draggedItemId, 10);
        const dropIndex = parseInt(dropTarget.id, 10);

        const temp = tasks[draggedIndex];
        tasks[draggedIndex] = tasks[dropIndex];
        tasks[dropIndex] = temp;

        saveToDB("tasks", tasks);
        initTaskList(tasks);
      }
    });
  });
};


initDataStratup();



