<template>
  <div class="layout">
    <Layout>
      <Content :style="{padding: '0 50px'}">
        <Card title="查询">
          <Table
            :columns="rpspColumn"
            :data="search"
            stripe border
            ref="table"
          ></Table>
          <Table
            :columns="rpspDataColumn"
            :data="searchData"
            stripe border
            ref="table"
          ></Table>
          <div style="margin: 10px;overflow: hidden">
            <Button @click="addRow()">增加</Button>
            <Button @click="update()">更新匹配度</Button>
            <div style="float: right;">
              <Page :total="searchAllData.length" :page-size=pageSize show-total :current="1" @on-change="changePage" show-elevator size="small"></Page>
            </div>
          </div>
        </Card>
        <Modal
          v-model="modal1"
          title="背景"
          @on-ok="ok"
          @on-cancel="cancel">
          <!--改这里-->
          <Table
            :columns="contextColumn"
            :data="contextData"
            stripe border
            ref="table"
          ></Table>
          <Button @click="addcontext()">增加</Button>
          <!--<p>{{edit_context.context}}</p>-->
        </Modal>
        <Modal
          v-model="modal2"
          title="背景"
          @on-ok="ok1"
          @on-cancel="cancel">
          <!--改这里-->
          <Table
            :columns="contextColumn1"
            :data="contextData1"
            stripe border
            ref="table"
          ></Table>
          <Button @click="addcontext1()">增加</Button>
          <Button @click="clearcontext1()">清空</Button>
          <!--<p>{{edit_context.context}}</p>-->
        </Modal>

        <Modal
          v-model="modal3"
          title="选择需求模式和服务模式"
          @on-ok="okp"
          @on-cancel="cancel">
          <!--改这里-->
          服务模式名称
          <!--<Select v-model="model1" style="width:200px">
            <Option v-for="item in spList" :value="item.value" :key="item.value"></Option>
          </Select>-->
          <Input v-model="model1" style="width:150px"/>
          <Button @click="searchsp()">查询</Button>{{model1_id}}<br>
          需求模式名称
          <Input v-model="model2" style="width:150px"/>
          <Button @click="searchrp()">查询</Button>{{model2_id}}<br>
          <Table
            :columns="pattern"
            :data="patternData"
            stripe border
            ref="table"
          ></Table>
          <!--<p>{{edit_context.context}}</p>-->
        </Modal>
      </Content>
    </Layout>
  </div>
</template>

<script>
  export default {
    name: "table-main",
    data() {
      return {
          pageSize: 5,
          searchAllData: [],
        index: 0,
        model1: '',
        model1_id: "",
        model1_name: "",
        sp: true,
        model2: "",
        model2_id: "",
        model2_name: "",
        modal1 : false,
        modal2 : false,
        modal3: false,
        rpAllIdNameList: [],
        update(){
            this.$ajax.get('http://127.0.0.1:8000/api/updatep')
        },
          patternData:[],
          pattern:[
              {
                  title: 'ID',
                  key: 'key',
                  render: (h, params) => {
                      return h("div", params.row.key);
                  }
              },
              {
                  title: '描述',
                  key: 'value',
                  render: (h, params) => {
                      return h("div", params.row.value);
                  }
              },
              {
                  title: '操作',
                  key: 'action',
                  render: (h, params) => {
                      return h('Button', {
                              props: {
                                  type: params.row.$isEdit ? 'warning' : 'info',
                                  size: 'small',
                                  icon: ''
                              },
                              style: {
                                  marginRight: '5px',
                              },
                              on: {
                                  click: () => {
                                      if (this.sp){
                                          this.model1_id = params.row.key;
                                          this.model1_name = params.row.name
                                      } else {
                                          this.model2_id = params.row.key;
                                          this.model2_name = params.row.name
                                      }
                                  }
                              }
                          }, '选择')}
              }],
        //用来接收后台传输的数据
        search: [{
            $isEdit:false,
            rpName:"",
            spName:"",
            times:"",
            p:"",
            context:""
        }],
        contextData: [],
        contextData1: [],
        searchcontext : JSON.stringify({}),
        searchData: [],

        nowdata: [],
        contextColumn: [
            {
              title: 'key',
              key: 'key',
              render: (h, params) => {
                  if (params.row.$isEdit) {
                      return h("Input", {
                          props: {
                              value: params.row.key
                          },
                          on: {
                              input: function (event) {
                                  params.row.key = event;
                              }
                          }
                      });
                  } else {
                      return h("div", params.row.key);
                  }
              }
          },{
              title: 'value',
              key: 'value',
              render: (h, params) => {
                  if (params.row.$isEdit) {
                      return h("Input", {
                          props: {
                              value: params.row.value
                          },
                          on: {
                              input: function (event) {
                                  params.row.value = event;
                              }
                          }
                      });
                  } else {
                      return h("div", params.row.value);
                  }
              }
          },{
              title: '操作',
              key: 'action',
              render: (h, params) => {
                  return h('div', [
                      h('Button', {
                          props: {
                              type: params.row.$isEdit ? 'warning' : 'info',
                              size: 'small',
                              icon: ''
                          },
                          style: {
                              marginRight: '5px',
                          },
                          on: {
                              click: () => {
                                  if (params.row.$isEdit) {
                                      this.handleSave(params.row);
                                      this.contextData[params.index]['key'] = params.row.key;
                                      this.contextData[params.index]['value'] = params.row.value;
                                      console.log(this.contextData)
                                  } else {
                                      this.handleEdit(params.row);
                                  }
                              }
                          }
                      }, params.row.$isEdit ? '保存' : '修改'),
                      h('Poptip', {
                          props: {
                              confirm: true,
                              title: '是否要删除此字段？',
                              transfer: true
                          },
                          on: {
                              'on-ok': () => {
                                  /*this.$ajax.post("http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/delMap",{
                                      rpId:params.row.rpId,
                                      spId:params.row.spId,
                                      p:params.row.p,
                                      context:params.row.context
                                  })*/
                                  this.contextData.splice(params.row._index, 1)
                                  //删除逻辑
                              }
                          },
                      }, [
                          h('Button', {
                              props: {
                                  type: 'error',
                                  size: 'small'
                              },
                              style: {
                                  marginRight: '5px'
                              },
                          }, '删除')
                      ]),
                  ])
              }
          }],

        contextColumn1: [
            {
              title: 'key',
              key: 'key',
              render: (h, params) => {
                  if (params.row.$isEdit) {
                      return h("Input", {
                          props: {
                              value: params.row.key
                          },
                          on: {
                              input: function (event) {
                                  params.row.key = event;
                              }
                          }
                      });
                  } else {
                      return h("div", params.row.key);
                  }
              }
          },{
              title: 'value',
              key: 'value',
              render: (h, params) => {
                  if (params.row.$isEdit) {
                      return h("Input", {
                          props: {
                              value: params.row.value
                          },
                          on: {
                              input: function (event) {
                                  params.row.value = event;
                              }
                          }
                      });
                  } else {
                      return h("div", params.row.value);
                  }
              }
          },{
              title: '操作',
              key: 'action',
              render: (h, params) => {
                  return h('div', [
                      h('Button', {
                          props: {
                              type: params.row.$isEdit ? 'warning' : 'info',
                              size: 'small',
                              icon: ''
                          },
                          style: {
                              marginRight: '5px',
                          },
                          on: {
                              click: () => {
                                  if (params.row.$isEdit) {
                                      this.handleSave(params.row);
                                      this.contextData1[params.index]['key'] = params.row.key;
                                      this.contextData1[params.index]['value'] = params.row.value;
                                  } else {
                                      this.handleEdit(params.row);
                                  }
                              }
                          }
                      }, params.row.$isEdit ? '保存' : '修改'),
                      h('Poptip', {
                          props: {
                              confirm: true,
                              title: '是否要删除此字段？',
                              transfer: true
                          },
                          on: {
                              'on-ok': () => {
                                  /*this.$ajax.post("http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/delMap",{
                                      rpId:params.row.rpId,
                                      spId:params.row.spId,
                                      p:params.row.p,
                                      context:params.row.context
                                  })*/
                                  this.contextData1.splice(params.row._index, 1)
                                  //删除逻辑
                              }
                          },
                      }, [
                          h('Button', {
                              props: {
                                  type: 'error',
                                  size: 'small'
                              },
                              style: {
                                  marginRight: '5px'
                              },
                          }, '删除')
                      ]),
                  ])
              }
          }],
        //easy-table-vue的列规范

        //iview的列命名规范
        rpspDataColumn: [
          {
            title: ' ',
            key: 'rpName',
              render: (h, params) => {
                  return h('div', params.row.rpName);
              }
          }, {
            title: ' ',
            key: 'spName',
                render: (h, params) => {
                    return h('div', params.row.spName);
                }
          }, {
            title: ' ',
            key: 'context',
            render: (h, params) => {
              //@h 是一个构造器，可以使用其创建新组建
              //@params 是表格的数据，params.row可以获取当前行的数据{
                let context = JSON.parse(params.row.context);
                let row_contextlist = []
                for (let i in context){
                    row_contextlist.push(h('br'));
                    row_contextlist.push(h('p',i + ' : ' + context[i]))
                }
                row_contextlist.push(h('br'));
                return params.row.$isEdit ? h('Button', {
                        props: {
                            type: 'primary',
                            size: 'small'
                        },
                        on: {
                            'click':()=>{
                                let context = JSON.parse(params.row.context);
                                this.nowdata = params.row
                                this.contextData = [];
                                for (var key in context) {
                                    this.contextData.push({
                                        $isEdit:false,
                                        key:key,
                                        value:context[key]
                                    })
                                }
                                this.modal1 = true
                            }
                        },
                        style: {
                            marginRight: '5px'
                        },
                    }, '编辑') : h("div", {
                    style:{
                        fontSize: "100%"
                    }
                }, row_contextlist)
             /* if (params.row.$isEdit) {
                return h("Select", {
                  props: {transfer:true},
                  on: {
                    "on-change": (event) => {
                      params.row.context = event
                    }
                  }
                }, this.context.map((item) => {
                  return h('Option', {
                    props: {
                      value: item.value,
                      label: item.value
                    }
                  })
                }))
              } else return h('div', params.row.context);*/
            }
          },
            {
                title: ' ',
                key: 'p',
                render: (h, params) => {
                    return h("div", params.row.p);
                }
            }, {
            title: ' ',
            key: 'times',
            render: (h, params) => {
              if (params.row.$isEdit) {
                return h("Input", {
                  props: {
                    value: params.row.times
                  },
                  on: {
                    input: function (event) {
                      params.row.times = event;
                    }
                  }
                });
              } else {
                return h("div", params.row.times);
              }
            }
          },
          {
            title: ' ',
            key: 'action',
            width: 200,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: params.row.$isEdit ? 'warning' : 'info',
                    size: 'small',
                    icon: ''
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      console.log(this.now);
                      if (params.row.$isEdit) {
                        console.log(params.row)
                        if (params.row.new) {
                            this.$ajax.post("http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/insertrecord",{
                                rpId:params.row.rpId,
                                spId:params.row.spId,
                                times:params.row.times,
                                context:params.row.context
                            }).catch(function (error) {
                                console.log(error);
                            });
                        } else {
                            console.log(params.row._index)
                            console.log(this.index)
                            this.$ajax.post("http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/updaterecord",{
                                rpId:params.row.rpId,
                                spId:params.row.spId,
                                times:params.row.times,
                                context:params.row.context,
                                p:params.row.p,
                                rpIdOld:this.searchData[params.row._index].olddata.rpId,
                                spIdOld:this.searchData[params.row._index].olddata.spId,
                                timesOld:this.searchData[params.row._index].olddata.times,
                                contextOld:this.searchData[params.row._index].olddata.context,
                                pOld:this.searchData[params.row._index].olddata.p
                            }).catch(function (error) {
                                console.log(error);
                            });
                        }
                        this.handleSave(params.row);
                        this.searchData[params.row._index].$isEdit = false
                      } else {
                          console.log(params.row)
                          this.searchData[params.row._index].olddata = {
                              rpId:params.row.rpId,
                              spId:params.row.spId,
                              times:params.row.times,
                              context:params.row.context,
                              p:params.row.p
                          }
                        this.handleEdit(params.row);
                        this.searchData[params.row._index].$isEdit = true
                      }
                    }
                  }
                }, params.row.$isEdit ? '保存' : '修改'),
                h('Poptip', {
                  props: {
                    confirm: true,
                    title: '是否要删除此字段？',
                    transfer: true
                  },
                  on: {
                    'on-ok': () => {
                        console.log(params.row)
                        this.$ajax.post("http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/delrecord",{
                            rpId:params.row.rpId,
                            spId:params.row.spId,
                            context:params.row.context
                        })
                        this.searchData.splice(params.row._index, 1)
                      //删除逻辑
                    }
                  },
                }, [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                  }, '删除')
                ]),params.row.$isEdit ? h('Button', {
                      props: {
                          type: 'info',
                          size: 'small',
                          icon: ''
                      },
                      style: {
                          marginRight: '5px',
                      },
                      on: {
                          click: () => {
                              if (params.row.$isEdit) {
                                  this.modal3 = true;
                                  this.index = params.row._index;
                                  this.model1_id = params.row.spId;
                                  this.model1_name = params.row.spName;
                                  this.model2_id = params.row.rpId;
                                  this.model2_name = params.row.rpName;
                              }
                          }
                      }
                  }, '设置模式') : '',
              ])
            }
          }],
        rpspColumn: [
              {
                  title: '需求模式名称',
                  key: 'rpName',
                  render: (h, params) => {
                      return h("Input", {
                          props: {
                              value: params.row.rpName
                          },
                          on: {
                              input: function (event) {
                                  params.row.rpName = event;
                              }
                          }
                      });
                  }
              },
            {
                  title: '服务模式名称',
                  key: 'spName',
                  render: (h, params) => {
                      return h("Input", {
                          props: {
                              value: params.row.spName
                          },
                          on: {
                              input: function (event) {
                                  params.row.spName = event;
                              }
                          }
                      });
                  }
              }, {
                  title: '匹配情景',
                  key: 'context',
                  render: (h, params) => {
                      let contextlist = []
                      for (let i=0; i<this.contextData1.length; i++){
                          contextlist.push(h('br'));
                          contextlist.push(h('p', this.contextData1[i]["key"] + ' : ' + this.contextData1[i]["value"]))
                      }
                      contextlist.push(h('br'));
                      console.log("contextlist", contextlist)
                      return [h("div", {
                          style:{
                              fontSize: "100%"
                          }
                      }, contextlist)]
                  }
              }, {
                title: '匹配度',
                key: 'p',
                render: (h, params) => {
                    if (params.row.$isEdit) {
                        params.row.p = 1;
                    }
                }
            }, {
                title: '使用次数',
                key: 'times',
                render: (h, params) => {
                    if (params.row.$isEdit) {
                        params.row.times = 1;
                    }
                }
              },
              {
                  title: '操作',
                  key: 'action',
                  width: 200,
                  render: (h, params) => {
                      return h('div', [
                          h('Button', {
                              props: {
                                  type: params.row.$isEdit ? 'warning' : 'info',
                                  size: 'small',
                                  icon: ''
                              },
                              style: {
                                  marginRight: '5px',
                              },
                              on: {
                                  click: () => {
                                          var rpIdNameList = []
                                          /*var rpIdNameList = [
                                              {"rpId":"1", "rpName":"rp1"},
                                              {"rpId":"2", "rpName":"rp2"},
                                              {"rpId":"3", "rpName":"rp3"},
                                              {"rpId":"4", "rpName":"rp4"}
                                              ];*/

                                          for (var i=0;i<this.rpAllIdNameList.length;i++){
                                              if ((this.rpAllIdNameList[i].rpName.search(params.row.rpName)) != -1 || (params.row.rpName.length == 0)){
                                                  rpIdNameList.push({
                                                      "rpId":this.rpAllIdNameList[i].rpId,
                                                      "rpName":this.rpAllIdNameList[i].rpName
                                                  })
                                              }
                                          }
                                          console.log(rpIdNameList)
                                          this.$ajax.post("http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/findspbyall",{
                                              spId:'',
                                              spName:params.row.spName,
                                              spFunc:'',
                                              spField:''
                                          }).then(res => {
                                              this.searchAllData = [];
                                              var datamap = [];
                                              for (var i=0; i<rpIdNameList.length; i++){
                                                  datamap.push([])
                                                  for (var j=0; j<res.data.length; j++){
                                                      datamap[i].push({
                                                          "rpId":rpIdNameList[i].rpId,
                                                          "rpName":rpIdNameList[i].rpName,
                                                          "spId":res.data[j].spId,
                                                          "spName":res.data[j].spName
                                                      })
                                                  }
                                              }
                                              var that = this;
                                              var promiseAll = datamap.map(function(i){
                                                  var x = i.map(function(j){
                                                      return that.$ajax.post("http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/findtimesandp",{
                                                          rpId:j.rpId,
                                                          spId:j.spId,
                                                          context:that.searchcontext
                                                      })
                                                  });
                                                  return that.$ajax.all(x)
                                              });
                                              that.$ajax.all(promiseAll).then(function(resArr){
                                                  resArr.forEach(function(res, i){
                                                      for (var k=0;k<res.length;k++){
                                                          for (var j=0;j<res[k].data.length;j++){
                                                              that.searchAllData.push({
                                                                  spId:res[k].data[j].spId,
                                                                  spName:datamap[i][k].spName,
                                                                  rpId:res[k].data[j].rpId,
                                                                  rpName:datamap[i][k].rpName,
                                                                  context:res[k].data[j].context,
                                                                  times:res[k].data[j].times,
                                                                  p:res[k].data[j].p
                                                              })
                                                          }
                                                      }
                                                  });
                                                  if (that.searchAllData.length <= that.pageSize){
                                                      that.searchData = that.searchAllData
                                                  } else {
                                                      that.searchData = that.searchAllData.slice(0, that.pageSize);
                                                  }
                                              })
                                          });
                                  }
                              }
                          }, '查询'), h('Button', {
                              props: {
                                  type: 'primary',
                                  size: 'small'
                              },
                              on: {
                                  'click':()=>{
                                      this.modal2 = true
                                  }
                              },
                              style: {
                                  marginRight: '5px'
                              },
                          }, '编辑匹配情景')
                      ])
                  }
              }],
        rpList: [],
        spList: [],
        context: []
        //EChart数据列

      }
    },
    created() {      //在created函数中使用axios的get请求向后台获取用户信息数据
      this.$ajax('http://icesrequire.free.idcfengye.com/api/get-all-rps').then(res => {
          let that = this
          that.rpList = [{value:" "}]
          res.data.forEach(data=>{
              that.rpList.push({
                  value:data.info.name
              });
              that.rpAllIdNameList.push({
                  "rpId":data.info.rpId,
                  "rpName":data.info.name,
                  "rpDescription":data.info.description
              })
          })
          console.log("rplist",this.rpList)
          console.log("rpAllIdNameList",this.rpAllIdNameList)
      }).catch(function (error) {
          console.log(error);
      });

        this.$ajax('http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/findsp').then(res => {
            let that = this
            that.spList = [{value:" "}]
            res.data.forEach(data=>{
                that.spList.push({
                    value:data
                })
            })
            console.log("splist",this.spList)
        }).catch(function (error) {
            console.log(error);
        });

        this.$ajax('http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/findcontext').then(res => {
            let that = this
            that.context = [{value:" "}]
            res.data.forEach(data=>{
                that.context.push({
                    value:data
                })
            })
            console.log("splist",this.context)
        }).catch(function (error) {
            console.log(error);
        });

    },
    methods: {
      //点击了修改按钮

      handleEdit(row) {
        this.$set(row, "$isEdit", true);
      },
      //点击了保存按钮
      handleSave(row) {
        this.$set(row, "$isEdit", false);
      },
      addRow(){
          console.log(this.searchData)
          this.searchData.push({
              $isEdit:false,
              rpId:"",
              rpName:"",
              spId:"",
              spName:"",
              times:"",
              p:"",
              context:"{}",
              new:true
          });
      },
      addcontext(){
          this.contextData.push({
              $isEdit:false,
              key:"",
              value:""
          })
      },
      addcontext1(){
          this.contextData1.push({
              $isEdit:false,
              key:"",
              value:""
          })
      },
        clearcontext1(){
            this.contextData1 = []
        },
        ok1(){
            this.searchcontext = {}
            for (var i in this.contextData1) {
                this.searchcontext[this.contextData1[i]["key"]] = this.contextData1[i]["value"]
            }
            this.searchcontext = JSON.stringify(this.searchcontext);
            console.log(this.searchcontext)
            this.$Message.info("保存成功")
        },
      ok(){
          var temp = {};
          for (var i in this.contextData) {
              temp[this.contextData[i]["key"]] = this.contextData[i]["value"]
          }
          temp = JSON.stringify(temp);

          this.searchData[this.nowdata._index].context = temp
          console.log(this.searchData)
          this.$Message.info("保存成功")
      },
      cancel(){
          this.$Message.info("取消")
      },
        okp(){
          this.searchData[this.index].rpId = this.model2_id;
          this.searchData[this.index].rpName = this.model2_name;
          this.searchData[this.index].spId = this.model1_id;
          this.searchData[this.index].spName = this.model1_name;
          this.searchData[this.index].$isEdit = true;
          console.log(this.searchData[this.index])
        },
        searchsp(){
          this.sp = true;
          this.patternData = [];
          if (this.model1 == undefined){
              this.model1 = ""
          }
          this.$ajax.post("http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/findspbyall",{
                spId:'',
                spName:this.model1,
                spFunc:'',
                spField:''
          }).then(res =>{
              for (var i=0;i<res.data.length;i++){
                  this.patternData.push({
                      "key":res.data[i].spId,
                      "value":res.data[i].spFunc,
                      "name":res.data[i].spName,
                  })
              }
          })
        },
        searchrp(){
            console.log(this.model1);
            this.sp = false;
/*            this.patternData = [
                {"key":"1", "value":"describe1", "name":"rp1"},
                {"key":"2", "value":"describe2", "name":"rp2"},
                {"key":"3", "value":"describe3", "name":"rp3"},
                {"key":"4", "value":"describe4", "name":"rp4"}
            ];*/
            this.patternData = []
            for (var i=0;i<this.rpAllIdNameList.length;i++){
                if (this.rpAllIdNameList[i].rpName.search(this.model2) != -1){
                    this.patternData.push({
                        "key":this.rpAllIdNameList[i].rpId,
                        "value":this.rpAllIdNameList[i].rpDescription,
                        "name":this.rpAllIdNameList[i].rpName
                    })
                }
            }
        },
        changePage (index) {
            // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
            let _start = (index - 1) * this.pageSize;
            let _end = index * this.pageSize;
            this.searchData = this.searchAllData.slice(_start, _end)
        }
    },
  }
</script>

<style scoped>
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow-y: scroll;
    height: 100%;
  }

  .layout-logo {
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
    font-weight: bold;
    text-align: center;
    color: #49ffcc;
  }

  .layout-nav {
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }

  .layout-footer-center {
    text-align: center;
  }
</style>
