<template>
    <ul class="product-group-nav">
        <li
            class="product-group-nav-item"
            v-for="(tn, tindex) in navData"
            :class="{'n-active': tindex === top_nav_flag}"
            @click="top_nav_click(tn.catelogyName, tindex)"
        >
            {{tn.catelogyName}}
        </li>
    </ul>
</template>

<script>

export default {
    name: 'topNav',
    data(){
        return {
            top_nav_flag: 0
        }
    },
    created(){

    },
    props: {
        navData: {
            type: Array,
            required: true,
            default(){
                return []
            }
        }
    },
    watch: {
    },
    methods: {
        //顶部导航点击方法
        top_nav_click(name, index){
            this.top_nav_flag = index;
            this.$emit('domainSearch', name, index);
        }
    }
}
</script>

<style lang="less" scoped>
    @import '~@/styles/less/common.less';

    .product-group-nav{
        width: 100%;
        height: 36px;
        border-bottom: 2px solid #3983e5;

        &-item{
            display: inline-block;
            position: relative;
            height: 36px;
            line-height: 36px;
            font-size: 16px;
            margin-right: 30px;
            color: #333;
            cursor: pointer;

            &:hover{
                color: #06c;
            }

            &.n-active{
                color: #06c;
                cursor: default;

                &:after{
                    content: '';
                    display: inline-block;
                    border-top: 6px solid transparent;
                    border-left: 6px solid transparent;
                    border-right: 6px solid transparent;
                    border-bottom: 6px solid #3983e5;
                    position: absolute;
                    left: 50%;
                    bottom: 0;
                    margin-left: -6px;
                }
            }

        }
    }

</style>
