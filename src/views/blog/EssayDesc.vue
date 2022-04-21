<template>
    <div style="margin-left: 10px;margin-right: 10px;margin-top:30px">
        <div class="blogTitle">
            <h2>{{ essay.title }}</h2>
            <div style="background-color: #f8f8f8;
                        height: 64px;
                        padding-top: 20px;
                        padding-left: 18px;">
                <div>
                    <span style="color:#BB9444;margin-right:10px;">"{{ essay.name }}"</span>于<span style="color:#999AAA;margin-right:10px;margin-left:10px"><i class="el-icon-alarm-clock"></i>{{ essay.publishTime }}</span>发布
                </div>
                <div style="margin-top:5px">
                    <span >所属类目：</span><span style="color:#999AAA;margin-right:10px;">{{essay.categoryName}}</span>
                    <i class="el-icon-view">{{ essay.viewNumber }}</i>
                </div>
            </div>
        </div>
        <div v-html="essay.content" style="margin-top:10px" ></div>
        <div class="operate">
            <el-row>
                <el-col :span="2">
                    <div class="grid-content bg-purple" style="margin:auto">
                        <img :src="essay.userPicUrl" style="width: 40px;height: 40px;border-radius: 50%;" alt />
                    </div>
                </el-col>
                <el-col :span="16" style="margin: auto;">
                    <div class="grid-content bg-purple" style="margin:auto">
                        <div style="color:#BB9444;">{{ essay.name }}</div>
                    </div>
                </el-col>
                <el-col :span="6" style="margin:auto;">
                    <div class="grid-content bg-purple-light" style="text-align:center">
                        <i class="el-icon-thumb" @click="clickOperate()" >点赞{{ essay.goodNumber }}</i>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="comment" v-if="userId != null">
            <el-row>
                <el-col :span="2">
                    <div class="grid-content bg-purple" style="text-align:center">
                        <img :src="picUrl" style="width: 40px;height: 40px;border-radius: 50%;" alt />
                    </div>
                </el-col>
                <el-col :span="22">
                        <el-input placeholder="请输入内容" v-model="addform.comment" class="input-with-select" >
                            <template #append>
                                <el-button icon="el-icon-thumb">评论</el-button>
                            </template>
                        </el-input>
                </el-col>
            </el-row>
        </div>
        <div v-else style="text-align:center">
            <el-button type="text" @click="tologin()">登录才能评论</el-button>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getHomeEssayDec,addComment,addOperateHistory } from "../../api/index";
import { useRouter } from "vue-router";
export default {
    name: "essaydesc",
    setup() {
        const router = useRouter();
        //获取博客id
        const blogId = router.currentRoute.value.query.blogId;
        const userId = localStorage.getItem("user_id");
        let idReqDto = reactive({
            id:null,
        });
        const picUrl = localStorage.getItem('pic_url');
        const essay = ref([]);
        const getEssay = ()=>{
            idReqDto.id = blogId;
            getHomeEssayDec(idReqDto).then((res)=>{
                if(res.errorCode === 200){
                    essay.value = res.data;
                }else{
                    ElMessage.warning(res.message);
                }
            });
        };
        const operatefrom = reactive({
            operateNo:null,
            blogId:null,
        });
        const clickOperate = ()=>{
            if(!userId){
                 ElMessage.warning("登录后才能点赞哦~~~");
                 return;
            }
            operatefrom.blogId = blogId;
            operatefrom.operateNo = 1;
            addOperateHistory(operatefrom).then((res)=>{
                if(res.errorCode === 200){
                    essay.goodNumber = essay.goodNumber + 1;
                    ElMessage.success("点赞成功");
                }
            });
        };
        const addform = reactive({
            blogId:null,
            replyUserId:null,
            replyId:null,
            comment:null
        });
        const view = ()=>{
            operatefrom.blogId = blogId;
            operatefrom.operateNo = 0;
            addOperateHistory(operatefrom).then((res)=>{
                if(res.errorCode === 200){
                    essay.viewNumber = essay.viewNumber + 1;
                }
            });
        };
        const tologin = ()=>{
            router.push("/login");
        };
        getEssay();
        view();
        return {
            userId,
            addform,
            blogId,
            idReqDto,
            essay,
            picUrl,
            operatefrom,
            getEssay,
            clickOperate,
            view,
            tologin
        };
    },
};
</script>

<style scoped>
.comment{
    margin-top: 20px;
}
</style>
