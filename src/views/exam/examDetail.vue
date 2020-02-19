// 点击试卷后的缩略信息
<template>
  <div id="msg">
    <div class="title">
      <span>试卷列表</span>
      <span> {{examData.examCourse}}</span>
    </div>
    <div class="wrapper">
      <ul class="top">
        <li class="example">{{examData.examCourse}}</li>
        <li><i class="iconfont icon-pen-"></i></li>
        <li><i class="iconfont icon-share"></i></li>
        <li class="right">
          <div>
            <span class="count">总分</span>
            <span class="score">{{score[0]+score[1]+score[2]}}</span>
          </div>
        </li>
      </ul>
      <ul class="bottom">
        <li>更新于{{examData.examDate | converTime('YYYY-MM-DD')}}</li>
		&nbsp;
        <li>来自 {{examData.institute}}</li>
		&nbsp;
        <li class="btn">{{examData.examType}}</li>
        <li class="right"><el-button @click="toAnswer(examData.id,examData.paperId)">开始答题</el-button></li>
      </ul>
      <ul class="info">
        <li @click="dialogVisible = true"><a href="javascript:;"><i class="iconfont icon-info"></i>考生须知</a></li>
      </ul>
    </div>
    <div class="content">
      <el-collapse v-model="activeName" >
        <el-collapse-item class="header" name="0">
          <template slot="title" class="stitle" >
            <div class="title">
              <span>{{examData.examCourse}}</span><i class="header-icon el-icon-info"></i>
              <span class="time">总分：{{score[0]+score[1]+score[2]}} 分 / 时间{{examData.totalTime}}分钟</span>
              <el-button type="primary" size="small">点击查看试题详情</el-button>
            </div>
          </template>
          <el-collapse class="inner">
            <el-collapse-item>
              <template slot="title" name="1">
                <div class="titlei">填空题 (共{{topicCount[0]}}题 共计{{score[0]}}分)</div>
              </template>
              <div class="contenti">
                <ul class="question" v-for="(list, index) in topic[0]" :key="index">
                  <li>{{index+1}}. {{list.questionContent}} {{list.questionScore}}分</li>
                </ul>
              </div>
            </el-collapse-item>
            <el-collapse-item>
              <template slot="title" name="2">
                <div class="titlei">判断题 (共{{topicCount[1]}}题  共计{{score[1]}}分)</div>
              </template>
              <div class="contenti">
                <ul class="question" v-for="(list, index) in topic[1]" :key="index">
                  <li>{{topicCount[0]+index+1}}.{{list.questionContent}}  {{list.questionScore}}分</li>
                </ul>
              </div>
            </el-collapse-item>
            <el-collapse-item>
              <template slot="title" name="3">
                <div class="titlei">单选题 (共{{topicCount[2]}}题 共计{{score[2]}}分)</div>
              </template>
              <div class="contenti">
                <ul class="question" v-for="(list, index) in topic[2]" :key="index">
                  <li>{{topicCount[0]+topicCount[1]+index+1}}. {{list.questionContent}} {{list.questionScore}}分</li>
                </ul>
              </div>
            </el-collapse-item>
			<el-collapse-item>
			  <template slot="title" name="3">
			    <div class="titlei">多选题 (共{{topicCount[3]}}题 共计{{score[3]}}分)</div>
			  </template>
			  <div class="contenti">
			    <ul class="question" v-for="(list, index) in topic[3]" :key="index">
			      <li>{{topicCount[0]+topicCount[1]+topicCount[2]+index+1}}. {{list.questionContent}} {{list.questionScore}}分</li>
			    </ul>
			  </div>
			</el-collapse-item>
          </el-collapse>
        </el-collapse-item>
        
      </el-collapse>
    </div>
    <!--考生须知对话框-->
    <el-dialog
      title="考生须知"
      :visible.sync="dialogVisible"
      width="30%">
      <span>{{examData.examDesc}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from '../../utils/http'	
export default {
  data() {
    return {
      dialogVisible: false, //对话框属性
      activeName: '0',  //默认打开序号
      topicCount: [],//每种类型题目的总数
      score: [],  //每种类型分数的总数
      examData: { }, //考试信息
      topic: { }//试卷信息
    }
  },
  mounted() {
    this.getExamData()
	this.getTopicData()
  },
  methods: {
	async getExamData(){
		//根据考试安排ID，查询考试的相关信息
		let _this = this
		let examId = _this.$route.query.examId;   //考试安排ID
		let params = {
			id: examId
		}
		let data = await http.get('exam/getExamById',params);
		if (data.data.status === 200) {
			 let tmp = data.data.data
			 _this.examData = eval('(' + tmp + ')')
			 //console.log("examData--"+_this.examData)
		} else {
			_this.message(true,data.data.msg,'error')
			_this.examData = {}
		}
	},
	async getTopicData(){
		let paperId = this.$route.query.paperId; //试卷ID
		//根据试卷ID，查询试卷的信息
		let params = {
			paperId: paperId
		}
		let paperData = await http.get('paper/getPaperById',params);
		if (paperData.data.status === 200) {
			 this.topic = paperData.data.data
				 let keys = Object.keys(this.topic) //对象转数组
				 keys.forEach(e => {
				   let data = this.topic[e]
				   console.log("topic.data--"+data)
				   this.topicCount.push(data.length)
				   let currentScore = 0
				   for(let i = 0; i< data.length; i++) { //循环每种题型,计算出总分
				     console.log("data[i].questionScore--"+data[i].questionScore)
				     currentScore += data[i].questionScore-0
				   }
				   this.score.push(currentScore) //把每种题型总分存入score
				 })
		} else {
			this.message(true,data.data.msg,'error')
			this.topic = {}
		}	  
	},
    toAnswer(examId,paperId) {
      this.$router.push({path:"/answer",query:{examId: examId,paperId:paperId}})
    },
  }
}
</script>

<style lang="scss" scoped>
.bottom {
  .right{
    .el-button{
      color: #409EFF;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }
  }
}
.right {
  margin-left: auto;
}
.inner .contenti .question {
  margin-left: 40px;
  color: #9a9a9a;
  font-size: 14px;
}
.content .inner .titlei {
  margin-left: 20px;
  font-size: 16px;
  color: #88949b;
  font-weight: bold;
}
.content .title .time {
  font-size: 16px;
  margin-left: 420px;
  color: #999;
}
.content .stitle {
  background-color: #0195ff;
}
.content .title span {
  margin-right: 10px;
}
#msg .content .title {
  font-size: 20px;
  margin: 0px;
  display: flex;
  align-items: center;
}
.content {
  margin-top: 20px;
  background-color: #fff;
}
.content .header {
  padding: 10px 30px;
}
.wrapper .info {
  margin: 20px 0px 0px 20px;
  border-top: 1px solid #eee;
  padding: 20px 0px 10px 0px;
}
.wrapper .info a {
  color: #88949b;
  font-size: 14px;
}
.wrapper .info a:hover {
  color: #0195ff;
}
.wrapper .bottom .btn {
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #88949b;
  border-radius: 4px;
} 
.wrapper .bottom {
  display: flex;
  margin-left: 20px;
  color: #999;
  font-size: 14px;
  align-items: center;
}
.wrapper .bottom li {
  margin-right: 14px;
}
#msg {
  background-color: #eee;
  width: 980px;
  margin: 0 auto;
}
#msg .title {
  margin: 20px;
}
#msg .wrapper {
  background-color: #fff;
  padding: 10px;
}
.wrapper .top {
  display: flex;
  margin: 20px;
  align-items: center;
}
.wrapper .top .right {
  margin-left: auto;
}
.wrapper .top .example {
  color: #333;
  font-size: 22px;
  font-weight: 700;
}
.wrapper .top li i {
  margin-left: 20px;
  color: #88949b;
}
.wrapper .right .count {
  margin-right: 60px;
  color: #fff;
  padding: 4px 10px;
  background-color: #88949b;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border: 1px solid #88949b;
}
.wrapper .right .score {
  position: absolute;
  left: 53px;
  top: -5px;
  padding: 1px 12px;
  font-size: 20px;
  color: #88949b;
  border: 1px dashed #88949b;
  border-left: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  font-weight: bold;
}
.wrapper .right div {
  position: relative;
}
</style>
