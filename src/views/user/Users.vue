<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.realName" placeholder="用户姓名" class="handle-input mr10" clearable></el-input>
                <el-select v-model="query.sex" placeholder="性别" class="handle-select mr10" clearable>
                    <el-option key="1" label="男" value="1"></el-option>
                    <el-option key="2" label="女" value="2"></el-option>
                    <el-option key="2" label="未知" value="3"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-circle-plus" @click="addEdit">添加</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="account" label="用户账号"></el-table-column>
                <el-table-column prop="realName" label="用户姓名"></el-table-column>
                <el-table-column label="头像" align="center">
                    <template #default="scope">
                        <el-image class="table-td-thumb" :src="scope.row.picUrl" :preview-src-list="[scope.row.picUrl]" lazy>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column label="性别" align="center">
                    <template #default="scope">
                        <el-tag :type="scope.row.sex === 1?'success':scope.row.sex === 2?'danger':''">{{ sexData[scope.row.sex] }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="synopsis" label="用户简介"></el-table-column>
                <el-table-column prop="areaName" label="所在地区"></el-table-column>
                <el-table-column prop="birthday" label="出生日期"></el-table-column>
                <el-table-column prop="nativePlace" label="籍贯"></el-table-column>
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
                <el-form-item label="姓名">
                    <el-input v-model="updateform.realName"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                        <el-radio v-model="updateform.sex" :label="1">男</el-radio>
                        <el-radio v-model="updateform.sex" :label="2">女</el-radio>
                        <el-radio v-model="updateform.sex" :label="3">未知</el-radio>
                </el-form-item>
                <el-form-item label="地址">
                    <!-- <el-input v-if="updateform.areaName" v-model="updateform.areaName"></el-input> -->
                    <el-cascader
                        size="large"
                        :options="options"
                        v-model="selectedOptions"
                        @change="getAddress">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload class="upload-demo" 
                        :action=uploadUrl 
                        auto-upload 
                        :on-success="uploadSuccess" >
                        <el-image v-if="updateform.picUrl" class="table-td-thumb" :src="updateform.picUrl" fit="fill" style="width:100%;height:100%" lazy>
                        </el-image>
                        <i v-else class="el-icon-upload"></i>
                        <div v-if="!updateform.picUrl" >
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="类目" prop="region">
                    <el-select v-model="updateform.categories" placeholder="请选择" multiple>
                        <el-option v-for="category in selectDate" :key="category.id" :label="category.name" :value="category.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出生日期">
                        <el-date-picker type="date" placeholder="选择日期" value-format="YYYY-MM-DD" v-model="updateform.birthday"
                            style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="籍贯">
                    <el-input v-model="updateform.nativePlace"></el-input>
                </el-form-item>
                <el-form-item label="简介">
                    <el-input type="textarea" rows="1" v-model="updateform.synopsis"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                        <el-radio v-model="updateform.status" :label="0">禁用</el-radio>
                        <el-radio v-model="updateform.status" :label="1">启用</el-radio>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 添加弹出框 -->
        <el-dialog title="添加" v-model="addEditVisible" width="30%">
            <el-form label-width="70px">
                <el-form-item label="选择账号" prop="region">
                    <el-select v-model="addform.id" placeholder="请选择" filterable :filter-method="selectAccount">
                        <el-option v-for="account in selectAccountDate" :key="account.id" :label="account.name" :value="account.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="addform.realName"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                        <el-radio v-model="addform.sex" :label="1">男</el-radio>
                        <el-radio v-model="addform.sex" :label="2">女</el-radio>
                        <el-radio v-model="addform.sex" :label="3">未知</el-radio>
                </el-form-item>
                <el-form-item label="地址">
                    <el-cascader
                        size="large"
                        :options="options"
                        v-model="selectedOptions"
                        @change="getAddress">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload class="upload-demo" 
                        :action=uploadUrl 
                        auto-upload
                        :on-success="uploadSuccess">
                        <el-image v-if="addform.picUrl" class="table-td-thumb" :src="addform.picUrl" :fit="fill" style="width:100%;height:100%" lazy>
                        </el-image>
                        <i v-else class="el-icon-upload"></i>
                        <div v-if="!addform.picUrl">
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="类目" prop="region">
                    <el-select v-model="addform.categories" placeholder="请选择" multiple>
                        <el-option v-for="category in selectDate" :key="category.id" :label="category.name" :value="category.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出生日期">
                    <el-date-picker type="date" placeholder="选择日期" value-format="YYYY-MM-DD" v-model="addform.birthday"
                        style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="籍贯">
                    <el-input v-model="addform.nativePlace"></el-input>
                </el-form-item>
                <el-form-item label="简介">
                    <el-input type="textarea" rows="1" v-model="addform.synopsis"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio v-model="addform.status" :label="0">禁用</el-radio>
                    <el-radio v-model="addform.status" :label="1">启用</el-radio>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addEditVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUserEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { updateUser, addUser, getUserPage, deleteUser, getAccountData, getCategoryData} from "../../api/index";
import { regionData } from 'element-china-area-data'

export default {
    name: "users",
    setup() {
        const query = reactive({
            realName:"",
            sex:null,
            page: 1,
            rows: 10,
        });
        const sexData = reactive({
            '1':'男',
            '2':'女',
            '3':'未知'
        });
        const tableData = ref([]);
        const pageTotal = ref(0);
        // 获取表格数据
        const getData = () => {
            getUserPage(query).then((res) => {
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
        const selectCategoryDate = ()=>{
            getCategoryData().then((res)=>{
                selectDate.value = res.data;
            });
        };
        selectCategoryDate();
        const selectDate = ref([]);
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
        })
        const selectedOptions = ref();
        //获取地址
        const getAddress = (value)=>{
            for(var i = 0;i<options.length;i++){
                if(value[0] == options[i].value){
                    for(var j = 0;j<options[i].children.length;j++){
                        if(value[1] == options[i].children[j].value){
                            for(var m = 0;m<options[i].children[j].children.length;m++){
                                if(value[2] == options[i].children[j].children[m].value){
                                    if(addEditVisible.value){
                                        addform.areaName = options[i].label + '/' + options[i].children[j].label + '/' + options[i].children[j].children[m].label;
                                        addform.provinceCode = value[0];
                                        addform.cityCode = value[1];
                                        addform.areaCode = value[2];
                                    }else{
                                        updateform.areaName = options[i].label + '/' + options[i].children[j].label + '/' + options[i].children[j].children[m].label;
                                        updateform.provinceCode = value[0];
                                        updateform.cityCode = value[1];
                                        updateform.areaCode = value[2];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        //上传图片
        const uploadUrl = "http://localhost:8080/api/cloud/uploadImg";
        const uploadSuccess = (res)=>{
            if(addEditVisible){
                addform.picUrl = res.data;
            }
            if(editVisible){
                updateform.picUrl = res.data;
            }
        }
        // 删除操作
        const handleDelete = (index,row) => {
            deleteData.id = row.id;
            // 二次确认删除
            ElMessageBox.confirm("确定要删除吗？", "提示", {
                type: "warning",
            }).then(() => {
                deleteUser(deleteData).then((res)=>{
                    if(res.errorCode == 200){
                        ElMessage.success("删除成功");
                        getData();
                    }else{
                        ElMessage.warning(res.message);
                    }
                });
            }).catch(() => {});
        };
        let selectName = reactive({
            name:"",
        });
        const selectAccount = (val)=>{
            selectName.name = val;
            getAccountData(selectName).then((res)=>{
                selectAccountDate.value = res.data;
            });
        };
        const selectAccountDate = ref([]);
        selectAccount("");
        // 表格编辑时弹窗和保存
        const editVisible = ref(false);
        let updateform = reactive({
            id:"",
            realName:"",
            picUrl:"",
            sex:null,
            synopsis:"",
            areaName:"",
            provinceCode:"",
            cityCode:"",
            areaCode:"",
            birthday:"",
            nativePlace:"",
            categories:[],
            status:null
        });
        let idx = -1;
        const handleEdit = (index, row) => {
            idx = index;
            Object.keys(updateform).forEach((item) => {
                updateform[item] = row[item];

            });
            editVisible.value = true;
        };
        const updateEdit = () => {
            updateUser(updateform).then((res)=>{
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
        const options = regionData;
        let addform = reactive({
            id:"",
            realName:"",
            picUrl:"",
            sex:null,
            synopsis:"",
            areaName:"",
            provinceCode:"",
            cityCode:"",
            areaCode:"",
            birthday:"",
            nativePlace:"",
            categories:[],
            status:null
        });
        const addUserEdit = () => {
            addUser(addform).then((res)=>{
                if(res.errorCode == 200){
                    addEditVisible.value = false;
                    ElMessage.success(`添加账号成功`);
                    getData();
                }else{
                    ElMessage.warning(res.message);
                }
            });
        };
        
        return {
            selectName,
            selectAccount,
            selectAccountDate,
            query,
            tableData,
            pageTotal,
            editVisible,
            addEditVisible,
            updateform,
            addform,
            sexData,
            options,
            selectedOptions,
            uploadUrl,
            uploadSuccess,
            getAddress,
            handleSearch,
            handlePageChange,
            handleDelete,
            addEdit,
            handleEdit,
            addUserEdit,
            updateEdit,
            selectCategoryDate,
            selectDate
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
