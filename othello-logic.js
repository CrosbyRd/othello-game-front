import $ from 'jquery'

let gameArea
const dim = 8
const tileWidth = 62
let game

export function init () {
  gameArea = $('.tile-container')
  gameArea.css('width', dim * tileWidth + 'px')
  gameArea.css('height', dim * tileWidth + 'px')
  $('.game-container').css('width', dim * tileWidth + 'px')
  game = new Othello()
}

// constructor sets the board and model
function Othello () {
  let j
  let i
  this.computer = -1
  this.turn = -1
  this.whiteScore = 2
  this.blackScore = 2
  this.state = new Array(dim)
  this.badMoves = [
    { i: 1, j: 1 },
    { i: 6, j: 6 },
    { i: 1, j: 6 },
    { i: 6, j: 1 }
  ]
  this.preferedMoves = [
    { i: 0, j: 0 },
    { i: 7, j: 7 },
    { i: 0, j: 7 },
    { i: 7, j: 0 }
  ]
  /*    {i: 0, j: 1},
      {i: 1, j: 0},
      {i: 0,  j: 6},
      {i: 1, j: 7},
      {i: 6, j: 0},
      {i: 7, j: 1},
      {i: 7, j: 6},
      {i: 6, j: 7} */
  for (i = 0; i < dim; i++) {
    this.state[i] = new Array(dim)
    for (j = 0; j < dim; j++) {
      this.state[i][j] = new Tile(i, j)
    }
  }
  // Add dots
  for (i = 2; i < 7; i += 4) {
    for (j = 2; j < 7; j += 4) {
      const dot = $('<div>', {
        class: 'dot'
      })
      dot.css('top', i * tileWidth - 5 + 'px')
      dot.css('left', j * tileWidth - 5 + 'px')
      gameArea.append(dot)
    }
  }
  // Add 4 starting pieces
  // i = 3, j = 3
  this.state[3][3].setTileBlack()
  // i = 4, j = 4
  this.state[4][4].setTileBlack()
  // i = 3, j = 4
  this.state[3][4].setTileWhite()
  // i = 4, j = 3
  this.state[4][3].setTileWhite()

  if (this.turn === this.computer) { this.computerMove() }
}

Othello.prototype.isValidMove = function (i, j, state, turn) {
  if (state === undefined) { state = this.state }
  if (turn === undefined) { turn = this.turn }
  i = parseInt(i)
  j = parseInt(j)
  if (state[i][j].value !== 0) { return false }

  let count
  for (let k = -1; k < 2; k++) {
    for (let l = -1; l < 2; l++) {
      count = 1
      while (withinBounds(i + count * k, j + count * l)) {
        if (state[i + count * k][j + count * l].value === -1 * turn) {
          count++
        } else { break }
      }
      if (withinBounds(i + count * k, j + count * l)) {
        if (count > 1 && state[i + count * k][j + count * l].value === turn) { return true }
      }
    }
  }

  return false
}

function withinBounds (i, j) {
  return i >= 0 & j >= 0 & i < dim & j < dim
}

Othello.prototype.makeMove = function (i, j) {
  i = parseInt(i)
  j = parseInt(j)

  let count
  for (let k = -1; k < 2; k++) {
    for (let l = -1; l < 2; l++) {
      count = 1
      while (withinBounds(i + count * k, j + count * l)) {
        if (this.state[i + count * k][j + count * l].value === -1 * this.turn) {
          count++
        } else { break }
      }
      if (withinBounds(i + count * k, j + count * l)) {
        if (count > 1 && this.state[i + count * k][j + count * l].value === this.turn) {
          count = 1
          while (this.state[i + count * k][j + count * l].value === -1 * this.turn) {
            this.setColor(i + count * k, j + count * l, 1)
            count++
          }
        }
      }
    }
  }

  this.setColor(i, j, 0)
  this.turn *= -1

  let moves = this.movesAvailable()
  // console.log(moves.length)
  if (moves.length === 0) {
    // console.log('no moves')
    this.turn *= -1
    moves = this.movesAvailable()
    if (moves.length === 0) {
      // console.log('no moves for opponent')
      this.gameOver()
      return
    }
  }

  if (this.turn === this.computer) {
    setTimeout(function () {
      game.computerMove()
    }, 500)
  }
}

Othello.prototype.gameOver = function () {
  if (this.blackScore > this.whiteScore) { $('.result').text('Black Wins!') } else if (this.blackScore < this.whiteScore) { $('.result').text('White Wins!') } else { $('.result').text('Draw!') }
}

Othello.prototype.movesAvailable = function (state, turn) {
  if (state === undefined) { state = this.state }
  if (turn === undefined) { turn = this.turn }
  const moves = []
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      if (this.isValidMove(i, j, state, turn)) {
        moves.push({ i, j, enemyMoves: -1, disaster: false })
      }
    }
  }

  return moves
}

Othello.prototype.setColor = function (i, j, flip) {
  if (this.turn > 0) {
    this.state[i][j].setTileWhite()
    this.whiteScore++
    if (flip) { this.blackScore-- }
  } else if (this.turn < 0) {
    this.state[i][j].setTileBlack()
    this.blackScore++
    if (flip) { this.whiteScore-- }
  }
  $('.score-black').text(this.blackScore)
  $('.score-white').text(this.whiteScore)
}

Othello.prototype.computerMove = function () {
  let k
  const moves = this.movesAvailable()
  const enemy = -1 * this.turn
  let model
  let count
  // simulate each move and count the moves available to the other person
  for (k = 0; k < moves.length; k++) {
    model = copyBoard(this.state)
    makeFakeMove(model, this.turn, moves[k].i, moves[k].j)
    const opponentMoves = this.movesAvailable(model, enemy)
    let modelNext
    let movesNext
    let minMoves = 64
    // make all possible enemy moves
    for (let l = 0; l < opponentMoves.length; l++) {
      modelNext = copyBoard(model)
      // make the move
      makeFakeMove(modelNext, enemy, opponentMoves[l].i, opponentMoves[l].j)
      // count how many of my own moves I get
      movesNext = this.movesAvailable(modelNext, this.turn)
      // find who has minimum
      minMoves = 64
      count = movesNext.length
      for (let m = 0; m < movesNext.length; m++) {
        if (this.checkBadMove(movesNext[m].i, movesNext[m].j)) { count = count - 2 }
        if (this.checkPreferedMove(movesNext[m].i, movesNext[m].j)) { count += 10 }
      }
      if (minMoves > count) { minMoves = count }
      if (this.checkPreferedMove(opponentMoves[l].i, opponentMoves[l].j)) { moves[k].disaster = true }
    }
    moves[k].enemyMoves = minMoves
  }

  moves.sort(moveSort)
  // console.log(moves);

  for (k = 0; k < moves.length; k++) {
    if (this.checkPreferedMove(moves[k].i, moves[k].j)) {
      this.makeMove(moves[k].i, moves[k].j)
      return
    }
  }

  // Must check for bad moves
  for (count = 0; count < (moves.length - 1); count++) {
    if (!moves[count].disaster && !this.checkBadMove(moves[count].i, moves[count].j)) { break }
  }

  this.makeMove(moves[count].i, moves[count].j)
}

Othello.prototype.checkBadMove = function (i, j) {
  for (let k = 0; k < this.badMoves.length; k++) {
    if (this.badMoves[k].i === i && this.badMoves[k].j === j) { return true }
  }
  return false
}

Othello.prototype.checkPreferedMove = function (i, j) {
  for (let k = 0; k < this.preferedMoves.length; k++) {
    if (this.preferedMoves[k].i === i && this.preferedMoves[k].j === j) { return true }
  }
  return false
}

function moveSort (a, b) {
  if (a.enemyMoves < b.enemyMoves) { return 1 } else if (a.enemyMoves > b.enemyMoves) { return -1 } else {
    if (a.i < b.i) { return -1 }
    if (a.i > b.i) { return 1 } else {
      if (a.j < b.j) { return -1 }
      if (a.j > b.j) { return 1 } else { return 0 }
    }
  }
}

function makeFakeMove (state, turn, i, j) {
  let count
  for (let k = -1; k < 2; k++) {
    for (let l = -1; l < 2; l++) {
      count = 1
      while (withinBounds(i + count * k, j + count * l)) {
        if (state[i + count * k][j + count * l].value === -1 * turn) {
          count++
        } else { break }
      }
      if (withinBounds(i + count * k, j + count * l)) {
        if (count > 1 && state[i + count * k][j + count * l].value === turn) {
          count = 1
          while (state[i + count * k][j + count * l].value === -1 * turn) {
            state[i + count * k][j + count * l].value = turn
            count++
          }
        }
      }
    }
  }

  state[i][j].value = turn
}

function copyBoard (state) {
  const model = new Array(dim)
  for (let i = 0; i < dim; i++) {
    model[i] = new Array(dim)
    for (let j = 0; j < dim; j++) {
      model[i][j] = { value: state[i][j].value }
    }
  }
  return model
}

function Tile (i, j) {
  this.value = 0
  this.i = i
  this.j = j
  this.view = createTile(i, j)
}

// 1: White
// -1: Black
// 0: Empty

Tile.prototype.setTileBlack = function () {
  if (this.value === 1) { this.view.removeClass('white-piece') }
  this.value = -1
  this.view.addClass('black-piece')
}

Tile.prototype.setTileWhite = function () {
  if (this.value === -1) { this.view.removeClass('black-piece') }
  this.value = 1
  this.view.addClass('white-piece')
}

function createTile (i, j) {
  const tileBg = $('<div>', {
    class: 'tile-background',
    i,
    j
  })
  tileBg.css('top', i * tileWidth + 'px')
  tileBg.css('left', j * tileWidth + 'px')
  tileBg.on('click', function () {
    if (game.isValidMove($(this).attr('i'), $(this).attr('j'))) { game.makeMove($(this).attr('i'), $(this).attr('j')) }
  })
  tileBg.mouseenter(function () {
    if (game.isValidMove($(this).attr('i'), $(this).attr('j'))) { tileBg.css('background-color', '#62e984') }
  }).mouseleave(function () {
    tileBg.css('background-color', '#42b964')
  })

  const tile = $('<div>', {
    class: 'tile'
  })
  tileBg.append(tile)
  gameArea.append(tileBg)
  return tile
}
