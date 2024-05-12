import GameControl from "./GameControl.js";
import GameEnv from "./GameEnv.js";
import Socket from "./Multiplayer.js";

const Leaderboard = {
    currentKey: "localTimes",
    currentPage: 1,
    rowsPerPage: 10,
    isOpen: false,
    detailed: false,
    dim: false,

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
            this.dim = true // sets the dim to be true when the leaderboard is opened
            console.log("CREATE DIM")
            const dimDiv = document.createElement ("div");
            dimDiv.style.backgroundColor = "black";
            dimDiv.style.width = "100%";
            dimDiv.style.height = "100%";
            dimDiv.style.position = "absolute";
            dimDiv.style.opacity = "0.8";
            document.body.append(dimDiv);
            dimDiv.style.zIndex = "9998"
            dimDiv.addEventListener("click", Leaderboard.openLeaderboardPanel)
        },
        remove () {
            this.dim = false
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
        th3.innerText = "Score  ";
        const detailToggle = document.createElement("button")
        detailToggle.innerText = "..."
        th3.append(detailToggle)
        header.append(th3);
        table.append(header);
        const th4 = document.createElement("th");
        th4.innerText = "Difficulty";
        th4.hidden = !Leaderboard.detailed
        header.append(th4);
        table.append(header);
        const th5 = document.createElement("th");
        th5.innerText = "Game Speed";
        th5.hidden = !Leaderboard.detailed
        header.append(th5);
        const th6 = document.createElement("th");
        th6.innerText = "Date";
        th6.hidden = !Leaderboard.detailed
        header.append(th6);
        table.append(header);

        detailToggle.addEventListener("click", this.toggleDetails)
        return table
    },

    toggleDetails() {
        const table = document.getElementsByClassName("table scores")[0]
        Leaderboard.detailed = !Leaderboard.detailed

        if (table) {
            table.remove() //remove old table if it is there
        }
        document.getElementById("leaderboardDropDown").append(Leaderboard.updateLeaderboardTable()) //update new leaderboard
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

    createClearLeaderboardButton(table) {
        const breakRow = document.createElement("br")
        table.append(breakRow)
        const clearButtonRow = document.createElement("tr")
        const td1 = document.createElement("td");
        td1.style.textAlign = "end"
        const space1 = document.createElement("tr")
        td1.append(space1)
        clearButtonRow.append(td1);
        const clearButton = document.createElement("button")
        clearButton.innerText = "CLEAR TABLE"
        clearButton.style.width = '100%'
        clearButtonRow.append(clearButton)
        const td3 = document.createElement("td");
        td3.style.textAlign = "start"
        const space2 = document.createElement("tr")
        td3.append(space2)
        clearButtonRow.append(td3);

        clearButton.addEventListener("click", this.clearTable)

        return clearButtonRow
    },

    clearTable () {
        const table = document.getElementsByClassName("table scores")[0]

        localStorage.removeItem(Leaderboard.currentKey)

        Leaderboard.currentPage = 1

        if (table) {
            table.remove() //remove old table if it is there
        }
        document.getElementById("leaderboardDropDown").append(Leaderboard.updateLeaderboardTable())
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
            const td4 = document.createElement("td");
            td4.innerText = score.difficulty;
            td4.hidden = !this.detailed
            row.append(td4);
            table.append(row);
            const td5 = document.createElement("td");
            td5.innerText = score.gameSpeed;
            td5.hidden = !this.detailed
            row.append(td5);
            const td6 = document.createElement("td");
            td6.innerText = score.date
            td6.hidden = !this.detailed
            row.append(td6);
            table.append(row);
        });

        table.append(Leaderboard.createPagingButtonsRow(table));
        table.append(Leaderboard.createClearLeaderboardButton(table))
        
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

}
    
export default Leaderboard;