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
                    <i class="nav-icon"></i>
                    <span class="nav-login">登录</span>
                    <span class="nav-register">注册</span>
                    <span class="nav-register" @click="logout">退出</span>
                </li>
                <li class="nav-my">我的<i class="nav-info-arrow"></i></li>

                <div class="nav-info-detail">
                    <button class="nav-login-btn" @click="login">登录</button>
                    <p class="nav-detail-title">全部需求</p>
                </div>
            </ul>
        </ul>
    </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import navItem from './NavItem'

export default {
  components: {
    navItem
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ])
  },
  data() {
    return {
      home: {
        name: '首页',
        target: '/home'
      },
      nav: true
    }
  },
  methods: {
    changeNav(target){
      this.$router.push(target)
    },
    login(){
      this.$router.push('/login');
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="less" scoped>
    @import '~@/styles/less/common.less';

    .nav-wrapper{
        background-color: #2577e3;
        width: 100%;
        height: 40px;

        .content-wrapper{
            z-index: 9;
        }

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
        .nav-info{
            width: 160px;
            height: 40px;
            background-color: #ff9913;
            position: absolute;
            top: 0;
            right: 0;
            padding: 5px 8px;
            box-sizing: border-box;
            .nav-status{
                margin-bottom: 2px;
                .nav-icon{
                    #display_type > .dsp-middle;
                    width: 12px;
                    height: 15px;
                    background-image: url('http://pic.c-ctrip.com/platform/online/home/un_header_footer20160610.png');
                    background-repeat:  no-repeat;
                    background-position:  -68px -183px;
                }
                .nav-login,
                .nav-register{
                    #display_type > .dsp-middle;
                    color: #fff;
                    font-size: 12px;
                    padding: 0 5px;

                    &:hover{
                        text-decoration: underline;
                        cursor: pointer;
                    }
                }
                .nav-login{
                    border-right: 2px solid #fff;
                }
            }
            .nav-my{
                display: inline-block;
                color: #fff;
                font-size: 14px;
                .nav-info-arrow{
                    display: inline-block;
                    .arrow_down(4px, #fff);
                }
                &:hover{
                    text-decoration: underline;
                    cursor: pointer;
                }
            }

            .nav-info-detail{
                display: none;
                width: 160px;
                height: 100px;
                background-color: #fff;
                padding: 8px 14px;
                position: absolute;
                left: 0;
                top: 40px;
                box-sizing: border-box;
                border: 1px solid #c3c3c3;
                border-top: none;
                box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);

                .nav-login-btn{
                    width: 100%;
                    height: 35px;
                    line-height: 33px;
                    background-color: #ffba14;
                    border-radius: 3px;
                    border: 1px solid #d5790a;
                    padding: 0;
                    outline: none;
                    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
                    font-size: 16px;
                    text-align: center;
                    font-weight: bold;
                    color: #fff;
                    text-shadow: 1px 1px 0 #e57c00;
                    margin-bottom: 3px;

                    &:hover{
                        cursor: pointer;
                        background-color: #ff9914;
                        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2), 0 0 5px #fb0 inset;
                    }

                }

                .nav-detail-title{
                    cursor: pointer;
                    font-size: 12px;
                    color: #06c;
                    padding: 3px 0;
                    margin: 5px 0;

                    &:hover{
                        text-decoration: underline;
                    }
                }
            }

            &:hover{
                .nav-info-arrow{
                    transform: rotate(180deg);
                }
                .nav-info-detail{
                    display: block;
                }
            }
        }
    }
</style>
