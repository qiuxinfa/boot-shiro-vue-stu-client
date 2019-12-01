<template>
  <el-row>
    <el-col>
      <div>
          <div>{{CountValue}}</div>     // 显示store里的count状态值
          <button @click="increment">+</button>
          <button @click="decrement">-</button>
      </div>
    </el-col>
  </el-row>
</template>
<script>
    import { mapActions, mapGetters } from 'vuex';     // mapActions, mapGetters为辅助函数
    export default {
        data() {
          return {
          }
        },
        methods: {
          ...mapActions([
                    'increment',    //映射 this.increment() 为 this.$store.dispatch('increment')
           'decrement'
         ]),
        },
        computed: {
            ...mapGetters({      //将 store 中的 getters 映射到局部计算属性
                    CountValue:'getCount'    // getCount 是在getters.js定义的方法
            })
        }
    }
</script>
<style>
</style>
