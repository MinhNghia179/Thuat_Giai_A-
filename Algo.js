window.onload = function () {
    const row = 23;
    const col = 59;
    const arr = [];
    var str_id, nodeFirst = [];
    for (let i = 0; i < row; i++) {
        arr.push([]);
    }
    for (let i = 0; i < row; i++) {
        nodeFirst[i] = document.createElement("div");
        nodeFirst[i].className += "append";
        console.log(nodeFirst[i]);
        for (let j = 0; j < col; j++) {
            let create_node = document.createElement("div");
            create_node.className += "matrix";
            create_node.id = i + "-" + j;
            nodeFirst[i].appendChild(create_node);
        }
        if (i == 0) {
            document.getElementById("start").append(nodeFirst[0]);
        }
        else {
            document.getElementById("start").insertBefore(nodeFirst[i], nodeFirst[i + 1]);
        }
    }
    var arr_star = [];
    for (let i = 0; i < row; i++) {
        arr_star.push([]);
        for (let j = 0; j < col; j++) {
            let add_event = document.getElementById(`${i}-${j}`);

            var check = 0;
            add_event.onmousedown = function () {
                check = 1;
                add_event.className += " wall";
                arr_star[i][j] = -1;
            };
            add_event.onmouseup = function () {
                check = 0;
            };
            add_event.onmouseover = function () {
                if (check == 1) {
                    add_event.className += " wall";
                    arr_star[i][j] = -1;
                };
            }
            arr_star[i][j] = 0;
        }
    }
    document.getElementById("btn_clear_path").addEventListener('click', function () {
        sessionStorage.setItem("arrAstar", JSON.stringify(arr_star));
    });
    document.getElementById("btn_clear").addEventListener('click', function () {
        window.sessionStorage.clear();
        location.reload();
    });
    var source = [9,9];
    var target = [10,50];
    document.getElementById(`${source[0]}-${source[1]}`).className += " Erase";
    document.getElementById(`${target[0]}-${target[1]}`).className += " Erase";
}
document.getElementById("btn_find").addEventListener('click', function () {
    var arrA = JSON.parse(sessionStorage.getItem("arrAstar"));
    console.log(arrA);

    var dc = [-1, 0, 1, 0];
    var dr = [0, -1, 0, 1];

    var Node = function (row, col) {
        this.row = row;
        this.col = col;
        this.f = 0;
        this.h = function (target) {
            return (this.row - target[0]) * (this.row - target[0]) + (this.col - target[1]) * (this.col - target[1]);
        }
    };
    var AStar = function (row, col, arr) {
        this.sizeRow = row;
        this.sizeCol = col;
        this.map = arr;

        this.getMinF = function (ls) {
            var minF = 100000000;
            var idx = -1;
            for (var i = 0; i < ls.length; i++) {
                if (ls[i].f < minF) {
                    minF = ls[i].f;
                    idx = i;
                }
            }
            return idx;
        }

        this.findNode = function (ps, ls) {
            for (var i = 0; i < ls.length; i++) {
                if (ls[i].row == ps[0] && ls[i].col == ps[1])
                    return i;
            }
            return -1;
        }

        this.solve = function (src, trg) {
            var OPEN = [];
            var CLOSE = [];

            var nSource = new Node(src[0], src[1]);

            nSource.g = 0;
            nSource.f = nSource.h(trg);
            OPEN.push(nSource);

            while (OPEN.length > 0) {

                var curIdx = this.getMinF(OPEN);
                var curNode = OPEN[curIdx];
                OPEN.splice(curIdx, 1);

                if (curNode.row == trg[0] && curNode.col == trg[1])
                    return curNode;
                for (var i = 0; i < 4; i++) {
                    var r = curNode.row + dr[i];
                    var c = curNode.col + dc[i];
                    var Mi;
                    if (r >= 0 && r < this.sizeRow && c >= 0 && c < this.sizeCol && this.map[r][c] != -1) {

                        var dmi = curNode.g + 1;
                        var oIdx = this.findNode([r, c], OPEN);
                        if (oIdx >= 0) {
                            Mi = OPEN[oIdx];
                            if (Mi.g < dmi) {
                                continue;
                            }
                        }

                        var cIdx = this.findNode([r, c], CLOSE);
                        if (cIdx >= 0) {
                            Mi = CLOSE[cIdx];
                            if (Mi.g < dmi) {
                                continue;
                            } else {
                                OPEN.push(CLOSE[cIdx]);
                                CLOSE.splice(cIdx, 1);
                            }
                        }

                        if (oIdx < 0 && cIdx < 0) {
                            Mi = new Node(r, c);
                            OPEN.push(Mi);
                        }

                        Mi.g = dmi;
                        Mi.f = Mi.g + Mi.h(trg);
                        Mi.parent = curNode;
                    }
                }

                CLOSE.push(curNode);
            }
            return -1;
        };
    };
    var astar = new AStar(23, 59, arrA);
    var source = [9,9];
    var target = [10,50];
    var node = astar.solve(source, target);
    if (node != -1) {
        do {
            astar.map[node.row][node.col] = 1;
            document.getElementById(`${node.row}-${node.col}`).className += " result";
			
            node = node.parent;
        } while (node);
    } else {
        alert("no route found");
    }
});