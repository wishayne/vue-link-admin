<template>
    <div class="product-group">
        <!-- 顶部导航栏 -->
        <top-nav :nav-data="containerData" @domainSearch="top_nav_select"></top-nav>
        <div class="product-group-content">
            <!-- 内部侧边栏 -->
            <div class="product-left-wrapper">
                <template>
                    <sidebar-small
                        :sidebar="containerData[selectedNav].children"
                        @domainSearch="sidebar_click">
                    </sidebar-small>
                </template>
            </div>
            <div class="product-right-wrapper">
                <div class="right-content">
                    <div class="store-detail-wrapper">
                        <slot name="store"></slot>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

//顶部导航栏
import topNav from './detail_top_nav'
//内部导航栏
import innerNav from './detail_inner_nav'
//内部侧边栏(小)
import sidebarSmall from './detail_sidebar_short'

export default {
    name: 'detailContainer',
    data(){
        return {
            selectedNav: 0
        }
    },
    components: {
        topNav,
        innerNav,
        sidebarSmall
    },
    props: {
        containerData: {
            type: Array,
            required: true,
            default(){
                return []
            }
        },
    },
    created(){

    },
    methods: {
        //顶部导航点击(组件传出的值)
        top_nav_select(name, index){
            this.selectedNav = index;
            this.$emit('domainSearch', name);
        },

        //侧边栏点击(组件传出的值)
        sidebar_click(name){
            this.$emit('domainSearch', name);

        },

        //toremove start
        //内部导航栏点击方法
        inner_nav_select(res){
            console.log('内部select');
            console.log(res);
        }
        //toremove end
    }
}
</script>

<style lang="less" scoped>
    @import '~@/styles/less/common.less';
    .product-group{
        width: 100%;
        margin-bottom: 28px;
        display: inline-block;

        &-content{
            display: flex;
            // height: 100px;
            border: 1px solid #e0e0e0;
            border-top: none;
            background-color: #fff;

            .product-left-wrapper{
                flex: 0 0 400px;
                padding: 0 20px;
                border-right: 1px dotted #a3a3a3;

            }

            .product-right-wrapper{
                flex: 1;
                // background-color: gray;
                box-sizing: border-box;
                padding: 15px 15px 0;

                .right-content{
                    width: 100%;
                    // height: 100px;
                    display: flex;

                    .ad-detail{
                        flex: 0 0 220px;
                        width: 220px;
                        height: 330px;
                        position: relative;
                        cursor: pointer;
                        overflow: hidden;
                        // background-color: pink;
                        img{
                            width: 220px;
                        }
                        p{
                            position: absolute;
                            width: 100%;
                            height: 30px;
                            line-height: 30px;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            background: rgba(0, 0, 0, 0.5);
                            font-size: 12px;
                            color: #fff;
                            text-align: center;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }

                        //响应式
                        @media screen and (max-width: 1200px){
                            display: none;
                        }
                    }

                    .store-detail-wrapper{
                        flex: 1;
                        // background-color: gray;


                    }

                }
            }
        }
    }


    .ticket-wrapper{
        .ad-detail{
            height: 338px !important;
        }
    }
</style>
