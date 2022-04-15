<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 博客管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.title" placeholder="标题" class="handle-input mr10" clearable></el-input>
                <el-select v-model="query.categoryId" placeholder="类目" class="handle-select mr10" clearable>
                    <el-option v-for="category in selectDate" :key="category.id" :label="category.name" :value="category.id"></el-option>
                </el-select>
                <el-select v-model="query.status" placeholder="状态" class="handle-select mr10" clearable>
                    <el-option key="0" label="禁用" value="0"></el-option>
                    <el-option key="1" label="启用" value="1"></el-option>
                </el-select>
                <el-select v-model="query.label" placeholder="标签" class="handle-select mr10" clearable>
                    <el-option key="1" label="发布" value="1"></el-option>
                    <el-option key="2" label="草稿" value="2"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-circle-plus" @click="addEdit">添加</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="synopsis" label="摘要"></el-table-column>
                <el-table-column label="展示图" align="center">
                    <template #default="scope">
                        <el-image class="table-td-thumb" :src="scope.row.picUrl" :preview-src-list="[scope.row.picUrl]" lazy>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="内容" v-if="false"></el-table-column>
                <el-table-column label="标签" align="center">
                    <template #default="scope">
                        <el-tag :type="scope.row.label === 1?'success':scope.row.label === 2?'danger':''">{{ pubData[scope.row.label] }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="commentNumber" label="评论数"></el-table-column>
                <el-table-column prop="goodNumber" label="点赞数"></el-table-column>
                <el-table-column prop="viewNumber" label="浏览数"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template #default="scope">
                        <el-tag :type="scope.row.status === 1?'success':scope.row.status === 0?'danger':''">{{ statusData[scope.row.status] }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="publishTime" label="发布时间"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.page"
                    :page-size="query.rows" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-model="editVisible" width="30%">
            <el-form label-width="70px">
                <el-form-item label="标题">
                    <el-input v-model="updateform.title"></el-input>
                </el-form-item>
                <el-form-item label="摘要">
                    <el-input v-model="updateform.synopsis"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload class="upload-demo" 
                        :action=uploadUrl 
                        auto-upload 
                        :on-success="uploadSuccess">
                        <el-image v-if="updateform.picUrl" class="table-td-thumb" :src="updateform.picUrl" fit="fill" style="width:100%;height:100%" lazy>
                        </el-image>
                        <i v-else class="el-icon-upload"></i>
                        <div v-if="!updateform.picUrl">
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="内容">
                    <el-input type="textarea" rows="3" v-model="updateform.content"></el-input>
                </el-form-item>
                <el-form-item label="类目" prop="region">
                    <el-select v-model="updateform.categoryId" placeholder="请选择">
                        <el-option v-for="category in selectDate" :key="category.id" :label="category.name" :value="category.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发布人" prop="region">
                    <el-select v-model="updateform.userId" placeholder="请选择">
                        <el-option v-for="account in selectAccountDate" :key="account.id" :label="account.name" :value="account.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签">
                    <el-radio v-model="updateform.label" :label="1">发布</el-radio>
                    <el-radio v-model="updateform.label" :label="2">草稿</el-radio>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio v-model="updateform.status" :label="0">禁用</el-radio>
                    <el-radio v-model="updateform.status" :label="1">启用</el-radio>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 添加弹出框 -->
        <el-dialog title="添加" v-model="addEditVisible" width="30%">
            <el-form label-width="70px">
                <el-form-item label="标题">
                    <el-input v-model="addform.title"></el-input>
                </el-form-item>
                <el-form-item label="摘要">
                    <el-input v-model="addform.synopsis"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload class="upload-demo" 
                        :action=uploadUrl 
                        auto-upload 
                        :on-success="uploadSuccess">
                        <el-image v-if="addform.picUrl" class="table-td-thumb" :src="addform.picUrl" fit="fill" style="width:100%;height:100%" lazy>
                        </el-image>
                        <i v-else class="el-icon-upload"></i>
                        <div v-if="!updateform.picUrl">
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="内容">
                    <el-input type="textarea" rows="3" v-model="addform.content"></el-input>
                </el-form-item>
                <el-form-item label="类目" prop="region">
                    <el-select v-model="addform.categoryId" placeholder="请选择">
                        <el-option v-for="category in selectDate" :key="category.id" :label="category.name" :value="category.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发布人" prop="region">
                    <el-select v-model="addform.userId" placeholder="请选择">
                        <el-option v-for="account in selectAccountDate" :key="account.id" :label="account.name" :value="account.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签">
                    <el-radio v-model="addform.label" :label="1">发布</el-radio>
                    <el-radio v-model="addform.label" :label="2">草稿</el-radio>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio v-model="addform.status" :label="0">禁用</el-radio>
                    <el-radio v-model="addform.status" :label="1">启用</el-radio>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addEditVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addEssayEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { updateEssay, addEssay, deleteEssay, getEssayPage, getCategoryData, getAccountData } from "../../api/index";

export default {
    name: "essay",
    setup() {
        const query = reactive({
            title: "",
            categoryId: "",
            label:"",
            status:"",
            page: 1,
            rows: 10,
        });
        const tableData = ref([]);
        const pageTotal = ref(0);
        // 获取表格数据
        const getData = () => {
            getEssayPage(query).then((res) => {
                if(res.errorCode == 200){
                    tableData.value = res.data;
                }else{
                    tableData.value = null;
                    ElMessage.warning(res.message);
                }
                pageTotal.value = res.total || 50;
                
            });
        };
        getData();

        // 查询操作
        const handleSearch = () => {
            query.page = 1;
            getData();
        };
        // 分页导航
        const handlePageChange = (val) => {
            query.page = val;
            getData();
        };

        let deleteData = reactive({
            id:"",
        });
        const statusData = reactive({
            '0':'禁用',
            '1':'启用',
        });
        //文章标签
        const pubData = reactive({
            '1':'发布',
            '2':'草稿',
        });



        // 删除操作
        const handleDelete = (index,res) => {
            deleteData.id = res.id;
            // 二次确认删除
            ElMessageBox.confirm("确定要删除吗？", "提示", {
                type: "warning",
            })
                .then(() => {
                    console.log(res.id);
                    deleteEssay(deleteData).then((res)=>{
                        if(res.errorCode == 200){
                            ElMessage.success("删除成功");
                            getData();
                        }else{
                            ElMessage.success(res.message);
                        }
                    })
                })
                .catch(() => {});
        };

        //上传图片
        const uploadUrl = "http://localhost:8080/api/cloud/uploadImg";
        const uploadSuccess = (res)=>{
            addform.picUrl = res.data;
            updateform.picUrl = res.data;
        }

        // 表格编辑时弹窗和保存
        const editVisible = ref(false);
        let updateform = reactive({
            id:"",
            categoryId: "",
            content:"",
            label:"",
            status: "",
            synopsis:"",
            picUrl:"",
            title:"",
            userId:""
        });
        let idx = -1;
        const handleEdit = (index, row) => {
            idx = index;
            Object.keys(updateform).forEach((item) => {
                updateform[item] = row[item];
            });
            editVisible.value = true;
        };
        const saveEdit = () => {
            updateEssay(updateform).then((res)=>{
                if(res.errorCode == 200){
                    editVisible.value = false;
                    ElMessage.success(`修改成功`);
                    getData();
                }else{
                    ElMessage.warning("修改失败");
                }
                
            });
            
        };

        const selectCategoryDate = ()=>{
            getCategoryData().then((res)=>{
                selectDate.value = res.data;
            });
            getAccountData().then((res)=>{
                selectAccountDate.value = res.data;
            });
        };
        selectCategoryDate();
        const selectDate = ref([]);
        const selectAccountDate = ref([]);
        //添加操作
        const addEditVisible = ref(false);
        const addEdit = () => {
            addEditVisible.value = true;
        };
        let addform = reactive({
            categoryId: "",
            content:"",
            label:"",
            status: "",
            picUrl:"",
            synopsis:"",
            title:"",
            userId:""
        });
        const addEssayEdit = () => {
            addEssay(addform).then((res)=>{
                if(res.errorCode == 200){
                    addEditVisible.value = false;
                    ElMessage.success(`添加成功`);
                    getData();
                }else{
                    ElMessage.success(res.message);
                }
            });
            
        };
        


        return {
            query,
            tableData,
            pageTotal,
            editVisible,
            addEditVisible,
            updateform,
            addform,
            selectDate,
            statusData,
            pubData,
            selectAccountDate,
            uploadUrl,
            uploadSuccess,
            handleSearch,
            handlePageChange,
            handleDelete,
            addEdit,
            handleEdit,
            addEssayEdit,
            saveEdit,
            selectCategoryDate,
        };
    },
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
:deep(.el-form-item .el-upload) {
  width: 100px;
  height: 100px;
}
</style>
