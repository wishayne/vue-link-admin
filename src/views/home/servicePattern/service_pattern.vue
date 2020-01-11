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
                {catelogyName: '组织内服务模式'},
                {catelogyName: '领域内服务模式'}
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
        // remind 服务模式数据获取
    },
    methods: {

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
