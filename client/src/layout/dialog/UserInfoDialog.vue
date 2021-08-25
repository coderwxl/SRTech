<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleBeforeClose"
  >
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'UserInfoDialog',
  props: {
    userInfoDialogVisible: Boolean
  },
  computed: {
    dialogVisible: {
      get: function() {
        return this.userInfoDialogVisible
      },
      set: function(value) {
        this.$emit('update:user-info-dialog-visible', value)
      }
    }
  },
  methods: {
    handleBeforeClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>
