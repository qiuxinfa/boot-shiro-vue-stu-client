<!--考生答题界面-->
<template>
  <div id="answer">
    <!--顶部信息栏-->
     <div class="top">
       <ul class="item">
         <li><i class="iconfont icon-menufold icon20" ref="toggle" @click="slider_flag = !slider_flag"></i></li>
         <li>{{examData.questionType}}-{{examData.questionCourse}}</li>
<!--         <li @click="flag = !flag">
           <i class="iconfont icon-user icon20"></i>
           <div class="msg"  v-if="flag" @click="flag = !flag">
             <p>姓名：{{userInfo.name}}</p>
             <p>准考证号:  {{userInfo.id}}</p>
           </div>
         </li> -->
         <li><i class="iconfont icon-arrLeft icon20"></i></li>
       </ul>
     </div>
     <div class="flexarea">
        <!--左边题目编号区-->
        <transition name="slider-fade">
          <div class="left" v-if="slider_flag">
            <ul class="l-top">
              <li>
                <a href="javascript:;"></a>
                <span>当前</span>
              </li>
              <li>
                <a href="javascript:;"></a>
                <span>未答</span>
              </li>
              <li>
                <a href="javascript:;"></a>
                <span>已答</span>
              </li>
              <li>
                <a href="javascript:;"></a>
                <span>标记</span>
              </li>
            </ul>
            <div class="l-bottom">
			  <div class="item">
			    <p>填空题部分</p>
			    <ul>
			      <li v-for="(list, index1) in topic[0]" :key="index1">
			        <a href="javascript:;" @click="fill(index1)" :class="{'border': index == index1 && currentType == 0,'bg': fillAnswer[index1][3] != 0}"><span :class="{'mark': topic[0][index1].isMark == true}"></span>{{index1+1}}</a>
			      </li>
			    </ul>
			  </div>	
			  <div class="item">
			    <p>判断题部分</p>
			    <ul>
			      <li v-for="(list, index2) in topic[1]" :key="index2">
			        <a href="javascript:;" @click="judge(index2)" :class="{'border': index == index2 && currentType == 1,'bg': bg_flag && topic[1][index2].isClick == true}"><span :class="{'mark': topic[1][index2].isMark == true}"></span>{{topicCount[0]+index2+1}}</a>
			      </li>
			    </ul>
			  </div>
              <div class="item">
                <p>单选题部分</p>
                <ul>
                  <li v-for="(list, index3) in topic[2]" :key="index3">
                    <a href="javascript:;" 
                      @click="change(index3)"
                      :class="{'border': index == index3 && currentType == 2,'bg': bg_flag && topic[2][index3].isClick == true}">
                      <span :class="{'mark': topic[2][index3].isMark == true}"></span>
                      {{topicCount[0]+topicCount[1]+index3+1}}
                    </a>
                  </li>
                </ul>
              </div>
              <div class="final" @click="commit()">结束考试</div>
            </div>
          </div>
        </transition>  
        <!--右边选择答题区-->
        <transition name="slider-fade">
        <div class="right">
          <div class="title">
            <p>{{title}}</p>
            <i class="iconfont icon-right auto-right"></i>
            <span>全卷共{{topicCount[0] + topicCount[1] + topicCount[2]}}题  <i class="iconfont icon-time"></i>倒计时：<b>{{time}}</b>分钟</span>
          </div>
          <div class="content">
            <p class="topic"><span class="number">{{number}}</span>{{showQuestion}}</p>
            <div class="fill" v-if="currentType == 0">
              <div v-for="(item,currentIndex) in part" :key="currentIndex">
                <el-input placeholder="请填在此处"
                  v-model="fillAnswer[index][currentIndex]"
                  clearable
                  @blur="fillBG">
                </el-input>
              </div>
              <div class="analysis" v-if="isPractice">
                <ul>
                  <li> <el-tag type="success">正确姿势：</el-tag><span class="right">{{topic[0][index].questionAnswer}}</span></li>
                  <li><el-tag>题目解析：</el-tag></li>
                  <li>{{topic[0][index].questionExplain == null ? '暂无解析': topic[0][index].questionExplain}}</li>
                </ul>
              </div>
            </div>
            <div class="judge" v-if="currentType == 1">
              <el-radio-group v-model="judgeAnswer[index]" @change="getJudgeLabel">
                <el-radio :label="1">正确</el-radio>
                <el-radio :label="2">错误</el-radio>
              </el-radio-group>
              <div class="analysis" v-if="isPractice">
                <ul>
                  <li> <el-tag type="success">正确姿势：</el-tag><span class="right">{{topic[1][index].questionAnswer}}</span></li>
                  <li><el-tag>题目解析：</el-tag></li>
                  <li>{{topic[1][index].questionExplain == null ? '暂无解析': topic[1][index].questionExplain}}</li>
                </ul>
              </div>
            </div>
			<div v-if="currentType == 2">
			  <el-radio-group v-model="radio[index]" @change="getChangeLabel" >
			    <el-radio :label="1">{{showAnswer.choiceA}}</el-radio>
			    <el-radio :label="2">{{showAnswer.choiceB}}</el-radio>
			    <el-radio :label="3">{{showAnswer.choiceC}}</el-radio>
			    <el-radio :label="4">{{showAnswer.choiceD}}</el-radio>
			  </el-radio-group>
			  <div class="analysis" v-if="isPractice">
			    <ul>
			      <li> <el-tag type="success">正确姿势：</el-tag><span class="right">{{reduceAnswer.rightAnswer}}</span></li>
			      <li><el-tag>题目解析：</el-tag></li>
			      <li>{{reduceAnswer.questionExplain == null ? '暂无解析': reduceAnswer.questionExplain}}</li>
			    </ul>
			  </div>
			</div>
          </div>
          <div class="operation">
            <ul class="end">
              <li @click="previous()"><i class="iconfont icon-previous"></i><span>上一题</span></li>
              <li @click="mark()"><i class="iconfont icon-mark-o"></i><span>标记</span></li>
              <li @click="next()"><span>下一题</span><i class="iconfont icon-next"></i></li>
            </ul>
          </div>
        </div>
        </transition>
     </div> 
  </div>
</template>

<script>
import store from '@/vuex/store'
import {mapState} from 'vuex'
import http from '../../utils/http'	

export default {
  store,
  data() {
    return {
      startTime: null, //考试开始时间
      endTime: null, //考试结束时间
      time: null, //考试持续时间
      reduceAnswer:[],  //vue官方不支持3层以上数据嵌套,如嵌套则会数据渲染出现问题,此变量直接接收3层嵌套时的数据。
      answerScore: 0, //答题总分数
      bg_flag: false, //已答标识符,已答改变背景色
      isFillClick: false, //选择题是否点击标识符
      slider_flag: true, //左侧显示隐藏标识符
      flag: false, //个人信息显示隐藏标识符
      currentType: 0, //当前题型类型   0--填空题  1--判断题  2--单选题  3--多选题
      radio: [], //保存考生所有选择题的选项
      title: "请在横线处填写答案",
      index: 0, //全局index
      userInfo: { //用户信息
        name: null,
        id: null
      },
      topicCount: [],//每种类型题目的总数
      score: [],  //每种类型分数的总数
      examData: { //考试信息
        // source: null,
        // totalScore: null,
      },
      topic: {  //试卷信息

      },
      showQuestion: [], //当前显示题目信息
      showAnswer: {}, //当前题目对应的答案选项
      number: 1, //题号
      part: null, //填空题的空格数量
      fillAnswer: [[]], //二维数组保存所有填空题答案
      judgeAnswer: [], //保存所有判断题答案
      topic1Answer: [],  //学生选择题作答编号,
      rightAnswer: ''
    }
  },
  created() {
    // this.getCookies()
    this.getExamData()
	this.getTopicData()
    this.showTime()
  },
  methods: {
    getCookies() {  //获取cookie
      // this.userInfo.name = this.$cookies.get("cname")
      // this.userInfo.id = this.$cookies.get("cid")
    },
    calcuScore() { //计算答题分数
      
    },
	async getExamData(){
		//根据考试安排ID，查询考试的相关信息
		let _this = this
		_this.startTime = new Date().getTime()
		let examId = _this.$route.query.examId;   //考试安排ID
		let params = {
			id: examId
		}
		let data = await http.get('exam/getExamById',params);
		if (data.data.status === 200) {
			 let tmp = data.data.data
			 _this.examData = eval('(' + tmp + ')')
			_this.index = 0
			_this.time = _this.examData.totalTime //获取分钟数
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
			  let reduceAnswer = this.topic[2][this.index]
			  this.reduceAnswer = reduceAnswer
			  let keys = Object.keys(this.topic) //对象转数组
			  keys.forEach(e => {
				let data = this.topic[e]
				this.topicCount.push(data.length)
				let currentScore = 0
				for(let i = 0; i< data.length; i++) { //循环每种题型,计算出总分
				  currentScore += data[i].questionScore
				}
				this.score.push(currentScore) //把每种题型总分存入score
			  })
			  let len = this.topicCount[0]
			  let father = []
			  for(let i = 0; i < len; i++) { //根据填空题数量创建二维空数组存放每道题答案
				let children = [null,null,null,0]
				father.push(children)
			  }
			  this.fillAnswer = father
			  let dataInit = this.topic[0]
			  this.number = 1
			  this.showQuestion = dataInit[0].questionContent
			  this.showAnswer = dataInit[2]
			  this.fill(0)
		} else {
			this.message(true,data.data.msg,'error')
			this.topic = {}
		}	  
	},
    change(index) { //选择题
      this.index = index
	  //点了上一题按钮，回到了判断题的最后一题
	  if(this.index < 0){
		  this.index = this.topic[1].length-1
		  this.judge(this.index)
	  }else if(this.index == this.topic[2].length){
		  //点了下一题按钮，回到了填空题的第一题（暂时没有考虑多选，不然下一题就是多选的第一题）
		  this.index = 0
		  this.fill(0)
	  }else{
		  //在选择题的范围内
		  let reduceAnswer = this.topic[2][this.index]
		  this.reduceAnswer = reduceAnswer
		  this.isFillClick = true
		  this.currentType = 2
		  this.title = "请选择正确的选项"
		  let Data = this.topic[2]
		  this.showQuestion = Data[this.index].questionContent //获取题目信息
		  this.showAnswer = Data[this.index]
		  this.number = this.topicCount[0] + this.topicCount[1] + this.index + 1
	  }
    },
    fillBG() { //填空题已答题目 如果已答该题目,设置第四个元素为需要填空的个数
      if(this.fillAnswer[this.index][0] != null || this.fillAnswer[this.index][1] != null || this.fillAnswer[this.index][2] != null) {
        this.fillAnswer[this.index][3] = this.part
      }
    },
    fill(index) { //填空题
      let len = this.topic[0].length
      this.index = index
	  // 点了上一题，且上一题为选择题的最后一题
	  if(index < 0){
		  this.index = this.topic[2].length-1
		  alert("fill index "+this.index)
		  this.change(this.index)
	  }else if(index == len){
		  //点了下一题，且下一题为判断题的第一题
		  this.index = 0
		  this.judge(0)
	  }else{
		  //在填空题的范围内
		  this.currentType = 0
          this.title = "请在横线处填写答案"
          let Data = this.topic[0]
          this.showQuestion = Data[index].questionContent //获取题目信息
          let part= this.showQuestion.split("()").length -1 //根据题目中括号的数量确定填空横线数量
          this.part = part
          this.number = index + 1		  
	  }
    },
    judge(index) { //判断题
      let len = this.topic[1].length
      this.index = index
	  //点了上一题，且上一题为填空题的最后一题
	  if(index < 0){
		  this.index = this.topic[0].length-1
		  this.fill(this.index)
	  }else if(index == len){
		  // 点了下一题，且下一题为单选题的第一题
		  this.index = 0
		  this.change(0)
	  }else{
		  //在判断题的范围内
		  this.currentType = 1
		  this.title = "请作出正确判断"
		  let Data = this.topic[1]
		  this.showQuestion = Data[index].questionContent //获取题目信息
		  this.number = this.topicCount[0]+ index + 1
	  }
    },
    getChangeLabel(val) { //获取选择题作答选项
      this.radio[this.index] = val //当前选择的序号
      if(val) {
        let data = this.topic[2]
        this.bg_flag = true
        data[this.index]["isClick"] = true
      }
      /* 保存学生答题选项 */
      this.topic1Answer[this.index] = val 
    },
    getJudgeLabel(val) {  //获取判断题作答选项
      this.judgeAnswer[this.index] = val
      if(val) {
        let data = this.topic[1]
        this.bg_flag = true
        data[this.index]["isClick"] = true
      }
    },
    previous() { //上一题
      this.index --
      switch(this.currentType) {
        case 0: 
		  this.fill(this.index)
          break
        case 1: 
          this.judge(this.index)
          break
        case 2:
          this.change(this.index)
          break
      }
    },
    next() { //下一题
      this.index ++
      switch(this.currentType) {
        case 0: 
		  this.fill(this.index)
          break
        case 1: 
          this.judge(this.index)
          break
        case 2:
          this.change(this.index)
          break
      }
    },
    mark() { //标记功能
      switch(this.currentType) {
        case 0:
		  this.topic[0][this.index]["isMark"] = true //填空题标记
          break
        case 1:
          this.topic[1][this.index]["isMark"] = true //判断题标记
          break
        case 2:
          this.topic[2][this.index]["isMark"] = true //选择题标记
      }
    },
    commit() { 
	  //最终得分
	  let finalScore = 0
      /**计算填空题总分 */
      let fillAnswer = this.fillAnswer
	  let joinAnswerFill =""
      fillAnswer.forEach((element,index) => { //此处index和 this.index数据不一致，注意
	    console.log("element："+element)
		//如果答了题，element[3]不为0
		if(element[3] != 0 ){
			//如果3个空的填空题
			if(element[3] == 3){
			  let cnt = 0   // 正确的个数	
			  if(this.topic[0][index].questionAnswer.includes(element[0])) { //判断填空答案是否与数据库一致
				console.log("第一空正确")
				cnt++
			  }
			  if(this.topic[0][index].questionAnswer.includes(element[1])) { //判断填空答案是否与数据库一致
				console.log("第二空正确")
				cnt++
			  }
			  if(this.topic[0][index].questionAnswer.includes(element[2])) { //判断填空答案是否与数据库一致
				console.log("第三空正确")
				cnt++
			  }
			  finalScore += (this.topic[0][this.index].questionScore-0)/3*cnt		
			  //答题记录：题与题之间用*号分隔，同一个题的2个空之间用#号分隔
			  joinAnswerFill += element[0] + "#" + element[1] + "#" + element[2] + "*"
			}else if(element[3] == 2){
			 //如果2个空的填空题
			  let cnt = 0   // 正确的个数	
			  if(this.topic[0][index].questionAnswer.includes(element[0])) { //判断填空答案是否与数据库一致
				console.log("第一空正确")
				cnt++
			  }
			  if(this.topic[0][index].questionAnswer.includes(element[1])) { //判断填空答案是否与数据库一致
				console.log("第二空正确")
				cnt++
			  }
			  finalScore += (this.topic[0][this.index].questionScore-0)/2*cnt		
			  //答题记录：题与题之间用*号分隔，同一个题的2个空之间用#号分隔
			  joinAnswerFill += element[0] + "#" + element[1] + "*"		  
			}else{
			 //如果1个空的填空题
			  if(this.topic[0][index].questionAnswer.includes(element[0])) { //判断填空答案是否与数据库一致
				console.log("第一空正确")
				finalScore += this.topic[0][this.index].questionScore-0	
				//答题记录：题与题之间用*号分隔，同一个题的2个空之间用#号分隔
				joinAnswerFill += element[0] + element[1] + "*"	
			  }				
			}
 
		}else{
			//没有答题的也要记录下来
			//答题记录：题与题之间用*号分隔，同一个题的2个空之间用#号分隔
			joinAnswerFill += "?" + element[1] + "*"	
		}
      });
      /** 计算判断题总分 */
      let topic3Answer = this.judgeAnswer
	  let joinAnswerJudge = ""
      topic3Answer.forEach((element,index) => {
        let right = null
        switch(element) {
          case 1:
            right = "T"
            break
          case 2:
            right = "F"
		  default:
		    right = "?"
        }
		joinAnswerJudge += right + "*"
        if(right == this.topic[1][index].questionAnswer) { // 当前选项与正确答案对比
            finalScore += this.topic[1][index].questionScore-0 // 计算总分数
          }
      })
	  /* 计算选择题总分 */
	  let topic1Answer = this.topic1Answer
	  let singleAnswer = "";
	  topic1Answer.forEach((element,index) => { //循环每道选择题根据选项计算分数
	    let right = null
	    if(element != null) {
	      switch(element) { //选项1,2,3,4 转换为 "A","B","C","D"
	        case 1:
	          right = "A"
	          break
	        case 2:
	          right = "B"
	          break
	        case 3:
	          right = "C"
	          break
	        case 4:
	          right = "D"
			default: 
			  right = "?"
	      }
		  singleAnswer += right +"*";
	      if(right == this.topic[2][index].questionAnswer) { // 当前选项与正确答案对比
	        finalScore += this.topic[2][index].questionScore-0 // 计算总分数
	      }
	    }
	  })

      if(this.time != 0) {
        this.$confirm("考试结束时间未到,是否提前交卷","友情提示",{
          confirmButtonText: '立即交卷',
          cancelButtonText: '再检查一下',
          type: 'warning'
        }).then(() => {
			
			
          console.log("交卷")
          this.endTime = new Date().getTime()
		  //相差的毫秒数
		  let ms = this.endTime - this.startTime
		  //相差的分钟数
		  let joinTimeCost = Math.round(ms/1000.0/60)
          //提交成绩信息
		  let data = {
		    examId: this.examData.id, //考试安排ID
		    joinTimeCost: joinTimeCost, //考试实际用的时间，单位是分钟
		    joinScore: finalScore,  //考试总分
		    joinAnswerFill:  joinAnswerFill,   //考生填空题答案
		    joinAnswerJudge: joinAnswerJudge,   //考生判断题答案
		    joinAnswerSingle: singleAnswer,   //考生单选题答案
		    joinAnswerMultiple: ''          //考生多选题答案 
		  }
		  this.addExamRecord(data)
			
		}).catch(() => {
          console.log("继续答题")
        })
      }
    },
    showTime() { //倒计时
      setInterval(() => {
        this.time -= 1
        if(this.time == 10) {
          this.$message({
            showClose: true,
            type: 'error',
            message: '考生注意,考试时间还剩10分钟！！！'
          })
          if(this.time == 0) {
			this.commit()
            console.log("考试时间已到,强制交卷。")
          }
        }
      },1000 * 60)
    },
	async addExamRecord(data){
	    let resData = await http.post('/exam/record/add',data)
		alert(resData.data.msg)
		//回到试卷列表页面
        this.$router.push({path:'/exam'})
	},
	message(ifshow,msg,type) {
		this.$message({
			showClose: ifshow,
			message: msg,
			type: type
		})
	}
  },
  computed:mapState(["isPractice"])
}
</script>

<style lang="scss">
.iconfont.icon-time {
  color: #2776df;
  margin: 0px 6px 0px 20px;
}
.analysis {
  margin-top: 20px;
  .right {
    color: #2776df;
    font-size: 18px;
    border: 1px solid #2776df;
    padding: 0px 6px;
    border-radius: 4px;
    margin-left: 20px;
  }
  ul li:nth-child(2) {
    margin: 20px 0px;
  }
  ul li:nth-child(3) {
    padding: 10px;
    background-color: #d3c6c9;
    border-radius: 4px;
  }
}
.analysis span:nth-child(1) {
  font-size: 18px;
}
.mark {
  position: absolute;
  width: 4px;
  height: 4px;
  content: "";
  background-color: red;
  border-radius: 50%;
  top: 0px;
  left: 22px;
}
.border {
  position: relative;
  border: 1px solid #FF90AA !important;
}
.bg {
  background-color: #5188b8 !important;
}
.fill .el-input {
  display: inline-flex;
  width: 150px;
  margin-left: 20px;
  .el-input__inner {
    border: 1px solid transparent;
    border-bottom: 1px solid #eee;
    padding-left: 20px;
  }
}
/* slider过渡效果 */
.slider-fade-enter-active {
  transition: all .3s ease;
}
.slider-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slider-fade-enter, .slider-fade-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}

.operation .end li:nth-child(2) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgb(39, 118, 223);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: #fff;
}
.operation .end li {
  cursor: pointer;
  margin: 0 100px;
}
.operation {
  background-color: #fff;
  border-radius: 4px;
  padding: 10px 0px;
  margin-right: 10px;
}
.operation .end {
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(39, 118, 223);
}
.content .number {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  background-color: rgb(39, 118, 223);
  border-radius: 4px;
  margin-right: 4px;
}
.content {
  padding: 0px 20px;
}
.content .topic {
  padding: 20px 0px;
  padding-top: 30px; 
}
.right .content {
  background-color: #fff;
  margin: 10px;
  margin-left: 0px;
  height: 470px;
}
.content .el-radio-group label {
  color: #000;
  margin: 5px 0px;
}
.content .el-radio-group {
  display: flex;
  flex-direction:column;
}
.right .title p {
  margin-left: 20px;
}
.flexarea {
  display: flex;
}
.flexarea .right {
  flex: 1;
}
.auto-right {
  margin-left: auto;
  color: #2776df;
  margin-right: 10px;
}
.right .title {
  margin-right: 10px;
  padding-right: 30px;
  display: flex;
  margin-top: 10px;
  background-color: #fff;
  height: 50px;
  line-height: 50px;
}
.clearfix {
  clear: both;
}
.l-bottom .final {
  cursor: pointer;
  display: inline-block;
  text-align: center;
 background-color: rgb(39, 118, 223);
  width: 240px;
  margin: 20px 0px 20px 10px;
  border-radius: 4px;
  height: 30px;
  line-height: 30px;
  color: #fff;
  margin-top: 22px;
}
#answer .left .item {
  padding: 0px;
  font-size: 16px;
}
.l-bottom {
  border-radius: 4px;
  background-color: #fff;
}
.l-bottom .item p {
  margin-bottom: 15px;
  margin-top: 10px;
  color: #000;
  margin-left: 10px;
  letter-spacing: 2px;
}
.l-bottom .item li {
  width: 15%;
  margin-left: 5px;
  margin-bottom: 10px;
}
.l-bottom .item {
  display: flex;
  flex-direction: column;
}
.l-bottom .item ul {
  width: 100%;
  margin-bottom: -8px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.l-bottom .item ul li a { 
  position: relative;
  justify-content: center;
  display: inline-flex;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #eee;
  text-align: center;
  color: #000;
  font-size: 16px;
}
.left .l-top {
  display: flex;
  justify-content: space-around;
  padding: 16px 0px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #fff;
}
.left {
  width: 260px;
  height: 100%;
  margin: 10px 10px 0px 10px;
}
.left .l-top li:nth-child(2) a {
  border: 1px solid #eee;
}
.left .l-top li:nth-child(3) a {
  background-color: #5188b8;
  border: none;
}
.left .l-top li:nth-child(4) a {
  position: relative;
  border: 1px solid #eee;
}
.left .l-top li:nth-child(4) a::before {
  width: 4px;
  height: 4px;
  content: " ";
  position: absolute;
  background-color: red;
  border-radius: 50%;
  top: 0px;
  left: 16px;
}
.left .l-top li {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.left .l-top li a {
  display: inline-block;
  padding: 10px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #FF90AA;
}
#answer .top {
  background-color: rgb(39, 118, 223);
}
#answer .item {
  color: #fff;
  display: flex;
  padding: 20px;
  font-size: 20px;
}
#answer .top .item li:nth-child(1) {
  margin-right: 10px;
}
#answer .top .item li:nth-child(3) {
  position: relative;
  margin-left: auto;
}
#answer {
  padding-bottom: 30px;
}
.icon20 {
  font-size: 20px;
  font-weight: bold;
}
.item .msg {
  padding: 10px 15px;
  border-radius: 4px;
  top: 47px;
  right: -30px;
  color: #6c757d;
  position: absolute;
  border: 1px solid rgba(0,0,0,.15);
  background-color: #fff;
}
.item .msg p {
  font-size: 16px;
  width: 200px;
  text-align: left;
}
</style>
