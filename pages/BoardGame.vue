<template>
  <div class="game-container">
    <div class="score-container">
      <div class="score-board">
        black
        <div class="score-black">2</div>
      </div>
      <div class="result"></div>
      <div class="score-board">
        white
        <div class="score-white">2</div>
      </div>
    </div>
    <div class="tile-container">
    </div>
  </div>
</template>

<script>
export default {
  name: 'BoardGame',
  data() {
    return {
      gameArea: null,
      dim: 8,
      tileWidth: 62,
      game: null
    }
  },
  methods: {
    Othello() {
      this.computer = -1;
      this.turn = -1;
      this.whiteScore = 2;
      this.blackScore = 2;
      this.state = new Array(this.dim);
      this.badMoves = [
        {i: 1, j: 1},
        {i: 6, j: 6},
        {i: 1, j: 6},
        {i: 6, j: 1}
      ];
      this.preferedMoves = [
        {i: 0, j: 0},
        {i: 7, j: 7},
        {i: 0, j: 7},
        {i: 7, j: 0}
      ]
      /*    {i: 0, j: 1},
          {i: 1, j: 0},
          {i: 0,  j: 6},
          {i: 1, j: 7},
          {i: 6, j: 0},
          {i: 7, j: 1},
          {i: 7, j: 6},
          {i: 6, j: 7}*/
      for (let i = 0; i < this.dim; i++) {
        this.state[i] = new Array(this.dim);
        for (let j = 0; j < this.dim; j++) {
          this.state[i][j] = new this.Tile(i, j);
        }
      }
      // Add dots
      for (let i = 2; i < 7; i += 4) {
        for (let j = 2; j < 7; j += 4) {
          let dot = $('<div>', {
            class: "dot"
          });
          dot.css("top", i * this.tileWidth - 5 + "px");
          dot.css("left", j * this.tileWidth - 5 + "px");
          this.gameArea.append(dot);
        }
      }
      // Add 4 starting pieces
      // i = 3, j = 3
      this.state[3][3].setTileBlack();
      // i = 4, j = 4
      this.state[4][4].setTileBlack();
      // i = 3, j = 4
      this.state[3][4].setTileWhite();
      // i = 4, j = 3
      this.state[4][3].setTileWhite();

      if (this.turn === this.computer)
        this.computerMove();
    },
    isValidMove(i, j, state, turn) {
      if (state === undefined)
        state = this.state;
      if (turn === undefined)
        turn = this.turn;
      i = parseInt(i);
      j = parseInt(j);
      if (state[i][j].value !== 0)
        return false;

      let count;
      for (let k = -1; k < 2; k++) {
        for (let l = -1; l < 2; l++) {
          count = 1;
          while (this.withinBounds(i + count * k, j + count * l)) {
            if (state[i + count * k][j + count * l].value === -1 * turn) {
              count++;
            } else
              break;
          }
          if (this.withinBounds(i + count * k, j + count * l)) {
            if (count > 1 && state[i + count * k][j + count * l].value === turn)
              return true;
          }
        }
      }

      return false;
    },
    withinBounds(i, j) {
      return i >= 0 & j >= 0 & i < this.dim & j < this.dim
    },
    makeMove(i, j) {
      i = parseInt(i);
      j = parseInt(j);

      let count;
      for (let k = -1; k < 2; k++) {
        for (let l = -1; l < 2; l++) {
          count = 1;
          while (this.withinBounds(i + count * k, j + count * l)) {
            if (this.state[i + count * k][j + count * l].value === -1 * this.turn) {
              count++;
            } else
              break;
          }
          if (this.withinBounds(i + count * k, j + count * l)) {
            if (count > 1 && this.state[i + count * k][j + count * l].value === this.turn) {
              count = 1;
              while (this.state[i + count * k][j + count * l].value === -1 * this.turn) {
                this.setColor(i + count * k, j + count * l, 1);
                count++;
              }
            }
          }
        }
      }

      this.setColor(i, j, 0);
      this.turn *= -1;

      let moves = this.movesAvailable();
      console.log(moves.length);
      if (moves.length === 0) {
        console.log("no moves");
        this.turn *= -1;
        moves = this.movesAvailable();
        if (moves.length === 0) {
          console.log("no moves for opponent");
          this.gameOver();
          return;
        }
      }

      if (this.turn === this.computer) {
        setTimeout(function () {
          this.game.computerMove();
        }, 500);
      }
    },
    gameOver() {
      if (this.blackScore > this.whiteScore)
        $(".result").text("Black Wins!");
      else if (this.blackScore < this.whiteScore)
        $(".result").text("White Wins!");
      else
        $(".result").text("Draw!");
    },
    movesAvailable(state, turn) {
      if (state === undefined)
        state = this.state;
      if (turn === undefined)
        turn = this.turn;
      let moves = [];
      for (let i = 0; i < this.dim; i++) {
        for (let j = 0; j < this.dim; j++) {
          if (this.isValidMove(i, j, state, turn)) {
            moves.push({i: i, j: j, enemyMoves: -1, disaster: false});
          }
        }
      }

      return moves;
    },
    setColor(i, j, flip) {
      if (this.turn > 0) {
        this.state[i][j].setTileWhite();
        this.whiteScore++;
        if (flip)
          this.blackScore--;
      } else if (this.turn < 0) {
        this.state[i][j].setTileBlack();
        this.blackScore++;
        if (flip)
          this.whiteScore--;
      }
      $(".score-black").text(this.blackScore);
      $(".score-white").text(this.whiteScore);
    },


    computerMove() {
      let moves = this.movesAvailable(),
        enemy = -1 * this.turn,
        model,
        count;
      // simulate each move and count the moves available to the other person
      for (let k = 0; k < moves.length; k++) {
        model = this.copyBoard(this.state);
        this.makeFakeMove(model, this.turn, moves[k].i, moves[k].j);
        let opponentMoves = this.movesAvailable(model, enemy);
        let modelNext,
          movesNext,
          minMoves = 64;
        // make all possible enemy moves
        for (let l = 0; l < opponentMoves.length; l++) {
          modelNext = this.copyBoard(model);
          // make the move
          this.makeFakeMove(modelNext, enemy, opponentMoves[l].i, opponentMoves[l].j);
          // count how many of my own moves I get
          movesNext = this.movesAvailable(modelNext, this.turn);
          // find who has minimum
          minMoves = 64;
          count = movesNext.length;
          for (let m = 0; m < movesNext.length; m++) {
            if (this.checkBadMove(movesNext[m].i, movesNext[m].j))
              count = count - 2;
            if (this.checkPreferedMove(movesNext[m].i, movesNext[m].j))
              count += 10;
          }
          if (minMoves > count)
            minMoves = count;
          if (this.checkPreferedMove(opponentMoves[l].i, opponentMoves[l].j))
            moves[k].disaster = true;
        }
        moves[k].enemyMoves = minMoves;
      }

      moves.sort(this.moveSort)
      //console.log(moves);

      for (let k = 0; k < moves.length; k++) {
        if (this.checkPreferedMove(moves[k].i, moves[k].j)) {
          this.makeMove(moves[k].i, moves[k].j);
          return;
        }
      }

      // Must check for bad moves
      for (count = 0; count < (moves.length - 1); count++) {
        if (!moves[count].disaster && !this.checkBadMove(moves[count].i, moves[count].j))
          break;
      }

      this.makeMove(moves[count].i, moves[count].j);
    },

    checkBadMove(i, j) {
      for (let k = 0; k < this.badMoves.length; k++) {
        if (this.badMoves[k].i === i && this.badMoves[k].j === j)
          return true;
      }
      return false;
    },

    checkPreferedMove(i, j) {
      for (let k = 0; k < this.preferedMoves.length; k++) {
        if (this.preferedMoves[k].i === i && this.preferedMoves[k].j === j)
          return true;
      }
      return false;
    },

    moveSort(a, b) {
      if (a.enemyMoves < b.enemyMoves)
        return 1;
      else if (a.enemyMoves > b.enemyMoves)
        return -1;
      else {
        if (a.i < b.i)
          return -1;
        if (a.i > b.i)
          return 1;
        else {
          if (a.j < b.j)
            return -1;
          if (a.j > b.j)
            return 1;
          else
            return 0;
        }
      }
    },

    makeFakeMove(state, turn, i, j) {
      let count;
      for (let k = -1; k < 2; k++) {
        for (let l = -1; l < 2; l++) {
          count = 1;
          while (this.withinBounds(i + count * k, j + count * l)) {
            if (state[i + count * k][j + count * l].value === -1 * turn) {
              count++;
            } else
              break;
          }
          if (this.withinBounds(i + count * k, j + count * l)) {
            if (count > 1 && state[i + count * k][j + count * l].value === turn) {
              count = 1;
              while (state[i + count * k][j + count * l].value === -1 * turn) {
                state[i + count * k][j + count * l].value = turn;
                count++;
              }
            }
          }
        }
      }

      state[i][j].value = turn;
    },

    copyBoard(state) {
      let model = new Array(this.dim);
      for (let i = 0; i < this.dim; i++) {
        model[i] = new Array(this.dim);
        for (let j = 0; j < this.dim; j++) {
          model[i][j] = {value: state[i][j].value};
        }
      }
      return model;
    },

    Tile(i, j) {
      this.value = 0;
      this.i = i;
      this.j = j;
      this.view = this.createTile(i, j);
    },

// 1: White
// -1: Black
// 0: Empty

    setTileBlack() {
      if (this.value === 1)
        this.view.removeClass("white-piece")
      this.value = -1;
      this.view.addClass("black-piece");
    },

    setTileWhite() {
      if (this.value === -1)
        this.view.removeClass("black-piece")
      this.value = 1;
      this.view.addClass("white-piece");
    },

    createTile(i, j) {
      let tileBg = $('<div>', {
        class: "tile-background",
        i: i,
        j: j
      });
      tileBg.css("top", i * tileWidth + "px");
      tileBg.css("left", j * tileWidth + "px");
      tileBg.on('click', function () {
        if (game.isValidMove($(this).attr("i"), $(this).attr("j")))
          game.makeMove($(this).attr("i"), $(this).attr("j"));
      });
      tileBg.mouseenter(function () {
        if (game.isValidMove($(this).attr("i"), $(this).attr("j")))
          tileBg.css("background-color", "#62e984");
      }).mouseleave(function () {
        tileBg.css("background-color", "#42b964");
      });

      let tile = $('<div>', {
        class: "tile",
      });
      tileBg.append(tile);
      gameArea.append(tileBg);
      return tile;
    }
  },
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

body {
  font-family: "Arial", "Helvetica";
}

.game-container {
  position: static;
  display: block;
  margin: 10px auto;
}

.tile-container {
  margin: auto;
  position: absolute;
  border: solid 1px #477757;
}

.tile-background {
  background-color: #42b964;
  width: 60px;
  height: 60px;
  border: solid 1px #376747;
  position: absolute;
}

.dot {
  border-radius: 50%;
  width: 10px;
  height: 10px;
  position: absolute;
  background-color: #175727;
}

.black-piece, .white-piece {
  width: 50px;
  height: 50px;
  margin: 5px;
  border-radius: 50%;
  border: solid 1px #477757;
}

.white-piece {
  background-color: white;
}

.black-piece {
  background-color: black;
}

.score-board {
  display: inline-block;
  margin: 10px auto;
  width: 75px;
  border: solid 1px #175727;
  padding: 5px;
  text-align: center;
}

.score-container {
  display: flex;
  flex-direction: row;
}

.result {
  font-size: 20px;
  font-weight: bold;
  margin: 23px;
}

</style>
