<!-- 首页服务模式组件 -->
<template>
    <div class="store-item">
            <img class="store-item-img" :src="imgurl">
            <div class="store-item-detail">
                <p class="title">{{spDetail.spName}}</p>
            </div>
    </div>
</template>

<script>

export default {
    name: 'spDetail',
    data(){
        return {
            imgurl: ''
        }
    },
    props: {
        spDetail: {
            type: Object,
            required: true,
            default(){
                return {}
            }
        }
    },
    created(){
            this.$ajax.get('http://activiti-linan.192.168.42.159.nip.io/activiti-activiti/find_model_extra?id=' + this.spDetail.spId, {responseType: 'arraybuffer'}).then(png => {
                 this.imgurl = 'data:image/png;base64,' + btoa(new Uint8Array(png.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
            })
    },
    methods: {

    }
}
</script>

<style lang="less" scoped>
    @import '~@/styles/less/common.less';
    .store-item{
        width: 400px;
        height: 160px;
        background-color: @lazy_color;
        float: left;
        margin: 0 10px 10px 0;
        overflow: hidden;
        position: relative;
        cursor: pointer;

        &-img{
            width: 400px;
            transition: all linear .2s;
        }

        &-detail{
            position: absolute;
            // z-index: 2;
            top: 50%;
            left: 50%;
            margin: -56px 0 0 -56px;
            padding: 20px 10px;
            width: 92px;
            height: 72px;
            overflow: hidden;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.3);
            text-align: center;
            transition: all linear .2s;

            .title{
                font-size: 18px;
                font-weight: 700;
                color: #fff;
                margin-bottom: 3px;
                padding: 2px 0;
            }
            .hotel-num{
                font-size: 12px;
                white-space: nowrap;
                color: #fff;
                padding: 3px 0;
            }



        }

        &:hover{
            .store-item-img{
                transform: scale(1.3);
            }

            .store-item-detail{
                background: rgba(0, 0, 0, 0);
            }
        }


        @media screen and (max-width: 1200px){
            margin-right: 20px;
        }
    }
</style>
