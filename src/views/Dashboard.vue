<template>
    <div class="channel" style="margin:auto">
        <el-carousel :interval="2000" arrow="always">
            <el-carousel-item v-for="item in channelList" :key="item.id" @click="getBlog(item.blogUrl)" style="cursor: pointer;">
                <el-image :src="item.blogPic" fit="cover" style="height:100%;width:100%"></el-image>
                <div class="channelDesc">
                    <span class="channelTitle">{{ item.blogTitle }}</span>
                    <div class="channelBlog">
                        {{ item.blogDesc }}
                    </div>
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
    <div class="category">
        <el-button type="text" @click="toMore" style="color:#303133;margin-left: 94%;">更多<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        <el-tabs type="border-card" v-model="query.active" @tab-click="getList">
            <el-tab-pane v-for="cate in categoryList" :key="cate.id" :label="cate.name" :name="cate.id">
                <div class="blog">
                    <el-card class="box-card" v-for="blog in blogList"
                        :key="blog.id" shadow="never" @click="getBlog(blog.id)" style="cursor: pointer;">
                        <template #header class="clearfix">
                            <span>{{ blog.title }}</span>
                        </template>
                        <div class="text item">
                            {{ blog.synopsis }}
                        </div>
                    </el-card>
                    <div class="pagination">
                        <el-pagination background layout="prev, next" :current-page="query.page"
                        :page-size="query.rows" :total="query.pageTotal" @current-change="handlePageChange"></el-pagination>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { ref,reactive, onActivated } from "vue";
import { getHomeEssayPage,getHomeChannel,getHomeCategory } from "../api/index";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { toRaw } from '@vue/reactivity';
export default {
    name: "dashboard",
    setup() {
        const router = useRouter();
        const query = reactive({
            id:'',
            active:0,
            page: 1,
            rows: 5,
            pageTotal:0
        });
        const blogList = ref([]);
        const channelList = ref([]);
        const categoryList = ref([]);
        const getList = ()=> {
            if(query.active != 0){
                query.id = query.active;
            }else{
                query.id = '';
            }
            getHomeEssayPage(query).then((res) => {
            if (res.errorCode == 200) { 
                blogList.value = res.data;
                query.pageTotal = res.total;
            }
         })
        };
        // 分页导航
        const handlePageChange = (val) => {
            query.page = val;
            getList();
        };
        const getChannel = ()=>{
            getHomeChannel().then((res)=>{
                if(res.errorCode == 200){
                    channelList.value = res.data;
                }
            })
        };
        const getCategory = ()=>{
            getHomeCategory().then((res)=>{
                if(res.errorCode == 200){
                    categoryList.value = res.data;
                }
            })
        };
        const toMore = ()=>{
            router.push("/login");
        };
        const getBlog = (id)=>{
            router.push({path:'/essaydesc',query:{blogId:id}});
        };
        getCategory();
        getChannel();
        getList();
        return {
            channelList,
            categoryList,
            blogList,
            query,
            getList,
            handlePageChange,
            getChannel,
            getCategory,
            toMore,
            getBlog
        };
    },
};
</script>

<style scoped>
.channelTitle{
    font-size: 17px;
    font-weight: 500;
}
.channelBlog{
    font-size: 14px;
    color: #999;
}
    .text {
    font-size: 14px;
  }
.channelDesc{
    background-color:#f0fff914;
    color: #f2f6fc;
    position: relative;
    top: -52px;
    padding-left: 20px;
    text-align: left;
    height: 100%;
}
  .item {
    margin-bottom: 18px;
  }
.category{
    margin-top: 10px;
}

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
  }
  :deep(.el-carousel__container){
      height: 450px;
      text-align: center;
  }
  :deep(.el-carousel__indicator){
      margin-bottom: 45px;
  }
  :deep(.el-pagination){
      text-align: center;
  }
</style>
