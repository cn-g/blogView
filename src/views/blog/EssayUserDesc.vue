<template>
    <div style="margin-left: 10px;margin-right: 10px;margin-top:30px">
        <div>
            <el-row>
                <el-col :span="3">
                    <div class="grid-content bg-purple" style="margin:auto">
                        <img :src="essayList.userPicUrl" style="width: 60px;height: 60px;border-radius: 50%;" alt />
                    </div>
                </el-col>
                <el-col :span="21" style="margin: auto;">
                    <div class="grid-content bg-purple" style="margin:auto">
                        <div style="color:#BB9444;font-size:20px">{{ essayList.name }}</div>
                    </div>
                </el-col>
            </el-row>
            <div style="background-color: #f8f8f8;
                        height: 80px;
                        padding-top: 20px;
                        padding-left: 18px;">
                <div style="margin-top:5px">
                    <el-row>
                        <el-col :span="3">
                            <div class="grid-content bg-purple" style="margin:auto">
                                性别：<span style="color:#999AAA;">{{ sexData[essayList.sex] }}</span>
                            </div>
                        </el-col>
                        <el-col :span="6" style="margin: auto;">
                            出生日期：<span style="color:#999AAA;">{{ essayList.birthday }}</span>
                        </el-col>
                        <el-col :span="15" style="margin: auto;">
                            所在地区：<span style="color:#999AAA;">{{ essayList.areaName }}</span>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:5px">
                        <el-col :span="5">
                            <div class="grid-content bg-purple" style="margin:auto">
                                <span >浏览量：<i class="el-icon-view" style="color:#999AAA;">{{ essayList.viewNumber }}</i></span>
                            </div>
                        </el-col>
                        <el-col :span="19" style="margin: auto;">
                            点赞数：<i class="el-icon-thumb" style="color:#999AAA;">{{ essayList.goodNumber }}</i>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:5px">
                        <el-col :span="3">
                            <div class="grid-content bg-purple" style="margin:auto">
                                <span >兴趣类目：</span>
                            </div>
                        </el-col>
                        <el-col :span="21" style="margin: auto;">
                            <span v-for="category in essayList.categoryList" :key="category.id" style="color:#999AAA;">
                                <span>{{ category.name }}</span>
                            </span>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <div style="margin-top:20px">
            <el-card class="box-card" v-for="blog in essayList.essayList"
                :key="blog.id" shadow="never" @click="getBlog(blog.blogId)" style="cursor: pointer;">
                <div class="text item" style="color:#999AAA;">
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
                    
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getHomeUserDec } from "../../api/index";
import { useRouter } from "vue-router";
export default {
    name: "essayuserdesc",
    setup() {
        const router = useRouter();
        //获取博客id
        const blogUserId = router.currentRoute.value.query.blogUserId;
        const userId = localStorage.getItem("user_id");
        const sexData = reactive({
            '1':'男',
            '2':'女',
            '3':'未知'
        });
        const query = reactive({
            id:null,
        });
        const essayList = ref([]);
        const getUserDesc = ()=>{
            query.id = blogUserId;
            getHomeUserDec(query).then(res=>{
                if(res.errorCode === 200){
                    essayList.value = res.data;
                }
            })
        };
        const getBlog = (id)=>{
            router.push({path:'/essaydesc',query:{blogId:id}});
        };
        getUserDesc();
        return {
            essayList,
            query,
            userId,
            sexData,
            getUserDesc,
            getBlog
        };
    },
};
</script>

<style scoped>
.comment{
    margin-top: 20px;
}
</style>
