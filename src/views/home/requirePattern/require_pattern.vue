<!-- 需求模式块详情 -->
<template>
    <div class="scroll-hook">
        <detail-lazy :nav="nav" height="394" v-if="!loading_flag"></detail-lazy>

        <template v-if="loading_flag">
            <detail-container class="ticket-wrapper" :container-data="rp_nav" key="rp">
                <template slot="store">
                    <rp-detail
                        v-for="(t, tindex) in rp_list"
                        :key="`ticket-${tindex}`"
                        :rp-detail="t"></rp-detail>
                </template>
            </detail-container>
        </template>
    </div>

</template>

<script>


import mock_data from '@/assets/js/mock.js';
//内容盒子
import detailContainer from '../detail/detail-container'
//lazyload模块
import detailLazy from '../detail/detail_lazy_container'
//需求模式组件
import rpDetail from './detail_rp'





export default {
    name: 'requirePattern',
    data(){
        return {
            nav: [],
            rp_nav: [
                {catelogyName: '需求模式'}
            ],
            rp_list: [],
            loading_flag: true
        }
    },
    components:{
        detailContainer,
        detailLazy,
        rpDetail
    },
    props:{
        active: {
            type: Boolean,
            default: false
        }
    },
    watch:{
        active(val){

            if(val && !this.loading_flag){
                setTimeout(() => {
                    this.loading_flag = !this.loading_flag;
                }, 500)
            }
        }
    },
    created(){
        this.getRPList();
    },
    methods: {
        getRPList(){
            this.$ajax.get('http://require-linan.192.168.42.159.nip.io/require/api/get-all-rps').then(data => {
                this.rp_list = data.data;
            })
        }
    }
}
</script>

<style lang="less" scoped>
    @import '~@/styles/less/common.less';

</style>
