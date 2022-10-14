<template>
  <div class="row">
    <div class="col">
      <OptionButtons />
    </div>
    <div class="col">
      <BoardGame />
    </div>
  </div>
</template>

<script>
import BoardGame from '@/pages/BoardGame'
import OptionButtons from '@/pages/OptionButtons'

export default {
  name: 'IndexPage',
  components: { BoardGame, OptionButtons }
}
</script>
