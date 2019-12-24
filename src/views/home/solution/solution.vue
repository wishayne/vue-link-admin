<!-- 服务模式区域详情 -->
<template>
    <div class="scroll-hook">
        <detail-lazy :nav="nav" height="386" v-if="!loading_flag"></detail-lazy>

        <template v-if="loading_flag">
            <detail-container class="ticket-wrapper" :container-data="solution_nav" key="solution">
                <template slot="store">
                    <solution-detail
                        v-for="(h, hindex) in solution_list"
                        :key="`solution-${hindex}`"
                        :solution-detail="h"></solution-detail>
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
import solutionDetail from './detail_solution'




export default {
    name: 'solution',
    data(){
        return {
            nav: [],
            solution_nav:[
                {catelogyName: '服务方案'}
            ],
            solution_list:[],
            loading_flag: true
        }
    },
    components:{
        detailContainer,
        detailLazy,
        solutionDetail
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
        this.getSolutionList();
    },
    methods: {
        getSolutionList(){
            let pathParams = 'page=0&limit=10&creator=&description=&state=';
            this.$ajax.get('http://service-registry-linan.192.168.42.159.nip.io/solution/query?'+ pathParams).then(data => {
                this.solution_list = data.data.content;

            })
        }
    }
}
</script>

<style lang="less" scoped>
    @import '~@/styles/less/common.less';

</style>
