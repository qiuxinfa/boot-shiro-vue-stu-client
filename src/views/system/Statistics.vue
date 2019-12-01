<template>
    <section class="chart-container">
        <el-row>
            <el-col :span="18">
                <div id="userLoginTotale" style="width:100%; height:600px;margin-left:200px"></div>
            </el-col>
            <el-col :span="18">
                <div id="reqTotal" style="width:100%; height:600px;margin-left:200px"></div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'
    import http from '../../utils/http'
    export default {
        data() {
            return {
                userName: ["橘子", "香蕉", "苹果", "椰子", "木瓜", "槟榔"],
                loginTotal: [5, 20, 36, 10, 10, 20],
                arrNa: ['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他'],
                reqData1: [
                    {value:335, name:'直达', selected:true},
                    {value:679, name:'营销广告'},
                    {value:1548, name:'搜索引擎'}
                ],
                reqData2: [
                    {value:335, name:'直达'},
                    {value:310, name:'邮件营销'},
                    {value:234, name:'联盟广告'},
                    {value:135, name:'视频广告'},
                    {value:1048, name:'百度'},
                    {value:251, name:'谷歌'},
                    {value:147, name:'必应'},
                    {value:102, name:'其他'}
                ]
            }
        },

        methods: {
          // 统计用户登录次数
          async getUserLoginTotal () {
            let _this = this
            let data = await http.get('SysApi/v1/findUserLoginTotal')

            if(!data.data) {
    					return
    				}

            if (data.data.status === 200) {
               _this.userName = data.data.data[0].name
               _this.loginTotal = data.data.data[0].total
            } else {
              const h = this.$createElement;
              this.$notify({
                title: '没有权限查看登录统计',
                message: h('i', { style: 'color: teal'}, '当前登录统计的数据为模拟数据')
              })
            }
            _this.drawColumnChart()
          },
          // 统计用户访问
          async getUserReqTotal () {
            let _this = this
            let data = await http.get('SysApi/v1/findUserReqTotal')

            if(!data.data) {
              _this.listLoading = false
              return
            }

            if (data.data.status === 200) {
               _this.arrNa = data.data.data[0].arrName
               _this.reqData1 = data.data.data[0].metlist
               _this.reqData2 = data.data.data[0].usrlist
            } else {
              const h = this.$createElement;
              this.$notify({
                title: '没有权限查看访问统计',
                message: h('i', { style: 'color: teal'}, '当前访问统计的数据为模拟数据')
              });
            }
            _this.drawBarChart()
          },
            drawColumnChart() {
                var userLoginTotal = echarts.init(document.getElementById('userLoginTotale'));
                userLoginTotal.setOption({
                  title: { text: '登录统计' },
                  tooltip: {},
                  xAxis: {
                      name: '用户',
                      data: this.userName // 用户[]
                  },
                  yAxis: {
                    name: '登录次数'
                  },
                  series: [{
                      name: '登陆次数',
                      type: 'bar',
                      data: this.loginTotal // 登录次数[]
                    }]
                });
            },
            drawBarChart() {
                var reqTotal = echarts.init(document.getElementById('reqTotal'));
                reqTotal.setOption({
                  title: { text: '请求统计' },
                  tooltip: {
                      trigger: 'item',
                      formatter: "{a} <br/>{b}: {c} ({d}%)"
                  },
                  legend: {
                      orient: 'vertical',
                      x: 'right',
                      data: this.arrNa
                  },
                  series: [
                      {
                          name:'请求方式',
                          type:'pie',
                          selectedMode: 'single',
                          radius: [0, '30%'],

                          label: {
                              normal: {
                                  position: 'inner'
                              }
                          },
                          labelLine: {
                              normal: {
                                  show: false
                              }
                          },
                          data: this.reqData1
                      },
                      {
                          name:'请求次数',
                          type:'pie',
                          radius: ['40%', '55%'],
                          label: {
                              normal: {
                                  formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                                  backgroundColor: '#eee',
                                  borderColor: '#aaa',
                                  borderWidth: 1,
                                  borderRadius: 4,
                                  // shadowBlur:3,
                                  // shadowOffsetX: 2,
                                  // shadowOffsetY: 2,
                                  // shadowColor: '#999',
                                  // padding: [0, 7],
                                  rich: {
                                      a: {
                                          color: '#999',
                                          lineHeight: 22,
                                          align: 'center'
                                      },
                                      // abg: {
                                      //     backgroundColor: '#333',
                                      //     width: '100%',
                                      //     align: 'right',
                                      //     height: 22,
                                      //     borderRadius: [4, 4, 0, 0]
                                      // },
                                      hr: {
                                          borderColor: '#aaa',
                                          width: '100%',
                                          borderWidth: 0.5,
                                          height: 0
                                      },
                                      b: {
                                          fontSize: 16,
                                          lineHeight: 33
                                      },
                                      per: {
                                          color: '#eee',
                                          backgroundColor: '#334455',
                                          padding: [2, 4],
                                          borderRadius: 2
                                      }
                                  }
                              }
                          },
                          data: this.reqData2
                      }
                  ]
                });
            },
            /**
      			 * ifshow: true/false msg: message  type: error/warning/success
      			 */
      			message(ifshow,msg,type) {
      				this.$message({
      					showClose: ifshow,
      					message: msg,
      					type: type
      				})
      			}
        },
        mounted: function () {
          this.getUserLoginTotal()
          this.getUserReqTotal()
        },
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }
</style>
