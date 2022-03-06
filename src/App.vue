<template>
  <div id="app">
    <router-view></router-view>
<!--    <img alt="Vue logo" src="./assets/logo.png">-->
<!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <div class="footer">
      <div class="record">
        <a href="https://beian.miit.gov.cn/" target="_blank" class="link">
          ICP证：浙ICP备2021006984号-1
        </a>
        <img :src="require('@/assets/110.png')" style="vertical-align: middle"/>
        <!--          <p style="display: inline-block;vertical-align: middle;color:rgba(255,255,255,.68);">浙公网安备 33011002011821号 </p >-->
      </div>
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
export default {
  name: 'App',
  components: {
    HelloWorld
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.record {
  width: 100%;
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  background: rgba(44, 52, 73, 1);
  left: 0;
  text-align: center;
}
  .link{
    text-decoration: none;
    display: inline-block;
    color: rgba(255, 255, 255, 1);
    margin-right: 6px;
    font-size: 14px;
  }
</style>
