<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 账号管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.account" placeholder="用户名" class="handle-input mr10" clearable></el-input>
                <el-input v-model="query.phone" placeholder="手机号" class="handle-input mr10" clearable></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-circle-plus" @click="addEdit">添加</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="account" label="用户名"></el-table-column>
                <el-table-column prop="phone" label="手机号"></el-table-column>
                <el-table-column prop="qqNumber" label="QQ号"></el-table-column>
                <el-table-column prop="weChat" label="微信号"></el-table-column>
                <el-table-column label="角色" align="center">
                    <template #default="scope">
                        <el-tag type='success'>{{ scope.row.roleName }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="用户类型" align="center">
                    <template #default="scope">
                        <el-tag :type="scope.row.type === 1?'success':scope.row.type === 0?'danger':''">{{ typeData[scope.row.type] }}</el-tag>
                    </template>
                </el-table-column>
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
                <el-form-item label="用户名">
                    <el-input v-model="updateform.account"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="updateform.password"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="region">
                    <el-select v-model="updateform.roleId" placeholder="请选择">
                        <el-option v-for="role in selectDate" :key="role.id" :label="role.name" :value="role.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="updateform.phone"></el-input>
                </el-form-item>
                <el-form-item label="QQ号">
                    <el-input v-model="updateform.qqNumber"></el-input>
                </el-form-item>
                <el-form-item label="微信号">
                    <el-input v-model="updateform.weChat"></el-input>
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
                <el-form-item label="用户名">
                    <el-input v-model="addform.account"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="addform.password"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="region">
                    <el-select v-model="addform.roleId" placeholder="请选择">
                        <el-option v-for="role in selectDate" :key="role.id" :label="role.name" :value="role.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户类型">
                    <el-radio v-model="addform.type" :label="1">前台</el-radio>
                    <el-radio v-model="addform.type" :label="2">后台</el-radio>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="addform.phone"></el-input>
                </el-form-item>
                <el-form-item label="QQ号">
                    <el-input v-model="addform.qqNumber"></el-input>
                </el-form-item>
                <el-form-item label="微信号">
                    <el-input v-model="addform.weChat"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addEditVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addAccountEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { updateAccount, addAccount, deleteAccount, getAccountPage, getRoleData } from "../../api/index";

export default {
    name: "account",
    setup() {
        const query = reactive({
            account: "",
            phone: "",
            qqNumber:"",
            weChat:"",
            page: 1,
            rows: 10,
        });
        const tableData = ref([]);
        const pageTotal = ref(0);
        const typeData = reactive({
            '1':'前台用户',
            '2':'后台用户',
        });
        // 获取表格数据
        const getData = () => {
            getAccountPage(query).then((res) => {
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
        })

        // 删除操作
        const handleDelete = (index,res) => {
            deleteData.id = res.id;
            // 二次确认删除
            ElMessageBox.confirm("确定要删除吗？", "提示", {
                type: "warning",
            })
                .then(() => {
                    console.log(res.id);
                    deleteAccount(deleteData).then((res)=>{
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
            account: "",
            password:"",
            phone: "",
            roleId:"",
            qqNumber:"",
            weChat:"",
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
            updateAccount(updateform).then((res)=>{
                if(res.errorCode == 200){
                    editVisible.value = false;
                    ElMessage.success(`修改成功`);
                    getData();
                }else{
                    ElMessage.warning(res.message);
                }
            });
            
        };
        let nameData = reactive({
            name:"",
        })
        const selectRoleDate = ()=>{
            getRoleData(nameData).then((res)=>{
                selectDate.value = res.data;
            })
        };
        selectRoleDate();

        //添加操作
        const addEditVisible = ref(false);
        const selectDate = ref([]);
        const addEdit = () => {
            addEditVisible.value = true;
        };
        let addform = reactive({
            account: "",
            roleId:"",
            password:"",
            phone: "",
            qqNumber:"",
            weChat:"",
            type:null
        });
        const addAccountEdit = () => {
            addAccount(addform).then((res)=>{
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
            typeData,
            nameData,
            query,
            tableData,
            pageTotal,
            editVisible,
            addEditVisible,
            updateform,
            addform,
            selectDate,
            handleSearch,
            handlePageChange,
            handleDelete,
            addEdit,
            handleEdit,
            addAccountEdit,
            saveEdit,
            selectRoleDate,
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
</style>
