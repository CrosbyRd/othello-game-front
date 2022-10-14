<template>
  <v-container fluid>
    <v-row align="center">
      <v-col>
        <v-select
          :items="algoritmo1"
          label="Primer algoritmo"
          dense
          outlined
        ></v-select>

        <v-select
          :items="algoritmo2"
          label="Segundo algoritmo"
          dense
          outlined
        ></v-select>

        <v-select
          :items="corte"
          label="Dificultad del algoritmo 1"
          dense
          outlined
        ></v-select>

        <v-select
          :items="corte2"
          label="Dificultad del algoritmo 2"
          dense
          outlined
        ></v-select>

        <v-btn
          fab
          fixed
          depressed
          color="green"
          @click="sendInfo"
        >
          <v-icon>mdi-skip-next</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'OptionButtons',
  data: () => ({
    algoritmo1: ['Jugador', 'Minimax', 'Random', 'Alpha-Beta', 'Reinforcement Learning'],
    algoritmo2: ['Jugador', 'Minimax', 'Random', 'Alpha-Beta', 'Reinforcement Learning'],
    corte: [1, 2, 3, 4, 5, 6],
    corte2: [1, 2, 3, 4, 5, 6]
  }),
  methods: {
    sendInfo () {
      const FormData = require('form-data')
      const data = new FormData()
      data.append('algoritmo1', '0')
      data.append('algoritmo2', '1')
      data.append('corte', '1')
      data.append('corte2', '1')

      const config = {
        method: 'post',
        url: 'http://localhost:5000',
        headers: data.getHeaders ? data.getHeaders() : { 'Content-Type': 'multipart/form-data' },
        data
      }

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data))
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>

<style>

</style>
