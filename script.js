
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");

const taskTitle = document.getElementById("taskTitle");
const taskSubject = document.getElementById("taskSubject");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");

const formHeading = document.querySelector(".form-panel h2");
const submitButton = taskForm.querySelector(".add-task-btn");

let tasks = JSON.parse(localStorage.getItem("studySpaceTasks")) || [];
let currentFilter = "all";
let editingTaskId = null;

// Today's date in local time.
const today = new Date();

const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

taskDate.min = localToday;

// Create a cancel-edit button.
const cancelEditButton = document.createElement("button");

cancelEditButton.type = "button";
cancelEditButton.className = "cancel-edit-btn";
cancelEditButton.textContent = "Cancel Editing";
cancelEditButton.hidden = true;

taskForm.appendChild(cancelEditButton);

// Save tasks.
function saveTasks() {
    localStorage.setItem("studySpaceTasks", JSON.stringify(tasks));
}

// Update dashboard statistics.
function updateStats() {
    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    totalTasks.textContent = total;
    pendingTasks.textContent = pending;
    completedTasks.textContent = completed;

    progressPercent.textContent = percentage + "%";
    progressBar.style.width = percentage + "%";
}

// Format date without timezone problems.
function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");

    const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
    );

    return date.toLocaleDateString("en-CA", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

// Sort tasks by due date.
// Pending tasks appear before completed tasks.
function getSortedTasks() {
    return [...tasks].sort((a, b) => {
        if (a.completed !== b.completed) {
            return Number(a.completed) - Number(b.completed);
        }

        return a.date.localeCompare(b.date);
    });
}

// Display tasks.
function renderTasks() {
    taskList.replaceChildren();

    let filteredTasks = getSortedTasks();

    if (currentFilter === "pending") {
        filteredTasks = filteredTasks.filter(
            task => !task.completed
        );
    }

    if (currentFilter === "completed") {
        filteredTasks = filteredTasks.filter(
            task => task.completed
        );
    }

    if (filteredTasks.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";

        const icon = document.createElement("div");
        icon.className = "empty-icon";
        icon.textContent = "📚";

        const heading = document.createElement("h3");
        heading.textContent = "No tasks here";

        const message = document.createElement("p");
        message.textContent = currentFilter === "all"
            ? "Add your first study task to get started!"
            : "Nothing to show in this category yet.";

        emptyState.append(icon, heading, message);
        taskList.appendChild(emptyState);

        return;
    }

    filteredTasks.forEach(task => {
        const item = document.createElement("div");
        item.className = "task-item";

        if (task.completed) {
            item.classList.add("completed");
        }

        // Checkbox.
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.checked = task.completed;

        checkbox.setAttribute(
            "aria-label",
            "Mark task as completed"
        );

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;

            saveTasks();
            renderTasks();
            updateStats();
        });

        // Task information.
        const info = document.createElement("div");
        info.className = "task-info";

        const title = document.createElement("h3");
        title.textContent = task.title;

        const details = document.createElement("p");
        details.textContent =
            `${task.subject} · Due: ${formatDate(task.date)}`;

        info.append(title, details);

        // Task priority and actions.
        const meta = document.createElement("div");
        meta.className = "task-meta";

        const priority = document.createElement("span");
        priority.className = `priority ${task.priority}`;
        priority.textContent = task.priority;

        // Overdue label.
        if (!task.completed && task.date < localToday) {
            const overdue = document.createElement("span");

            overdue.className = "overdue-label";
            overdue.textContent = "Overdue";

            meta.appendChild(overdue);
        }

        // Edit button.
        const editButton = document.createElement("button");

        editButton.className = "edit-btn";
        editButton.textContent = "Edit";
        editButton.setAttribute("aria-label", "Edit task");

        editButton.addEventListener("click", () => {
            startEditing(task.id);
        });

        // Delete button.
        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";
        deleteButton.textContent = "×";
        deleteButton.setAttribute("aria-label", "Delete task");

        deleteButton.addEventListener("click", () => {
            if (editingTaskId === task.id) {
                cancelEditing();
            }

            tasks = tasks.filter(
                item => item.id !== task.id
            );

            saveTasks();
            renderTasks();
            updateStats();
        });

        meta.append(priority, editButton, deleteButton);
        item.append(checkbox, info, meta);

        taskList.appendChild(item);
    });
}

// Start editing a task.
function startEditing(taskId) {
    const task = tasks.find(
        item => item.id === taskId
    );

    if (!task) return;

    editingTaskId = taskId;

    taskTitle.value = task.title;
    taskSubject.value = task.subject;
    taskDate.value = task.date;
    taskPriority.value = task.priority;

    formHeading.textContent = "Edit study task";
    submitButton.textContent = "Save Changes";

    cancelEditButton.hidden = false;

    // Allow editing an existing overdue task.
    taskDate.min = "";

    taskForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    taskTitle.focus();
}

// Cancel editing.
function cancelEditing() {
    editingTaskId = null;

    taskForm.reset();

    taskPriority.value = "Medium";
    taskDate.min = localToday;

    formHeading.textContent = "Add a new task";
    submitButton.textContent = "+ Add Study Task";

    cancelEditButton.hidden = true;
}

cancelEditButton.addEventListener("click", cancelEditing);

// Add or update a task.
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = taskTitle.value.trim();
    const subject = taskSubject.value.trim();
    const date = taskDate.value;

    if (!title || !subject || !date) {
        alert("Please complete all the fields.");
        return;
    }

    // Only new tasks must have a future or today's date.
    if (!editingTaskId && date < localToday) {
        alert("Please select today or a future due date.");
        return;
    }

    if (editingTaskId) {
        const task = tasks.find(
            item => item.id === editingTaskId
        );

        if (!task) {
            cancelEditing();
            return;
        }

        task.title = title;
        task.subject = subject;
        task.date = date;
        task.priority = taskPriority.value;

    } else {
        const newTask = {
            id: Date.now(),
            title: title,
            subject: subject,
            date: date,
            priority: taskPriority.value,
            completed: false
        };

        tasks.push(newTask);
    }

    saveTasks();
    cancelEditing();

    renderTasks();
    updateStats();
});

// Task filters.
document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

// Load saved tasks.
renderTasks();
updateStats();

// =====================================
// STUDYSPACE V3 - CALENDAR FUNCTIONALITY
// =====================================

// Calendar elements
const calendarDays = document.getElementById("calendarDays");
const currentMonthLabel = document.getElementById("currentMonth");

const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");

const selectedDateTitle = document.getElementById("selectedDateTitle");
const selectedDateTasks = document.getElementById("selectedDateTasks");

// Current calendar month
let currentCalendarMonth = new Date(
    Number(localToday.split("-")[0]),
    Number(localToday.split("-")[1]) - 1,
    1
);

// Initially select today's date
let selectedCalendarDate = localToday;


// Format calendar dates as YYYY-MM-DD
function getCalendarDate(year, month, day) {
    const formattedMonth = String(month + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");

    return `${year}-${formattedMonth}-${formattedDay}`;
}


// Display tasks for the selected date
function showSelectedDateTasks() {

    selectedDateTitle.textContent =
        "Tasks for " + new Date(
            Number(selectedCalendarDate.split("-")[0]),
            Number(selectedCalendarDate.split("-")[1]) - 1,
            Number(selectedCalendarDate.split("-")[2])
        ).toLocaleDateString("en-CA", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });

    selectedDateTasks.replaceChildren();

    const dateTasks = tasks.filter(
        task => task.date === selectedCalendarDate
    );

    if (dateTasks.length === 0) {

        const message = document.createElement("p");

        message.textContent = "No tasks scheduled for this date.";

        selectedDateTasks.appendChild(message);

        return;
    }

    dateTasks.forEach(task => {

        const taskCard = document.createElement("div");
        taskCard.className = "calendar-task";

        const info = document.createElement("div");
        info.className = "calendar-task-info";

        const title = document.createElement("strong");
        title.textContent = task.title;

        const subject = document.createElement("span");
        subject.textContent = task.subject;

        info.append(title, subject);

        const status = document.createElement("span");
        status.className = "calendar-task-status";

        if (task.completed) {

            status.textContent = "Completed";
            status.classList.add("done");

        } else if (task.date < localToday) {

            status.textContent = "Overdue";
            status.classList.add("overdue");

        } else {

            status.textContent = task.priority;
        }

        taskCard.append(info, status);

        selectedDateTasks.appendChild(taskCard);

    });

}


// Generate the monthly calendar
function renderCalendar() {

    calendarDays.replaceChildren();

    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();

    const daysInMonth = new Date(
        year,
        month + 1,
        0
    ).getDate();

    // Display month and year
    currentMonthLabel.textContent =
        currentCalendarMonth.toLocaleDateString("en-CA", {
            month: "long",
            year: "numeric"
        });

    // Empty spaces before the first day
    for (let i = 0; i < firstDay; i++) {

        const emptyDay = document.createElement("div");

        emptyDay.className = "calendar-day empty";

        calendarDays.appendChild(emptyDay);
    }


    // Generate calendar dates
    for (let day = 1; day <= daysInMonth; day++) {

        const dateString = getCalendarDate(
            year,
            month,
            day
        );

        const dayButton = document.createElement("button");

        dayButton.type = "button";
        dayButton.className = "calendar-day";

        const number = document.createElement("span");

        number.className = "day-number";
        number.textContent = day;

        dayButton.appendChild(number);


        // Highlight today's date
        if (dateString === localToday) {
            dayButton.classList.add("today");
        }


        // Highlight selected date
        if (dateString === selectedCalendarDate) {
            dayButton.classList.add("selected");
        }


        // Find tasks due on this date
        const tasksOnDate = tasks.filter(
            task => task.date === dateString
        );


        // Show task indicator
        if (tasksOnDate.length > 0) {

            const indicator = document.createElement("span");

            indicator.className = "task-indicator";

            dayButton.appendChild(indicator);
        }


        // Highlight dates with overdue tasks
        const hasOverdueTasks = tasksOnDate.some(
            task => !task.completed && task.date < localToday
        );

        if (hasOverdueTasks) {
            dayButton.classList.add("overdue-day");
        }


        // Select a date
        dayButton.addEventListener("click", () => {

            selectedCalendarDate = dateString;

            renderCalendar();
            showSelectedDateTasks();

        });

        calendarDays.appendChild(dayButton);
    }

    showSelectedDateTasks();

}


// Previous month
prevMonthButton.addEventListener("click", () => {

    currentCalendarMonth.setMonth(
        currentCalendarMonth.getMonth() - 1
    );

    renderCalendar();

});


// Next month
nextMonthButton.addEventListener("click", () => {

    currentCalendarMonth.setMonth(
        currentCalendarMonth.getMonth() + 1
    );

    renderCalendar();

});


// Refresh the calendar whenever the V2 task list is updated.
const originalRenderTasks = renderTasks;

renderTasks = function() {

    originalRenderTasks();

    renderCalendar();

};


// Initial calendar display
renderCalendar();

