<template>
  <div class="app-container">
    <p>消息</p>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  data() {
    return {
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
    }
  }
}
</script>
