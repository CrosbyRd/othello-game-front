<template>
  <div>
    <v-row
      align="center"
      justify="space-around"
      class="ma-1"
    >
      <v-btn
        depressed
        color="primary"
      >
        Boton para volver
      </v-btn>

      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
          >
           Enseñar a IA
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-row>
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
  </div>
</template>

<script>
import * as othello from '@/othello-logic'

export default {
  name: 'BoardGame',
  data: () => ({
    items: [
      { title: 'Metodo x' }
    ]
  }),
  mounted () {
    othello.init()
  }
}
</script>

<style>

body {
  font-family: "Arial", "Helvetica", serif;
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
