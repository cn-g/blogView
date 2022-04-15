<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-tickets"></i>
        </div>
        <div class="logo">博客园</div>
        <div class="header-midder">
            <el-input placeholder="请输入内容" v-model="text.content" class="input-with-select" style="width:500px" >
                <template #append>
                    <el-button icon="el-icon-search"></el-button>
                </template>
            </el-input>
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
</template>
<script>
import { computed, onMounted, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getAccount } from "../api/index";
import { ElMessage } from 'element-plus';
export default {
    setup() {
        const router = useRouter();
        const userId = localStorage.getItem("user_id");
        const message = 2;
        
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

        const getUser = ()=>{
            console.log(userId);
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
        };
        getUser();
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
            getUser,
            collapseChage,
            handleCommand,
            toLogin
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
</style>
