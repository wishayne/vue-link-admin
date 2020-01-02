<template>
    <li v-if="!item.hidden && nav" class="nav-item">
        <span class="title">
            {{ item.title }}
            <template>
                <i class="arrow"></i><i class="second-arrow"></i>
            </template>
        </span>
        <ul class="second-nav">
            <nav-item v-for="second in item.children" :key="second.path" :item="second" :base-path="resolvePath(second.path)" :nav="isNav" />
        </ul>
    </li>
    <li v-else-if="!item.hidden && !nav" class="second-nav-item">
        <span class="second-title" @click="changeNav(item.path)">{{ item.meta.title }}</span>
    </li>
</template>

<script>
import path from 'path'

export default {
  name: 'NavItem',
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ''
    },
    nav: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isNav: false
    }
  },
  methods: {
    resolvePath(routePath) {
      return path.resolve(this.basePath, routePath)
    },
    changeNav(target) {
      this.$router.push(target)
    }
  }
}
</script>

<style lang="less" scoped>
    @import '~@/styles/less/common.less';

    .nav-item{
    display: inline-block;
    height: 40px;
    line-height: 40px;
    color: #fff;
    cursor: pointer;

        .title{
            // height: 14px;
            font-size: 14px;
            border-right: 1px solid #1d67dd;
            padding: 0 7px;
            position: relative;

            .arrow{
                display: inline-block;
                transition: all ease-out .1s;
                .arrow_down(3px, #fff);
                margin-left: 2px;
            }
            .second-arrow{
                display: none;
                position: absolute;
                top: 5px;
                left: 10px;
                .arrow_up(8px);
            }
        }

        .second-nav{
            display: none;
            width: 100%;
            height: 40px;
            border: 1px solid #2577e3;
            border-top: none;
            color: #333;
            background-color: #fff;
            position: absolute;
            left: 0;
            bottom: -40px;
            box-sizing: border-box;

            &-item{
                display: inline-block;
                height: 40px;
                line-height: 40px;

                .second-title{
                    font-size: 14px;
                    border-right: 1px solid #ccc;
                    padding: 0 8px;

                    &:hover{
                        color: #2577e3;
                        cursor: pointer;
                    }
                }

                &:last-of-type{
                    .second-title{
                        border-right: none;
                    }
                }
            }

            .second-skip-wrapper{
                height: 40px;
                line-height: 40px;
                position: absolute;
                top: 0;
                right: 18px;

                .skip-icon{
                    #display_type > .dsp-middle;
                    width: 16px;
                    height: 16px;
                    margin-right: 5px;
                    background-image: url('http://pic.c-ctrip.com/platform/online/home/un_icon_index_type20170111.png');
                    background-repeat: no-repeat;
                }

                .skip-title{
                    #display_type > .dsp-middle;
                    font-size: 14px;
                }
            }
        }

        &:last-of-type{
            .title{
                border-right: none;
            }
        }
        &:hover{
            background-color: #0a56bb;

            .second-arrow,
            .second-nav{
                display: block;
            }

            .arrow{
                transform: rotate(180deg);
            }
        }
    }
</style>
