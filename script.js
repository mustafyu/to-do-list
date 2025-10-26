// function to recalc and show "X tasks left"
function updateCount() {
    const all = document.querySelectorAll("#taskList li");      // all tasks
    const done = document.querySelectorAll("#taskList li.done"); // completed ones
    const remaining = all.length - done.length;                  // total - done
    // update the <p id="count">
    document.getElementById("count").textContent =
        `${remaining} task${remaining === 1 ? "" : "s"} left`;
}

// main add function
function addTask() {
    const input = document.getElementById("taskInput");
    const categorySelect = document.getElementById("categorySelect");
    const dueDateInput = document.getElementById("dueDateInput");
    const text = input.value.trim();
    const category = categorySelect.value;
    const dueDate = dueDateInput.value;
    if (!text) return; // ignore empty input

    // create a new <li>
    const li = document.createElement("li");

    // Task content container
    const taskContent = document.createElement("div");
    taskContent.className = "task-content";

    //  span for text
    const span = document.createElement("span");
    span.className = "task";
    span.textContent = text;


    // category badge (if category exists)
    if (category) {
        const badge = document.createElement("span");
        badge.className = `category-badge category-${category}`;
        badge.textContent = category;
        span.appendChild(badge);
    }

    taskContent.appendChild(span);

    // Due date display
    if (dueDate) {
        const dateDisplay = document.createElement("div");
        dateDisplay.className = "due-date";

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const taskDate = new Date(dueDate + 'T00:00:00');

        const diffTime = taskDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let dateText = new Date(dueDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        if (diffDays < 0) {
            dateDisplay.classList.add("overdue");
            dateText = `⚠️ ${dateText} (Overdue)`;
        } else if (diffDays === 0) {
            dateDisplay.classList.add("today");
            dateText = `📅 Today`;
        } else if (diffDays === 1) {
            dateDisplay.classList.add("soon");
            dateText = `📅 Tomorrow`;
        } else if (diffDays <= 7) {
            dateDisplay.classList.add("soon");
            dateText = `📅 ${dateText} (${diffDays} days)`;
        } else {
            dateText = `📅 ${dateText}`;
        }

        dateDisplay.textContent = dateText;
        taskContent.appendChild(dateDisplay);
    }

    //  delete button
    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "✕";

    // when clicking the li → mark done/undone
    li.addEventListener("click", () => {
        li.classList.toggle("done");
        updateCount(); // refresh counter
    });

    // when clicking delete button → remove and update count
    del.addEventListener("click", (e) => {
        e.stopPropagation(); // avoid toggling .done
        li.remove();         // remove the task
        updateCount();       // refresh counter
    });

    // put text and delete button into li
    li.append(taskContent, del);
    // add li into the ul
    document.getElementById("taskList").appendChild(li);

    // clear the input and reset category
    input.value = "";
    categorySelect.value = "";
    dueDateInput.value = "";

    // refresh counter
    updateCount();
}

// run once on page load so it shows 0
window.addEventListener("DOMContentLoaded", updateCount);
