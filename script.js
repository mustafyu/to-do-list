
// Function to run when clicked add
function addTask(){

    //Get the input element and read its value
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim(); // trim() removes spaces before/after

    //Stopping if input is empty
    if (taskText === "") {
        alert("Please enter a task.");
        return; // end the function
    }

    //Create a new list item
    const li = document.createElement('li');
    li.textContent = taskText; // Set the text of the list item

    // add a click event to mark completed task
    li.addEventListener('click',() => {
        li.classList.toggle('done'); // toggle the completed class
    });

    //Create a delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';

    //Add event listener to delete the task when clicked
    deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click from marking the task as done
        li.remove(); // Remove the list item
    });

    //Append the delete button to the list item
    li.appendChild(deleteBtn);

    // Add new task to the ul task list
    document.getElementById('taskList').appendChild(li);

    //Clear the input field
    input.value = '';

}