const WIN_LINES: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

// --- D-PAD NAVIGATION ---
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    moveCursor(-1, 0)
})

controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    moveCursor(1, 0)
})

controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    moveCursor(0, -1)
})

controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    moveCursor(0, 1)
})

function moveCursor (dRow: number, dCol: number) {
    if (turn == -1) {
        return
    }
    let currentRow = Math.floor(pos / 3)
    let currentCol = pos % 3
    let newRow = Math.max(0, Math.min(2, currentRow + dRow))
    let newCol = Math.max(0, Math.min(2, currentCol + dCol))
    pos = newRow * 3 + newCol
    updateCursor()
}

// --- PLACE MARK (BUTTON A) ---
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (turn == -1) {
        return
    }
    if (list[pos] == 0) {
        list[pos] = turn
        drawMark(pos, turn)
        checkWinning(turn)
        if (turn != -1) {
            turn = (turn == 1) ? 2 : 1
            updateTurnIndicator()
        }
    }
})

function drawMark (index: number, playerNum: number) {
    let mark: Sprite
    if (playerNum == 1) {
        // Player 1: Blue X
        mark = sprites.create(img`
            888..............888
            8888............8888
            88888..........88888
            .88888........88888.
            ..88888......88888..
            ...88888....88888...
            ....88888..88888....
            .....8888888888.....
            ......88888888......
            .......888888.......
            .......888888.......
            ......88888888......
            .....8888888888.....
            ....88888..88888....
            ...88888....88888...
            ..88888......88888..
            .88888........88888.
            88888..........88888
            8888............8888
            888..............888
            `, 0)
    } else {
        // Player 2: Red O
        mark = sprites.create(img`
            .....2222222222.....
            ....222222222222....
            ...22222222222222...
            ..22222......22222..
            .2222..........2222.
            2222............2222
            2222............2222
            222..............222
            222..............222
            222..............222
            222..............222
            222..............222
            222..............222
            2222............2222
            2222............2222
            .2222..........2222.
            ..22222......22222..
            ...22222222222222...
            ....222222222222....
            .....2222222222.....
            `, 0)
    }
    mark.x = getX(index)
    mark.y = getY(index)
    markSprites[index] = mark
}

function getX (p: number) {
    return xs[p]
}

function getY (p: number) {
    return ys[p]
}

// --- WIN DETECTION ---
function checkWinning (playerNum: number) {
    for (let line of WIN_LINES) {
        if (list[line[0]] == playerNum && list[line[1]] == playerNum && list[line[2]] == playerNum) {
            showWin(line[0], line[1], line[2])
            declareWinner(playerNum)
            return
        }
    }
    for (let val of list) {
        if (val == 0) {
            return
        }
    }
    declareWinner(0)
}

function showWin (one: number, two: number, three: number) {
    for (let index = 0; index <= 5; index++) {
        toggleVisibility(markSprites[one])
        toggleVisibility(markSprites[two])
        toggleVisibility(markSprites[three])
        pause(300)
    }
}

function toggleVisibility (s: Sprite) {
    s.setFlag(SpriteFlag.Invisible, !(s.flags & SpriteFlag.Invisible))
}

function declareWinner (playerNum: number) {
    turn = -1
    updateTurnIndicator()
    pause(500)
    if (playerNum == 1) {
        Ascore += 1
        game.splash("Player 1 (X) Won!")
    } else if (playerNum == 2) {
        Bscore += 1
        game.splash("Player 2 (O) Won!")
    } else {
        game.splash("CAT / DRAW!")
    }
    if (Ascore >= 5) {
        game.splash("Player 1 Wins the Match!")
        resetScores()
    } else if (Bscore >= 5) {
        game.splash("Player 2 Wins the Match!")
        resetScores()
    }
    resetBoard()
}

// --- CURSOR ---
function updateCursor () {
    if (!(cursor)) {
        cursor = sprites.create(img`
            ...55555555555555555...
            ..5555555555555555555..
            .555555555555555555555.
            55555.............55555
            5555...............5555
            555.................555
            555.................555
            555.................555
            555.................555
            555.................555
            555.................555
            555.................555
            555.................555
            555.................555
            555.................555
            555.................555
            555.................555
            5555...............5555
            55555.............55555
            .555555555555555555555.
            ..5555555555555555555..
            ...55555555555555555...
            `, 0)
        cursor.z = 10
    }
    cursor.setFlag(SpriteFlag.Invisible, false)
    cursor.x = getX(pos)
    cursor.y = getY(pos)
}

// --- TURN INDICATOR & HUD ---
function updateTurnIndicator () {
    let bg = scene.backgroundImage()
    bg.fillRect(0, 0, 160, 18, 13)
    bg.print("A:" + Ascore, 5, 5, 8)
    bg.print("B:" + Bscore, 135, 5, 2)
    if (turn == 1) {
        bg.print("< P1 (X) >", 50, 5, 8)
    } else if (turn == 2) {
        bg.print("< P2 (O) >", 50, 5, 2)
    } else if (turn == -1) {
        bg.print("GAME OVER", 50, 5, 5)
    }
}

// --- BOARD SETUP ---
function resetBoard () {
    scene.setBackgroundColor(13)
    let board = image.create(160, 120)
    board.drawLine(66, 20, 66, 100, 15)
    board.drawLine(94, 20, 94, 100, 15)
    board.drawLine(40, 46, 120, 46, 15)
    board.drawLine(40, 74, 120, 74, 15)
    scene.setBackgroundImage(board)
    turn = 1
    pos = 4
    list = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (let s of markSprites) {
        if (s) {
            s.destroy()
        }
    }
    markSprites = []
    updateCursor()
    updateTurnIndicator()
}

function resetScores () {
    Ascore = 0
    Bscore = 0
}

// --- GLOBAL STATE ---
let markSprites: Sprite[] = []
let list: number[] = []
let xs: number[] = [53, 80, 107, 53, 80, 107, 53, 80, 107]
let ys: number[] = [33, 33, 33, 60, 60, 60, 87, 87, 87]
let pos = 4
let turn = 1
let cursor: Sprite = null
let Ascore = 0
let Bscore = 0

// Start Game
resetScores()
resetBoard()

// Blinking Cursor Loop
game.onUpdateInterval(400, function () {
    if (pos >= 0 && cursor && turn != -1) {
        cursor.setFlag(SpriteFlag.Invisible, !(cursor.flags & SpriteFlag.Invisible))
    }
})