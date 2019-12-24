<!-- 服务模式区域详情 -->
<template>
    <div class="scroll-hook">
        <detail-lazy :nav="nav" height="386" v-if="!loading_flag"></detail-lazy>

        <template v-if="loading_flag">
            <detail-container :container-data="sp_nav" @domainSearch="domainSearch" key="sp">
                <template slot="store">
                    <sp-detail
                        v-for="(h, hindex) in sp_list"
                        :key="`sp-${hindex}`"
                        :sp-detail="h"></sp-detail>
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
//服务模式详情
import spDetail from './detail_sp'




export default {
    name: 'servicePattern',
    data(){
        return {
            nav: [],
            sp_nav: [
                {catelogyName: ''}
            ],
            sp_list: [],
            loading_flag: true
        }
    },
    components:{
        detailContainer,
        detailLazy,
        spDetail
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
                // console.log('hotel active');
                // setTimeout(() => {
                //     this.loading_flag = !this.loading_flag;
                // }, 500)
            }
        }
    },
    created(){
        this.getFields();
    },
    methods: {
        getFields(){
            this.$ajax.get('http://service-registry-linan.192.168.42.159.nip.io/serviceCategory/listRoots').then(data => {
                this.sp_nav = data.data;
                return data.data;
            }).then(sp_nav => {
                this.$ajax.post("http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/findspbyall",{
                    spField:sp_nav[0].catelogyName
                }).then(res =>{
                    this.sp_list = res.data;
                })
            })
        },

        domainSearch(name){
            this.$ajax.post("http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/findspbyall",{
                spId:"",
                spName:"",
                spFunc:"",
                spField: name
            }).then(res =>{
                this.sp_list = res.data;
            })
        }
    }
}
</script>

<style lang="less" scoped>
    @import '~@/styles/less/common.less';

</style>
