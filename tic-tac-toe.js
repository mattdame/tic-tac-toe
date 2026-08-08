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
        adjustConfig(1)
        drawConfig()
        updateTurnIndicator()
        return
    }
    if (matchOver) {
        startNewMatch()
        return
    }
    if (awaitingContinue) {
        roundStarter = 3 - roundStarter
        resetBoard()
        return
    }
    if (turn == -1) {
        return
    }
    placePiece(pos)
})
function placePiece (p: number) {
    if (list[p] == 0) {
        pickStarterOpen = false
        let q = queues[turn]
        if (q.length >= pieceLimit() && pieceLimit() < 5) {
            let oldest = q.shift()
            list[oldest] = 0
            if (markSprites[oldest]) {
                markSprites[oldest].destroy()
                markSprites[oldest] = null
            }
        }
        list[p] = turn
        drawMark(p, turn)
        q.push(p)
        placements += 1
        refreshFades(turn)
        checkWinning(turn)
        if (turn != -1) {
            turn = (turn == 1) ? 2 : 1
            updateTurnIndicator()
        }
    }
    autoTimer = 0
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (configOpen) {
        closeConfig()
        return
    }
    if (pickStarterOpen) {
        roundStarter = 3 - roundStarter
        turn = roundStarter
        updateTurnIndicator()
    }
})
function drawMark (index: number, playerNum: number) {
    let mark: Sprite
    if (playerNum == 1) {
        // Player 1: X
        mark = sprites.create(xImage, 0)
    } else {
        // Player 2: O
        mark = sprites.create(oImage, 0)
    }
    mark.x = getX(index)
    mark.y = getY(index)
    markSprites[index] = mark
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    moveCursor(0, -1)
})
function showWin (one: number, two: number, three: number) {
    if (cursor) {
        cursor.setFlag(SpriteFlag.Invisible, true)
    }
    flashCells = [one, two, three]
}
function showDraw () {
    if (cursor) {
        cursor.setFlag(SpriteFlag.Invisible, true)
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
// --- WIN DETECTION ---
function checkWinning (playerNum: number) {
    for (let line of WIN_LINES) {
        if (list[line[0]] == playerNum && list[line[1]] == playerNum && list[line[2]] == playerNum) {
            showWin(line[0], line[1], line[2])
            declareWinner(playerNum)
            return
        }
    }
    if (placements >= moveCap()) {
        showDraw()
        declareWinner(0)
        return
    }
    for (let val of list) {
        if (val == 0) {
            return
        }
    }
    if (pieceLimit() == 5) {
        showDraw()
        declareWinner(0)
    }
}
function moveCap () {
    if (pieceLimit() == 4) {
        return 26
    }
    return 40
}
function updateTurnIndicator () {
    bg2 = scene.backgroundImage()
    // Clear the banner
    bg2.fillRect(0, 0, 160, 18, 13)
    // Corner score indicators: X (top-left), O (top-right), stars below
    drawScore(xImage, 6, 9, STAR, Xscore)
    drawScore(oImage, 134, 137, STAR, Oscore)
    // Highlight box for the active player
    bg2.fillRect(38, 1, 84, 16, 15)
    if (turn == 1) {
        let label = pickStarterOpen ? "X STARTS" : "TURN: X"
        bg2.fillRect(40, 3, 80, 12, colorX)
        bg2.print(label, 80 - label.length * 3, 5, 1)
    } else if (turn == 2) {
        let label = pickStarterOpen ? "O STARTS" : "TURN: O"
        bg2.fillRect(40, 3, 80, 12, colorO)
        bg2.print(label, 80 - label.length * 3, 5, 1)
    } else if (turn == -1) {
        let text = "DRAW"
        let fill = DRAW_COLOR
        if (endPlayer == 1) {
            text = matchOver ? "X WINS MATCH" : "X WINS"
            fill = colorX
        } else if (endPlayer == 2) {
            text = matchOver ? "O WINS MATCH" : "O WINS"
            fill = colorO
        }
        bg2.fillRect(40, 3, 80, 12, fill)
        bg2.print(text, 80 - text.length * 3, 5, textColorFor(fill))
    }
}
function textColorFor (fill: number) {
    return IS_LIGHT[fill] ? 15 : 1
}
// --- TURN INDICATOR & HUD ---
function drawScore (icon: Image, iconX: number, starX: number, fullStar: Image, score: number) {
    bg = scene.backgroundImage()
    bg.drawImage(icon, iconX, 1)
    bg.fillRect(starX, 28, 16, 96, 13)
    for (let i = 0; i < winTarget; i++) {
        if (score > i) {
            bg.drawImage(fullStar, starX, 28 + i * 18)
        } else {
            bg.drawImage(STAR_EMPTY, starX, 28 + i * 18)
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
function modeLabel () {
    return MODE_LABELS[modeIndex]
}
function pieceLimit () {
    return MODE_PIECES[modeIndex]
}
function modeFades () {
    return MODE_FADES[modeIndex]
}
function drawConfig () {
    if (configPanel) {
        configPanel.destroy()
    }
    let panel = image.create(150, 110)
    panel.fill(1)
    panel.fillRect(3, 3, 144, 104, 13)
    panel.fillRect(6, 16 + configIndex * 18, 138, 16, 15)
    panel.print("CONFIG", 57, 4, 15)
    panel.print("PLAY TO: " + winTarget, 12, 20, (configIndex == 0) ? 13 : 1)
    panel.print("X COLOR", 12, 38, (configIndex == 1) ? 13 : 1)
    panel.print("O COLOR", 12, 56, (configIndex == 2) ? 13 : 1)
    panel.fillRect(78, 36, 14, 12, colorX)
    panel.fillRect(78, 54, 14, 12, colorO)
    panel.print("MODE: " + modeLabel(), 12, 74, (configIndex == 3) ? 13 : 1)
    panel.print("A/<> SET  B BACK", 12, 96, 15)
    configPanel = sprites.create(panel, 0)
    configPanel.z = 50
    configPanel.x = 80
    configPanel.y = 60
}
function adjustConfig (delta: number) {
    if (configIndex == 0) {
        winTarget = (winTarget + delta + 4) % 5 + 1
    } else if (configIndex == 1) {
        colorIndexX = (colorIndexX + delta + COLORS.length) % COLORS.length
        colorX = COLORS[colorIndexX]
        updateMarkImages()
    } else if (configIndex == 2) {
        colorIndexO = (colorIndexO + delta + COLORS.length) % COLORS.length
        colorO = COLORS[colorIndexO]
        updateMarkImages()
    } else if (configIndex == 3) {
        let oldMode = modeIndex
        modeIndex = (modeIndex + delta + MODE_LABELS.length) % MODE_LABELS.length
        if (modeIndex != oldMode) {
            updateFadeImages()
            if (!matchOver) {
                resetBoard()
            }
        }
    }
}
function updateMarkImages () {
    xImage = X_ICON.clone()
    xImage.replace(8, colorX)
    oImage = O_ICON.clone()
    oImage.replace(2, colorO)
    updateFadeImages()
}
function updateFadeImages () {
    xFades = []
    oFades = []
    let n = pieceLimit()
    for (let life = 1; life < n; life++) {
        xFades[life] = makeFaded(xImage, life, n)
        oFades[life] = makeFaded(oImage, life, n)
    }
}
function makeFaded (base: Image, life: number, n: number) {
    let keep = 100 - Math.floor(75 * (n - life) / (n - 1))
    let out = base.clone()
    for (let x = 0; x < out.width; x++) {
        for (let y = 0; y < out.height; y++) {
            if (out.getPixel(x, y) != 0 && (x * 31 + y * 17) % 100 >= keep) {
                out.setPixel(x, y, 0)
            }
        }
    }
    return out
}
function refreshFades (playerNum: number) {
    if (!modeFades()) {
        return
    }
    let q = queues[playerNum]
    let full = (playerNum == 1) ? xImage : oImage
    let fades = (playerNum == 1) ? xFades : oFades
    let n = pieceLimit()
    for (let i = 0; i < q.length; i++) {
        let life = n - q.length + i + 1
        let img = full
        if (life < n && fades[life]) {
            img = fades[life]
        }
        let s = markSprites[q[i]]
        if (s) {
            s.setImage(img)
        }
    }
}
function toggleVisibility (s: Sprite) {
    s.setFlag(SpriteFlag.Invisible, !(s.flags & SpriteFlag.Invisible))
}
function moveCursor (dRow: number, dCol: number) {
    if (configOpen) {
        if (dRow != 0) {
            configIndex = (configIndex + dRow + 4) % 4
            drawConfig()
        } else {
            adjustConfig(dCol)
            drawConfig()
            updateTurnIndicator()
        }
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
    endPlayer = playerNum
    updateTurnIndicator()
    endDelay = END_DELAY
}
function showResultSplash () {
    if (Xscore >= winTarget) {
        game.splash("Player 1 Wins the Match!")
        matchOver = true
        updateTurnIndicator()
    } else if (Oscore >= winTarget) {
        game.splash("Player 2 Wins the Match!")
        matchOver = true
        updateTurnIndicator()
    } else {
        awaitingContinue = true
    }
}
function startNewMatch () {
    matchOver = false
    resetScores()
    roundStarter = Math.randomRange(1, 2)
    pickStarterOpen = true
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
    turn = roundStarter
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
    queues = [[], [], []]
    placements = 0
    autoTimer = 0
    flashCells = []
    awaitingContinue = false
    endDelay = 0
    endPlayer = 0
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
let matchOver = false
let roundStarter = 1
let pickStarterOpen = false
let configIndex = 0
let modeIndex = 0
let configPanel: Sprite = null
let MODE_LABELS: string[] = ["CLASSIC", "4 PIECES FADE", "4 PIECES SOLID", "3 PIECES FADE", "3 PIECES SOLID"]
let MODE_PIECES: number[] = [5, 4, 4, 3, 3]
let MODE_FADES: boolean[] = [false, true, false, true, false]
let COLORS: number[] = []
let colorIndexX = 7
let colorIndexO = 1
let colorX = 8
let colorO = 2
let DRAW_COLOR = 11
let IS_LIGHT = [false, true, false, true, true, true, false, true, false, true, false, true, false, true, false, false]
let xImage: Image = null
let oImage: Image = null
let markSprites: Sprite[] = []
let queues: number[][] = []
let xFades: Image[] = []
let oFades: Image[] = []
let placements = 0
let autoTimer = 0
let AUTO_DELAY = 8
let flashCells: number[] = []
let awaitingContinue = false
let endDelay = 0
let endPlayer = 0
let END_DELAY = 15
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
COLORS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
updateMarkImages()
// Start Game
startNewMatch()
// Blinking Cursor Loop
game.onUpdateInterval(400, function () {
    if (pos >= 0 && cursor && turn != -1 && !configOpen) {
        cursor.setFlag(SpriteFlag.Invisible, !(cursor.flags & SpriteFlag.Invisible))
    }
})
// Flash the result (winning line or draw board) until the player resets
game.onUpdateInterval(300, function () {
    if (flashCells.length == 0) {
        return
    }
    if (turn == -1) {
        for (let c of flashCells) {
            if (markSprites[c]) {
                toggleVisibility(markSprites[c])
            }
        }
    } else {
        for (let c of flashCells) {
            if (markSprites[c]) {
                markSprites[c].setFlag(SpriteFlag.Invisible, false)
            }
        }
        flashCells = []
    }
})
// Auto-place the sole remaining move
game.onUpdateInterval(100, function () {
    if (endDelay > 0) {
        endDelay -= 1
        if (endDelay <= 0) {
            showResultSplash()
        }
        return
    }
    if (turn == -1 || configOpen || matchOver) {
        autoTimer = 0
        return
    }
    let emptyCells: number[] = []
    for (let i = 0; i < 9; i++) {
        if (list[i] == 0) {
            emptyCells.push(i)
        }
    }
    if (emptyCells.length != 1) {
        autoTimer = 0
        return
    }
    if (autoTimer == 0) {
        autoTimer = AUTO_DELAY
    } else {
        autoTimer -= 1
    }
    if (autoTimer <= 0) {
        pos = emptyCells[0]
        updateCursor()
        placePiece(emptyCells[0])
    }
})
