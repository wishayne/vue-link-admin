<template>
    <div class="searchbanner-wrapper">
        <div class="searchbanner-search">
            <div class="content-wrapper">
                <div class="search-wrapper">
                    <ul class="search-nav">
                        <li
                            class="search-nav-item"
                            :class="{'nav-active': nav_cur_flag === nav_index}"
                            v-for="(n,nav_index) in nav_data"
                            @click="nav_click(n, nav_index)">
                            <span class="title">{{n}}</span>
                        </li>
                    </ul>
                    <div class="search-content" :style="{'display': search_content_display[0]}">
                        <div class="search-content-wrapper">
                            <div class="content-group">
                                <div class="input-wrapper">服务名称
                                    <label class="search-content-field">
                                        <input type="text" v-model="service.name">
                                    </label>
                                </div>
                                <div class="input-wrapper">服务描述
                                    <label class="search-content-field">
                                        <input type="text" v-model="service.description">
                                    </label>
                                </div>
                                <div class="input-wrapper">所属领域
                                    <label class="search-content-field">
                                        <input type="text" v-model="service.category">
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="search-content-btn">
                            <button @click="serviceSearch">搜索</button>
                        </div>
                    </div>

                    <div class="search-content" :style="{'display': search_content_display[1]}">
                        <div class="search-content-wrapper">
                            <div class="content-group">
                                <div class="input-wrapper">模式名称
                                    <label class="search-content-field">
                                        <input type="text" v-model="sp.spName">
                                    </label>
                                </div>
                                <div class="input-wrapper">功能信息
                                    <label class="search-content-field">
                                        <input type="text" v-model="sp.spFunc">
                                    </label>
                                </div>
                                <div class="input-wrapper">所属领域
                                    <label class="search-content-field">
                                        <input type="text" v-model="sp.spField">
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="search-content-btn">
                            <button @click="spSearch">搜索</button>
                        </div>
                    </div>

                    <div class="search-content" :style="{'display': search_content_display[2]}">
                        <div class="search-content-wrapper">
                            <div class="content-group">
                                <div class="input-wrapper">方案描述
                                    <label class="search-content-field">
                                        <input type="text" v-model="solution.name">
                                    </label>
                                </div>
                                <div class="input-wrapper">发起人员
                                    <label class="search-content-field">
                                        <input type="text" v-model="solution.owner">
                                    </label>
                                </div>
                                <div class="input-wrapper">方案状态
                                    <label class="search-content-field">
                                        <select v-model="solution.state">
                                            <option :value="state.id" v-for="state in solutionStateList" >{{state.name}}</option>
                                        </select>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="search-content-btn">
                            <button @click="solutionSearch">搜索</button>
                        </div>
                    </div>

                    <div class="search-content" :style="{'display': search_content_display[3]}">
                        <div class="search-content-wrapper">
                            <div class="content-group">
                                <div class="input-wrapper">模式名称
                                    <label class="search-content-field">
                                        <input type="text" v-model="rp.name">
                                    </label>
                                </div>
                                <div class="input-wrapper">模式描述
                                    <label class="search-content-field">
                                        <input type="text" v-model="rp.desc">
                                    </label>
                                </div>
                                <div class="input-wrapper">所属领域
                                    <label class="search-content-field">
                                        <input type="text" v-model="rp.domain">
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="search-content-btn">
                            <button @click="rpSearch">搜索</button>
                        </div>
                    </div>



                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'cSb',
    data(){
        return {

            //导航栏数据
            nav_data: ['已有服务','服务模式','服务方案','需求模式'],
            nav_cur_flag: 0,
            search_content_display: ['block', 'none', 'none', 'none'],
            inputFlag: [false, false, false],
            solutionStateList:[
                {
                    id: 0,
                    name:"全部"
                },
                {
                    id: 1,
                    name:"已生成"
                },
                {
                    id: 2,
                    name:"执行中"
                },
                {
                    id: 3,
                    name:"执行完毕"
                }
            ],
            service:{
                name: '',
                description: '',
                category: ''
            },
            sp:{
                spId: '',
                spName: '',
                spFunc: '',
                fpField: ''
            },
            solution:{
                name: '',
                owner:'',
                state:''
            },
            rp:{
                name:'',
                desc:'',
                domain:''
            }

        }
    },
    created(){
        this.solution.state = this.solutionStateList[0].id;
    },
    methods: {
        //导航栏点击
        nav_click(name, index){
            this.search_content_display[this.nav_cur_flag] = 'none';
            this.search_content_display[index] = 'block';
            this.nav_cur_flag = index;
        },
        serviceSearch(){
            this.$router.push({
                path: '/service',
                query: this.service
            });
        },
        spSearch(){
            this.$router.push({
                path: '/service-pattern',
                query: this.sp
            });
        },
        solutionSearch(){

        },
        rpSearch(){

        }
    }
}
</script>

<style lang="less" scoped>
    @import '~@/styles/less/common.less';

    .searchbanner-wrapper{
        width: 100%;
        height: 240px;
        overflow: hidden;
        position: relative;

        .searchbanner-search{
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;

            .content-wrapper{
                height: 100%;
                margin: 0px auto;
            }

            .search-wrapper{
                position: absolute;
                margin: 10px;
                padding: 15px;
                display: flex;
                z-index: 10;
                box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);

                .search-nav{
                    flex: 0 0 90px;
                    width: 100px;
                    height: 100%;
                    background-color: #2577e3;
                    &-item{
                        height: 45px;
                        line-height: 42px;
                        box-sizing: border-box;
                        border-left: 4px solid transparent;
                        padding-left: 15px;
                        padding-right: 10px;
                        cursor: pointer;

                        .title{
                            width: 70px;
                            display: inline-block;
                            font-size: 16px;
                            color: #fff;
                            border-bottom: 1px dashed #fff;
                        }

                        &.nav-active,
                        &:hover{
                            border-left: 4px solid #ff9915;
                            background-color: #fff;

                            .title{
                                color: #2577e3;
                            }
                        }

                        &.nav-active{
                            cursor: default;
                        }

                        &:last-child{
                            .title{
                                border-bottom: none;
                            }
                        }
                    }
                }
                .search-content{
                    flex: 1;
                    width: 460px;
                    height: 100%;
                    background-color: #fff;
                    box-sizing: border-box;
                    padding: 20px 0 0 50px;
                    position: relative;

                    &-wrapper{
                        .content-group{
                            width: 100%;
                            height: 160px;
                            line-height: 30px;
                            font-size: 15px;
                        }

                    }

                    &-field{
                      margin-left: 20px;
                    }

                    .input-wrapper{
                        height: 28px;
                        font-size: 15px;
                        margin: 3px auto;

                        &.active{
                            input{
                                border-color: #2577e3;
                            }
                        }

                        input{
                            width: 300px;
                            height: inherit;
                            box-sizing: border-box;
                            box-shadow: 2px 2px 1px 0 rgba(164, 203, 255, 0.25) inset;
                            outline: 0 none;
                            padding: 0 10px;
                            border-radius: 4px;
                            border: 1px solid #8ebefc;
                        }
                    }

                    &-btn{
                        position: absolute;
                        bottom: 0px;
                        right: 25px;

                        button{
                            width: 80px;
                            height: 33px;
                            color: #fff;
                            font-size: 16px;
                            text-align: center;
                            text-shadow: 1px 1px 0 #cf7000;
                            background-color: #ffb000;
                            border: solid 1px #e77c00;
                            border-radius: 3px;
                            box-shadow: 0 1px 0 rgba(95, 50, 0, 0.7);
                            cursor: pointer;

                            &:hover{
                                background-color: #f79700;
                                border-color: #de7800;
                            }
                        }
                    }
                }
            }

        }


    }
</style>
