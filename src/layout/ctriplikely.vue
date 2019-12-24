<template>
  <div id="app">
    <my-header></my-header>
    <my-nav></my-nav>
    <div class="product-detail-wrapper">
        <div class="content-wrapper">
            <router-view />
        </div>
    </div>
  </div>
</template>

<script>

import myHeader from '@/components/CtripLikely/header/MyHeader'
import myNav from '@/components/CtripLikely/nav/MyNav'

export default {
  name: 'ctriplikely',
  components: {
    myHeader,
    myNav
  }
};
</script>
<style lang="less" scoped>
    @import '~@/styles/less/common.less';

    .product-detail-wrapper{
        width: 100%;
        background-color: #f6f6f6;
        padding-top: 40px;
        padding-bottom: 40px;
    }

</style>
