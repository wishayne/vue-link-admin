<template>
    <div class="ticket-product">
        <p class="ticket-product-name">
            {{serviceDetail.serviceName}}
        </p>
        <p class="ticket-product-date">{{serviceDetail.serviceType}}</p>
        <div class="ticket-product-info">
            <div class="price">
                <p class="ticket-product-name">
<!--                    {{serviceDetail.type}}-->
                </p>
            </div>
        </div>
    </div>
</template>

<script>



export default {
    name: 'serviceDetail',
    data(){
        return {

        }
    },
    props:{
        serviceDetail: {
            type: Object,
            required: true,
            default(){
                return {}
            }
        }
    },
    created(){

    },
    methods: {

    }
}
</script>

<style lang="less" scoped>
    @import '~@/styles/less/common.less';

    .ticket-product{
        width: 194px;
        height: 74px;
        padding: 15px 12px;
        background: #f8f8f8;
        border: 1px solid #f8f8f8;
        cursor: pointer;
        transition: all .2s linear;
        float: left;
        margin: 0 10px 10px 0;


        &-name,
        &-date{
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            padding: 0 5px;
            box-sizing: border-box;
        }

        &-name{
            color: #333;
            margin-bottom: 3px;

            .icon{
                width: 12px;
                height: 7px;
                display: inline-block;
                margin: 0 5px;
                overflow: hidden;
                vertical-align: middle;
                background-image: url('http://pic.c-ctrip.com/platform/online/home/un_index_20170601.png');
                background-repeat:  no-repeat;
                background-position: -1px -116px;
            }
        }

        &-date{
            color: #999;
            margin-bottom: 6px;
        }

        &-info{
            position: relative;
            padding: 0 5px;
            .ticket-btn{
                font-size: 14px;
                height: 27px;
                line-height: 27px;
                padding: 0 15px;
                background-color: #ffb000;
                color: #fff;
                border-radius: 3px;
                position: absolute;
                top: 3px;
                right: 5px;

                &:hover{
                    background-color: #f7ab01;
                }
            }
        }

        &:hover{
            box-shadow: 0 1px 4px rgba(0,0,0,.25);
        }


        @media screen and (max-width: 1200px){
            margin-right: 15px;
        }
    }
</style>
