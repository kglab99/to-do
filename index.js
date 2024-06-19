// GLOBAL
const tasks = document.querySelector("div#tasks");

// * 1 *
// MEMORY INITIALIZATION
let memory = [];
let localMemory = [];
checkLocalStorage();
createTasksFromMemory();

    // Get data from local storage if it exists
function checkLocalStorage() {
    
    if (window.localStorage.length > 0) {
        localMemory = JSON.parse(localStorage.memory);

        // Runs entries through object constructor to inherit prototype
        localMemory.forEach(item => {
            memory.push(new ListItem(item.description, item.fav, item.done));
        });

    }
}

    // Create tasks from memory 
function createTasksFromMemory() {
    memory.forEach(item => {
        createTask(item.description, item.fav, item.done);
    })
}

// MAIN OBJECT CONSTRUCTOR
function ListItem(description, fav, done) {
    this.description = description;
    this.fav = fav;
    this.done = done;
}

// DOM LISTENERS
let addButton = document.querySelector("div#add > button").addEventListener("click", addTask);

// Enter support
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
    }
});

// FUNCTIONS FOR DOM LISTENERS

function addTask() {
    let description = document.querySelector("div#add > input").value;
   
  
    if (description != '') {
        if (memory.length != 0) {
            let isValuePresent = false;
            
            for (const i of memory) {
                if(i.description == description) {
                    isValuePresent = true;
                    document.querySelector("div#add > input").value = "";
                    document.querySelector("div#add > input").placeholder = "Can't add duplicate task";
                }
            };

            if (isValuePresent == false) {
                document.querySelector("div#add > input").value = "";
                createTask(description, false, false);
                memory.push(new ListItem(description, false, false));
                localStorage.memory = JSON.stringify(memory);

            }


        } else if (memory.length == 0) {
                        document.querySelector("div#add > input").value = "";
                        console.log(memory);
        
                        createTask(description, false, false);
                        memory.push(new ListItem(description, false, false));
                        localStorage.memory = JSON.stringify(memory);
        }

    }
}

// * 2 *
// CREATING DOM TASK

function createTask(taskContent, taskFav, taskDone){

    //Create main div for the task
    let task = document.createElement("div");


    let tasksH1 = document.querySelector("h1#tasks");
    let doneTitle = document.querySelector("h1.done");
    let tasksTitle = document.querySelector("h1#tasks");

    if(taskFav == true && taskDone == false) {
        task.className = "task favorite";
        tasksH1.insertAdjacentElement("beforebegin", task);
    } else if (taskFav == false && taskDone == false) {
        task.className = "task";
        tasksH1.insertAdjacentElement("afterend", task);
    } else if (taskFav == true && taskDone == true) {
        task.className = "task favorite done";
        doneTitle.insertAdjacentElement("afterend", task);
    } else if (taskFav == false && taskDone == true) {
        task.className = "task done";
        doneTitle.insertAdjacentElement("afterend", task);
    }

    //Create right and left divs
    let left = document.createElement("div");
    left.className += "left";

    let right = document.createElement("div");
    right.className += "right";

    task.append(left, right);

    //Create checkbox
    let labelCheckbox = document.createElement("label");
    labelCheckbox.className += "checkbox-btn";
    left.appendChild(labelCheckbox);

    let labelCheckboxInner = document.createElement("label");
    labelCheckboxInner.setAttribute("for", "checkbox");
    labelCheckbox.appendChild(labelCheckboxInner);

    let inputCheckbox = document.createElement("input");
    inputCheckbox.id = "checkbox";
    inputCheckbox.type = "checkbox";
    labelCheckbox.appendChild(inputCheckbox);

    let spanCheckbox = document.createElement("span");
    spanCheckbox.className += "checkmark";
    labelCheckbox.appendChild(spanCheckbox);

    inputCheckbox.addEventListener("click", () => {
        for(const i in memory) {
            if ((memory[i].description == taskContent) == true){

                if (memory[i].done == false) {
                    memory[i].done = true;
                } else if (memory[i].done == true) {
                    memory[i].done = false;
                }
            }
        }

        localStorage.memory = JSON.stringify(memory);

        if (task.className == "task") {
            task.className = "task done";
            doneTitle.insertAdjacentElement("afterend", task);
        } else if (task.className == "task done") {
            task.className = "task";
            tasksH1.insertAdjacentElement("afterend", task);
        } else if (task.className == "task favorite") {
            task.className = "task favorite done";
            doneTitle.insertAdjacentElement("afterend", task);
        } else if (task.className == "task favorite done") {
            task.className = "task favorite";
            tasksH1.insertAdjacentElement("beforebegin", task);
        }
    
    })

    if (taskDone == true) {
        inputCheckbox.checked = true;
    }


    //Create task description
    let taskText = document.createElement("p");
    taskText.className += "task-name";
    taskText.textContent = taskContent;

    left.appendChild(taskText);
    
    //Add fav button
    let favoriteBtn = document.createElement("img");
    favoriteBtn.className += "favorite-btn item-btn";
    favoriteBtn.src = "assets/favorite.svg";

    favoriteBtn.addEventListener("click", () => {

        for(const i in memory) {
           if ((memory[i].description == taskContent) == true) {

            if (memory[i].fav == false) {
                favoriteBtn.classList += " checked";

                memory[i].fav = true;
            } else if (memory[i].fav == true) {
                favoriteBtn.classList = "favorite-btn item-btn";

                memory[i].fav = false;
            }

           }


        }
        localStorage.memory = JSON.stringify(memory);

        if (task.className == "task") {
            task.className = "task favorite";
            tasksH1.insertAdjacentElement("beforebegin", task);
        } else if (task.className == "task done") {
            task.className = "task favorite done";
        } else if (task.className == "task favorite") {
            task.className = "task";
            tasksH1.insertAdjacentElement("afterend", task);
        } else if (task.className == "task favorite done") {
            task.className = "task done";
        }
       
    })

    if (taskFav == true) {
        favoriteBtn.classList += " checked";
    } 

    //Add del button
    let deleteBtn = document.createElement("img");
    deleteBtn.className += "delete-btn item-btn";
    deleteBtn.src = "assets/trash.svg";

    deleteBtn.addEventListener("click", () => {

        for(const i in memory) {
            if ((memory[i].description == taskContent) == true){
                memory.splice(i, 1);

            }
        }

        localStorage.memory = JSON.stringify(memory);

        task.remove();
    })

    right.append(favoriteBtn, deleteBtn);
}