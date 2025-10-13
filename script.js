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
    const text = input.value.trim();
    if (!text) return; // ignore empty input

    // create a new <li>
    const li = document.createElement("li");

    //  span for text
    const span = document.createElement("span");
    span.className = "task";
    span.textContent = text;

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
    li.append(span, del);
    // add li into the ul
    document.getElementById("taskList").appendChild(li);

    // clear the input
    input.value = "";

    // refresh counter
    updateCount();
}

// run once on page load so it shows 0
window.addEventListener("DOMContentLoaded", updateCount);
