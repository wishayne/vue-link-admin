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
