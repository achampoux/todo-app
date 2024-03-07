import { compareAsc, format } from "date-fns";

const projectsContainer = document.getElementById('projects');
const tasksContainer = document.getElementById('tasks');
const projectTitleInput = document.getElementById('project-title');
const taskTitleInput = document.getElementById('task-title');
const taskDescriptionInput = document.getElementById('task-description');
const taskDueDateInput = document.getElementById('task-due-date');
const taskPriorityInput = document.getElementById('task-priority');
const editTaskTitleInput = document.getElementById('edit-task-title');
const editTaskDescriptionInput = document.getElementById('edit-task-description');
const editTaskDueDateInput = document.getElementById('edit-task-due-date');
const editTaskPriorityInput = document.getElementById('edit-task-priority');
const buttonAddProject = document.getElementById('add-project');
const buttonAddTask = document.getElementById('add-task');
const addProjectPopUp = document.getElementById('add-project-popup');
const addTaskPopUp = document.getElementById('add-task-popup');
const editTaskPopUp = document.getElementById('edit-task-popup');
const buttonCloseProjectPopup = document.getElementById('close-project-popup');
const buttonCloseTaskPopup = document.getElementById('close-task-popup');
const buttonEditTaskPopup = document.getElementById('close-edit-task-popup');
const buttonSubmitProject = document.getElementById('button-submit-project');
const buttonSubmitTask = document.getElementById('button-submit-task');
const buttonEditTask = document.getElementById('button-edit-task');


buttonAddProject.addEventListener("click", eventListenerButtons);
buttonAddTask.addEventListener("click", eventListenerButtons);
buttonCloseProjectPopup.addEventListener("click", eventListenerButtons);
buttonCloseTaskPopup.addEventListener("click", eventListenerButtons);
buttonEditTaskPopup.addEventListener("click", eventListenerButtons);
buttonSubmitProject.addEventListener("click", eventListenerButtons);
buttonSubmitTask.addEventListener("click", eventListenerButtons);
buttonEditTask.addEventListener("click", eventListenerButtons);

let tasksByProject = {
    'Default': [{ title: 'Title', description: 'Description', dueDate: '2024-03-03', priority: 'low' }, { title: 'Title', description: 'Description', dueDate: '2024-03-03', priority: 'medium' }, { title: 'Title', description: 'Description', dueDate: '2024-03-03', priority: 'high' }],
    'Project-A': [{ title: 'Lorem Ipsum', description: 'This is a description', dueDate: '2028-03-03', priority: 'high' }],
    'Empty project': [],
}

let currentSelectedProject = Object.keys(tasksByProject)[0];
let currentSelectedTask = 0;

if (storageAvailable("localStorage")) {
if (localStorage["tasks-by-project"]) {
    tasksByProject = JSON.parse(localStorage["tasks-by-project"]);
}}

function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            // everything except Firefox
            (e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === "QuotaExceededError" ||
                // Firefox
                e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
        );
    }
}

const projects = {
    create(){
        let projectTitle = projectTitleInput.value;
        projects.push(projectTitle);
        projects.clear();
        projects.print();
        return projectTitle;
    },
    push(str){
        tasksByProject[str] = [];
        currentSelectedProject = str;
        tasks.print(currentSelectedProject);
    },
    clear(){
        projectsContainer.innerText = '';
    },
    print(){
        const ul = document.createElement('ul');

        // Iterate through the keys (project names) and create list items with event listeners
        for (const projectName in tasksByProject) {
            if (tasksByProject.hasOwnProperty(projectName)) {
                const li = document.createElement('li');
                li.addEventListener("click", eventListenerProjects);
                li.textContent = projectName;
                ul.appendChild(li);
            }
        }
        
        // Append the list to the container
        projectsContainer.appendChild(ul);

        // Store in Local Storage
        projects.store();
    },
    hidePopUp(){
        addProjectPopUp.classList.add('hidden');
    },
    showPopUp(){
        addProjectPopUp.classList.remove('hidden');
    },
    store(){
        if (storageAvailable("localStorage")) {
            // Yippee! We can use localStorage awesomeness
            localStorage["tasks-by-project"] = JSON.stringify(tasksByProject);
        } else {
            // Too bad, no localStorage for us
        }
    },
    remove(id){
        delete tasksByProject[id];
        currentSelectedProject = Object.keys(tasksByProject)[0];
        projects.clear();
        tasks.clear();
        projects.print();
    }
}

const tasks = {
    create(title, description, dueDate, priority) {
        title = taskTitleInput.value;
        description = taskDescriptionInput.value;
        dueDate = taskDueDateInput.value;
        priority = taskPriorityInput.value;
        return {
            title: title,
            description: description,
            dueDate: dueDate,
            priority: priority,
        }
    },
    createEdit(title, description, dueDate, priority) {
        title = editTaskTitleInput.value;
        description = editTaskDescriptionInput.value;
        dueDate = editTaskDueDateInput.value;
        priority = editTaskPriorityInput.value;
        return {
            title: title,
            description: description,
            dueDate: dueDate,
            priority: priority,
        }
    },
    push(obj,key) {
        key = currentSelectedProject;
        tasksByProject[key].push(obj);
        tasks.print(key);
    },
    clear() {
        tasksContainer.innerText = '';
    },
    print(key) {
        // Get the tasks for the selected project
        const tasks = tasksByProject[key];

        if (tasks) {

        // Create an unordered list element for tasks
        const tasksUl = document.createElement('ul');

        let i = 0;
        // Iterate through tasks and create list items

        const div3 = document.createElement('div');
        const button3 = document.createElement('button');

        div3.classList.add('button-remove-container');
        button3.classList.add('remove-project');
        button3.textContent = 'remove project';
        button3.id = currentSelectedProject;
        button3.addEventListener("click", eventListenerButtons);

        div3.appendChild(button3);

        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            const div = document.createElement('div');
            const div2 = document.createElement('div');
            div.classList.add('task-container',task.priority);
            div2.classList.add('button-container');

            const button = document.createElement('button');
            const button2 = document.createElement('button');
            button.classList.add('remove-task','close');
            button.id = index;
            button2.classList.add('edit-task','close');
            button2.id = index;

            const h2 = document.createElement('h2');
            h2.classList.add('task-title');
            const p = document.createElement('p'); 
            p.classList.add('hidden');
            const span = document.createElement('span');
            span.classList.add('hidden');

            button.addEventListener("click", eventListenerButtons);
            button2.addEventListener("click", eventListenerButtons);
            h2.addEventListener("click", eventListenerButtons);
            
            button.textContent = 'x';
            button2.textContent = 'edit';
            h2.textContent = task.title;
            p.textContent = task.description;
            span.textContent = task.dueDate;

            div2.appendChild(h2);
            div2.appendChild(button2);
            div2.appendChild(button);

            div.appendChild(div2);
            div.appendChild(div2);
            div.appendChild(p);
            div.appendChild(span);
            
            li.appendChild(div);
            tasksUl.appendChild(li);
        });

        // Replace the existing tasks content with the new tasks list
        tasksContainer.innerHTML = '';
        tasksContainer.appendChild(tasksUl);

        if(tasks.length == 0){
            tasksContainer.appendChild(div3);
        }

        // Store in Local Storage
        projects.store();
        }
    },
    hidePopUp() {
        addTaskPopUp.classList.add('hidden');
    },
    showPopUp() {
        addTaskPopUp.classList.remove('hidden');
    },
    hideEditPopUp(){
        editTaskPopUp.classList.add('hidden');
    },
    showEditPopUp(){
        editTaskTitleInput.value = tasksByProject[currentSelectedProject][currentSelectedTask].title;
        editTaskDescriptionInput.value = tasksByProject[currentSelectedProject][currentSelectedTask].description;
        editTaskDueDateInput.value = tasksByProject[currentSelectedProject][currentSelectedTask].dueDate;
        editTaskPriorityInput.value = tasksByProject[currentSelectedProject][currentSelectedTask].priority;
        editTaskPopUp.classList.remove('hidden');
    },
    remove(id) {
        tasksByProject[currentSelectedProject].splice(id, 1);
        tasks.print(currentSelectedProject);
    },
    edit(obj){
        tasksByProject[currentSelectedProject].splice(currentSelectedTask, 1, obj);
        tasks.print(currentSelectedProject);
    }
}

function eventListenerProjects(e) {
    let project = e.target.innerText;
    currentSelectedProject = project;
    tasks.print(project);
}

function eventListenerButtons(e) {
    switch (e.target.id) {
        case 'add-project':
            projects.showPopUp();
            break;
        case 'add-task':
            tasks.showPopUp();
            break;
        case 'close-project-popup':
            projects.hidePopUp();
            break;
        case 'close-task-popup':
            tasks.hidePopUp();
            break;
        case 'close-edit-task-popup':
            tasks.hideEditPopUp();
            break;
        case 'button-submit-project':
            projects.push(projects.create());
            projects.hidePopUp();
            break;
        case 'button-submit-task':
            tasks.push(tasks.create());
            tasks.hidePopUp();
            break;
        case 'button-edit-task':
            tasks.edit(tasks.createEdit());
            tasks.hideEditPopUp();
            break;
        // Add more cases if needed
        default:
            // Default case if none of the above conditions are met
            break;
    }
    switch (e.target.classList[0]) {
        case 'remove-task':
            tasks.remove(e.target.id);
            break;
        case 'edit-task':
            currentSelectedTask = e.target.id;
            tasks.showEditPopUp();
            break;
        case 'task-title':
            const target = e.target.closest('.task-container');
            const paragraph = target.querySelector('p');
            const spanElement = target.querySelector('span');

            if (paragraph.classList.contains('hidden') && spanElement.classList.contains('hidden')) {
                // If both elements have the 'hidden' class, remove it from both
                paragraph.classList.remove('hidden');
                spanElement.classList.remove('hidden');
            } else {
                // If at least one element doesn't have the 'hidden' class, add it to both
                paragraph.classList.add('hidden');
                spanElement.classList.add('hidden');
            }
            break;
        case 'remove-project':
            currentSelectedProject = e.target.id;
            projects.remove(currentSelectedProject);
            break;
        // Add more cases if needed
        default:
            // Default case if none of the above conditions are met
            break;
    }
}

projects.print();
tasks.print('Default');