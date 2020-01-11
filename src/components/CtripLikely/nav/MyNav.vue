<template>
    <nav class="nav-wrapper">
        <ul class="content-wrapper">
            <li class="nav-item">
                <span class="title">
                    {{ home.name }}
                    <i class="arrow"></i><i class="second-arrow"></i>
                </span>
                <ul class="second-nav">
                    <li class="second-nav-item">
                        <span class="second-title" @click="changeNav(home.target)">{{ home.name }}</span>
                    </li>
                </ul>
            </li>
            <nav-item v-for="route in permission_routes" :key="route.path" :item="route"  :base-path="route.path" :nav="nav" />

            <ul class="nav-info">
                <li class="nav-status">
                    <span v-if="!logined" class="nav-login" @click="login">登录</span>
                    <span v-if="logined" class="nav-login">{{ username }}</span>
                    <span v-if="logined" class="nav-register" @click="logout">退出</span>
                </li>
            </ul>
        </ul>
    </nav>
</template>

<script>
import navItem from './NavItem'

export default {
  components: {
    navItem
  },
  computed: {

  },
  data() {
    return {
      home: {
        name: '首页',
        target: '/home'
      },
      nav: true,
      permission_routes: [],
      logined: false,
      username: ''
    }
  },
  created() {
    const getters = this.$store.getters
    this.permission_routes = getters.permission_routes
    this.logined = getters.token
    this.username = getters.userinfo.vserName
  },
  methods: {
    changeNav(target){
      this.$router.push(target)
    },
    login(){
      this.$router.push('/login')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/')
      window.location.reload()
    }
  }
}
</script>

<style lang="less" scoped>
    @import '~@/styles/less/common.less';

    .nav-wrapper{
        background-color: #2577e3;
        width: 100%;
        height: 45px;

        .content-wrapper{
            z-index: 9;
        }

        .nav-item{
            display: inline-block;
            height: 45px;
            line-height: 45px;
            color: #fff;
            cursor: pointer;

                .title{
                    // height: 14px;
                    font-size: 16px;
                    border-right: 1px solid #1d67dd;
                    padding: 2px 7px;
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
                    height: 45px;
                    border: 1px solid #2577e3;
                    border-top: none;
                    color: #333;
                    background-color: #fff;
                    position: absolute;
                    left: 0;
                    bottom: -45px;
                    box-sizing: border-box;

                    &-item{
                        display: inline-block;
                        height: 45px;
                        line-height: 40px;

                        .second-title{
                            font-size: 16px;
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
        .nav-info{
            position: absolute;
            top: 7px;
            right: 0;
            padding: 5px 8px;
            box-sizing: border-box;
            .nav-status{
                margin-bottom: 2px;
                .nav-login,
                .nav-register{
                    #display_type > .dsp-middle;
                    color: #fff;
                    font-size: 16px;
                    padding: 0 5px;
                    cursor: pointer;

                }
                .nav-register{
                    border-left: 2px solid #fff;
                }
            }
        }
    }
</style>
