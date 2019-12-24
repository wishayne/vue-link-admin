<template>
    <dl class="entrance-group">
        <dt class="entrance-group-title"> </dt>
        <dd class="entrance-group-item">
            <span
                class="item"
                :title="el"
                v-for="el in sidebar"
                @click="side_nav_click(el.catelogyName)"
            >
                {{el.catelogyName}}
            </span>
        </dd>
    </dl>
</template>

<script>

export default {
    name: 'sidebarSmall',
    data(){
        return {

        }
    },
    props:{
        sidebar: {
            type: Array,
            required: true,
            default(){
                return []
            }
        }
    },
    created(){

    },
    methods: {
        side_nav_click(name){
            this.$emit('domainSearch', name);
        }
    }
}
</script>

<style lang="less" scoped>
    @import '~@/styles/less/common.less';

    .entrance-group{
        width: 187px;
        margin-bottom: 7px;
        overflow: hidden;

        &-title{
            width: 100%;
            height: 38px;
            line-height: 38px;
            font-size: 14px;
            font-weight: 700;
        }

        &-item{
            // width: 100%;
            margin-left: -10px;

            .item{
                padding: 0 10px;
                line-height: 18px;
                height: 18px;
                margin: 7px 0;
                font-size: 12px;
                color: #666;
                border-left: 1px solid #ececec;
                display: inline-block;
                &:hover{
                    cursor: pointer;
                    color: #3983e6;
                }
            }
        }

    }
</style>
