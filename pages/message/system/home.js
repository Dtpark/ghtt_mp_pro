// pages/message/system/home.js
const app = getApp()
const systemUrl = require('../../../config/config').systemUrl
const userAvatar = require('../../../config/config').userAvatar
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 通知列表
        list: [],
        // 当前页
        page: 1,
        userAvatar: userAvatar
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this
        app.wxApi.showLoading()
        that.requestMore(false)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        let that = this
        app.wxApi.showLoading()
        that.requestMore(false)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        let that = this
        that.requestMore(true)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    // 请求更多
    requestMore(isMore = false) {
        let that = this
        let page = that.data.page;
        if (isMore) {
            page += 1;
        } else {
            page = 1;
        }
        that.setData({
            page: page, // 更新当前页数
        })
        that.getList(); // 重新调用请求获取下一页数据 或者刷新数据
    },

    // 获取系统消息列表
    getList() {
        let that = this
        app.apimanager.postRequest(systemUrl)
            .then(res => {
                app.wxApi.hideLoading()
                app.wxApi.stopPullDownRefresh()
                    // console.log(res)
                if (res.Variables) {
                    that.setData({
                        list: res.Variables.list
                    })
                } else {
                    app.wxApi.navigateBack()
                }

            })
            .catch(e => {
                app.wxApi.hideLoading()
                app.wxApi.stopPullDownRefresh()
                console.log(e)
            })
    }
})