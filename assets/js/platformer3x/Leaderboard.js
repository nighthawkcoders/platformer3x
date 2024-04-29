import GameControl from "./GameControl.js";
import GameEnv from "./GameEnv.js";
import Socket from "./Multiplayer.js";

const Leaderboard = {
    currentKey: "localTimes",
    currentPage: 1,
    rowsPerPage: 10,
    isOpen: false,

    getSortedLeaderboardData () {
        const localData = JSON.parse(localStorage.getItem(this.currentKey))
        if (!localData) {
            console.log("NO DATA")
            return []
        }
        localData.sort((a, b) => a.time - b.time);
        return localData
    }, 

    backgroundDim: {
        create () {
            console.log("CREATE DIM")
        },
        remove () {
            console.log("REMOVE DIM");
        }
    },

    createLeaderboardDisplayTable () {
        const table = document.createElement("table");
        table.className = "table scores"
        const header = document.createElement("tr");
        const th1 = document.createElement("th");
        th1.innerText = "Name";
        header.append(th1);
        const th2 = document.createElement("th");
        th2.innerText = "Time";
        header.append(th2);
        table.append(header);
        const th3 = document.createElement("th");
        th3.innerText = "Score";
        header.append(th3);
        table.append(header);

        return table
    },

    createPagingButtonsRow(table) {
        const data = Leaderboard.getSortedLeaderboardData()
        const breakRow = document.createElement("br")
        table.append(breakRow)
        const pagingButtonsRow = document.createElement("tr")
        const td1 = document.createElement("td");
        td1.style.textAlign = "end"
        const backButton = document.createElement("button")
        backButton.innerText = "<"
        backButton.style.width = "100%"
        td1.append(backButton)
        pagingButtonsRow.append(td1);
        const td2 = document.createElement("td");
        td2.innerText = `${this.currentPage} of ${Math.ceil(data.length/Leaderboard.rowsPerPage)}`
        pagingButtonsRow.append(td2);
        const td3 = document.createElement("td");
        td3.style.textAlign = "start"
        const frontButton = document.createElement("button")
        frontButton.innerText = ">"
        frontButton.style.width = "100%"
        td3.append(frontButton)
        pagingButtonsRow.append(td3);

        backButton.addEventListener("click", this.backPage)
        frontButton.addEventListener("click", this.frontPage)

        return pagingButtonsRow
    },

    updateLeaderboardTable () {
        const data = this.getSortedLeaderboardData()
        const table = this.createLeaderboardDisplayTable()
        const startPage = (this.currentPage-1)*this.rowsPerPage
        const displayData = data.slice(startPage, startPage+this.rowsPerPage)
        
        displayData.forEach(score => {
            const row = document.createElement("tr");
            const td1 = document.createElement("td");
            td1.innerText = score.userID;
            row.append(td1);
            const td2 = document.createElement("td");
            td2.innerText = (score.time/1000);
            row.append(td2);
            const td3 = document.createElement("td");
            td3.innerText = score.coinScore;
            row.append(td3);
            table.append(row);
        });

        table.append(Leaderboard.createPagingButtonsRow(table));

        return table
    },

    backPage () {
        const table = document.getElementsByClassName("table scores")[0]

        if (Leaderboard.currentPage - 1 == 0) {
            return;
        }
    

        Leaderboard.currentPage -= 1

        if (table) {
            table.remove() //remove old table if it is there
        }
        document.getElementById("leaderboardDropDown").append(Leaderboard.updateLeaderboardTable()) //update new leaderboard
    },
    
    frontPage () {
        const table = document.getElementsByClassName("table scores")[0]

        const data = Leaderboard.getSortedLeaderboardData()

        console.log(data.length/Leaderboard.rowsPerPage)

        if (Leaderboard.currentPage + 1 > Math.ceil(data.length/Leaderboard.rowsPerPage)) {
            return
        }

        Leaderboard.currentPage += 1

        if (table) {
            table.remove() //remove old table if it is there
        }
        document.getElementById("leaderboardDropDown").append(Leaderboard.updateLeaderboardTable()) //update new leaderboard
    },

    openLeaderboardPanel () {
            leaderboardTitle.innerHTML = "Local Leaderboard";

            // toggle isOpen
            this.isOpen = !this.isOpen;
            // open and close properties for sidebar based on isOpen
            const table = document.getElementsByClassName("table scores")[0]
            if (!this.isOpen) {
                Leaderboard.backgroundDim.remove()
            }
            if (this.isOpen) {
                Leaderboard.backgroundDim.create()
                if (table) {
                    table.remove() //remove old table if it is there
                }
                document.getElementById("leaderboardDropDown").append(Leaderboard.updateLeaderboardTable()) //update new leaderboard
            }

            const leaderboardDropDown = document.querySelector('.leaderboardDropDown');
            leaderboardDropDown.style.width = this.isOpen?"70%":"0px";
            leaderboardDropDown.style.top = this.isOpen?"15%":"0px";
            leaderboardDropDown.style.left = this.isOpen?"15%":"0px";
    },

    initializeLeaderboard () {
        const leaderboardTitle = document.createElement("div");
        leaderboardTitle.id = "leaderboardTitle";
        document.getElementById("leaderboardDropDown").appendChild(leaderboardTitle);
        document.getElementById("leaderboardDropDown").append(this.updateLeaderboardTable())

        document.getElementById("leaderboard-button").addEventListener("click",Leaderboard.openLeaderboardPanel)
    },

//     get leaderboardTable(){
//         // create table element
//         var t = document.createElement("table");
//         t.className = "table scores";
//         // create table header
//         var header = document.createElement("tr");
//         var th1 = document.createElement("th");
//         th1.innerText = "Name";
//         header.append(th1);
//         var th2 = document.createElement("th");
//         th2.innerText = "Score";
//         header.append(th2);
//         t.append(header);

//         this.table = t;

//         return t;
//     }

//     updateLeaderboardTable(pageNumber = 1) { //accept the page number parameter
//         // Fetch time scores from local storage
//         const timeScores = JSON.parse(localStorage.getItem(this.key)) || [];

//         // Sort scores from lowest to highest
//         timeScores.sort((a, b) => a.time - b.time);

//         console.log(timeScores,this.key)

//         // Calculate the start indeand end index for the current leaderboard page
//         const startIndex = (pageNumber - 1) * this.rowsPerPage;
//         const endIndex = startIndex + this.rowsPerPage;

//         // Get the existing table element
//         const table = this.table;

//         // Clear the table content
//         table.innerHTML = "";

//         // Recreate the table header
//         var header = document.createElement("tr");
//         var th1 = document.createElement("th");
//         th1.innerText = "Name";
//         header.append(th1);
//         var th2 = document.createElement("th");
//         th2.innerText = "Score";
//         header.append(th2);
//         table.append(header);

//         // Populate the table with time scores
//         timeScores.forEach(score => {
//             var row = document.createElement("tr");
//             var td1 = document.createElement("td");
//             td1.innerText = score.userID;
//             row.append(td1);
//             var td2 = document.createElement("td");
//             td2.innerText = (score.time/1000);
//             row.append(td2);
//             table.append(row);
//         });

//         // Update the current page number
//         this.currentPage = pageNumber

//         // Populate the table with coin/goomba scores
        
//     }

//     // Create button for paging controls
//     createPagingControls(){
//         const prevButton = document.createElement("button");
//         prevButton.innerText = "Previous";
//         prevButton.addEventListener("click", () => {
//                 if (this.CurrentPage>1) {
//                     this.updateLeaderboardTable(this.currentPage - 1);
//                 }
//         });

//         const nextButton = document.createElement("button");
//         nextButton.innerText = "Next";
//         nextButton.addEventListener("click", () => {
//                 if (this.CurrentPage>1) {
//                     this.updateLeaderboardTable(this.currentPage + 1);
//                 }
//             });

//         const pagingDiv = document.createElement("div");
//         pagingDiv.appendChild(prevButton);
//         pagingDiv.appendChild(nextButton);

//         return pagingDiv

//     }


//     get clearButton() {
//         const div = document.createElement("div");
//         div.innerHTML = "Clear Leaderboard: ";
        
//         const button = document.createElement("button");
//         button.innerText = "Clear!";
    
//         button.addEventListener("click", () => {
//             const confirmed = confirm("Are you sure you want to clear the leaderboard?");
//             if (confirmed) {
//                 localStorage.clear();
//                 this.updateLeaderboardTable();
//             }
//         });
    
//         div.append(button); // wrap button element in div
//         return div;
//     }
    

//     get filter() {
//         const div = document.createElement("div");
//         div.innerHTML = "Filters: ";
    
//         const filter = document.createElement("select");
//         const options = ["low", "high"];

//         options.forEach(option => {
//             const opt = document.createElement("option");
//             opt.value = option.toLowerCase();
//             opt.text = option;
//             filter.add(opt);
//         });

//         div.append(filter); // wrap button element in div
//         return div;
//     }

    // static leaderboardDropDown() {
    //     // create title for leaderboard
    //     var localMultiplayer = document.createElement("div");
    //     localMultiplayer.id = "leaderboardTitle";
    //     document.getElementById("leaderboardDropDown").appendChild(localMultiplayer);


    //     var localLeaderboard = new Leaderboard(GameControl.localStorageTimeKey);
    //     var serverLeaderboard = new Leaderboard("GtimeScores")

    //     var t1 = localLeaderboard.leaderboardTable;
    //     var t2 = serverLeaderboard.leaderboardTable;
    //     document.getElementById("leaderboardDropDown").append(t1);
    //     document.getElementById("leaderboardDropDown").append(t2);

    //     var clearButton = localLeaderboard.clearButton;
    //     document.getElementById("leaderboardDropDown").append(clearButton);

    //     //var filterDropDown = newLeaderboard.filter;
    //     //document.getElementById("leaderboardDropDown").append(filterDropDown);

    //     var IsOpen = false; // default sidebar is closed
    //     var SubmenuHeight = 0; // calculated height of submenu
    //     function leaderboardPanel() {
    //         if (Socket.shouldBeSynced) {
    //             // turn off local
    //             t1.style.display = "none";
    //             t2.style.display = "table";

    //             localMultiplayer.innerHTML = "Multiplayer Leaderboard";
    //         } else if (!Socket.shouldBeSynced) {
    //             // turn off multiplayer
    //             t2.style.display = "none";
    //             t1.style.display = "table";

    //             localMultiplayer.innerHTML = "Local Leaderboard";
    //         }

    //         localLeaderboard.updateLeaderboardTable();
    //         serverLeaderboard.updateLeaderboardTable();
    //         // toggle isOpen
    //         IsOpen = !IsOpen;
    //         // open and close properties for sidebar based on isOpen
    //         var leaderboard = document.querySelector('.leaderboardDropDown');
    //         leaderboard.style.width = IsOpen?"80%":"0px";
    //         leaderboard.style.paddingLeft = IsOpen?"10px":"0px";
    //         leaderboard.style.paddingRight = IsOpen?"10px":"0px";
    //         leaderboard.style.top = `calc(${SubmenuHeight}px + ${GameEnv.top}px)`;
    //     }
    //     // settings-button and event listener opens sidebar
    //     document.getElementById("leaderboard-button").addEventListener("click",leaderboardPanel);
    //     // sidebar-header and event listener closes sidebar
    //     document.getElementById("leaderboard-header").addEventListener("click",leaderboardPanel);

//         window.addEventListener('load', function() {
//             var Submenu = document.querySelector('.submenu');
//             SubmenuHeight = Submenu.offsetHeight;
//         });
//     }

}
    
export default Leaderboard;