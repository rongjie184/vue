<template>
<el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="30%">
  <span>登录过期，请重新登录</span>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="reSign">确 定</el-button>
  </span>
</el-dialog>
</template>

<script>
  export default {
    props:{
      dialogVisible:{
        type:Boolean,
        default:false
      }
    },
    data(){
      return {
      }
    },
    methods:{
      reSign(){
        this.$router.replace({path: `/login`})
      }
    }
  }
</script>