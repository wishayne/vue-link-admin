<template>
    <div class="product-detail-wrapper">
        <div class="content-wrapper">
            <!-- 已有服务-->
            <service :active="active_flag >= 0"></service>
            <!-- 服务模式模块 -->
            <service-pattern :active="active_flag >= 1"></service-pattern>
            <!-- 服务方案模块 -->
            <solution :active="active_flag >= 2"></solution>
            <!-- 需求模式 -->
            <require-pattern :active="active_flag >= 3"></require-pattern>
        </div>

        <ul class="lift-wrapper" :style="`top:${lift_top}px;`">
            <li
                class="lift-item"
                :class="{'lift-active': (lift_index === lift_flag)}"
                v-for="(lift,lift_index) in d"
                @click="liftClick(lift_index)">
                <span class="skip">{{lift.name}}</span>
            </li>
        </ul>
    </div>
</template>

<script>

import Lib from '@/assets/lib.js'

// 已有服务
import service from './service/service'
// 服务模式
import servicePattern from './servicePattern/service_pattern'
// 服务方案
import solution from './solution/solution'
// 需求模式
import requirePattern from './requirePattern/require_pattern'

export default {
  name: 'cPd',
  data() {
    return {
      // 滚动监控
      scroll_data: [],
      // 左边导航栏高度
      lift_top: 0,

      d: [
        { name: '已有服务', index: 'service' },
        { name: '服务模式', index: 'sp' },
        { name: '服务方案', index: 'solution' },
        { name: '需求模式', index: 'rp' }
      ],
      lift_flag: 0,

      // 激活标识
      active_flag: 0

    }
  },
  components: {
    service,
    servicePattern,
    solution,
    requirePattern
  },
  props: {
    // 滚动高度
    scrollNum: {
      type: Number,
      default: 0
    }
  },
  created() {

  },
  mounted() {
    const s = document.getElementsByClassName('scroll-hook')

    for (let dom of s) {
      let scoll_h = dom.offsetTop + dom.offsetParent.offsetTop + 90
      this.scroll_data.push(scoll_h)
    }

    this.lift_top = this.scroll_data[0]
  },
  watch: {
    scrollNum(val) {
      let inner_h = window.innerHeight

      let new_h = this.scroll_data[0] - val
      if (new_h > 200) {
        this.lift_top = new_h
      } else {
        this.lift_top = 200
      }

      // 返回当前滚动标识
      for (let i of this.scroll_data) {
        if ((this.scrollNum + inner_h) < i) {
          let num = this.scroll_data.indexOf(i);

          if (!num) {
            this.active_flag = num;
          } else {
            this.active_flag = num - 1;
          }
          break;
        }
      }

      // 当滚动高度超过时
      if ((this.scrollNum + inner_h) > this.scroll_data[this.scroll_data.length - 1]) {
        this.active_flag = this.scroll_data.length
      }

      // 判断电梯高度
      if (val < this.scroll_data[1]) {
        this.lift_flag = 0
      } else if (val >= this.scroll_data[1] && val < this.scroll_data[2]) {
        this.lift_flag = 1
      } else if (val >= this.scroll_data[2] && val < this.scroll_data[3]) {
        this.lift_flag = 2
      } else if (val >= this.scroll_data[3] && val < this.scroll_data[4]) {
        this.lift_flag = 3
      }
    },
  },
  methods: {
    liftClick(index) {
      this.lift_flag = index
      var cur_top = Lib.C.getScrollTop()
      // 滚动
      Lib.C.page_scroll_to(cur_top, this.scroll_data[index])
    }
  }
}
</script>

<style lang="less" scoped>
    @import '~@/styles/less/common.less';

    .product-detail-wrapper{
        width: 100%;
        background-color: #f6f6f6;
        padding-top: 28px;
        padding-bottom: 40px;
    }

    .lift-wrapper{
        position: fixed;
        top: 0;
        left: 50%;
        margin-left: -670px;
        opacity: 1;
        transition: all linear .3s;
        .lift-item{
            width: 55px;
            height: 40px;
            line-height: 40px;
            text-align: center;

            .skip{
                font-size: 12px;
                display: inline-block;
                border-bottom: 1px solid #e0e0e0;
            }

            &:hover{
                color: #fff;
                background: #3882e5;
            }
            &:last-child{
                .skip{
                    border-bottom: none;
                }
            }

            // 图案
            /*&.travel{*/
            /*    background-position-y: 0;*/
            /*}*/

            &.lift-active{
                cursor: default;
                background: none;
                color: #3882e5;
            }
        }

        @media screen and (min-width: 1200px) and (max-width: 1300px){
            opacity: 0;
        }

        @media screen and (max-width: 1200px){
            opacity: 1;
            margin-left: -530px;
        }

        @media screen and (max-width: 1100px){
            opacity: 0;
        }
    }

</style>
