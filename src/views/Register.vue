<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">博客园用户注册</div>
            <el-form :model="param" :rules="rules" ref="register" label-width="0px" class="ms-content">
                <el-form-item prop="account">
                    <el-input v-model="param.account" placeholder="请输入用户名">
                        <template #prepend>
                            <el-button icon="el-icon-user"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="param.password"
                        @keyup.enter="submitForm()">
                        <template #prepend>
                            <el-button icon="el-icon-lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="checkPassword">
                    <el-input type="password" placeholder="再次确认密码" v-model="param.checkPassword" @change="check()">
                        <template #prepend>
                            <el-button icon="el-icon-lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="qqNumber">
                    <el-input v-model="param.qqNumber" placeholder="请输入QQ号">
                        <template #prepend>
                            <el-button icon="el-icon-user"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="weChat">
                    <el-input v-model="param.weChat" placeholder="请输入微信号">
                        <template #prepend>
                            <el-button icon="el-icon-user"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="phone">
                    <el-input v-model="param.phone" placeholder="请输入手机号">
                        <template #prepend>
                            <el-button icon="el-icon-user"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">注册</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { userRegister } from "../api/index";

export default {
    setup() {
        const router = useRouter();
        const param = reactive({
            account: null,
            checkPassword:null,
            password: null,
            phone:null,
            qqNumber:null,
            weChat:null
        });

        const rules = {
            account: [
                {
                    pattern:/^[a-zA-Z0-9]+$/,
                    required: true,
                    message: "用户名需要为数字加英文",
                    trigger: "blur",
                },
                {
                    min:4,
                    message:"用户名不能小于四位"
                }
            ],
            password: [
                {pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/, required: true,trigger: "blur" ,message:"密码需在6-20位,且字母、数字和标点符号至少包含两种"}
            ],
            checkPassword: [
                { required: true, message: "请再次输入密码", trigger: "blur" },
            ],
            qqNumber:[
                {pattern:/^-?[1-9]\d*$/,trigger: "blur" ,message:"QQ号格式不正确"}
            ],
            phone: [
                {pattern:/^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,trigger: "blur" ,message:"手机号格式不正确"}
            ],
            weChat: [
                {pattern:/^[a-zA-Z0-9]+$/,trigger: "blur" ,message:"微信号格式不正确"}
            ]
        };
        const check = (val)=>{
            if(param.password !== val){
                ElMessage.warning("两次输入密码不正确");
            }
        };
        const register = ref(null);
        const submitForm = () => {
            register.value.validate((valid) => {
                if(valid){
                    userRegister(param).then((res) => {
                        if (res.errorCode == 200) {
                            ElMessage.success("注册成功");
                            router.push("/login");
                        } else {
                            ElMessage.error(res.message);
                        }
                    });
                }else{
                    ElMessage.error("注册失败");
                    return false;
                }
            });
            
        };

        const store = useStore();
        store.commit("clearTags");

        return {
            param,
            rules,
            register,
            submitForm,
            check
        };
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/blog-login.png);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #606266;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 40%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background:#fff;
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>