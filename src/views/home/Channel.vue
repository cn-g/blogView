<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 轮播管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.blogTitle" placeholder="标题" class="handle-input mr10" clearable></el-input>
                <el-select v-model="query.status" placeholder="状态" class="handle-select mr10" clearable>
                    <el-option key="0" label="禁用" value="0"></el-option>
                    <el-option key="1" label="启用" value="1"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-circle-plus" @click="addEdit">添加</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="blogTitle" label="标题"></el-table-column>
                <el-table-column prop="blogDesc" label="描述"></el-table-column>
                <el-table-column prop="blogUrl" label="链接地址"></el-table-column>
                <el-table-column label="展示图" align="center">
                    <template #default="scope">
                        <el-image class="table-td-thumb" :src="scope.row.blogPic" :preview-src-list="[scope.row.blogPic]" lazy>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template #default="scope">
                        <el-tag :type="scope.row.status === 1?'success':scope.row.status === 0?'danger':''">{{ statusData[scope.row.status] }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="sort" label="排序"></el-table-column>
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
                    <el-input v-model="updateform.blogTitle"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="updateform.blogDesc"></el-input>
                </el-form-item>
                <el-form-item label="轮播图">
                    <el-upload class="upload-demo" 
                        :action=uploadUrl 
                        auto-upload 
                        :on-success="uploadSuccess">
                        <el-image v-if="updateform.blogPic" class="table-td-thumb" :src="updateform.blogPic" fit="fill" style="width:100%;height:100%" lazy>
                        </el-image>
                        <i v-else class="el-icon-upload"></i>
                        <div v-if="!updateform.blogPic">
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="链接地址">
                    <el-input v-model="updateform.blogUrl"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="updateform.sort"></el-input>
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
                    <el-input v-model="addform.blogTitle"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="addform.blogDesc"></el-input>
                </el-form-item>
                <el-form-item label="轮播图">
                    <el-upload class="upload-demo" 
                        :action=uploadUrl 
                        auto-upload 
                        :on-success="uploadSuccess">
                        <el-image v-if="addform.blogPic" class="table-td-thumb" :src="addform.blogPic" fit="fill" style="width:100%;height:100%" lazy>
                        </el-image>
                        <i v-else class="el-icon-upload"></i>
                        <div v-if="!addform.blogPic">
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="链接地址">
                    <el-input v-model="addform.blogUrl"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="addform.sort"></el-input>
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
import { updateChannel, addChannel, deleteChannel, getChannelPage } from "../../api/index";

export default {
    name: "channel",
    setup() {
        const query = reactive({
            blogTitle: "",
            status:"",
            page: 1,
            rows: 10,
        });
        const tableData = ref([]);
        const pageTotal = ref(0);
        // 获取表格数据
        const getData = () => {
            getChannelPage(query).then((res) => {
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

        //上传图片
        const uploadUrl = "http://localhost:8080/api/cloud/uploadImg";
        const uploadSuccess = (res)=>{
            addform.blogPic = res.data;
            updateform.blogPic = res.data;
        }

        // 删除操作
        const handleDelete = (index,res) => {
            deleteData.id = res.id;
            // 二次确认删除
            ElMessageBox.confirm("确定要删除吗？", "提示", {
                type: "warning",
            })
                .then(() => {
                    console.log(res.id);
                    deleteChannel(deleteData).then((res)=>{
                        if(res.errorCode == 200){
                            ElMessage.success("删除成功");
                            getData();
                        }else{
                            ElMessage.warning(res.message);
                        }
                    })
                })
                .catch(() => {});
        };


        // 表格编辑时弹窗和保存
        const editVisible = ref(false);
        let updateform = reactive({
            id:"",
            status: "",
            blogUrl:"",
            blogPic:"",
            blogTitle:"",
            blogDesc:"",
            sort:""
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
            updateChannel(updateform).then((res)=>{
                if(res.errorCode == 200){
                    editVisible.value = false;
                    ElMessage.success(`修改成功`);
                    getData();
                }else{
                    ElMessage.warning(res.message);
                }
                
            });
            
        };
        //添加操作
        const addEditVisible = ref(false);
        const addEdit = () => {
            addEditVisible.value = true;
        };
        let addform = reactive({
            status: "",
            blogUrl:"",
            blogPic:"",
            blogTitle:"",
            blogDesc:"",
            sort:""
        });
        const addEssayEdit = () => {
            addChannel(addform).then((res)=>{
                if(res.errorCode == 200){
                    addEditVisible.value = false;
                    ElMessage.success(`添加成功`);
                    getData();
                }else{
                    ElMessage.warning(res.message);
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
            statusData,
            uploadUrl,
            uploadSuccess,
            handleSearch,
            handlePageChange,
            handleDelete,
            addEdit,
            handleEdit,
            addEssayEdit,
            saveEdit,
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
/* :deep(.el-form-item .el-upload) {
  width: 100px;
  height: 100px;
} */
</style>
