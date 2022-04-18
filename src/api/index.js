import request from '../utils/request';
//登录
export const userLogin = query => {
    return request({
        url: '/login/userLogin',
        method: 'get',
        params: query
    });
};
//注册
export const userRegister = data => {
    return request({
        url: '/login/userRegister',
        method: 'post',
        data: data
    });
};
//保存图片
export const uploadImg = data => {
    return request({
        url: '/cloud/uploadImg',
        method: 'post',
        data: data
    });
};
//前台博客列表
export const getHomeEssayPage = query => {
    return request({
        url: '/web-reception/home/getEssayPage',
        method: 'get',
        params: query
    });
};
//前台轮播图列表
export const getHomeChannel = query => {
    return request({
        url: '/web-reception/home/getChannelList',
        method: 'get',
        params: query
    });
};
//前台获取类目列表
export const getHomeCategory = query => {
    return request({
        url: '/web-reception/home/getCategory',
        method: 'get',
        params: query
    });
};
//前台获取热门博客榜单
export const getHomeRecommendList = query => {
    return request({
        url: '/web-reception/home/getRecommendList',
        method: 'get',
        params: query
    });
};
//前台获取热门博主榜单
export const getHomeUserRecommendList = query => {
    return request({
        url: '/web-reception/home/getUserRecommendList',
        method: 'get',
        params: query
    });
};
//前台获取热门搜索
export const getHomeSearchList = query => {
    return request({
        url: '/web-reception/home/getSearchList',
        method: 'get',
        params: query
    });
};
//账号
export const getAccountPage = query => {
    return request({
        url: '/web-admin/account/getAccountPage',
        method: 'get',
        params: query
    });
};
export const getAccount = query => {
    return request({
        url: '/web-admin/account/getAccount',
        method: 'get',
        params: query
    });
};
export const updateAccount = data => {
    return request({
        url: '/web-admin/account/updateAccount',
        method: 'post',
        data: data
    });
};
export const addAccount = data => {
    return request({
        url: '/web-admin/account/addAccount',
        method: 'post',
        data: data
    });
};
export const deleteAccount = data => {
    return request({
        url: '/web-admin/account/deleteAccount',
        method: 'post',
        data: data
    });
};
export const getAccountData = query => {
    return request({
        url: '/web-admin/account/getAccountData',
        method: 'get',
        params: query
    });
};
//用户
export const getUserPage = query => {
    return request({
        url: '/web-admin/user/getUserPage',
        method: 'get',
        params: query
    });
};
export const getUser = query => {
    return request({
        url: '/web-admin/user/getUser',
        method: 'get',
        params: query
    });
};
export const addUser = data => {
    return request({
        url: '/web-admin/user/addUser',
        method: 'post',
        data: data
    });
};
export const updateUser = data => {
    return request({
        url: '/web-admin/user/updateUser',
        method: 'post',
        data: data
    });
};
export const deleteUser = data => {
    return request({
        url: '/web-admin/user/deleteUser',
        method: 'post',
        data: data
    });
};
export const getUserRecommendByUserId = query => {
    return request({
        url: '/web-admin/user/getUserRecommendByUserId',
        method: 'get',
        params: query
    });
};
//角色
export const getRolePage = query => {
    return request({
        url: '/web-admin/role/getRolePage',
        method: 'get',
        params: query
    });
};
export const addRole = data => {
    return request({
        url: '/web-admin/role/addRole',
        method: 'post',
        data: data
    });
};
export const updateRole = data => {
    return request({
        url: '/web-admin/role/updateRole',
        method: 'post',
        data: data
    });
};
export const deleteRole = data => {
    return request({
        url: '/web-admin/role/deleteRole',
        method: 'post',
        data: data
    });
};
export const getRoleData = query => {
    return request({
        url: '/web-admin/role/getRoleData',
        method: 'get',
        params: query
    });
};
//接口
export const getUrlPage = query => {
    return request({
        url: '/web-admin/url/getUrlPage',
        method: 'get',
        params: query
    });
};
export const addUrl = data => {
    return request({
        url: '/web-admin/url/addUrl',
        method: 'post',
        data: data
    });
};
export const updateUrl = data => {
    return request({
        url: '/web-admin/url/updateUrl',
        method: 'post',
        data: data
    });
};
export const deleteUrl = data => {
    return request({
        url: '/web-admin/url/deleteUrl',
        method: 'post',
        data: data
    });
};
//操作
export const getOperatePage = query => {
    return request({
        url: '/web-admin/operate/getOperatePage',
        method: 'get',
        params: query
    });
};
export const addOperate = data => {
    return request({
        url: '/web-admin/operate/addOperate',
        method: 'post',
        data: data
    });
};
export const updateOperate = data => {
    return request({
        url: '/web-admin/operate/updateOperate',
        method: 'post',
        data: data
    });
};
export const deleteOperate = data => {
    return request({
        url: '/web-admin/operate/deleteOperate',
        method: 'post',
        data: data
    });
};
//类目
export const getCategoryPage = query => {
    return request({
        url: '/web-admin/category/getCategoryPage',
        method: 'get',
        params: query
    });
};
export const addCategory = data => {
    return request({
        url: '/web-admin/category/addCategory',
        method: 'post',
        data: data
    });
};
export const updateCategory = data => {
    return request({
        url: '/web-admin/category/updateCategory',
        method: 'post',
        data: data
    });
};
export const deleteCategory = data => {
    return request({
        url: '/web-admin/category/deleteCategory',
        method: 'post',
        data: data
    });
};
export const getCategoryData = query => {
    return request({
        url: '/web-admin/category/getCategoryData',
        method: 'get',
        params: query
    });
};
//博客
export const getEssayPage = query => {
    return request({
        url: '/web-admin/essay/getEssayPage',
        method: 'get',
        params: query
    });
};
export const addEssay = data => {
    return request({
        url: '/web-admin/essay/addEssay',
        method: 'post',
        data: data
    });
};
export const updateEssay = data => {
    return request({
        url: '/web-admin/essay/updateEssay',
        method: 'post',
        data: data
    });
};
export const deleteEssay = data => {
    return request({
        url: '/web-admin/essay/deleteEssay',
        method: 'post',
        data: data
    });
};
export const getEssayData = query => {
    return request({
        url: '/web-admin/essay/getEssayData',
        method: 'get',
        params: query
    });
};
export const getEssay = query => {
    return request({
        url: '/web-admin/essay/getEssay',
        method: 'get',
        params: query
    });
};
export const getEssayRatio = query => {
    return request({
        url: '/web-admin/essay/getEssayRatio',
        method: 'get',
        params: query
    });
};
//轮播
export const getChannelPage = query => {
    return request({
        url: '/web-admin/channel/getChannelPage',
        method: 'get',
        params: query
    });
};
export const addChannel = data => {
    return request({
        url: '/web-admin/channel/addChannel',
        method: 'post',
        data: data
    });
};
export const updateChannel = data => {
    return request({
        url: '/web-admin/channel/updateChannel',
        method: 'post',
        data: data
    });
};
export const deleteChannel = data => {
    return request({
        url: '/web-admin/channel/deleteChannel',
        method: 'post',
        data: data
    });
};
//搜索关键字
export const getSearchPage = query => {
    return request({
        url: '/web-admin/search/getSearchPage',
        method: 'get',
        params: query
    });
};
export const addSearch = data => {
    return request({
        url: '/web-admin/search/addSearch',
        method: 'post',
        data: data
    });
};
export const updateSearch = data => {
    return request({
        url: '/web-admin/search/updateSearch',
        method: 'post',
        data: data
    });
};
export const deleteSearch = data => {
    return request({
        url: '/web-admin/search/deleteSearch',
        method: 'post',
        data: data
    });
};
//搜索历史
export const getHistoryPage = query => {
    return request({
        url: '/web-admin/history/getHistoryPage',
        method: 'get',
        params: query
    });
};
export const addHistory = data => {
    return request({
        url: '/web-admin/history/addHistory',
        method: 'post',
        data: data
    });
};
export const updateHistory = data => {
    return request({
        url: '/web-admin/history/updateHistory',
        method: 'post',
        data: data
    });
};
export const deleteHistory = data => {
    return request({
        url: '/web-admin/history/deleteHistory',
        method: 'post',
        data: data
    });
};
//热门博客榜单
export const getRecommendPage = query => {
    return request({
        url: '/web-admin/recommend/getRecommendPage',
        method: 'get',
        params: query
    });
};
export const addRecommend = data => {
    return request({
        url: '/web-admin/recommend/addRecommend',
        method: 'post',
        data: data
    });
};
export const updateRecommend = data => {
    return request({
        url: '/web-admin/recommend/updateRecommend',
        method: 'post',
        data: data
    });
};
export const deleteRecommend = data => {
    return request({
        url: '/web-admin/recommend/deleteRecommend',
        method: 'post',
        data: data
    });
};
//热门博主榜单
export const getUserRecommendPage = query => {
    return request({
        url: '/web-admin/userRecommend/getUserRecommendPage',
        method: 'get',
        params: query
    });
};
export const addUserRecommend = data => {
    return request({
        url: '/web-admin/userRecommend/addUserRecommend',
        method: 'post',
        data: data
    });
};
export const updateUserRecommend = data => {
    return request({
        url: '/web-admin/userRecommend/updateUserRecommend',
        method: 'post',
        data: data
    });
};
export const deleteUserRecommend = data => {
    return request({
        url: '/web-admin/userRecommend/deleteUserRecommend',
        method: 'post',
        data: data
    });
};
//待办事项
export const getThingList = query => {
    return request({
        url: '/web-admin/thing/getThingList',
        method: 'get',
        params: query
    });
};
export const addThing = data => {
    return request({
        url: '/web-admin/thing/addThing',
        method: 'post',
        data: data
    });
};
export const updateThing = data => {
    return request({
        url: '/web-admin/thing/updateThing',
        method: 'post',
        data: data
    });
};