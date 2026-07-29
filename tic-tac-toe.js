controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    moveCursor(-1, 0)
})
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
// --- PLACE MARK (BUTTON A) ---
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (turn == -1) {
        return
    }
    // Place mark if the selected space is empty
    if (list[pos] == 0) {
        currentTurn = turn
        list[pos] = currentTurn
        drawMark(pos, currentTurn)
        checkWinning(currentTurn)
        // If game is still ongoing, switch turn
        if (turn != -1) {
            turn = (currentTurn == 1) ? 2 : 1
updateTurnIndicator()
        }
    }
})
function drawMark (index: number, player2: number) {
    if (player2 == 1) {
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
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    moveCursor(0, -1)
})
function toggleSprite (s: Sprite) {
    if (true) {
        s.setFlag(SpriteFlag.Invisible, !(s.flags & SpriteFlag.Invisible))
    }
}
function showWin (one: number, two: number, three: number) {
    for (let index = 0; index <= 5; index++) {
        toggleSprite(markSprites[one])
        toggleSprite(markSprites[two])
        toggleSprite(markSprites[three])
        pause(300)
    }
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    moveCursor(0, 1)
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    moveCursor(1, 0)
})
function getY (p: number) {
    return ys[p]
}
function checkWinning (player2: number) {
    if (list[0] == player2 && list[1] == player2 && list[2] == player2) {
        showWin(0, 1, 2)
        declareWinner(player2)
    } else if (list[3] == player2 && list[4] == player2 && list[5] == player2) {
        showWin(3, 4, 5)
        declareWinner(player2)
    } else if (list[6] == player2 && list[7] == player2 && list[8] == player2) {
        showWin(6, 7, 8)
        declareWinner(player2)
    } else if (list[0] == player2 && list[3] == player2 && list[6] == player2) {
        showWin(0, 3, 6)
        declareWinner(player2)
    } else if (list[1] == player2 && list[4] == player2 && list[7] == player2) {
        showWin(1, 4, 7)
        declareWinner(player2)
    } else if (list[2] == player2 && list[5] == player2 && list[8] == player2) {
        showWin(2, 5, 8)
        declareWinner(player2)
    } else if (list[0] == player2 && list[4] == player2 && list[8] == player2) {
        showWin(0, 4, 8)
        declareWinner(player2)
    } else if (list[2] == player2 && list[4] == player2 && list[6] == player2) {
        showWin(2, 4, 6)
        declareWinner(player2)
    } else {
        full = 1
        for (let val of list) {
            if (val == 0) {
                full = 0
            }
        }
        if (full == 1) {
            declareWinner(0)
        }
    }
}
// --- TURN INDICATOR & HUD ---
function updateTurnIndicator () {
    bg = scene.backgroundImage()
    // Clear top banner area
    bg.fillRect(0, 0, 160, 18, 13)
    bg.print("A:" + Ascore, 5, 5, 8)
bg.print("B:" + Bscore, 135, 5, 2)
// Draw Whose Turn It Is
    if (turn == 1) {
        bg.print("< P1 (X) >", 50, 5, 8)
    } else if (turn == 2) {
        bg.print("< P2 (O) >", 50, 5, 2)
    } else if (turn == -1) {
        bg.print("GAME OVER", 50, 5, 5)
    }
}
// --- D-PAD NAVIGATION ---
function moveCursor (dRow: number, dCol: number) {
    if (turn == -1) {
        return
    }
    currentRow = Math.floor(pos / 3)
    currentCol = pos % 3
    newRow = Math.max(0, Math.min(2, currentRow + dRow))
    newCol = Math.max(0, Math.min(2, currentCol + dCol))
    pos = newRow * 3 + newCol
    updateCursor()
}
function resetScores () {
    Ascore = 0
    Bscore = 0
}
function getX (p: number) {
    return xs[p]
}
function declareWinner (player2: number) {
    turn = -1
    updateTurnIndicator()
    pause(500)
    if (player2 == 1) {
        Ascore += 1
        game.splash("Player 1 (X) Won!")
    } else if (player2 == 2) {
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
function resetBoard () {
    scene.setBackgroundColor(13)
    bg2 = image.create(160, 120)
    // Draw Grid Lines
    bg2.drawLine(66, 20, 66, 100, 15)
    bg2.drawLine(94, 20, 94, 100, 15)
    bg2.drawLine(40, 46, 120, 46, 15)
    bg2.drawLine(40, 74, 120, 74, 15)
    scene.setBackgroundImage(bg2)
    turn = 1
    // Reset cursor to center
    pos = 4
    list = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
    ]
    for (let s of markSprites) {
        if (s) {
            s.destroy()
        }
    }
    markSprites = []
    updateCursor()
    updateTurnIndicator()
}
let bg2: Image = null
let newCol = 0
let newRow = 0
let currentCol = 0
let currentRow = 0
let full = 0
let markSprites: Sprite[] = []
let mark: Sprite = null
let list: number[] = []
let ys: number[] = []
let xs: number[] = []
let pos = 0
let bg: Image = null
let currentTurn = 0
let turn = 0
let cursor: Sprite = null
let Ascore = 0
let Bscore = 0
// Start cursor in center cell
pos = 4
// 1 = Player 1 (X), 2 = Player 2 (O), -1 = Game Over
turn = 1
// Grid center coordinates (3x3 layout)
xs = [
53,
80,
107,
53,
80,
107,
53,
80,
107
]
ys = [
33,
33,
33,
60,
60,
60,
87,
87,
87
]
// Start Game
resetScores()
resetBoard()
// Blinking Cursor Loop
game.onUpdateInterval(400, function () {
    if (pos >= 0 && cursor && turn != -1) {
        cursor.setFlag(SpriteFlag.Invisible, !(cursor.flags & SpriteFlag.Invisible))
    }
})
