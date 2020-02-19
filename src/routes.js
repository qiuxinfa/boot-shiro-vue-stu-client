import Test from './views/test/Test.vue'
import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import UserList from './views/user/UserList.vue'
import PermiList from './views/permission/PermisList.vue'
import RoleList from './views/permission/RoleList.vue'
import DictionaryList from './views/dictionary/DictionaryList.vue'
import OperatingRecord from './views/system/OperatingRecord.vue'
import Statistics from './views/system/Statistics.vue'
import LoginLog from './views/system/LoginLog.vue'
import Ueditor from './views/ueditor.vue'
import InstituteList from './views/institute/InstituteList.vue'
import MajorList from './views/major/MajorList.vue'
import ClazzList from './views/clazz/ClazzList.vue'
import StudentList from './views/student/StudentList.vue'
import TeacherList from './views/teacher/TeacherList.vue'
import CourseList from './views/course/CourseList.vue'
import MyCourseList from './views/mycourse/MyCourseList.vue'
import CourseCenter from './views/coursecenter/CourseCenter.vue'
import GradeCenter from './views/grade/GradeCenter.vue'
import myExam from './views/exam/myExam.vue'
import examDetail from './views/exam/examDetail.vue'
import answer from './views/exam/answer.vue'
import paperManager from './views/exam/paperManager.vue'
import questionManager from './views/exam/questionManager.vue'

let router = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'icon iconfont icon-yonghurenxiang',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/user/list', component: UserList, name: '用户列表' },
            { path: '/ueditor', component: Ueditor, name: '富文本测试' },
        ]
    },
	{
	    path: '/',
	    component: Home,
	    name: '考试管理',
	    children: [
	        { path: '/paper', component: paperManager, name: '考试管理'},
	        { path: '/question', component: questionManager, name: '题库管理' }
	    ]
	},
    {
        path: '/',
        component: Home,
        name: '权限管理',
        iconCls: 'icon iconfont icon-Slice',
        children: [
            { path: '/perms/list', component: PermiList, name: '菜单列表' },
            { path: '/role/list', component: RoleList, name: '角色权限' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '数据字典',
        iconCls: 'icon iconfont icon-dic-manager',
        children: [
            { path: '/dict/list', component: DictionaryList, name: '字典属性' },
        ]
    },
	{
	    path: '/',
	    component: Home,
	    name: '学院管理',
	    iconCls: 'icon iconfont icon-dic-manager',
	    children: [
	        { path: '/institute/list', component: InstituteList, name: '学院列表' },
	    ]
	},
	{
	    path: '/',
	    component: Home,
	    name: '专业管理',
	    iconCls: 'icon iconfont icon-dic-manager',
	    children: [
	        { path: '/major/list', component: MajorList, name: '专业列表' },
	    ]
	},	
	{
	    path: '/',
	    component: Home,
	    name: '班级管理',
	    iconCls: 'icon iconfont icon-dic-manager',
	    children: [
	        { path: '/clazz/list', component: ClazzList, name: '班级列表' },
	    ]
	},	
	{
	    path: '/',
	    component: Home,
	    name: '学生管理',
	    iconCls: 'icon iconfont icon-dic-manager',
	    children: [
	        { path: '/student/list', component: StudentList, name: '学生列表' },
	    ]
	},	
	{
	    path: '/',
	    component: Home,
	    name: '老师管理',
	    iconCls: 'icon iconfont icon-dic-manager',
	    children: [
	        { path: '/teacher/list', component: TeacherList, name: '老师列表' },
	    ]
	},		
	{
	    path: '/',
	    component: Home,
	    name: '课程管理',
	    iconCls: 'icon iconfont icon-dic-manager',
	    children: [
	        { path: '/course/list', component: CourseList, name: '课程列表' },
	    ]
	},		
	{
	    path: '/',
	    component: Home,
	    name: '个人中心',
	    iconCls: 'icon iconfont icon-dic-manager',
	    children: [
	        { path: '/course/mycourse', component: MyCourseList, name: '我的课程' },
			{ path: '/exam', component: myExam, name: '我的考试' },
			{ path: '/examDetail', component: examDetail, name: '考试详情' },
			{ path: '/answer', component: answer, name: '考试答题' }
	    ]
	},	
	{
	    path: '/',
	    component: Home,
	    name: '个人中心',
	    iconCls: 'icon iconfont icon-dic-manager',
	    children: [
	        { path: '/course/center', component: CourseCenter, name: '课程中心' },
	    ]
	},	
	{
	    path: '/',
	    component: Home,
	    name: '个人中心',
	    iconCls: 'icon iconfont icon-dic-manager',
	    children: [
	        { path: '/grade/center', component: GradeCenter, name: '成绩统计' },
	    ]
	},						
    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'icon iconfont icon-xitongguanli',
        children: [
            { path: '/sys/operateRecord', component: OperatingRecord, name: '操作记录' },
            { path: '/sys/loginLog', component: LoginLog, name: '登陆日志' },
            { path: '/sys/statistics', component: Statistics, name: '统计图表' },

        ]
    },
    {
        path: '/',
        component: Home,
        name: 'TEST',
        iconCls: 'icon iconfont icon-ceshi',
        children: [
            { path: '/Test', component: Test, name: '测试页面' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];


export default router;
