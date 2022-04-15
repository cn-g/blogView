<template>
    <div class="channel">
        <el-carousel :interval="2000" arrow="always">
            <el-carousel-item v-for="item in channelList" :key="item.id" >
                <el-image :src="item.blogPic" fit="cover"></el-image>
            </el-carousel-item>
        </el-carousel>
    </div>
    <div class="blog">
        <el-card class="box-card" v-for="item in blogList"
                :key="item.id" shadow="never">
            <template #header class="clearfix">
                <span>{{ item.title }}</span>
            </template>
            <div class="text item">
                {{ item.synopsis }}
            </div>
        </el-card>
        <div class="pagination">
            <el-pagination background layout="prev, next" :current-page="query.page"
                :page-size="query.rows" :total="query.pageTotal" @current-change="handlePageChange"></el-pagination>
        </div>
    </div>
</template>

<script>
import { ref,reactive } from "vue";
import { getHomeEssayPage,getHomeChannel } from "../api/index";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
    name: "dashboard",
    setup() {
        const query = reactive({
            page: 1,
            rows: 3,
            pageTotal:0
        });
        const blogList = ref([]);
        const channelList = ref([]);
        const getList = ()=> {
            getHomeEssayPage(query).then((res) => {
            if (res.errorCode == 200) { 
                blogList.value = res.data;
                query.pageTotal = res.total;
            } else {
                ElMessage.warning(res.message);
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
                }else{
                    ElMessage.warning(res.message);
                }
            })
        }
        getList();
        getChannel();
        return {
            channelList,
            blogList,
            query,
            getList,
            handlePageChange,
            getChannel
        };
    },
};
</script>

<style scoped>
    .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
  .channel{
      height: 500px;
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
    width: 480px;
  }
  :deep(.el-carousel__container){
      height: 450px;
  }
</style>
