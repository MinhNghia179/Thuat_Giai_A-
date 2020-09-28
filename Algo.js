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
    /*   for (let i = 1; i <= 2; i++) {
           let min1 = 1, max1 = 23, min2 = 1, max2 = 59;
           var Id1_Random = Math.floor(Math.random() * (max1 - min1 + 1)) + min1;
           var Id2_Random = Math.floor(Math.random() * (max2 - min2 + 1)) + min2;
           let node_point = document.createElement("div");
           node_point.className += "point_find";
           document.getElementById(`${Id1_Random}-${Id2_Random}`).appendChild(node_point);
       } */
    var arr_star = [];
    for (let i = 0; i < row; i++) {
        arr_star.push([]);
        for (let j = 0; j < col; j++) {
            let add_event = document.getElementById(`${i}-${j}`);
            //     if (`${i}-${j}` != `${Id1_Random}-${Id2_Random}`) {
            var check = 0;
            add_event.onmousedown = function (event) {
                check = 1;
                add_event.className += " wall";
                arr_star[i][j] = -1;
            };
            add_event.onmouseup = function (event) {
                check = 0;
            };
            add_event.onmouseover = function (event) {
                if (check == 1) {
                    add_event.className += " wall";
                    arr_star[i][j] = -1;
                };
            }
            arr_star[i][j] = 0;
            //   }
        }
    }
}
function Node(row, col) {
    this.row = row;
    this.col = col;
    this.f = 0;
    this.h = function (target) {
        return (this.row - target[0]) * (this.row - target[0]) + (this.col - target[1]) * (this.col - target[1]);
    }
}
var dc = [-1, 0, 1, 0];
var dr = [0, -1, 0, 1];
function Astar(arr) {
    this.map = arr;
    this.getMinF = function (ls) {
        var minF = 10000000;
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
            if (ls[i].row == ps[0] && ls[i].col == ps[1]) {
                return i;
            }
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
            OPEN.slice(curIdx, 1);
            if (curNode.row == trg[0] && curNode.col == trg[1]) {
                return curNode;
            }
            for (var i = 0; i < 4; i++) {
                // step 3.1: check all valid Mi
                var r = curNode.row + dr[i];
                var c = curNode.col + dc[i];
                var Mi;
                if (r >= 0 && r < 24 && c >= 0 && c < 60 && this.map[r][c] != -1) {
                    // step 3.2: calculate successor distant 
                    var dmi = curNode.g + 1;
                    // step 3.3: check if Mi is in OPEN
                    var oIdx = this.findNode([r, c], OPEN);
                    if (oIdx >= 0) {
                        Mi = OPEN[oIdx];
                        // if g(Mi) < d(Mi) => go to step 5
                        if (Mi.g < dmi) {
                            continue;
                        }
                    }

                    // step 3.4: check if Mi is in OPEN
                    var cIdx = this.findNode([r, c], CLOSE);
                    if (cIdx >= 0) {
                        Mi = CLOSE[cIdx];
                        // step 3.4.1: g(Mi) < d(Mi) => go to step 5
                        if (Mi.g < dmi) {
                            continue;
                        } else {
                            // step 3.4.2: move Mi to OPEN
                            OPEN.push(CLOSE[cIdx]);
                            CLOSE.splice(cIdx, 1);
                        }
                    }

                    //step 3.5: if Mi neither in OPEN nor CLOSE 
                    if (oIdx < 0 && cIdx < 0) {
                        // step 3.5.1: 
                        Mi = new Node(r, c);
                        OPEN.push(Mi);
                    }

                    //step 4: update g(Mi) = d(Mi)
                    Mi.g = dmi;
                    Mi.f = Mi.g + Mi.h(trg);
                    Mi.parent = curNode;
                }
            }
            CLOSE.push(curNode);
        }
        return -1;
    }
}

var source = [1, 2];
var target = [7, 8];
var Aastar = document.getElementById("btn_find");
Aastar.onclick =  function(eve) {
    Aastar = new Astar(arr_star);
    var nodeAstar = Aastar.solve(source, target);
    if (nodeAstar != -1) {
        do {
            Aastar.map[nodeAstar.row][nodeAstar.col] = 1;
            nodeAstar = nodeAstar.parent;
            console.log(nodeAstar);
        }
        while (nodeAstar);
    }
    else {
        alert("no route found");
    }
};