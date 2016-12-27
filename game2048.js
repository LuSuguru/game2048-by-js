var score = 0;

var blockRows = []; //存储块状对象行的数组
var blockCols = []; //存储块状对象列的数组

var li = document.getElementsByTagName("li");
var button = document.getElementById("restart");
var span = document.getElementById("score");

window.onload = function() {
    for (var i = 0; i < 16; i++) {
        var block = new Block();
        blockRows.push(block);

        if (blockRows.length == 4) {
            blockCols.push(blockRows);
            blockRows = [];
        }
    }
    init(blockCols);

    //增加键盘点击事件
    document.body.onkeyup = function(e) {
        e.preventDefault();
        keyRun(e.keyCode);
    }

    //为按钮增加点击事件
    button.onmousedown = function() {
        init(blockCols);
        this.style.backgroundColor = "rgb(51, 51, 51)";
    }

    button.onmouseup = function() {
        this.style.backgroundColor = "#9DCD14";
    }

    /**
     * 根据按键判断方向
     */
    function keyRun(keyCode) {
        var isMove; //判断是否移动
        switch (keyCode) {
            case 37:
                isMove = blockMove.left();
                break;
            case 38:
                isMove = blockMove.up();
                break;
            case 39:
                isMove = blockMove.right();
                break;
            case 40:
                isMove = blockMove.down();
                break;
        }
        if (isMove) {
            checkFull();
            render();
        }
    }
}

/**
 * 渲染到游戏平面上
 */
function render() {
    var renderBlock = [];
    for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            renderBlock.push(blockCols[x][y].className);
        }
    }

    for (var i = 0; i < li.length; i++) {
        li[i].classList.remove(li[i].index);
        if (renderBlock[i] != "") {
            li[i].classList.add(renderBlock[i]);
            li[i].index = renderBlock[i];
        }
    }
    span.innerHTML = score;
}

/**
 * 获取产生数字“2”的随机块
 */
function getArea() {
    var x = Math.floor(Math.random() * 4);
    var y = Math.floor(Math.random() * 4);

    return blockCols[x][y];
}

/**
 * 添加数字“2”的区域
 */
function addTwo() {
    var gameBlock = getArea();
    if (gameBlock.number == 0) {
        gameBlock.className = "active-2";
        gameBlock.number = 2;
        return;
    } else {
        checkFull();
    }
}

/**
 *检查是否全部都有数字 
 */
function checkFull() {
    var i = 1,
        checked = false;

    for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            if (blockCols[x][y].number > 0 && i <= 16) {
                i++;
            }
        }
    }

    //如果全部都有数字，则不添加“2”，反之则添加
    checked = (i == 17) ? true : false;
    if (checked) {
        return;
    } else {
        addTwo();
    }
}

/**
 * 初始化，生成3个2的区域
 */
function init() {
    for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 4; y++) {
            blockCols[x][y].initBlock();
            score = 0;
        }
    }
    for (var i = 0; i < 3; i++) {
        addTwo();
    }
    render();
}

/**
 * 滑块移动
 */
var blockMove = {

    left: function() {
        var leftBlock = [],
            block,
            l,
            willString = "",
            didString = "",
            isMove = false;

        for (var x = 0; x < 4; x++) {
            //存储未移动前的数据
            willString = this.addBlockStr(blockCols[x]);

            leftBlock = this.checkUp(blockCols[x]);
            leftBlock = this.moveSeq(leftBlock);
            leftBlock = this.checkUp(leftBlock);
            l = leftBlock.length;

            blockCols[x] = leftBlock;

            for (var n = 0; n < 4 - l; n++) {
                block = new Block();
                blockCols[x].push(block);
            }

            //存储移动后的数据
            didString = this.addBlockStr(blockCols[x]);
            //判断移动前的数据与移动后的数据是否相等
            if (willString != didString) {
                isMove = true;
            }
        }
        return isMove;
    },

    right: function() {
        var rightBlock = [],
            block,
            l,
            willString = "",
            didString = "",
            isMove = false;

        for (var x = 0; x < 4; x++) {
            willString = this.addBlockStr(blockCols[x]);

            rightBlock = this.checkUp(blockCols[x]);
            rightBlock = this.moveRev(rightBlock);
            rightBlock = this.checkUp(rightBlock);
            l = rightBlock.length;
            blockCols[x] = rightBlock;

            for (var n = 0; n < 4 - l; n++) {
                block = new Block();
                blockCols[x].unshift(block);
            }

            didString = this.addBlockStr(blockCols[x]);
            if (willString != didString) {
                isMove = true;
            }
        }
        return isMove;
    },

    up: function() {
        var upBlock = [],
            block,
            l,
            willString,
            didString,
            isMove = false;

        for (var y = 0; y < 4; y++) {
            upBlock = [];
            for (var x = 0; x < 4; x++) {
                if (blockCols[x][y].number > 0) {
                    upBlock.push(blockCols[x][y]);
                }
                willString += " " + blockCols[x][y].number;
            }

            upBlock = this.moveSeq(upBlock);
            upBlock = this.checkUp(upBlock);
            l = upBlock.length;

            for (var j = 0; j < l; j++) {
                blockCols[j][y] = upBlock[j];
                didString += " " + blockCols[j][y].number;
            }
            for (var n = 0; n < 4 - l; n++) {
                block = new Block();
                blockCols[l + n][y] = block;
                didString += " " + blockCols[l + n][y].number;
            }
            if (willString != didString) {
                isMove = true;
            }
        }
        return isMove;
    },

    down: function() {
        var downBlock = [],
            block,
            l,
            willString,
            didString,
            didString2,
            isMove = false;

        for (var y = 0; y < 4; y++) {
            downBlock = [];
            willString = "";
            didString = "";
            didString2 = "";

            for (var x = 0; x < 4; x++) {
                if (blockCols[x][y].number > 0) {
                    downBlock.push(blockCols[x][y]);
                }
                willString += " " + blockCols[x][y].number;
            }

            downBlock = this.moveRev(downBlock);
            downBlock = this.checkUp(downBlock);
            l = downBlock.length;

            for (var j = 4 - l; j < 4; j++) {
                blockCols[j][y] = downBlock[j - (4 - l)];
                didString += " " + blockCols[j][y].number;
            }
            for (var n = 0; n < 4 - l; n++) {
                block = new Block();
                blockCols[n][y] = block;
                didString2 += " " + blockCols[n][y].number;
            }

            didString = didString2 + didString;
            if (willString != didString) {
                isMove = true;
            }
        }
        return isMove;
    },

    /**
     * 正序滑动位置判断函数
     */
    moveSeq: function(arrayBlock) {
        for (var i = 0; i < arrayBlock.length - 1; i++) {
            if (arrayBlock[i].number == arrayBlock[i + 1].number) {
                this.changeBlock(arrayBlock[i], arrayBlock[i + 1]);
            }
        }
        return arrayBlock;
    },

    /**
     * 倒序滑动位置判断函数
     */
    moveRev: function(arrayBlock) {
        for (var i = arrayBlock.length - 1; i > 0; i--) {
            if (arrayBlock[i].number == arrayBlock[i - 1].number) {
                this.changeBlock(arrayBlock[i], arrayBlock[i - 1]);
            }
        }
        return arrayBlock;
    },

    /**
     * 数组检查，将没有数字的块移除数组
     */
    checkUp: function(arrayBlock) {
        arrayBlock = arrayBlock.filter(function(item) {
            return (item.number > 0);
        });
        return arrayBlock;
    },

    /**
     * 添加“4” 之后的数字
     */
    changeBlock: function(block_1, block_2) {
        var num1 = block_1.number;
        var willNum = num1 * 2;

        block_1.className = "active-" + willNum;
        block_1.number = willNum;

        block_2.className = "";
        block_2.number = 0;

        score += num1;
    },

    /**
     * 判断是否运动，若无运动则不需要加数字
     */
    addBlockStr: function(arrayBlock) {
        var strBlock;
        arrayBlock.forEach((item) => {
            strBlock += "" + item.number;
        });
        return strBlock;
    }
}

/**
 * 滑块对象构造函数
 */
function Block() {
    this.className = "";
    this.number = 0;

    this.initBlock = function() {
        this.className = "";
        this.number = 0;
    }.bind(this);
}