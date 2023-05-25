
let gorevListesi = [];

if (localStorage.getItem("gorevListesi") !== null) {
    gorevListesi = JSON.parse(localStorage.getItem("gorevListesi"));
}

let editId;
let isEditTask = false;

const taskInput = document.querySelector("#txtTaskName");
let btnClear = document.querySelector("#btnClear");

displatTasks();

function displatTasks() {
    let ul = document.getElementById("task-list");
    ul.innerHTML = ""
    if (gorevListesi.length == 0) {
        ul.innerHTML = "<p class='p-3 m-0'>Görev listeniz boş.</p>"
    } else {
        for (let gorev of gorevListesi) {

            let completed = gorev.durum == "completed" ? "checked" : "";

            let li = `
                <li class="task list-group-item">
                    <div class="form-check">
                        <input type="checkbox" onclick="updateStatus(this)" id="${gorev.id}" class="form-check-input" ${completed}>
                        <label for="${gorev.id}" class="form-check-label ${completed}">${gorev.gorevAdi}</label>
                    </div>
                    <div class="dropdown">
                        <button class="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-ellipsis"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a onclick="deleteTask(${gorev.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash-arrow-up"></i> Sil</a></li>
                            <li><a onclick='editTask(${gorev.id},"${gorev.gorevAdi}")' class="dropdown-item" href="#"><i class="fa-sharp fa-solid fa-pen"></i> Düzenle</a></li>
                        </ul>
                    </div>
                </li>
            `;

            ul.insertAdjacentHTML("beforeend", li) // ul elemanına ekleme yapar, beforeend -> en sonuna ekler

        }
    }


}


document.querySelector("#btnAddNewTask").addEventListener("click", newTask);
document.querySelector("#btnAddNewTask").addEventListener("keypress", function () {
    if (event.key == "Enter") {
        document.getElementById("btnAddNewTask").click();
    }
});

function newTask(event) {

    if (taskInput.value == "") {
        alert("görev girmelisiniz");
    }
    else {
        if (!isEditTask) {
            // ekleme
            gorevListesi.push({ "id": gorevListesi.length + 1, "gorevAdi": taskInput.value, "durum": "pending" });
        } else {
            // güncelleme
            for (let gorev of gorevListesi) {
                if (gorev.id == editId) {
                    gorev.gorevAdi = taskInput.value;
                }
                isEditTask = false;
            }
        }

        taskInput.value = "";
        displatTasks();
        localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
    }
    event.preventDefault();//ilgili elementin normal davranışını kapat
}

function deleteTask(id) {
    let deleteId;

    for (let index in gorevListesi) {
        if (gorevListesi[index].id == id) {
            deleteId = index;
        }
    }
    gorevListesi.splice(deleteId, 1); // belirtilen elemandan 1 tane sil
    displatTasks();
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
}

function editTask(taskId, taskName) {

    editId = taskId;
    isEditTask = true;
    taskInput.value = taskName;
    taskInput.focus();
    taskInput.classList.add("active");

    console.log("edit id:", editId);
    console.log("edit name:", isEditTask);

}

btnClear.addEventListener("click", function () {
    gorevListesi.splice(0, gorevListesi.length);
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
    displatTasks();
})

function updateStatus(selectedTask) {
    let label = selectedTask.nextElementSibling;
    let durum;

    if (selectedTask.checked) {
        label.classList.add("checked");
        durum = "completed";
    } else {
        label.classList.remove("checked");
        durum = "pending";
    }

    for (let gorev of gorevListesi) {
        if (gorev.id == selectedTask.id) {
            gorev.durum = durum;
        }
    }
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));

}