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
export default {
  name: 'OptionButtons',
  data: () => ({
    algoritmo1: ['Jugador', 'Minimax', 'Random', 'Alpha-Beta', 'Reinforcement Learning'],
    algoritmo2: ['Jugador', 'Minimax', 'Random', 'Alpha-Beta', 'Reinforcement Learning'],
    corte: [1, 2, 3, 4, 5, 6],
    corte2: [1, 2, 3, 4, 5, 6]
  }),
  methods: {
    async sendInfo () {
      const result = await this.$axios.$post('http://localhost:5000', {
        algoritmo1: 0,
        algoritmo2: 1,
        corte: 1,
        corte2: 1
      }, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      console.log(result)
      return { result }
    }
  }
}
</script>

<style>

</style>
