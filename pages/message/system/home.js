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
        // 每页条数
        perpage: 30,
        // 总条数
        count: 0,
        // 是否有更多
        isMore: false,
        userAvatar: userAvatar,
        // 富文本样式
        tagStyle: {
            blockquote: "background-color:var(--greyLight)"
        }
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
        if (Math.ceil(that.data.count / that.data.perpage) >= that.data.page + 1) {
            if (that.data.isMore == false) {
                that.setData({
                    isMore: true
                })
            }
            that.requestMore(true)
        } else {
            that.setData({
                isMore: false
            })
        }
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
        let data = {
            page: that.data.page
        }
        app.apimanager.postRequest(systemUrl, data)
            .then(res => {
                app.wxApi.hideLoading()
                app.wxApi.stopPullDownRefresh()
                    // console.log(res)
                if (!res.Message) {
                    let list = res.Variables.list
                    if (that.data.page > 1) {
                        list = that.data.list.concat(list)
                    }
                    that.setData({
                        list: list,
                        perpage: res.Variables.perpage,
                        count: res.Variables.count
                    })
                } else {
                    app.wxApi.navigateBack()
                    app.wxApi.showToast({ title: res.Message.messagestr, icon: 'none' })
                }

            })
            .catch(e => {
                app.wxApi.hideLoading()
                app.wxApi.stopPullDownRefresh()
                console.log(e)
            })
    }
})