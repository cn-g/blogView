<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-tickets"></i>
        </div>
        <div class="logo">博客园</div>
        <div class="header-midder">
            <el-input placeholder="请输入内容" v-model="text.content" @focus="search" @blur="blur" class="input-with-select" style="width:500px" >
                <template #append>
                    <el-button icon="el-icon-search"></el-button>
                </template>
            </el-input>
            <el-card  style="position:relative;z-index:8" class="box-card">
                <el-row :gutter="12">
                    <el-col :span="12">
                        <el-card shadow="never" class="box-card">
                            <template #header class="clearfix">
                                <span>热门搜索</span>
                            </template>
                            <div v-for="item in searchList" :key="item.keyWord" class="text item">
                                {{item.keyWord}}
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="never" class="box-card">
                            <template #header class="clearfix">
                                <span>历史搜索</span>
                            </template>
                        </el-card>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <div class="header-right">
            <div v-if="!userId">
                <span class="loginStatus">
                    <el-button type="text" @click="toLogin" style="color:#303133">点击登录</el-button>
                </span>
            </div>
            <div class="header-user-con" v-else>
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img :src="userInfo.picUrl" />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{userInfo.account}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="user">个人中心</el-dropdown-item>
                            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
    <div class="recommend" v-if="editVisible">
        <el-card class="box-card">
            <template #header class="clearfix">
                <span>热门博客榜单</span>
            </template>
            <div v-for="blog in blogRecommendList" :key="blog.id" class="text item">
                {{blog.blogTitle}}
            </div>
        </el-card>
        <el-card class="box-card">
            <template #header class="clearfix">
                <span>热门博主榜单</span>
            </template>
            <div v-for="user in userRecommendList" :key="user.id" class="text item">
                {{ user.blogUserName }}
            </div>
        </el-card>
    </div>
</template>
<script>
import { computed, onMounted, reactive,ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getAccount,getHomeRecommendList,getHomeUserRecommendList,getHomeSearchList } from "../api/index";
import { ElMessage } from 'element-plus';
export default {
    setup() {
        const router = useRouter();
        const userId = localStorage.getItem("user_id");
        const message = 2;
        const  isSearch = ref(false);
        // const search = reactive({
        //     focus:''
        // });
        const search = ()=>{
            isSearch.value = true;
        };
        const blur = ()=>{
            isSearch.value = false;
        };
        let userInfo = reactive({
            id:"",
            account: "",
            picUrl:""
        });
        let text = reactive({
            content:""
        });
        const toLogin = ()=>{
            router.push("/login");
        };
        const store = useStore();
        const collapse = computed(() => store.state.collapse);
        // 图标事件
        const collapseChage = () => {
            router.push("/");
        };
        let idData = reactive({
            id:"",
        });
        const editVisible = ref(false);
        const getEdit = ()=>{
            if(router.currentRoute.value.name == 'dashboard'){
                editVisible.value = true;
                getBlogRecommend();
            }
        } 
        const blogRecommendList = ref([]);
        const userRecommendList = ref([]);
        const getBlogRecommend = ()=>{
            getHomeRecommendList().then((res)=>{
                if (res.errorCode == 200) { 
                blogRecommendList.value = res.data;
            } else {
                ElMessage.warning(res.message);
            }
            });
            getHomeUserRecommendList().then((res)=>{
                if (res.errorCode == 200) { 
                userRecommendList.value = res.data;
            } else {
                ElMessage.warning(res.message);
            }
            });
        };
        const searchList = ref([]);
        //const userSearchList = ref([]);
        const getSearchList = ()=>{
            getHomeSearchList().then((res)=>{
                if(res.errorCode == 200){
                    searchList.value = res.data;
                }else{
                    ElMessage.warning(res.message);
                }
                
            });
        };
        const getUser = ()=>{
            if(userId != null){
                idData.id = userId;
                getAccount(idData).then((res)=>{
                    if(res.errorCode == 200){
                        userInfo.account = res.data.account;
                        userInfo.picUrl = res.data.picUrl;
                    }else{
                        ElMessage.warning("获取用户信息失败");
                    }
                });
            }
            console.log(router.currentRoute.value.name);
        };
        getUser();
        getEdit();
        getSearchList();
        // 用户名下拉菜单选择事件
        
        const handleCommand = (command) => {
            if (command == "loginout") {
                localStorage.removeItem("token");
                localStorage.removeItem("role_id");
                router.push("/login");
            } else if (command == "user") {
                router.push("/user");
            }
        };

        return {
            text,
            userInfo,
            userId,
            message,
            collapse,
            blogRecommendList,
            userRecommendList,
            editVisible,
            isSearch,
            searchList,
            getSearchList,
            blur,
            search,
            getUser,
            collapseChage,
            handleCommand,
            toLogin,
            getBlogRecommend,
            getEdit
        };
    },
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #303133;
    background-color: #f2f6fc;
}
.recommend{
    width: 300px;
    position: absolute;
    right: 21%;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 250px;
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-midder{
    float: left;
    line-height: 70px;
    margin-left: 25%;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
    margin-right: 10px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #303133;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
.loginStatus{
    line-height: 70px;
    font-size: 14px;
}
.text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  /* .box-card {
    width: 480px;
  } */
</style>
