<!-- 机票区域详情 -->
<template>
    <div class="scroll-hook">
        <detail-lazy :nav="nav" height="394" v-if="!loading_flag"></detail-lazy>

        <template v-if="loading_flag">
            <detail-container class="ticket-wrapper" :container-data="service_nav" @domainSearch="domainSearch" key="service">
                <template slot="store">
                    <service-detail
                        v-for="(t, tindex) in service_list"
                        :key="`service-${tindex}`"
                        :service-detail="t"></service-detail>
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
//服务列表组件
import serviceDetail from './detail_service'





export default {
    name: 'service',
    data(){
        return {
            nav: [],
            service_nav: [
                {catelogyName: ''}
            ],
            service_list: [],
            loading_flag: true
        }
    },
    components:{
        detailContainer,
        detailLazy,
        serviceDetail
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

        this.getFields();
    },
    methods: {
        getFields(){
            this.$ajax.get('http://service-registry-linan.192.168.42.159.nip.io/serviceCategory/listRoots').then(data => {
                this.service_nav = data.data;
                return data.data;
            }).then(service_nav => {
                let pathParams = 'page=0&limit=12&category=' + service_nav[0].catelogyName;
                this.$ajax.get('http://service-registry-linan.192.168.42.159.nip.io/service/query?'+ pathParams).then(data => {
                    this.service_list = data.data.content;
                })
            })
        },

        domainSearch(name){
            let pathParams = 'page=0&limit=12&category=' + name;
            this.$ajax.get('http://service-registry-linan.192.168.42.159.nip.io/service/query?' + pathParams).then(data => {
                this.service_list = data.data.content;
            })
        }
    }
}
</script>

<style lang="less" scoped>
    @import '~@/styles/less/common.less';

</style>
