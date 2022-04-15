<template>
    <div>
        <el-row :gutter="40">
            <!-- <el-col :span="12"> -->
                <el-card shadow="hover">
                    <template #header>
                        <div class="clearfix">
                            <span>基础信息</span>
                        </div>
                    </template>
                    <div class="info">
                        <div class="info-image" >
                            <el-upload class="upload-demo" 
                                :action=uploadUrl 
                                auto-upload
                                :on-success="uploadSuccess">
                                <img :src="userform.picUrl" v-if="userform.picUrl"/>
                                <span class="info-edit">
                                <i class="el-icon-lx-camerafill"></i>
                               </span>
                            </el-upload>
                        </div>
                        <div class="info-name" > 
                            <span>{{ accountform.account }}</span> 
                        </div>
                        <div class="info-desc">{{ userform.synopsis }}</div>
                    </div>
                </el-card>
        </el-row>
        <el-row :gutter="40">
                <el-card shadow="hover" v-if="accountAditStatus">
                    <template #header>
                        <div class="clearfix">
                            <span>账号编辑</span>
                            <el-tooltip class="item" effect="dark" content="保存">
                                <el-button type="success" icon="el-icon-check" @click="accountUpdate(1)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="取消">
                                <el-button type="success" icon="el-icon-close" @click="accountUpdate(2)"></el-button>
                            </el-tooltip>
                            
                        </div>
                    </template>
                    <el-form label-width="90px" >
                        <el-form-item label="用户名："> 
                            <el-input v-model="updaetAccountform.account"></el-input>
                        </el-form-item>
                        <el-form-item label="旧密码：">
                            <el-input type="password" v-model="updaetAccountform.oldPassword"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码：">
                            <el-input type="password" v-model="updaetAccountform.password"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号：">
                            <el-input v-model="updaetAccountform.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="QQ号：">
                            <el-input v-model="updaetAccountform.qqNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="微信号：">
                            <el-input v-model="updaetAccountform.weChat"></el-input>
                        </el-form-item>
                    </el-form>
                </el-card>
                <el-card shadow="hover" v-else>
                    <template #header>
                        <div class="clearfix">
                            <span>账号信息</span>
                            <el-tooltip class="item" effect="dark" content="编辑">
                                <el-button type="primary" icon="el-icon-edit" @click="accountChange"></el-button>
                            </el-tooltip>
                        </div>
                    </template>
                    <el-form status-icon  label-width="100px" class="demo-ruleForm">
                        <el-form-item label="用户名"> 
                            {{ accountform.account }} 
                        </el-form-item>
                        <el-form-item label="手机号">
                            {{ accountform.phone }}
                        </el-form-item>
                        <el-form-item label="QQ号">
                            {{ accountform.qqNumber }}
                        </el-form-item>
                        <el-form-item label="微信号">
                            {{ accountform.weChat }}
                        </el-form-item>
                    </el-form>
                </el-card>
        </el-row>
        <el-row :gutter="40">
                <el-card shadow="hover" v-if="userAditStatus">
                    <template #header>
                        <div class="clearfix">
                            <span>用户编辑</span>
                            <el-tooltip class="item" effect="dark" content="保存">
                                <el-button type="success" icon="el-icon-check" @click="userUpdate(1)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="取消">
                                <el-button type="success" icon="el-icon-close" @click="userUpdate(2)"></el-button>
                            </el-tooltip>
                            
                        </div>
                    </template>
                    <el-form label-width="90px" >
                        <el-form-item label="姓名">
                            <el-input v-model="userUpdateform.realName"></el-input>
                        </el-form-item>
                        <el-form-item label="性别">
                            <el-radio v-model="userUpdateform.sex" :label="1">男</el-radio>
                            <el-radio v-model="userUpdateform.sex" style="margin-left:10px;" :label="2" >女</el-radio>
                            <el-radio v-model="userUpdateform.sex" style="margin-left:10px;" :label="3">未知</el-radio>
                        </el-form-item>
                        <el-form-item label="地址">
                            <el-cascader
                                size="large"
                                :options="options"
                                v-model="selectedOptions"
                                @change="getAddress"
                                style="width: 80%;" >
                            </el-cascader>
                        </el-form-item>
                        <el-form-item label="出生日期">
                            <el-date-picker type="date" placeholder="选择日期" value-format="YYYY-MM-DD" v-model="userUpdateform.birthday"
                                    style="width: 50%;"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="籍贯">
                            <el-input v-model="userUpdateform.nativePlace"></el-input>
                        </el-form-item>
                        <el-form-item label="简介">
                            <el-input type="textarea" rows="3" v-model="userUpdateform.synopsis" style="width: 50%;margin-top:10px;" ></el-input>
                        </el-form-item>
                        <el-form-item label="兴趣类目" prop="region">
                            <el-select v-model="userUpdateform.categories" placeholder="请选择" multiple style="width: 70%;">
                                <el-option v-for="category in selectDate" :key="category.id" :label="category.name" :value="category.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-card>
                <el-card shadow="hover" v-else>
                    <template #header>
                        <div class="clearfix">
                            <span>用户信息</span>
                            <el-tooltip class="item" effect="dark" content="编辑">
                                <el-button type="primary" icon="el-icon-edit" @click="userChange"></el-button>
                            </el-tooltip>
                        </div>
                    </template>
                    <el-form status-icon  label-width="100px" class="demo-ruleForm">
                        <el-form-item label="姓名">
                            {{ userform.realName }}
                        </el-form-item>
                        <el-form-item label="性别">
                            {{ sexData[userform.sex] }}
                        </el-form-item>
                        <el-form-item label="地址">
                            {{ userform.areaName }}
                        </el-form-item>
                        <el-form-item label="出生日期">
                            {{ userform.birthday }}
                        </el-form-item>
                        <el-form-item label="籍贯">
                            {{ userform.nativePlace }}
                        </el-form-item>
                        <el-form-item label="简介">
                            {{ userform.synopsis }}
                        </el-form-item>
                        <el-form-item label="兴趣类目">
                            {{ userform.categoryName }}
                        </el-form-item>
                    </el-form>
                </el-card>
        </el-row>
    </div>
</template>

<script>
import { reactive, ref } from "vue";
import "cropperjs/dist/cropper.css";
import { ElMessage, ElMessageBox } from "element-plus";
import { updateUser,getAccount,updateAccount,getUser,getCategoryData } from "../api/index";
import router from '../router';
import { regionData } from 'element-china-area-data'
export default {
    name: "user",
    setup() {
        let userform = reactive({
            id:"",
            realName:null,
            picUrl:null,
            sex:null,
            synopsis:null,
            areaName:null,
            provinceCode:"",
            cityCode:"",
            areaCode:"",
            birthday:"",
            nativePlace:null,
            categoryName:"",
            status:null
        });
        const sexData = reactive({
            '1':'男',
            '2':'女',
            '3':'未知'
        });
        let userUpdateform = reactive({
            id:"",
            realName:null,
            picUrl:null,
            sex:null,
            synopsis:null,
            areaName:null,
            provinceCode:"",
            cityCode:"",
            areaCode:"",
            birthday:"",
            categories:[],
            nativePlace:null,
            status:null
        });
        const selectCategoryDate = ()=>{
            getCategoryData().then((res)=>{
                selectDate.value = res.data;
            });
        };
        selectCategoryDate();
        const selectDate = ref([]);

        //基础信息
        let userInfo = reactive({
            id:"",
            account: "",
            picUrl:""
        });
        //账号信息
        let accountform = reactive({
            id:"",
            account: "",
            phone: "",
            qqNumber:"",
            weChat:"",
        });
        let updaetAccountform = reactive({
            id:"",
            account: null,
            oldPassword:null,
            password:null,
            phone: null,
            qqNumber:null,
            weChat:null,
        });
        //上传图片
        const uploadUrl = "http://localhost:8080/api/cloud/uploadImg";
        const uploadSuccess = (res)=>{
            userInfo.picUrl = res.data;
            userform.id = localStorage.getItem("userId");
            userform.picUrl = res.data;
            updateUser(userform).then((res)=>{
                if(res.errorCode == 200){
                    router.go(0);
                    ElMessage.success("修改头像成功");
                }else{
                    ElMessage.warning("修改头像失败");
                }
            })
        }

        let idData = reactive({
            id:"",
        });
        const accountAditStatus = ref(false);
        const userAditStatus = ref(false);
        const getUserInfo = ()=>{
            idData.id = localStorage.getItem("userId");
            getAccount(idData).then((res)=>{
                if(res.errorCode == 200){
                    accountform.id = res.data.id;
                    accountform.account = res.data.account;
                    accountform.phone = res.data.phone;
                    accountform.qqNumber = res.data.qqNumber;
                    accountform.weChat = res.data.weChat;
                    updaetAccountform.id = res.data.id;
                    updaetAccountform.account = res.data.account;
                    updaetAccountform.phone = res.data.phone;
                    updaetAccountform.qqNumber = res.data.qqNumber;
                    updaetAccountform.weChat = res.data.weChat;
                }else{
                    ElMessage.warning(res.message);
                }
            });
            getUser(idData).then((res)=>{
                if(res.errorCode == 200){
                    userform.id = res.data.id;
                    userform.realName = res.data.realName;
                    userform.nativePlace = res.data.nativePlace;
                    userform.picUrl = res.data.picUrl;
                    userform.synopsis = res.data.synopsis;
                    userform.provinceCode = res.data.provinceCode;
                    userform.areaName = res.data.areaName;
                    userform.cityCode = res.data.cityCode;
                    userform.areaCode = res.data.areaCode;
                    userform.birthday = res.data.birthday;
                    userform.sex = res.data.sex;
                    userform.categoryName = res.data.categoryName;
                    userUpdateform.realName = res.data.realName;
                    userUpdateform.sex = res.data.sex;
                    userUpdateform.birthday = res.data.birthday;
                    userUpdateform.nativePlace = res.data.nativePlace;
                    userUpdateform.synopsis = res.data.synopsis;
                    userUpdateform.provinceCode = res.data.provinceCode;
                    userUpdateform.areaName = res.data.areaName;
                    userUpdateform.cityCode = res.data.cityCode;
                    userUpdateform.areaCode = res.data.areaCode;
                    userUpdateform.id = res.data.id;
                    userUpdateform.categories = res.data.categories;
                }else{
                    ElMessage.warning(res.message);
                }
            });
            
        };
        getUserInfo();
        const selectedOptions = ref();
        const options = regionData;
        //获取地址
        const getAddress = (value)=>{
            for(var i = 0;i<options.length;i++){
                if(value[0] == options[i].value){
                    for(var j = 0;j<options[i].children.length;j++){
                        if(value[1] == options[i].children[j].value){
                            for(var m = 0;m<options[i].children[j].children.length;m++){
                                if(value[2] == options[i].children[j].children[m].value){
                                        userUpdateform.areaName = options[i].label + '/' + options[i].children[j].label + '/' + options[i].children[j].children[m].label;
                                        userUpdateform.provinceCode = value[0];
                                        userUpdateform.cityCode = value[1];
                                        userUpdateform.areaCode = value[2];
                                }
                            }
                        }
                    }
                }
            }
        };
        const accountChange = ()=>{
            accountAditStatus.value = true;
        }
        const userChange = ()=>{
            userAditStatus.value = true;
        }
        const accountUpdate = (num)=>{
            if(num == 1){
                updateAccount(updaetAccountform).then((res)=>{
                    if(res.errorCode == 200){
                        accountAditStatus.value = false;
                        if(updaetAccountform.password != null){
                            ElMessage.warning("密码已变更,即将自动退出");
                            setTimeout(function(){
                                localStorage.removeItem("token");
                                localStorage.removeItem("role_id");
                                router.push("/login");
                            },2000);
                        }
                        getUserInfo();
                        ElMessage.success("修改账号信息成功");
                    }else{
                       ElMessage.warning(res.message); 
                    }
                })
            }
            if(num == 2){
                accountAditStatus.value = false;
            }
        };
        const userUpdate = (num)=>{
            if(num == 1){
                updateUser(userUpdateform).then((res)=>{
                    if(res.errorCode == 200){
                        userAditStatus.value = false;
                        getUserInfo();
                        ElMessage.success("修改用户信息成功");
                    }else{
                       ElMessage.warning(res.message); 
                    }
                })
            }
            if(num == 2){
                userAditStatus.value = false;
            }
        }
        

        return {
            selectDate,
            options,
            selectedOptions,
            sexData,
            updaetAccountform,
            accountform,
            userform,
            userUpdateform,
            uploadUrl,
            accountAditStatus,
            userAditStatus,
            idData,
            userInfo,
            selectCategoryDate,
            uploadSuccess,
            getUserInfo,
            userChange,
            accountChange,
            accountUpdate,
            userUpdate,
            getAddress
        };
    },
};
</script>

<style scoped>
.info {
    text-align: center;
    padding: 35px 0;
}
.info-image {
    position: relative;
    margin: auto;
    width: 100px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 50px;
    overflow: hidden;
}
.info-image img {
    width: 100%;
    height: 100%;
}
.info-edit {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
}
.info-edit i {
    color: #eee;
    font-size: 25px;
}
.info-image:hover .info-edit {
    opacity: 1;
}
.info-name {
    margin: 15px 0 10px;
    font-size: 24px;
    font-weight: 500;
    color: #262626;
}
.crop-demo-btn {
    position: relative;
}
.crop-input {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}
:deep(.el-upload) {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
*{
    margin: auto;
}
:deep(.el-card){
    width: 40%;
}
:deep(.el-row){
    margin-top: 10px;
}
:deep(.el-button){
    position: relative;
    left: 76%;
    font-size: 16px;
    color: #100e0f;
    background-color: #e7ecef00;
    border-color: #409eff08;
}
:deep(.el-input){
    width: 50%;
    margin-top: 10px;
}
:deep(.el-form-item__content){
    margin-left: 16px;
}
</style>