/*******************************
todo - kliknutí na úkol rozbalí jeho popis, popř něco s datem ještě třeba calendář
******************************** */


let taskList = []
let seznamCount = 0
let taskCount = 0

// fce na dynamické vykreslení seznamu úkolů
function adjustGridColumns() {
    const grid = document.querySelector('#grid-seznamy');
    const items = grid.querySelectorAll('.seznam').length;

    if (items === 1) {
        grid.style.gridTemplateColumns = '1fr'
    } else {
        grid.style.gridTemplateColumns = `repeat(auto-fill, minmax(300px, 1fr))`
    }
}

// funkce na vykreslení úkolů
function displayings(list, myId){
    const specificDisplayArea = document.getElementById(myId).querySelector('.displayArea');
    specificDisplayArea.innerHTML = ""    
    
    list.forEach(function(task){
        if(task.seznamId === myId){
            let oneTask = document.createElement("div")
            oneTask.classList.add("oneTask1")
            let check = document.createElement("input")
            check.type = "checkbox"
            check.classList.add("checkbox1")
            check.id = "check" + taskCount
            check.addEventListener("change", (e) => {
                let oneCheckbox = e.target    
                if (oneCheckbox.checked) {
                        let index = taskList.findIndex(task => "check" + task.id === oneCheckbox.id)
                        if (index !== -1) {
                            taskList.splice(index, 1)
                        }
                oneCheckbox.checked = false
                displayings(taskList, task.seznamId)
                }
            })
            oneTask.appendChild(check)
            let textDisplay = document.createElement("div")
            textDisplay.innerHTML = `${task.text} <span>Deadline: ${task.date}</span>`
            oneTask.appendChild(textDisplay)
            
            specificDisplayArea.appendChild(oneTask)
        }
    })
} 


//funkce na uložení úkolů do pole
function saveTask(title, date, id){
    taskCount++
    let task = {
        text: title,
        date: date,
        seznamId: id,
        id: taskCount
    }
    taskList.push(task)
}

/***************************
todo - označení úkolů jako dokončené - pak nastylovat :checked, smazání úkolů nebo seznamů
*******************************/

// přidání seznamu úkolů
document.querySelector("#addList").addEventListener("click", function(e){
    seznamCount++
    let newSeznam = document.createElement("div")
    newSeznam.classList.add("seznam")
    newSeznam.id = 'seznam' + seznamCount

    newSeznam.innerHTML = '<input type="text" class="seznamHeadingInput" placeholder="Název seznamu..."> <div style="display:none;"> <a href="#" class="showTaskInput">Přidat úkol</a> <form class="input1"> <input type="text" class="taskInput" name="task" placeholder="Napište úkol..."> <input type="date" class="dateInput" name="taskDate"> <a href="#" class="submitTask">Přidat</a> </form> <div class="displayArea"> </div> </div>'

    let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16) // Generuje náhodnou barvu
    newSeznam.style.backgroundColor = randomColor

    document.querySelector("#grid-seznamy").appendChild(newSeznam)
    adjustGridColumns()

    newSeznam.querySelector('.seznamHeadingInput').focus()
    
    newSeznam.querySelector('.seznamHeadingInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault() // Prevent form submission

            // Get the input value and clear the input field
            let seznamHeading = this.value
            this.style.display = 'none' // Hide the input field

            // Display the seznam name and show the "Přidat úkol" button
            let seznamContent = this.nextElementSibling
            seznamContent.style.display = 'block'
            let seznamNameDisplay = document.createElement('h2')
            seznamNameDisplay.textContent = seznamHeading
            seznamContent.insertBefore(seznamNameDisplay, seznamContent.firstChild)
        }
    })

})




// co se stane po stisknutí tlačítek
document.querySelector("#grid-seznamy").addEventListener("click", function(event) {
    // Pokud bylo kliknuto na tlačítko "Přidat úkol"
    
    if (event.target.classList.contains("showTaskInput")) {
        event.target.style.display = "none";
        event.target.nextElementSibling.style.display = "grid";
    }
    // Pokud bylo kliknuto na tlačítko "Přidat"
    else if (event.target.classList.contains("submitTask")) {
        let taskForm = event.target.closest('.input1')
        let seznamId = event.target.closest('.seznam').id
        let taskValue = taskForm.querySelector(".taskInput").value
        let dateValue = taskForm.querySelector(".dateInput").value

        if (taskValue !== "") {
            saveTask(taskValue, dateValue, seznamId)
            displayings(taskList, seznamId)

            taskForm.style.display = "none"
            taskForm.previousElementSibling.style.display = "block"

            taskForm.querySelector(".taskInput").value = ""
            taskForm.querySelector(".dateInput").value = ""
        }
    }
})
