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
                <el-date-picker type="date" placeholder="选择日期" value-format="YYYY-MM-DD" v-model="query.day" style="margin-right:10px" clearable></el-date-picker>
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
                <el-table-column label="展示图" align="center">
                    <template #default="scope">
                        <el-image class="table-td-thumb" :src="scope.row.blogPic" :preview-src-list="[scope.row.blogPic]" lazy>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="blogTime" label="发布时间"></el-table-column>
                <el-table-column prop="day" label="展示时间"></el-table-column>
                <el-table-column prop="blogUserName" label="博主昵称"></el-table-column>
                <el-table-column label="博主头像" align="center">
                    <template #default="scope">
                        <el-image class="table-td-thumb" :src="scope.row.blogUserPic" :preview-src-list="[scope.row.blogUserPic]" lazy>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="序号" v-if="false"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template #default="scope">
                        <el-tag :type="scope.row.status === 1?'success':scope.row.status === 0?'danger':''">{{ statusData[scope.row.status] }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间"></el-table-column>
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
                <el-form-item label="博客选择" prop="region">
                    <el-select v-model="updateform.blogId" placeholder="请选择" filterable :filter-method="searchEssay" @change="getEssayById" clearable>
                        <el-option v-for="essay in selectDate" :key="essay.id" :label="essay.name" :value="essay.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="博主昵称" v-if="updateform.blogId">
                    <el-input v-model="updateform.blogUserName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="博主头像" v-if="updateform.blogId">
                    <el-image class="table-td-thumb" :src="updateform.blogUserPic" lazy></el-image>
                </el-form-item>
                <el-form-item label="发布日期" v-if="updateform.blogId">
                    <el-date-picker type="datetime" placeholder="选择日期" value-format="YYYY-MM-DD hh:mm:ss" v-model="updateform.blogTime"
                        :disabled="true" ></el-date-picker>
                </el-form-item>
                <el-form-item label="博客图片" v-if="updateform.blogPic">
                    <el-image  class="table-td-thumb" :src="updateform.blogPic" style="width:80%;height:80%" lazy>
                    </el-image>
                </el-form-item>
                <el-form-item label="展示日期" prop="day">
                    <el-date-picker type="date" placeholder="选择日期" value-format="YYYY-MM-DD" v-model="updateform.day" clearable></el-date-picker>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input type="number" v-model="updateform.sort"></el-input>
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
                <el-form-item label="博客选择" prop="region">
                    <el-select v-model="addform.blogId" placeholder="请选择" filterable :filter-method="searchEssay" @change="getEssayById" clearable>
                        <el-option v-for="essay in selectDate" :key="essay.id" :label="essay.name" :value="essay.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="博主昵称" v-if="addform.blogId">
                    <el-input v-model="addform.blogUserName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="博主头像" v-if="addform.blogId">
                    <el-image class="table-td-thumb" :src="addform.blogUserPic" lazy></el-image>
                </el-form-item>
                <el-form-item label="发布日期" v-if="addform.blogId">
                    <el-date-picker type="datetime" placeholder="选择日期" value-format="YYYY-MM-DD hh:mm:ss" v-model="addform.blogTime"
                        :disabled="true" ></el-date-picker>
                </el-form-item>
                <el-form-item label="博客图片" v-if="addform.blogPic">
                    <el-image  class="table-td-thumb" :src="addform.blogPic" style="width:80%;height:80%" lazy>
                    </el-image>
                </el-form-item>
                <el-form-item label="展示日期" prop="day">
                    <el-date-picker type="date" placeholder="选择日期" value-format="YYYY-MM-DD" v-model="addform.day" clearable></el-date-picker>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input type="number" v-model="addform.sort"></el-input>
                </el-form-item>
                <el-form-item label="状态" disabled="true">
                    <el-radio v-model="addform.status" :label="0">禁用</el-radio>
                    <el-radio v-model="addform.status" :label="1">启用</el-radio>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addEditVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addRecommendEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { updateRecommend, addRecommend, deleteRecommend, getRecommendPage, getEssayData, getEssay } from "../../api/index";

export default {
    name: "recommend",
    setup() {
        const query = reactive({
            day: "",
            status:"",
            page: 1,
            rows: 10,
        });
        const tableData = ref([]);
        const pageTotal = ref(0);
        // 获取表格数据
        const getData = () => {
            getRecommendPage(query).then((res) => {
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
                    deleteRecommend(deleteData).then((res)=>{
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
            blogId: "",
            blogPic:"",
            blogTitle:"",
            blogUserId:"",
            blogUserName:"",
            blogUserPic:"",
            blogTime:"",
            sort:"",
            status: "",
            day:""
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
            updateRecommend(updateform).then((res)=>{
                if(res.errorCode == 200){
                    editVisible.value = false;
                    ElMessage.success(`修改成功`);
                    getData();
                }else{
                    ElMessage.warning(res.message);
                }
                
            });
            
        };
        let selectName = reactive({
            name:"",
        });
        const searchEssay = (val)=>{
            selectName.name = val;
            selectEssayDate();
        }
        const selectEssayDate = ()=>{
            getEssayData(selectName).then((res)=>{
                selectDate.value = res.data;
            });
        };
        selectEssayDate();

        const getEssayById = ()=>{
            if(addform.blogId!=""){
                deleteData.id = addform.blogId;
            }
            if(updateform.blogId!=""){
                deleteData.id = updateform.blogId;
            }
            getEssay(deleteData).then((res)=>{
                console.log(editVisible.value);
                if(addEditVisible.value){
                        addform.blogId = res.data.id;
                        addform.blogTitle= res.data.title;
                        addform.blogPic = res.data.picUrl;
                        addform.blogUserId = res.data.userId;
                        addform.blogUserName = res.data.name;
                        addform.blogUserPic = res.data.userPicUrl;
                        addform.blogTime = res.data.publishTime;
                }
                if(editVisible.value){
                        updateform.blogId = res.data.id;
                        updateform.blogTitle= res.data.title;
                        updateform.blogPic = res.data.picUrl;
                        updateform.blogUserId = res.data.userId;
                        updateform.blogUserName = res.data.name;
                        updateform.blogUserPic = res.data.userPicUrl;
                        updateform.blogTime = res.data.publishTime;
                }
                    
            })
        }
        const selectDate = ref([]);
        const selectAccountDate = ref([]);
        //添加操作
        const addEditVisible = ref(false);
        const addEdit = () => {
            addEditVisible.value = true;
        };
        let addform = reactive({
            blogId: "",
            blogPic:"",
            blogTitle:"",
            blogUserId:"",
            blogUserName:"",
            blogUserPic:"",
            blogTime:"",
            sort:"",
            status: "",
            day:""
        });
        const addRecommendEdit = () => {
            addRecommend(addform).then((res)=>{
                console.log(res.message);
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
            selectDate,
            statusData,
            pubData,
            selectAccountDate,
            selectName,
            uploadUrl,
            searchEssay,
            uploadSuccess,
            handleSearch,
            handlePageChange,
            handleDelete,
            addEdit,
            handleEdit,
            addRecommendEdit,
            saveEdit,
            selectEssayDate,
            getEssayById
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
