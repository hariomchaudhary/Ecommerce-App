let addBtn = document.querySelector(".add");
let body = document.querySelector("body");
let grid = document.querySelector(".grid");

let deleteBtn = document.querySelector(".delete");
let deleteMode = false;
let colors = ["pink", "blue", "green", "black"];

let allFiltersChildren = document.querySelectorAll(".filter div");

for (let i = 0; i < allFiltersChildren.length; i++) {
    allFiltersChildren[i].addEventListener("click", function(e) {

        if (e.currentTarget.parentElement.classList.contains("color-selected")) {
            e.currentTarget.parentElement.classList.remove("color-selected");
            loadTasks();
            return;
        } else {
            for (let j = 0; j < allFiltersChildren.length; j++) {
                if (allFiltersChildren[j].parentElement.classList.contains("color-selected")) {
                    allFiltersChildren[j].parentElement.classList.remove("color-selected");
                }
            }
            e.currentTarget.parentElement.classList.add("color-selected");
        }
        let filterColor = e.currentTarget.classList[0];
        loadTasks(filterColor);
    });
}

// LOCALSTORAGE ka objbect check kr rhe hai and fir usme  sare tickets dall rhe h fir uske bad unn sbhi tickets ko localStorage me store kar rhe h
if (localStorage.getItem("AllTickets") == undefined) {
    let allTickets = {};
    allTickets = JSON.stringify(allTickets);
    localStorage.setItem("AllTickets", allTickets);
}

loadTasks();

//adding delete button class for selecting and de-selecting the delete button
deleteBtn.addEventListener("click", function(e) {
    if (e.currentTarget.classList.contains("delete-selected")) {
        e.currentTarget.classList.remove("delete-selected");
        deleteMode = false;
    } else {
        e.currentTarget.classList.add("delete-selected");
        deleteMode = true;
    }
});






addBtn.addEventListener("click", function() {


    //jab ticket add kr rhe h to delete mode ko band krna hai

    deleteBtn.classList.remove("delete-selected");
    deleteMode = false;

    let preModal = document.querySelector(".modal");

    if (preModal != null) return;



    let div = document.createElement("div");
    div.classList.add("modal");
    div.innerHTML = `<div class="modal">
    <div class="task-section">
        <div class="task-inner-container" contenteditable="true"></div>
    </div>
    <div class="modal-priority-section">
        <div class="priority-inner-conatiner">
            <div class="modal-priority pink"></div>
            <div class="modal-priority blue"></div>
            <div class="modal-priority green"></div>
            <div class="modal-priority black selected"></div>
        </div>
    </div>
</div>`



    let ticketColor = "black";

    let allModalPriority = div.querySelectorAll(".modal-priority");
    for (let i = 0; i < allModalPriority.length; i++) {
        allModalPriority[i].addEventListener("click", function(e) {
            for (let j = 0; j < allModalPriority.length; j++) {
                allModalPriority[j].classList.remove("selected");
            }

            e.currentTarget.classList.add("selected");

            ticketColor = e.currentTarget.classList[1];


        });

    }

    let taskInnerContainer = div.querySelector(".task-inner-container");

    taskInnerContainer.addEventListener("keydown", function(e) {
        if (e.key == "Enter") {
            let id = uid();
            let task = e.currentTarget.innerText;

            //step1 : jo bhi data h localstorage me usee lekr aao
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            //step2 : usko update kro
            let ticketObj = {
                color: ticketColor,
                taskValue: task,
            };

            //jo bhi ticket kaq data and color aa rha h vo is given id ke samne save ho jayega 
            allTickets[id] = ticketObj;

            //step3 : vapis updated object ko local stroage me save kro

            localStorage.setItem("AllTickets", JSON.stringify(allTickets));


            let ticketDiv = document.createElement("div");
            ticketDiv.classList.add("ticket");
            ticketDiv.setAttribute("data-id", id);

            ticketDiv.innerHTML = ` 
            <div data-id="${id}" class="ticket-color ${ticketColor}"></div>
            <div class="ticket-id">
                #${id};
            </div>
            <div data-id="${id}" class="actual-task" contenteditable="true">
                ${task}
            </div>
        </div>`;

            // YAHA TICKET K COLOR CHANGE KA PRIORITY COLOR CHANGE KAR RHE HAI
            let ticketColorDiv = ticketDiv.querySelector(".ticket-color");

            // yaha upar val;ue html me se text box ka content fetch kr rhe hai by fetching the div tag of that section
            let actualTaskDiv = ticketDiv.querySelector(".actual-task");

            actualTaskDiv.addEventListener("input", function(e) {
                let updatedTask = e.currentTarget.innerText;
                let currTicketId = e.currentTarget.getAttribute("data-id");
                // yaha task k anadr ka text update kr rhe hai
                //step 1. fetching all tickets
                let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

                // step 2. updating the actual task in localStroage
                allTickets[currTicketId].taskValue = updatedTask;

                // step 3. saving all the updated task
                localStorage.setItem("AllTickets", JSON.stringify(allTickets));
            })

            ticketColorDiv.addEventListener("click", function(e) {

                let currTicketId = e.currentTarget.getAttribute("data-id");
                let currColor = e.currentTarget.classList[1];

                let index = -1;
                for (let i = 0; i < colors.length; i++) {
                    if (currColor == colors[i]) {
                        index = i;
                    }
                }
                // 4 COLORS HAI -> AGAR VALUE 4 SE CHOTI HAI TO VHI VALUE RETURN HO JAYEGE AND VALUE 4 HO JAYEGE TO MOD 0 DE DEGA AND COLOR FIR SE VHI AA JAYEGA
                index++;
                index = index % 4;

                let newColor = colors[index];

                // yaha hum color update kar rhe h jo hum UI par change kar rhe hai 
                //step 1. all tickets lana
                let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

                //step 2. tickets ko update karna
                allTickets[currTicketId].color = newColor;

                //step 3. tickets ko save krna hai
                localStorage.setItem("AllTickets", JSON.stringify(allTickets));



                ticketColorDiv.classList.remove(currColor);
                ticketColorDiv.classList.add(newColor);

            })

            //TICKET OPEN KRNE K BAD USSE CLOSE KRNE KA CODE HAI AGAR ADD BUTTON PR GLTI SE CLICK HO GAYA H TO USSE DLETE KAR SAKTE HAI 
            ticketDiv.addEventListener("click", function(e) {
                if (deleteMode) {
                    let currTicketId = e.currentTarget.getAttribute("data-id");
                    e.currentTarget.remove();

                    let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
                    delete allTickets[currTicketId];
                    localStorage.setItem("AllTickets", JSON.stringify(allTickets));
                }
            });


            grid.append(ticketDiv);
            div.remove();
        } else if (e.key == "Escape") {
            div.remove();
        }
    });
    body.append(div);
});

function loadTasks(color) {

    let ticketsOnUi = document.querySelectorAll(".ticket");

    for (let i = 0; i < ticketsOnUi.length; i++) {
        ticketsOnUi[i].remove();
    }
    // 1. fetch alltickets data
    let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

    // 2. create tickets UI for each  ticket obj
    for (x in allTickets) {
        let currTicketId = x;
        let singleTicketObj = allTickets[x];

        if (color && color != singleTicketObj.color) continue;

        let ticketDiv = document.createElement("div");
        ticketDiv.classList.add("ticket");
        ticketDiv.setAttribute("data-id", currTicketId);

        ticketDiv.innerHTML = ` 
        <div data-id="${currTicketId}" class="ticket-color ${singleTicketObj.color}"></div>
        <div class="ticket-id">
        #${currTicketId};
        </div>
        <div data-id="${currTicketId}" class="actual-task" contenteditable="true">
        ${singleTicketObj.taskValue}
        </div>
        </div>`;

        let ticketColorDiv = ticketDiv.querySelector(".ticket-color");
        let actualTaskDiv = ticketDiv.querySelector(".actual-task");


        // 3. attach require event listers
        actualTaskDiv.addEventListener("input", function(e) {
            let updatedTask = e.currentTarget.innerText;
            let currTicketId = e.currentTarget.getAttribute("data-id");
            // yaha task k anadr ka text update kr rhe hai
            //step 1. fetching all tickets
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            // step 2. updating the actual task in localStroage
            allTickets[currTicketId].taskValue = updatedTask;

            // step 3. saving all the updated task
            localStorage.setItem("AllTickets", JSON.stringify(allTickets));
        })

        ticketColorDiv.addEventListener("click", function(e) {

            let currTicketId = e.currentTarget.getAttribute("data-id");
            let currColor = e.currentTarget.classList[1];

            let index = -1;
            for (let i = 0; i < colors.length; i++) {
                if (currColor == colors[i]) {
                    index = i;
                }
            }
            // 4 COLORS HAI -> AGAR VALUE 4 SE CHOTI HAI TO VHI VALUE RETURN HO JAYEGE AND VALUE 4 HO JAYEGE TO MOD 0 DE DEGA AND COLOR FIR SE VHI AA JAYEGA
            index++;
            index = index % 4;

            let newColor = colors[index];

            // yaha hum color update kar rhe h jo hum UI par change kar rhe hai 
            //step 1. all tickets lana
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            //step 2. tickets ko update karna
            allTickets[currTicketId].color = newColor;

            //step 3. tickets ko save krna hai
            localStorage.setItem("AllTickets", JSON.stringify(allTickets));



            ticketColorDiv.classList.remove(currColor);
            ticketColorDiv.classList.add(newColor);

        });





        //TICKET OPEN KRNE K BAD USSE CLOSE KRNE KA CODE HAI AGAR ADD BUTTON PR GLTI SE CLICK HO GAYA H TO USSE DLETE KAR SAKTE HAI 
        ticketDiv.addEventListener("click", function(e) {
            let currTicketId = e.currentTarget.getAttribute("data-id");
            if (deleteMode) {
                e.currentTarget.remove();

                let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
                delete allTickets[currTicketId];
                localStorage.setItem("AllTickets", JSON.stringify(allTickets));
            }

            // bold
            if (bold.classList.contains("bold-selected")) {
                if (ticketDiv.classList.contains("bold-text")) {
                    ticketDiv.style.fontWeight = "lighter";
                    ticketDiv.classList.remove("bold-text")
                } else {
                    ticketDiv.style.fontWeight = "bold";
                    ticketDiv.classList.add("bold-text")
                }

            }

            // italic
            let text = ticketDiv.querySelector(".actual-task");
            if (italics.classList.contains("italics-selected")) {
                if (text.classList.contains("italic-text")) {
                    text.style.fontStyle = "normal";
                    text.classList.remove("italic-text");
                } else {
                    text.classList.add("italic-text");
                    text.style.fontStyle = "italic";
                }
            }

            // underline
            if (underline.classList.contains("underline-selected")) {
                if (text.classList.contains("underline-text")) {
                    text.classList.remove("underline-text");
                } else {
                    text.classList.add("underline-text");
                }
            }
        });

        // 4. add tickets in the grid section of UI
        grid.append(ticketDiv);
    }

}

// bold mode
let boldMode = false;
let bold = document.querySelector(".bold");
bold.addEventListener("click", function(e) {
    italics.classList.remove("italics-selected");
    underline.classList.remove("underline-selected");
    if (e.currentTarget.classList.contains("bold-selected")) {
        e.currentTarget.classList.remove("bold-selected");
        boldMode = false;
    } else {
        e.currentTarget.classList.add("bold-selected");
        boldMode = true;

    }
});


//italics
let iMode = false;
let italics = document.querySelector(".italics");
italics.addEventListener("click", function(e) {
    bold.classList.remove("bold-selected");
    underline.classList.remove("underline-selected");
    if (e.currentTarget.classList.contains("italics-selected")) {
        e.currentTarget.classList.remove("italics-selected");
        iMode = false;
    } else {
        e.currentTarget.classList.add("italics-selected");
        iMode = true;
    }
});


// underline
let uMode = false;
let underline = document.querySelector(".underline");
underline.addEventListener("click", function(e) {
    bold.classList.remove("bold-selected");
    italics.classList.remove("italics-selected");
    if (e.currentTarget.classList.contains("underline-selected")) {
        e.currentTarget.classList.remove("underline-selected");
        uMode = false;
    } else {
        e.currentTarget.classList.add("underline-selected");
        uMode = true;
    }
});