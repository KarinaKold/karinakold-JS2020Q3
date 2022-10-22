const Gem = {
    elements: {
        main: null,
        header: null,
        sound: null,
        moveWrap: null,
        timeWrap: null,
        menuWrap: null,
        grid: null,
        openedMenuWrap: null,
        menu: null,
        solveMsg: null,
        score: null, 
        shield: null
    },

    menu: {
        menu: ["New Game", "Save", "Load", "Autosolve", "Score"]
    },

    properties: {
        moves: 0,
        time: [0, 0],
        flow: [],
        size: 4,
        emptyPos: [4, 4],
        menu: false,
        msg: false,
        sound: true,
        picture: false,
        pictureURL: "",
        auto: false,
        score: []
    },

    addZero(n) {
        return (parseInt(n, 10) < 10 ? '0' : '') + n;
    },

    init() {
        if (localStorage.getItem("score") !== null) {
            this.properties.score = JSON.parse(localStorage.getItem("score"));
        } else {
            this.properties.score = [];
        }
        // Create DOM elements
        this.elements.main = document.createElement("div");
        this.elements.header = document.createElement("div");
        this.elements.sound = document.createElement("div");
        this.elements.moveWrap = document.createElement("div");
        this.elements.timeWrap = document.createElement("div");
        this.elements.menuWrap = document.createElement("div");
        this.elements.grid = document.createElement("div");
        this.elements.openedMenuWrap = document.createElement("div");
        this.elements.menu = document.createElement("div");
        this.elements.solveMsg = document.createElement("div");
        this.elements.score = document.createElement("div");
        this.elements.shield = document.createElement("div");
        // Setup main elements
        this.elements.main.classList.add("main");
        this.elements.sound.classList.add("sound");
        this.elements.sound.addEventListener("click", () => {
            this.toggleSound();
        });

        this.elements.header.appendChild(this.elements.sound);
        this.elements.moveWrap.classList.add("moveWrap");
        this.elements.moveWrap.textContent = `moves: ${this.properties.moves}`;
        this.elements.header.appendChild(this.elements.moveWrap);
        this.elements.timeWrap.classList.add("timeWrap");
        this.elements.timeWrap.textContent = `time: ${this.addZero(this.properties.time[0])}:${this.addZero(this.properties.time[1])}`;
        this.elements.header.appendChild(this.elements.timeWrap);
        this.elements.menuWrap.classList.add("menuWrap");
        this.elements.menuWrap.textContent = "menu";
        this.elements.menuWrap.addEventListener("click", () => {
            this.toggleMenu();
        });

        this.elements.header.appendChild(this.elements.menuWrap);
        this.elements.header.classList.add("header");
        this.elements.main.appendChild(this.elements.header);
        this.elements.grid.classList.add("grid");
        this.elements.grid.appendChild(this.createGrid());
        this.elements.main.appendChild(this.elements.grid);
        this.elements.openedMenuWrap.classList.add("menu");
        this.elements.openedMenuWrap.appendChild(this.createMenu());
        this.elements.main.appendChild(this.elements.openedMenuWrap);
        this.elements.solveMsg.classList.add("msg");
        this.elements.main.appendChild(this.elements.solveMsg);
        document.body.appendChild(this.elements.main);

        let a1 = document.createElement("audio");
        let a2 = document.createElement("audio");
        a1.classList.add("audio1");
        a2.classList.add("audio2");
        a1.src = "./assets/tap-en.wav";
        a2.src = "./assets/tap-ru.wav";

        document.body.appendChild(a1);
        document.body.appendChild(a2);

        this.elements.score.classList.add("score");

        let closeLb = document.createElement("div");
        closeLb.textContent = "close";
        closeLb.classList.add("closeLb");

        closeLb.addEventListener("click", () => {
            document.querySelector(".score").classList.add("lbClose");
            document.querySelector(".score").classList.remove("lbOpen");
        });

        this.elements.score.appendChild(closeLb);
        this.elements.score.appendChild(document.createElement("table"));
        this.elements.main.appendChild(this.elements.score);
        this.elements.shield.classList.add("shield");
        this.elements.main.appendChild(this.elements.shield);
    },

    isNear(e) {
        if (((parseInt(e.style.gridArea[0]) === this.properties.emptyPos[0]) && (Math.abs(parseInt(e.style.gridArea[4]) - this.properties.emptyPos[1]) === 1)) || ((parseInt(e.style.gridArea[4]) === this.properties.emptyPos[1]) && (Math.abs(parseInt(e.style.gridArea[0]) - this.properties.emptyPos[0]) === 1))) {
            return true;
        } else {
            return false;
        }
    },

    swapElements(e) {
        const pos1 = (parseInt(e.style.gridArea[0]) - 1) * this.properties.size + parseInt(e.style.gridArea[4]);
        const pos2 = (this.properties.emptyPos[0] - 1) * this.properties.size + this.properties.emptyPos[1];

        this.properties.emptyPos[0] = parseInt(e.style.gridArea[0]);
        this.properties.emptyPos[1] = parseInt(e.style.gridArea[4]);

        e.style.gridArea = document.querySelector(".empty").style.gridArea;
        document.querySelector(".empty").style.gridArea = `${this.properties.emptyPos[0]} / ${this.properties.emptyPos[1]} / ${this.properties.emptyPos[0]} / ${this.properties.emptyPos[1]}`;
        
        e.classList.add(`pos${pos2}`);
        e.classList.remove(`pos${pos1}`);
        
        document.querySelector(".empty").classList.add(`pos${pos1}`);
        document.querySelector(".empty").classList.remove(`pos${pos2}`);
        this.properties.flow.push(pos2);
    },

    animate(e, time = 1) {
        let b1 = 0;
        let b2 = 0;
        let n1 = parseInt(e.style.gridArea[4]) - Gem.properties.emptyPos[1];
        let n2 = parseInt(e.style.gridArea[0]) - Gem.properties.emptyPos[0];

        if (n1 === 0) {
            if (n2 === 1) {
                b2 = -1;
            } else {
                b2 = 1;
            }
        } else {
           if (n1 === 1) {
               b1 = -1;
            } else {
               b1 = 1;
            }
        };

        let pos1 = e.getBoundingClientRect().left;
        let pos2 = e.getBoundingClientRect().top;

        document.body.append(e);
        e.style.position = "absolute";
        e.style.opacity = 0.8;
        e.style.left = pos1 + "px";
        e.style.top = pos2 + "px";

        let a1 = (pos1 + b1 * (2 + (0.7 * document.documentElement.scrollWidth + 0.7 * document.documentElement.scrollHeight) / (3 * Gem.properties.size)));
        let a2 = (pos2 + b2 * (2 + (0.7 * document.documentElement.scrollWidth + 0.7 * document.documentElement.scrollHeight) / (3 * Gem.properties.size)));
        let id = setInterval(frame, 3);

        function frame() {
            if (pos1 * b1 > a1 * b1 || pos2 * b2 > a2 * b2) {
                clearInterval(id);
            } else {
                pos1 = pos1 + 3 * b1;
                e.style.left = pos1 + "px";
                pos2 = pos2 + 3 * b2;
                e.style.top = pos2 + "px";
            }
        }
        setTimeout(this.toGrid, 200 * time, e);
    },

    toGrid(e) {
        document.querySelector(".grid").append(e);
        e.style.position = "static"; 
        e.style.opacity = 1;
    },

    countMoves() {
        this.properties.moves++;
        document.querySelector(".moveWrap").textContent = `Moves: ${this.properties.moves}`;
    },

    createGrid() {
        const fragment = document.createDocumentFragment();
        let timestamp = 0;

        for (let i = 1; i < this.properties.size * this.properties.size + 1; i++) {
            const gridElement = document.createElement("div");
            gridElement.classList.add("grid_element");

            if (i === this.properties.size * this.properties.size) {
                gridElement.textContent = "";
                gridElement.classList.add("empty");
                this.properties.emptyPos = [parseInt(this.properties.size), parseInt(this.properties.size)];
            } else {
                gridElement.textContent = i;
                gridElement.addEventListener("mousedown", (e) => {
                    timestamp = new Date().getTime();
                    let shiftX = e.clientX - e.target.getBoundingClientRect().left;
                    let shiftY = e.clientY - e.target.getBoundingClientRect().top;
                    e.target.style.position = "absolute";
                    e.target.style.zIndex = 20;
                    document.body.append(e.target);
                    moveAt(e.pageX, e.pageY);
                    function moveAt(pageX, pageY) {
                        e.target.style.left = pageX - shiftX + 'px';
                        e.target.style.top = pageY - shiftY + 'px';
                    }

                    let elemBelow = null;

                    function onMouseMove(e) {
                        moveAt(e.pageX, e.pageY);
                        e.target.style.display = "none";
                        elemBelow = document.elementFromPoint(e.clientX, e.clientY);
                        e.target.style.display = "flex";
                    }

                    function isEmptyBelow() {
                        if (elemBelow === document.querySelector(".empty")) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                    document.addEventListener("mousemove", onMouseMove);

                    e.target.onmouseup = function() {
                        document.removeEventListener("mousemove", onMouseMove);
                        e.target.onmouseup = null;
                        e.target.style.position = "static";
                        e.target.style.zIndex = 0;
                        document.querySelector(".grid").append(e.target);

                        const interval = 120;
                        let timestamp2 = new Date().getTime();

                        if((timestamp2 - timestamp) > interval) { 
                            if (Gem.isNear(e.target) && isEmptyBelow()) {
                                Gem.swapElements(e.target);
                                Gem.countMoves();

                                if (Gem.properties.sound) {
                                    audio = document.querySelector(".audio1");
                                    audio.currentTime = 0;
                                    audio.play();
                                }

                                if (Gem.isSolved()) {
                                    Gem.showMsg();
                                }

                            } else {
                                if (Gem.properties.sound) {
                                    audio = document.querySelector(".audio2");
                                    audio.currentTime = 0;
                                    audio.play();
                                }
                                return;
                            }

                        } else {
                            if (Gem.isNear(e.target)) {
                                Gem.animate(e.target);
                                Gem.swapElements(e.target);
                                Gem.countMoves();

                                if (Gem.properties.sound) {
                                    audio = document.querySelector(".audio1");
                                    audio.currentTime = 0;
                                    audio.play();
                                }

                                if (Gem.isSolved()) {
                                    Gem.showMsg();
                                }

                            } else {
                                if (Gem.properties.sound) {
                                    audio = document.querySelector(".audio2");
                                    audio.currentTime = 0;
                                    audio.play();
                                }
                                return;
                            }
                        }
                    };
                });

                gridElement.addEventListener("dragstart", (e) => {
                    return false;
                });
            };

            gridElement.classList.add("n" + i);
            gridElement.classList.add("pos" + i);
            gridElement.style.gridArea = `${parseInt((i - 1) / this.properties.size) + 1} / ${(i - 1) % this.properties.size + 1} / ${parseInt((i - 1) / this.properties.size) + 1} / ${(i - 1) % this.properties.size + 1}`;
            gridElement.style.width = `calc((70vh + 70vw) / (${this.properties.size}*3))`;
            gridElement.style.height = `calc((70vh + 70vw) / (${this.properties.size}*3))`;
            
            if (this.properties.picture && i !== this.properties.size * this.properties.size) {
                gridElement.style.color = "rgba(0, 0, 0, 0)";
                gridElement.style.backgroundImage = this.properties.pictureURL;
                gridElement.style.backgroundSize = "calc((70vh + 70vw) / 3) calc((70vh + 70vw) / 3)";
                gridElement.style.backgroundPositionX = `calc(((70vh + 70vw) / (${this.properties.size}*3)) * (1 - ${gridElement.style.gridArea[4]}))`;
                gridElement.style.backgroundPositionY = `calc(((70vh + 70vw) / (${this.properties.size}*3)) * (1 - ${gridElement.style.gridArea[0]}))`;
            }
            fragment.appendChild(gridElement);
        };
        return fragment;
    },

    createMenu() {
        const fragment = document.createDocumentFragment();
        this.menu.menu.forEach(elem => {
            const menuElement = document.createElement("div");
            menuElement.classList.add("menu_element");
            menuElement.textContent = elem;

            switch (elem) {
                case "New Game":
                    const select = document.createElement("select");
                    const x3 = document.createElement("option");
                    const x4 = document.createElement("option");
                    const x5 = document.createElement("option");
                    const x6 = document.createElement("option");
                    const x7 = document.createElement("option");
                    const x8 = document.createElement("option");

                    x3.value = "3x3";
                    x3.innerText = "3x3";
                    x4.value = "4x4";
                    x4.innerText = "4x4";
                    x5.value = "5x5";
                    x5.innerText = "5x5";
                    x6.value = "6x6";
                    x6.innerText = "6x6";
                    x7.value = "7x7";
                    x7.innerText = "7x7";
                    x8.value = "8x8";
                    x8.innerText = "8x8";

                    select.appendChild(x3);
                    select.appendChild(x4);
                    select.appendChild(x5);
                    select.appendChild(x6);
                    select.appendChild(x7);
                    select.appendChild(x8);

                    const pic = document.createElement("input");
                    pic.type = "checkbox";
                    
                    const picText = document.createElement("span");
                    picText.innerText = "\nImages";
                    menuElement.app
                    menuElement.appendChild(document.createElement("br"));
                    menuElement.appendChild(select);
                    menuElement.appendChild(picText);
                    menuElement.appendChild(pic);

                    select.addEventListener("click", (e) => {
                        e.stopPropagation();
                    });

                    pic.addEventListener("click", (e) => {
                        e.stopPropagation();
                    });

                    picText.addEventListener("click", (e) => {
                        e.stopPropagation();
                    });

                    menuElement.addEventListener("click", () => {
                        let grid = document.querySelector(".grid");
                        grid.style.gridTemplateColumns = `repeat(${select.value[0]}, calc((70vh + 70vw) / (${select.value[0]}*3)))`;
                        grid.style.gridTemplateRows = `repeat(${select.value[0]}, calc((70vh + 70vw) / (${select.value[0]}*3)))`;
                        this.properties.size = select.value[0];
                        this.properties.picture = pic.checked;
                        this.properties.pictureURL = `url("assets/${Math.floor(1 + Math.random() * 90)}.jpg")`;

                        while (grid.firstChild) {
                             grid.removeChild(grid.firstChild);
                        }

                        grid.appendChild(this.createGrid());
                        this.properties.flow = [];
                        this.properties.moves = 0;

                        this.shuffle();
                        this.toggleMenu();
                    });
                    break;

                case "Save":     
                    menuElement.addEventListener("click", () => {
                        let temp = [];
                        temp.push(this.properties.time);
                        temp.push(this.properties.moves);
                        temp.push(this.properties.size);
                        temp.push(this.properties.picture);
                        temp.push(this.properties.pictureURL);
                        let arr = [];
                        for (let j = 1; j <= this.properties.size * this.properties.size; j++) {
                            arr.push(document.querySelector(`.n${j}`));
                        }
                        for (let i = 0; i < arr.length; i++) {
                            temp.push(arr[i].style.gridArea);
                        };
                        localStorage.setItem("save", temp);
                        localStorage.setItem("savedFlow", JSON.stringify(this.properties.flow));
                        this.toggleMenu();
                    });
                    break;

                case "Load":    
                    menuElement.addEventListener("click", () => {
                        if (localStorage.getItem("save") === null) {
                            alert("Нет сохраненных игр");
                        } else {
                            let arr = localStorage.getItem("save").split(",");
                            this.properties.flow = JSON.parse(localStorage.getItem("savedFlow"));
                            this.properties.size = parseInt(arr[3]);
                            this.properties.picture = (arr[4] === "true");
                            this.properties.pictureURL = arr[5];
                            
                            let grid = document.querySelector(".grid");
                            grid.style.gridTemplateColumns = `repeat(${this.properties.size}, calc((70vh + 70vw) / (${this.properties.size}*3)))`;
                            grid.style.gridTemplateRows = `repeat(${this.properties.size}, calc((70vh + 70vw) / (${this.properties.size}*3)))`;
                            
                            while (grid.firstChild) {
                                grid.removeChild(grid.firstChild);
                            }

                            grid.appendChild(this.createGrid());
                            let arr2 = document.querySelectorAll(".grid_element");

                            for (let i = 0; i < arr2.length; i++) {
                                arr2[i].style.gridArea = arr[i + 6];
                                arr2[i].classList.remove(`pos${i + 1}`);
                                let pos = (parseInt(arr2[i].style.gridArea[0]) - 1) * this.properties.size + parseInt(arr2[i].style.gridArea[4]);
                                arr2[i].classList.add(`pos${pos}`);
                            }

                            this.properties.emptyPos = [parseInt(arr2[arr2.length - 1].style.gridArea[0]), parseInt(arr2[arr2.length - 1].style.gridArea[4])];
                            this.properties.time = [parseInt(arr[0]), parseInt(arr[1])];
                            this.properties.moves = parseInt(arr[2]);

                            document.querySelector(".moveWrap").textContent = `Moves: ${this.properties.moves}`;
                            this.toggleMenu();
                        }
                    });
                    break;

                case "Autosolve":     
                    menuElement.addEventListener("click", () => {
                        let arr = this.properties.flow;

                        for (let i = arr.length - 1; i > 2; i--) {
                            if (arr[i] === arr[i - 2]) {
                                arr.splice(i - 1, 2);
                            }
                        };

                        this.properties.flow = arr;
                        document.querySelector(".shield").style.display = "flex";
                        this.toggleMenu();

                        setTimeout(this.autoSolve, 500);
                    });
                    break;

                case "Score":
                    menuElement.addEventListener("click", () => {
                        this.elements.score.removeChild(this.elements.score.lastChild);
                        scoreTable = document.createElement("table");
                        scoreTable.appendChild(this.createTable());
                        this.elements.score.appendChild(scoreTable);

                        document.querySelector(".score").classList.add("lbOpen");
                        document.querySelector(".score").classList.remove("lbClose");
                    });
                    break;
            }
            fragment.appendChild(menuElement);
        });
        return fragment;
    },

    createTable() {
        const fragment = document.createDocumentFragment();
        this.properties.score = JSON.parse(localStorage.getItem("score"));
        let arr = this.properties.score;
        let h = document.createElement("tr");
        h.innerHTML = "<tr><th>№</th><th>Score</th><th>Поле</th><th>Moves</th><th>Time</th></tr>";
        fragment.appendChild(h);

        for (let i = 0; i < arr.length; i++) {
            let elem = document.createElement("tr");
            elem.innerHTML = `<tr><td>${i + 1}</td><td>${arr[i].score}</td><td>${arr[i].size}</td><td>${arr[i].moves}</td><td>${arr[i].time[0]} : ${arr[i].time[1]}</td></tr>`;
            fragment.appendChild(elem);
        };
        return fragment;
    },

    showTime() {
        Gem.elements.timeWrap.textContent = `Time: ${Gem.addZero(Gem.properties.time[0])}:${Gem.addZero(Gem.properties.time[1])}`;
        Gem.properties.time[1] = Gem.properties.time[1] + 1;

        if (Gem.properties.time[1] === 60) {
            Gem.properties.time[0]++;
            Gem.properties.time[1] = 0;
        };

        if (!Gem.properties.menu && !Gem.properties.msg) {
            setTimeout(Gem.showTime, 1000);
        };
    },

    shuffle() {
        let ban = 0;
        for (let i = 0; i < parseInt(this.properties.size * this.properties.size * this.properties.size * 5 / 2); i++) {
            let variants = [];
            for (let j = 1; j <= this.properties.size * this.properties.size; j++) {
                if (this.isNear(document.querySelector(`.pos${j}`))) {
                    variants.push(j);
                }
            };
            variants = variants.filter(element => element !== ban);
            let next = variants[Math.floor(Math.random() * variants.length)];
            ban = (this.properties.emptyPos[0] - 1) * this.properties.size + this.properties.emptyPos[1];
            this.swapElements(document.querySelector(`.pos${next}`));
        }
        document.querySelector(".moveWrap").textContent = `Moves: ${this.properties.moves}`;
        this.properties.time = [0, 0];
    },

    toggleMenu() {
        if (!this.properties.menu) {
            document.querySelector(".menu").classList.add("animateOpen");
            document.querySelector(".menu").classList.remove("animateClose");
            this.properties.menu = true;
        } else {
            document.querySelector(".menu").classList.add("animateClose");
            document.querySelector(".menu").classList.remove("animateOpen");
            this.properties.menu = false;
            this.showTime();
        }
    },

    isSolved() {
        let count = 0;
        for (let i = 1; i < this.properties.size * this.properties.size; i++) {
            if (document.querySelector(`.pos${i}`).textContent === document.querySelector(`.n${i}`).textContent) {
                count++;
            }
        };

        if (count === this.properties.size * this.properties.size - 1) {
            return true;
        } else {
            return false;
        }
    },

    toggleSound() {
        this.properties.sound = !this.properties.sound;
        if (this.properties.sound) {
            document.querySelector(".sound").style.backgroundImage = 'url("assets/volume-on.svg")';
        } else {
            document.querySelector(".sound").style.backgroundImage = 'url("assets/volume-off.svg")';
        }
    },

    showMsg() {
        document.querySelector(".msg").classList.remove("msgClose");
        let score = (1 - this.properties.auto) * parseInt((1 + this.properties.size * this.properties.picture / 2)*Math.pow(this.properties.moves, 2)*this.properties.size/(this.properties.time[0]*60 + this.properties.time[1]));
        let final = {
            score,
            size: this.properties.size,
            moves: this.properties.moves,
            time: this.properties.time,
            pic: this.properties.picture
        };

        this.properties.score.push(final);
        this.properties.score.sort((prev, next) => next.score - prev.score);
        this.properties.score = this.properties.score.slice(0,10);

        localStorage.setItem("score", JSON.stringify(this.properties.score));

        if (this.properties.auto) {
            document.querySelector(".msg").innerText = `Игра решена за вас\n\n\nВы можете начать заново`;
            document.querySelector(".shield").style.display = "none";
        } else {
            document.querySelector(".msg").innerText = `Hooray!\nYou solved the puzzle in ${this.properties.time[0]}m${this.properties.time[1]}s and ${this.properties.moves} moves!\nScore - ${score}\n\n\nНачать заново?`;
        }

        newGemMsg = document.createElement("p");
        newGemMsg.textContent = "New Game";
        document.querySelector(".msg").appendChild(newGemMsg);
        newGemMsg.classList.add("newGemMsg");

        newGemMsg.addEventListener("click", () => {
            this.properties.pictureURL = `url("assets/${Math.floor(1 + Math.random() * 90)}.jpg")`;
            let grid = document.querySelector(".grid");

            while (grid.firstChild) {
                grid.removeChild(grid.firstChild);
            }

            grid.appendChild(this.createGrid());
            this.properties.flow = [];
            this.properties.moves = 0;
            this.properties.auto = false;
            this.shuffle();

            document.querySelector(".msg").classList.remove("msgOpen");
            document.querySelector(".msg").classList.add("msgClose");
            this.properties.msg = false;
            this.showTime();
        });

        document.querySelector(".msg").classList.add("msgOpen");
        this.properties.msg = true;
    },

    autoSolve() {
        Gem.properties.auto = true;
        let arr = Gem.properties.flow;

        for (let i = arr.length - 1; i >= 0; i--) {
                setTimeout(function timer() {
                    let e = document.querySelector(`.pos${arr[i]}`);
                    Gem.animate(e);
                    Gem.swapElements(e);

                if (i === 0) {
                    Gem.showMsg();
                };
                }, 
                (arr.length - i) * 200);
        };
    }
};

window.addEventListener("DOMContentLoaded", function () {
  Gem.init();
  Gem.shuffle();
  Gem.showTime();
});