// Task array to hold all tasks
let tasks = [];

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromStorage();
    renderTasks();
    updateCount();
});

// Add a new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const categorySelect = document.getElementById('categorySelect');
    const dueDateInput = document.getElementById('dueDateInput');

    const text = taskInput.value.trim();

    if (text === '') {
        alert('Please enter a task');
        return;
    }

    const task = {
        id: Date.now(), // Unique ID
        text: text,
        completed: false,
        category: categorySelect.value,
        dueDate: dueDateInput.value
    };

    tasks.push(task);
    saveTasksToStorage(); // Save to localStorage
    renderTasks();
    updateCount();

    // Clear inputs
    taskInput.value = '';
    categorySelect.value = '';
    dueDateInput.value = '';
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasksToStorage(); // Save to localStorage
        renderTasks();
        updateCount();
    }
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasksToStorage(); // Save to localStorage
    renderTasks();
    updateCount();
}

// Clear all completed tasks
function clearCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;

    if (completedCount === 0) {
        alert('No completed tasks to clear');
        return;
    }

    if (confirm(`Delete ${completedCount} completed task(s)?`)) {
        tasks = tasks.filter(t => !t.completed);
        saveTasksToStorage(); // Save to localStorage
        renderTasks();
        updateCount();
    }
}

// Filter tasks by category
let currentFilter = 'all';

function filterTasks(filter) {
    currentFilter = filter;

    // Update active button state
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`)?.classList.add('active');

    renderTasks();
}

// Get filtered tasks
function getFilteredTasks() {
    if (currentFilter === 'all') {
        return tasks;
    }
    return tasks.filter(t => t.category === currentFilter);
}

// Render tasks to the DOM
function renderTasks() {
    const taskList = document.getElementById('taskList');
    const filteredTasks = getFilteredTasks();

    taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
        const emptyMessage = currentFilter === 'all'
            ? 'No tasks yet. Add one above!'
            : `No ${currentFilter} tasks`;
        taskList.innerHTML = `<li class="empty-state">${emptyMessage}</li>`;
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'done' : '';
        li.onclick = () => toggleTask(task.id);

        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';

        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task';
        taskTextSpan.textContent = task.text;

        // Add category badge
        if (task.category) {
            const categoryBadge = document.createElement('span');
            categoryBadge.className = `category-badge category-${task.category}`;
            categoryBadge.textContent = task.category;
            taskTextSpan.appendChild(categoryBadge);
        }

        taskContent.appendChild(taskTextSpan);

        // Add due date
        if (task.dueDate) {
            const dueDateSpan = document.createElement('span');
            dueDateSpan.className = 'due-date';

            const dueDate = new Date(task.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const diffTime = dueDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
                dueDateSpan.classList.add('overdue');
                dueDateSpan.innerHTML = `⚠️ ${task.dueDate} (Overdue)`;
            } else if (diffDays === 0) {
                dueDateSpan.classList.add('today');
                dueDateSpan.innerHTML = `📅 ${task.dueDate} (Today)`;
            } else if (diffDays <= 5) {
                dueDateSpan.classList.add('soon');
                dueDateSpan.innerHTML = `📅 ${task.dueDate} (${diffDays} days)`;
            } else {
                dueDateSpan.innerHTML = `📅 ${task.dueDate}`;
            }

            taskContent.appendChild(dueDateSpan);
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '×';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        };

        li.appendChild(taskContent);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Update task count
function updateCount() {
    const count = tasks.filter(t => !t.completed).length;
    document.getElementById('count').textContent = `${count} task${count !== 1 ? 's' : ''} left`;
}

// ========== LocalStorage Functions ==========

function saveTasksToStorage() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}
