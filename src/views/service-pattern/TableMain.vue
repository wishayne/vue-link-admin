<template>
  <div class="layout">
    <Layout>
      <Content :style="{padding: '0 50px'}">
        <Card title="查询服务模式">
            <Table
              :columns="spColumn"
              :data="sp"
              stripe border
              ref="table"
            ></Table>
            <Table
              :columns="spColumnData"
              :data="spData"
              stripe border
              ref="table"
            ></Table>
            <div style="margin: 10px;overflow: hidden">
              <Button @click="addRow()">增加</Button>
              <div style="float: right;">
                <Page :total="spAllData.length" :page-size=pageSize show-total :current="1" @on-change="changePage" show-elevator size="small"></Page>
              </div>
            </div>
        </Card>
        <Alert>{{opensp}}</Alert>
        <img :src="imgurl">

      </Content>
      <iframe src="http://flowable-linan.192.168.42.159.nip.io/flowable-explorer/" width="0" height="0"></iframe>
    </Layout>
  </div>
</template>

<script>
  export default {
    name: "table-main",
    data() {
      return {
          success:"chen1",
          imgurl : "",
        //用来接收后台传输的数据
        opensp : "消息提示",
        pageSize : 5,
        tableData: [],
        sp: [{
            $isEdit:false,
            spId:"",
            spName:"",
            spFunc:"",
            spField:""
        }],
        spData: [],
          spAllData: [],
        //easy-table-vue的列规范
        spColumnData: [
            {
                title: ' ',
                key: 'imgurl',
                width: 400,
                render: (h, params) => {
                    console.log(this.spData)
                    console.log(params.row)
                    return h("img", {
                        style: {
                            verticalAlign: 'middle',
                            width: '95%',
                            height: '95%'
                        },
                        attrs: {
                            src: params.row.imgurl
                        },
                        on: {
                            click:()=>{
                                this.showimg(params.row._index)
                            }
                        }
                    })
                }
            },{
                title: ' ',
                key: 'spName',
                render: (h, params) => {
                    //@h 是一个构造器，可以使用其创建新组建
                    //@params 是表格的数据，params.row可以获取当前行的数据
                    if (params.row.$isEdit) {
                        return h('div', ["服务模式名称：", h("Input", {
                            props: {
                                value: params.row.spName
                            },
                            on: {
                                input: function (event) {
                                    params.row.spName = event;
                                }
                            }
                        }), h('br'), "服务模式功能：", h("Input", {
                            props: {
                                value: params.row.spFunc
                            },
                            on: {
                                input: function (event) {
                                    params.row.spFunc = event;
                                }
                            }
                        }), h('br'), "服务模式领域：", h("Input", {
                            props: {
                                value: params.row.spField
                            },
                            on: {
                                input: function (event) {
                                    params.row.spField = event;
                                }
                            }
                        })])
                    } else return h('div', {
                        style:{
                            fontSize: "120%"
                        }
                    }, [h('br'), h('p', "服务模式名称：" + params.row.spName), h('br'), h('p', "服务模式功能：" + params.row.spFunc), h('br'), h('p', "服务模式领域：" + params.row.spField), h('br')]);
                }
            },
            /* {
                title: ' ',
                key: 'spFunc',
                render: (h, params) => {
                    //@h 是一个构造器，可以使用其创建新组建
                    //@params 是表格的数据，params.row可以获取当前行的数据
                    if (params.row.$isEdit) {
                        return h("Input", {
                            props: {
                                value: params.row.spFunc
                            },
                            on: {
                                input: function (event) {
                                    params.row.spFunc = event;
                                }
                            }
                        })
                    } else return h('div', params.row.spFunc);
                }
            }, {
                title: ' ',
                key: 'spField',
                render: (h, params) => {
                    //@h 是一个构造器，可以使用其创建新组建
                    //@params 是表格的数据，params.row可以获取当前行的数据
                    if (params.row.$isEdit) {
                        return h("Input", {
                            props: {
                                value: params.row.spField
                            },
                            on: {
                                input: function (event) {
                                    params.row.spField = event;
                                }
                            }
                        })
                    } else return h('div', params.row.spField);
                }
            },*/ {
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
                                        if (params.row.new) {
                                            params.row.new = false;
                                            this.$ajax.post("http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/addsp",{
                                                spId:params.row.spId,
                                                spName:params.row.spName,
                                                spFunc:params.row.spFunc,
                                                spField:params.row.spField,
                                                spProcess:params.row.spProcess,
                                            }).catch(function (error) {
                                                console.log(error);
                                            });
                                            this.$ajax.post("http://activiti-linan.192.168.42.159.nip.io/activiti-activiti/update_model", {
                                                id: params.row.spId,
                                                name: params.row.spName
                                            }).catch(function (error) {
                                                console.log(error)
                                            })
                                        } else {
                                            this.$ajax.post("http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/updatesp",{
                                                spId:params.row.spId,
                                                spName:params.row.spName,
                                                spFunc:params.row.spFunc,
                                                spField:params.row.spField,
                                                spProcess:params.row.spProcess,
                                                spIdOld:params.row.olddata.spId,
                                                spNameOld:params.row.olddata.spName,
                                                spFuncOld:params.row.olddata.spFunc,
                                                spFieldOld:params.row.olddata.spField,
                                            }).catch(function (error) {
                                                console.log(error);
                                            });
                                            this.$ajax.post("http://activiti-linan.192.168.42.159.nip.io/activiti-activiti/update_model", {
                                                id: params.row.spId,
                                                name: params.row.spName
                                            }).catch(function (error) {
                                                console.log(error)
                                            })
                                        }
                                        this.handleSave(params.row);

                                    } else {
                                        params.row.olddata = {
                                            spId:params.row.spId,
                                            spName:params.row.spName,
                                            spFunc:params.row.spFunc,
                                            spField:params.row.spField,
                                            spProcess:params.row.spProcess
                                        }
                                        // 在这里打开导入服务
                                        this.handleEdit(params.row);
                                    }
                                }
                            }
                        }, params.row.$isEdit ? '保存' : '修改'),
                        params.row.$isEdit ? h('Button', {
                            props: {
                                type: params.row.$processEdit ? 'warning' : 'info',
                                size: 'small',
                                icon: ''
                            },
                            style: {
                                marginRight: '5px',
                            },
                            on: {
                                click: () => {
                                    /*if (params.row.$processEdit) {
                                        this.opensp = "保存中，请稍后..."
                                        this.$ajax.get('http://sp-algorithm-linan.192.168.42.159.nip.io/api/savesp?inputfile=' + params.row.spId)
                                            .then(res => {
                                                params.row.spProcess = params.row.spId
                                                if (res.data.msg == 'success') {
                                                    this.opensp = "保存成功！";
                                                } else {
                                                    this.opensp = res.data.msg
                                                }
                                            }).catch(function (error) {
                                            console.log(error);
                                        });
                                        this.handleprocessSave(params.row);
                                    }
                                    else {*/
                                        this.opensp = "服务模式文件导入中，请稍后...";
                                        if (params.row.spProcess === null || params.row.spProcess === ""){
                                            this.$ajax('http://activiti-linan.192.168.42.159.nip.io/activiti-activiti/add_new_model?id=' + params.row.spId + "&name=" + params.row.spName)
                                                .then(res => {
                                                    if (res.data === 'success') {
                                                        this.opensp = "导入服务模式文件成功! 访问 http://flowable-linan.192.168.42.159.nip.io/flowable-explorer/modeler.html?modelId=" + params.row.spId + " 修改文件。"
                                                        window.open("http://flowable-linan.192.168.42.159.nip.io/flowable-explorer/modeler.html?modelId=" + params.row.spId)
                                                    } else {
                                                        this.opensp = "出现错误"
                                                    }
                                                });
                                        } else {
                                            this.opensp = "导入服务模式文件成功! 访问 http://flowable-linan.192.168.42.159.nip.io/flowable-explorer/modeler.html?modelId=" + params.row.spProcess + " 修改文件。";
                                            window.open("http://flowable-linan.192.168.42.159.nip.io/flowable-explorer/modeler.html?modelId=" + params.row.spProcess)
                                        }
                                        /*this.handleprocessEdit(params.row);*/
                                    }
                            }
                        },  '修改流程') : h('Button', {
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
                                    this.opensp = "执行中"
                                    let url = 'http://sp-algorithm-linan.192.168.42.159.nip.io/api/runsp?inputfile=' + params.row.spId
                                    this.$ajax.get(url).then(data =>{
                                        this.opensp = data.data.msg
                                    })
                                }
                            }
                        }, '执行'),
                        h('Poptip', {
                            props: {
                                confirm: true,
                                title: '是否要删除此字段？',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    console.log(params.row)
                                    this.$ajax.get('http://activiti-linan.192.168.42.159.nip.io/activiti-activiti/del_model?id=' + params.row.spId)
                                        .then(res => {
                                            this.opensp = res.data;
                                        });
                                    this.$ajax.post("http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/delsp",{
                                        spId:params.row.spId,
                                        spName:params.row.spName,
                                        spFunc:params.row.spFunc,
                                        spField:params.row.spField
                                    })
                                    this.spData.splice(params.row._index, 1)
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
                        ])
                    ])
                }
            }],
        //iview的列命名规范
        spColumn: [
              {
                  title: '服务模式名称',
                  key: 'spName',
                  render: (h, params) => {
                      //@h 是一个构造器，可以使用其创建新组建
                      //@params 是表格的数据，params.row可以获取当前行的数据
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
                      /*if (params.row.$isEdit) {
                          return h("Select", {
                              props: {transfer:true},
                              on: {
                                  "on-change": (event) => {
                                      params.row.spName = event
                                  }
                              }
                          }, this.spNameList.map((item) => {
                              return h('Option', {
                                  props: {
                                      value: item.value,
                                      label: item.value
                                  }
                              })
                          }))
                      } else return h('div', params.row.spName);*/
                  }
              }, {
                  title: '功能信息',
                  key: 'spFunc',
                  render: (h, params) => {
                      return h("Input", {
                          props: {
                              value: params.row.spFunc
                          },
                          on: {
                              input: function (event) {
                                  params.row.spFunc = event;
                              }
                          }
                      });
                  }
              }, {
                  title: '领域信息',
                  key: 'spField',
                  render: (h, params) => {
                      return h("Input", {
                          props: {
                              value: params.row.spField
                          },
                          on: {
                              input: function (event) {
                                  params.row.spField = event;
                              }
                          }
                      });
                  }
              },
              {
                  title: '操作',
                  key: 'action',
                  width: 300,
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
                                          console.log(params.row);
                                          this.$ajax.post("http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/findspbyall",{
                                              spId:params.row.spId,
                                              spName:params.row.spName,
                                              spFunc:params.row.spFunc,
                                              spField:params.row.spField
                                          }).then(res => {
                                              var _spData = res.data;
                                              var that = this;
                                              var promiseAll = _spData.map(function(i){
                                                  return that.$ajax.get('http://activiti-linan.192.168.42.159.nip.io/activiti-activiti/find_model_extra?id=' + i.spId, {responseType: 'arraybuffer'})
                                              });

                                              /*this.$ajax.get(url, {responseType: 'arraybuffer'}).then(data =>{
                                                  this.imgurl = 'data:image/png;base64,' + btoa(new Uint8Array(data.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
                                              });*/
                                              that.spAllData = [];
                                              that.$ajax.all(promiseAll).then(function(resArr){
                                                  resArr.forEach(function(res, i){
                                                      console.log(i)
                                                      that.spAllData.push({
                                                          "imgurl" : 'data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')),
                                                          "spId" : _spData[i].spId,
                                                          "spName" : _spData[i].spName,
                                                          "spFunc" : _spData[i].spFunc,
                                                          "spField" : _spData[i].spField,
                                                          "spProcess" : _spData[i].spProcess
                                                      })
                                                  });
                                                  if (that.spAllData.length <= that.pageSize){
                                                      that.spData = that.spAllData
                                                  } else {
                                                      that.spData = that.spAllData.slice(0, that.pageSize);
                                                  }
                                              })
                                          }).catch(function (error) {
                                              console.log(error);
                                          });
                                      }
                                  }
                              }, '查询')
                      ])
                  }
              }],
        spIdList: [],
        spNameList: [],
        spFuncList: [],
        spFieldList: []
        //EChart数据列

      }
    },
    created() {      //在created函数中使用axios的get请求向后台获取用户信息数据
      this.$ajax('http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/findAll').then(res => {
        this.tableData = res.data
        //为了能修改数据需要在此处给每行数据加一个是否修改状态
        console.log(this.tableData)
        this.tableData.forEach(value => {
          value.$isEdit = false;
        });
      }).catch(function (error) {
        console.log(error);
      });

      this.$ajax('http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/findspid').then(res => {
          let that = this
          that.spIdList = [{value:" "}]
          res.data.forEach(data=>{
              that.spIdList.push({
                  value:data
              })
          })
          console.log("spIdList",this.spIdList)
      }).catch(function (error) {
          console.log(error);
      });

        this.$ajax('http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/findspname').then(res => {
            let that = this
            that.spNameList = [{value:" "}]
            res.data.forEach(data=>{
                that.spNameList.push({
                    value:data
                })
            })
            console.log("splist",this.spNameList)
        }).catch(function (error) {
            console.log(error);
        });

        this.$ajax('http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/findspfunc').then(res => {
            let that = this
            that.spFuncList = [{value:" "}]
            res.data.forEach(data=>{
                that.spFuncList.push({
                    value:data
                })
            })
            console.log("splist",this.spFuncList)
        }).catch(function (error) {
            console.log(error);
        });

        this.$ajax('http://servicepattern-linan.192.168.42.159.nip.io/demo-0.0.1-SNAPSHOT/findspfield').then(res => {
            let that = this
            that.spFieldList = [{value:" "}]
            res.data.forEach(data=>{
                that.spFieldList.push({
                    value:data
                })
            })
            console.log("splist",this.spFieldList)
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
/*      handleprocessEdit(row) {
          this.$set(row, "$processEdit", true);
      },
      handleprocessSave(row) {
          this.$set(row, "$processEdit", false);
       },*/
      addRow(){
          var date = new Date();
          var year = date.getFullYear();
          var month = (date.getMonth() + 1).toString();
          var strDate = date.getDate();
          var hour = date.getHours();
          var min = date.getMinutes();
          var sec = date.getSeconds();
          if (month >= 1 && month <= 9) {
              month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
              strDate = "0" + strDate;
          }/*
          if (hour >= 0 && hour <= 9) {
              hour = "0" + strDate;
          }*/
          if (min >= 0 && min <= 9) {
              min = "0" + min;
          }
          if (sec >= 0 && sec <= 9) {
              sec = "0" + sec;
          }
          var currentdate = year + month + strDate + hour + min + sec
          console.log(year + month + strDate)
          console.log(currentdate)
          console.log(strDate)
          this.spData.push({
              $isEdit:false,
              $processEdit:false,
              spId:currentdate,
              spName:"新服务模式",
              spFunc:"",
              spField:"",
              context:"",
              new:true,
              spProcess:"",
          })

      },
        changePage (index) {
            // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
           let _start = (index - 1) * this.pageSize;
           let _end = index * this.pageSize;
           this.spData = this.spAllData.slice(_start, _end)
        },
        showimg (index) {
            let img = new Image();
            img.src = this.spData[index].imgurl;
            this.$Modal.info({
                title: '缩略图',
                width: img.width + 100,
                content: `<img src="${this.spData[index].imgurl}">`
            })
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
