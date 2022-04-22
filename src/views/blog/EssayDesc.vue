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
                    <i class="el-icon-view">{{ essayNumber.viewNumber }}</i>
                </div>
            </div>
        </div>
        <div v-html="essay.content" style="margin-top:10px" ></div>
        <div class="operate" style="margin-top:20px;background-color: #f8f8f8;">
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
                    <div class="grid-content bg-purple-light" style="text-align:center;cursor: pointer;">
                        <i class="el-icon-thumb" @click="clickOperate()" style="color:#999AAA;">点赞{{ essayNumber.goodNumber }}</i>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="comment" v-if="userId != null">
            <el-row>
                <el-col :span="2">
                    <div class="grid-content bg-purple">
                        <img :src="picUrl" style="width: 40px;height: 40px;border-radius: 50%;" alt />
                    </div>
                </el-col>
                <el-col :span="22">
                        <el-input placeholder="请输入内容" v-model="userComment" class="input-with-select">
                            <template #append>
                                <el-button icon="el-icon-thumb" @click="addUserComment(null,null,userComment)">评论</el-button>
                            </template>
                        </el-input>
                </el-col>
            </el-row>
        </div>
        <div v-else style="text-align:center">
            <el-button type="text" @click="tologin()">登录才能评论</el-button>
        </div>
        <div class="comment-list">
            <el-divider style="height: 1px;"></el-divider>
            <div v-for="(item,i) in commentList" :key="i">
                <div class="author-info">
                    <span style="color:#BB9444;margin-right:10px;">{{ item.name }}</span>
                    <span style="color:#999AAA;margin-right:10px;margin-left: 65%;">
                        <i class="el-icon-alarm-clock"></i>{{ item.createTime }}</span>
                </div>
                <div>
                    <p style="margin-top:10px">
                        {{item.comment}}
                    </p>
                </div>
                <el-divider style="height: 1px;"></el-divider>
            </div>
            <div class="pagination">
                <el-pagination background layout="prev, next" :current-page="query.page"
                    :page-size="query.rows" :total="query.pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>
        <div class="blog" v-if="showEssay">
            <el-card class="box-card" v-for="blog in essayList"
                :key="blog.id" shadow="never" @click="getBlog(blog.id)" style="cursor: pointer;">
                <el-row>
                        <el-col :span="8">
                            <span><img :src="blog.picUrl" style="width: 100%;height: 100%;" alt /></span>
                        </el-col>
                        <el-col :span="16">
                            <el-row style="margin-left:10px">
                                <el-col :span="9">
                                    <div class="grid-content bg-purple" style="margin:auto;color:#000;font-size:16px">
                                        <span>{{ blog.title }}</span>
                                    </div>
                                </el-col>
                                <el-col :span="9" style="margin: auto;">
                                    <span style="color:#999AAA;">{{ blog.publishTime }}</span>
                                </el-col>
                                <el-col :span="3" style="margin: auto;">
                                    <span ><i class="el-icon-view" style="color:#999AAA;">{{ blog.viewNumber }}</i></span>
                                </el-col>
                                <el-col :span="3" style="margin: auto;">
                                    <i class="el-icon-thumb" style="color:#999AAA;">{{ blog.goodNumber }}</i>
                                </el-col>
                            </el-row>
                            <el-row style="height:100%">
                                <el-col :span="12" >
                                    <div class="grid-content bg-purple" style="margin-left:10px;margin-top: 20px;">
                                       <span style="color:#999AAA;">{{ blog.synopsis }}</span>
                                    </div>
                                </el-col>
                            </el-row>
                            </el-col>
                        </el-row>
            </el-card>
        </div>
        <div v-else style="text-align:center;color:#999AAA;">
            暂无推荐
        </div>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getHomeEssayDec,addComment,addOperateHistory,getCommentPage,getEssayPageByKeyWord } from "../../api/index";
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
        const query = reactive({
            id:null,
            keyWord:null,
            page: 1,
            rows: 3,
        });
        const commentList = ref([]);
        const getComment = ()=>{
            query.id = blogId;
            getCommentPage(query).then((res)=>{
                if(res.errorCode === 200){
                    commentList.value = res.data;
                    query.pageTotal = res.total;
                }
            });
        };
        // 分页导航
        const handlePageChange = (val) => {
            query.page = val;
            getComment();
        };
        const picUrl = localStorage.getItem('pic_url');
        const essay = ref([]);
        const essayNumber = reactive({
            goodNumber:null,
            viewNumber:null,
            title:null,
        });
        const getEssay = ()=>{
            idReqDto.id = blogId;
            getHomeEssayDec(idReqDto).then((res)=>{
                if(res.errorCode === 200){
                    essay.value = res.data;
                    essayNumber.viewNumber = res.data.viewNumber;
                    essayNumber.goodNumber = res.data.goodNumber;
                    essayNumber.title = res.data.title;
                    view();
                    getComment();
                    getEssayPage();
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
                    essayNumber.goodNumber = essayNumber.goodNumber + 1;
                    ElMessage.success("点赞成功");
                }
            });
        };
        const userComment = ref(null);
        const replayComment = ref(null);
        const addform = reactive({
            blogId:null,
            replyUserId:null,
            replyId:null,
            comment:null
        });
        const addUserComment = (replyId,replyUserId,comment)=>{
            addform.blogId = blogId;
            addform.replyId = replyId;
            addform.replyUserId = replyUserId;
            addform.comment = comment;
            addComment(addform).then((res)=>{
                if(res.errorCode === 200){
                    ElMessage.success("发布评论成功");
                    getComment();
                    userComment = "";
                }
            });
        };
        const view = ()=>{
            operatefrom.blogId = blogId;
            operatefrom.operateNo = 0;
            addOperateHistory(operatefrom).then((res)=>{
                if(res.errorCode === 200){
                    essayNumber.viewNumber = essayNumber.viewNumber + 1;
                }
            });
        };
        const tologin = ()=>{
            router.push("/login");
        };
        const essayList = ref([]);
        const showEssay = ref(true);
        const getEssayPage = ()=>{
            query.id = blogId;
            query.rows = 5;
            console.log(essayNumber);
            query.keyWord = essayNumber.title;
            getEssayPageByKeyWord(query).then((res)=>{
                if(res.errorCode == 200){
                    essayList.value = res.data;
                }else{
                    showEssay.value = false;
                }
            });
        };
        getEssay();
        return {
            commentList,
            query,
            userId,
            addform,
            blogId,
            idReqDto,
            essay,
            picUrl,
            operatefrom,
            userComment,
            replayComment,
            essayList,
            essayNumber,
            showEssay,
            getComment,
            getEssay,
            clickOperate,
            view,
            tologin,
            addUserComment,
            handlePageChange,
            getEssayPage
        };
    },
};
</script>

<style scoped>
.comment{
    margin-top: 20px;
}
</style>
