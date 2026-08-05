/**
 * --- GLOBAL STATE ---
 */
// --- D-PAD NAVIGATION ---
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    moveCursor(-1, 0)
})
// --- CURSOR ---
function updateCursor () {
    if (!(cursor)) {
        cursor = sprites.create(img`
            ..5555555555555555555..
            .555555555555555555555.
            55555555555555555555555
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
            555.................555
            555.................555
            5555...............5555
            55555555555555555555555
            .555555555555555555555.
            ..5555555555555555555..
            `, 0)
        cursor.z = 10
    }
    cursor.setFlag(SpriteFlag.Invisible, false)
    cursor.x = getX(pos)
    cursor.y = getY(pos)
}
// --- PLACE MARK (BUTTON A) ---
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (configOpen) {
        closeConfig()
        return
    }
    if (matchOver) {
        startNewMatch()
        return
    }
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
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (configOpen) {
        closeConfig()
        return
    }
    if (matchOver) {
        startNewMatch()
    }
})
function drawMark (index: number, playerNum: number) {
    let mark: Sprite
    if (playerNum == 1) {
        // Player 1: Blue X
        mark = sprites.create(X_ICON, 0)
    } else {
        // Player 2: Red O
        mark = sprites.create(O_ICON, 0)
    }
    mark.x = getX(index)
    mark.y = getY(index)
    markSprites[index] = mark
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    moveCursor(0, -1)
})
function showWin (one: number, two: number, three: number) {
    winning = true
    if (cursor) {
        cursor.setFlag(SpriteFlag.Invisible, true)
    }
    for (let index = 0; index <= 5; index++) {
        toggleVisibility(markSprites[one])
        toggleVisibility(markSprites[two])
        toggleVisibility(markSprites[three])
        pause(300)
    }
    winning = false
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
function updateTurnIndicator () {
    bg2 = scene.backgroundImage()
    // Clear the banner
    bg2.fillRect(0, 0, 160, 18, 13)
    // Corner score indicators: X (top-left), O (top-right), stars below
    drawScore(X_ICON, 6, 8, STAR, Xscore)
    drawScore(O_ICON, 134, 136, STAR, Oscore)
    // Highlight box for the active player
    bg2.fillRect(42, 1, 76, 16, 15)
    if (turn == 1) {
        bg2.fillRect(44, 3, 72, 12, 8)
        bg2.print("TURN: X", 61, 5, 1)
    } else if (turn == 2) {
        bg2.fillRect(44, 3, 72, 12, 2)
        bg2.print("TURN: O", 61, 5, 1)
    } else if (turn == -1) {
        bg2.fillRect(44, 3, 72, 12, 9)
        bg2.print("GAME OVER", 57, 5, 1)
    }
}
// --- TURN INDICATOR & HUD ---
function drawScore (icon: Image, iconX: number, starX: number, fullStar: Image, score: number) {
    bg = scene.backgroundImage()
    bg.drawImage(icon, iconX, 1)
    bg.fillRect(starX, 22, 16, 96, 13)
    for (let i = 0; i < winTarget; i++) {
        if (score > i) {
            bg.drawImage(fullStar, starX, 22 + i * 20)
        } else {
            bg.drawImage(STAR_EMPTY, starX, 22 + i * 20)
        }
    }
}
// --- CONFIG MENU (MENU BUTTON) ---
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    if (configOpen) {
        closeConfig()
    } else {
        openConfig()
    }
})
function openConfig () {
    configOpen = true
    drawConfig()
}
function closeConfig () {
    configOpen = false
    if (configPanel) {
        configPanel.destroy()
        configPanel = null
    }
    updateTurnIndicator()
}
function drawConfig () {
    if (configPanel) {
        configPanel.destroy()
    }
    let panel = image.create(130, 70)
    panel.fill(1)
    panel.fillRect(3, 3, 124, 64, 13)
    panel.print("PLAY TO", 40, 6, 15)
    panel.print("" + winTarget, 62, 18, 1)
    panel.print("< >  SET", 28, 44, 15)
    panel.print("A OK   B BACK", 20, 54, 15)
    configPanel = sprites.create(panel, 0)
    configPanel.z = 50
    configPanel.x = 80
    configPanel.y = 60
}
function toggleVisibility (s: Sprite) {
    s.setFlag(SpriteFlag.Invisible, !(s.flags & SpriteFlag.Invisible))
}
function moveCursor (dRow: number, dCol: number) {
    if (configOpen) {
        winTarget = Math.max(1, Math.min(5, winTarget + dRow + dCol))
        drawConfig()
        updateTurnIndicator()
        return
    }
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
    Xscore = 0
    Oscore = 0
}
function getX (p: number) {
    return xs[p]
}
function declareWinner (playerNum: number) {
    turn = -1
    if (playerNum == 1) {
        Xscore += 1
    } else if (playerNum == 2) {
        Oscore += 1
    }
    updateTurnIndicator()
    pause(500)
    if (playerNum == 1) {
        game.splash("Player 1 (X) Won!")
    } else if (playerNum == 2) {
        game.splash("Player 2 (O) Won!")
    } else {
        game.splash("CAT / DRAW!")
    }
    if (Xscore >= winTarget) {
        game.splash("Player 1 Wins the Match!")
        matchOver = true
        updateTurnIndicator()
    } else if (Oscore >= winTarget) {
        game.splash("Player 2 Wins the Match!")
        matchOver = true
        updateTurnIndicator()
    } else {
        resetBoard()
    }
}
function startNewMatch () {
    matchOver = false
    resetScores()
    resetBoard()
}
// --- BOARD SETUP ---
function resetBoard () {
    scene.setBackgroundColor(13)
    board = image.create(160, 120)
    // Vertical grid lines (2px thick, symmetric about center x=80)
    board.drawLine(66, 20, 66, 100, 15)
    board.drawLine(67, 20, 67, 100, 15)
    board.drawLine(93, 20, 93, 100, 15)
    board.drawLine(94, 20, 94, 100, 15)
    // Horizontal grid lines (2px thick, symmetric about center y=60)
    board.drawLine(40, 46, 120, 46, 15)
    board.drawLine(40, 47, 120, 47, 15)
    board.drawLine(40, 73, 120, 73, 15)
    board.drawLine(40, 74, 120, 74, 15)
    scene.setBackgroundImage(board)
    turn = 1
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
let board: Image = null
let newCol = 0
let newRow = 0
let currentCol = 0
let currentRow = 0
let Oscore = 0
let Xscore = 0
let winTarget = 5
let configOpen = false
let winning = false
let matchOver = false
let configPanel: Sprite = null
let markSprites: Sprite[] = []
let list: number[] = []
let pos = 0
let ys: number[] = []
let xs: number[] = []
let STAR: Image = null
let O_ICON: Image = null
let X_ICON: Image = null
let WIN_LINES: number[][] = []
let bg: Image = null
let bg2: Image = null
let turn = 0
let cursor: Sprite = null
WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
X_ICON = img`
    888.................888
    8888...............8888
    88888.............88888
    .88888...........88888.
    ..88888.........88888..
    ...88888.......88888...
    ....88888.....88888....
    .....88888...88888.....
    ......88888.88888......
    .......888888888.......
    ........8888888........
    .........88888.........
    ........8888888........
    .......888888888.......
    ......88888.88888......
    .....88888...88888.....
    ....88888.....88888....
    ...88888.......88888...
    ..88888.........88888..
    .88888...........88888.
    88888.............88888
    8888...............8888
    888.................888
    `
O_ICON = img`
    .......222222222.......
    .....2222222222222.....
    ...22222222222222222...
    ..2222222.....2222222..
    ..22222.........22222..
    .2222.............2222.
    .2222.............2222.
    2222...............2222
    2222...............2222
    222.................222
    222.................222
    222.................222
    222.................222
    222.................222
    2222...............2222
    2222...............2222
    .2222.............2222.
    .2222.............2222.
    ..22222.........22222..
    ..2222222.....2222222..
    ...22222222222222222...
    .....2222222222222.....
    .......222222222.......
    `
STAR = img`
    . . . . . . . f f . . . . . . . 
    . . . . . . f 5 5 f . . . . . . 
    . . . . . . f 5 5 f . . . . . . 
    . . . . . f 5 5 5 5 f . . . . . 
    f f f f f 5 5 5 5 5 5 f f f f f 
    f 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f 
    . f 5 5 5 5 5 5 5 5 5 5 5 5 f . 
    . . f 5 5 5 5 5 5 5 5 5 5 f . . 
    . . . f 5 5 5 5 5 5 5 5 f . . . 
    . . . f 5 5 5 5 5 5 5 5 f . . . 
    . . f 5 5 5 5 5 5 5 5 5 5 f . . 
    . . f 5 5 5 f f f f 5 5 5 f . . 
    . . f 5 5 f . . . . f 5 5 f . . 
    . f 5 5 f . . . . . . f 5 5 f . 
    . f 5 f . . . . . . . . f 5 f . 
    . f f . . . . . . . . . . f f . 
    `
let STAR_EMPTY = img`
    . . . . . . . f f . . . . . . . 
    . . . . . . f . . f . . . . . . 
    . . . . . . f . . f . . . . . . 
    . . . . . f . . . . f . . . . . 
    f f f f f . . . . . . f f f f f 
    f . . . . . . . . . . . . . . f 
    . f . . . . . . . . . . . . f . 
    . . f . . . . . . . . . . f . . 
    . . . f . . . . . . . . f . . . 
    . . . f . . . . . . . . f . . . 
    . . f . . . . . . . . . . f . . 
    . . f . . . f f f f . . . f . . 
    . . f . . f . . . . f . . f . . 
    . f . . f . . . . . . f . . f . 
    . f . f . . . . . . . . f . f . 
    . f f . . . . . . . . . . f f . 
    `
xs = [
    54,
    81,
    108,
    54,
    81,
    108,
    54,
    81,
    108
]
ys = [
    34,
    34,
    34,
    61,
    61,
    61,
    88,
    88,
    88
]
pos = 4
turn = 1
// Start Game
resetScores()
resetBoard()
// Blinking Cursor Loop
game.onUpdateInterval(400, function () {
    if (pos >= 0 && cursor && turn != -1 && !configOpen && !winning) {
        cursor.setFlag(SpriteFlag.Invisible, !(cursor.flags & SpriteFlag.Invisible))
    }
})
