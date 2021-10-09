<template>
  <div class="components-container">
    <split-pane split="vertical" default-percent="25" min-percent="20">
      <template slot="paneL">
        <div class="left-container" />
      </template>
      <template slot="paneR">
        <div class="right-container" />
      </template>
    </split-pane>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'

export default {
  name: 'SplitpaneDemo',
  components: { splitPane },
  methods: {

  }
}
</script>

<style  scoped>
  .components-container {
    position: relative;
    height: calc(100vh - 50px);
  }

  .left-container {
    background-color: #F38181;
    height: 100%;
  }

  .right-container {
    background-color: #FCE38A;
    height: 100%;
  }
</style>