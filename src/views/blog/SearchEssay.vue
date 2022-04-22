<template>
    <div style="margin-left: 10px;margin-right: 10px;margin-top:30px">
        <div style="margin-top:20px">
            <el-card class="box-card" v-for="blog in essayList"
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
import { getEssayPageByKeyWord } from "../../api/index";
import { useRouter } from "vue-router";
export default {
    name: "searchessay",
    setup() {
        const router = useRouter();
        //获取博客id
        const keyWord = router.currentRoute.value.query.keyWord;
        const userId = localStorage.getItem("user_id");
        const sexData = reactive({
            '1':'男',
            '2':'女',
            '3':'未知'
        });
        const query = reactive({
            keyWord:null,
            page: 1,
            rows: 10,
            pageTotal:0
        });
        const essayList = ref([]);
        const getUserDesc = ()=>{
            query.keyWord = keyWord;
            getEssayPageByKeyWord(query).then(res=>{
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
