<template>
        <div id="ArticleText">
            <el-affix :offset="0">
                <div id="ArticleTextHead">
                    <div id="ArticleTextHeadBack" @click="toHome()">
                        <i class="el-icon-arrow-left"></i>
                            文章管理
                    </div>
                    <el-divider direction="vertical"></el-divider>
                    <div id="ArticleTextHeadTitle">
                        <el-input
                            placeholder="请输入内容"
                            v-model="content.title"
                            maxlength="100"
                            show-word-limit></el-input>
                        <div id="ArticleTextHeadTitleOperate">
                            <el-button type="info" plain @click="addDraft()">保存草稿</el-button>
                            <el-button type="danger" plain @click="editVisible = true">发布文章</el-button>
                        </div>
                    </div>
                </div>
            </el-affix>
            <div class="container">
            <div class="mgb20" ref='editor' >
                <div v-html="content.html"></div>
            </div>
            </div>
            <!-- 编辑弹出框 -->
        <el-dialog title="发布" v-model="editVisible" width="20%">
            <el-form label-width="70px">
                <el-form-item label="标题">
                    <el-input v-model="content.title" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="摘要">
                    <el-input type="textarea" rows="3" v-model="addform.synopsis"></el-input>
                </el-form-item>
                <el-form-item label="展示图">
                    <el-upload class="upload-demo" 
                        :action=uploadUrl 
                        auto-upload 
                        :on-success="uploadSuccess">
                        <el-image v-if="addform.picUrl" class="table-td-thumb" :src="addform.picUrl" fit="fill" style="width:100%;height:100%" lazy>
                        </el-image>
                        <i v-else class="el-icon-upload"></i>
                        <div v-if="!addform.picUrl">
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="类目" prop="region">
                    <el-select v-model="addform.categoryId" placeholder="请选择">
                        <el-option v-for="category in selectDate" :key="category.id" :label="category.name" :value="category.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addPublish">确 定</el-button>
                </span>
            </template>
        </el-dialog>
        </div>
         
</template>

<script>
import WangEditor from "wangEditor";
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { addEssay,getCategoryData,getEssay } from '../api';
import { ElMessage } from 'element-plus';
import { useRouter } from "vue-router";
export default {
    name: "editor",
    setup() {
        const router = useRouter();
        const editor = ref(null);
        const content = reactive({
            title:'',
            text:'',
            html:''
        });
        const userId = localStorage.getItem("user_id");
        const toHome = ()=>{
            router.push("/dashboard");
        };
        let editInstance;
        onMounted(() => {
            editInstance = new WangEditor(editor.value);
            editInstance.config.zIndex = 1;
            editInstance.config.height = 1050;
            // 图片上传配置
            editInstance.config.showLinkImg = true;
            editInstance.config.showLinkImgAlt = true;
            editInstance.config.showLinkImgHref = false;
            editInstance.create();
        });
        onBeforeUnmount(() => {
            editInstance.destroy();
            editInstance = null;
        });
        //上传图片
        const uploadUrl = "http://localhost:7089/cloud/uploadImg";
        const uploadSuccess = (res)=>{
            addform.picUrl = res.data;
        }
        const editVisible = ref(false);
        const selectCategoryDate = ()=>{
            getCategoryData().then((res)=>{
                selectDate.value = res.data;
            });
        };
        selectCategoryDate();
        const selectDate = ref([]);
        let addform = reactive({
            id:null,
            categoryId: null,
            content:null,
            label:null,
            status: 1,
            picUrl:null,
            synopsis:null,
            title:null,
            userId:null
        });
        const blogId = router.currentRoute.value.query.blogId;
        //保存为草稿
        const idReqDto = reactive({
            id:null,
        });
        const insertContent = ()=>{
            if(blogId){
                idReqDto.id = blogId;
                getEssay(idReqDto).then(res=>{
                    if(res.errorCode === 200){
                        content.title = res.data.title;
                        content.html = res.data.content;
                        editInstance.txt.html() = content.html;
                    }
                })
            }
        };
        insertContent();
        const addDraft = () => {
            content.html = editInstance.txt.html();
            addform.userId = localStorage.getItem("user_id");
            addform.label = 2;
            addform.status = 1;
            addform.content = content.html;
            addform.title = content.title;
            addform.id = blogId;
            addEssay(addform).then((res)=>{
                if(res.errorCode === 200){
                    addform.id = res.data;
                    ElMessage.success("保存成功");
                    router.push({path:"/essayuser",query:{blogUserId:userId}});
                }
            });
        };
        //发布博客
        const addPublish = () => {
            content.html = editInstance.txt.html();
            addform.userId = localStorage.getItem("user_id");
            addform.content = content.html;
            addform.title = content.title;
            addform.label = 1;
            addEssay(addform).then((res)=>{
                if(res.errorCode === 200){
                    editVisible.value = false;
                    ElMessage.success("发布成功");
                    router.push({path:"/essayuser",query:{blogUserId:userId}})
                }else{
                    ElMessage.warning("发布失败");
                }
            });
        };
        return {
            addform,
            editor,
            content,
            addDraft,
            addPublish,
            toHome,
            uploadUrl,
            uploadSuccess,
            editVisible,
            selectCategoryDate,
            selectDate,
            insertContent
        };
    },
};
</script>

<style>

#ArticleText {
  height: 100%;
  width: 100%;
  position: relative;
  user-select: none;
  display: flex;
  flex-direction: column;
}
.user-avator {
    margin-left: 20px;
    margin-right: 10px;

}
  #ArticleTextHead {
    height: 75px;
    width: 100%;
    background-color: red;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    z-index: 999;
    background-color:white;
    }

    #ArticleTextHeadBack {
      width: 150px;
      font-weight: bold;
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }

    .el-divider {
      height: 24px;
    }

    #ArticleTextHeadTitle {
      display: flex;
      align-items: center;
      width: 90%;
      position: relative;
    }
      .el-input {
        flex: 1;
      }

      #ArticleTextHeadTitleOperate {
        width: 250px;
        margin: 0 30px;
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
        .el-avatar {
          cursor: pointer;
        }
      
  #ArticleTextContent {
    flex: 1;
    margin-top: 10px;
    width: 100%;
  }

  .toolbar {
    border: 1px solid #ccc;
  }

  /* .text {
    border: 1px solid #ccc;
    min-height: 400px;
  } */
  .container{
      width: 43%;
    margin: 0 auto;
    height: 90%;
    overflow-y: scroll;
  }

</style>