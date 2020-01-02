<template>
  <div id="embed-frame">
      <iframe
         style="border:none"
         :width="searchTableWidth"
         :height="searchTableHeight"
         v-bind:src="reportUrl"
       ></iframe>
  </div>
</template>
<script>

export default {
  data() {
    return {
      reportUrl: '',
      searchTableHeight: 0,
      searchTableWidth: 0
    }
  },
  watch: {
    '$route': function () {
      // 监听路由变化
      this.reportUrl = this.$route.meta.pathUrl
    }
  },
  created() {
    // 从路由里动态获取 url地址
    this.reportUrl = this.$route.meta.pathUrl
  },
  mounted() {
    window.onresize = () => {
      this.widthHeight(); // 自适应高宽度
    };
    this.$nextTick(function () {
      this.widthHeight();
    });
  },
  methods: {
    widthHeight() {
      // remind 让页面的高度从iframe中读取，避免出现两个滚动条
      this.searchTableHeight = window.innerHeight
      this.searchTableWidth = window.innerWidth - 20
    }
  }
}
</script>
