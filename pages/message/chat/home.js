// pages/message/chat/home.js
const app = getApp()
const pmDetailUrl = require('../../../config/config').pmDetailUrl
const sendPmUrl = require('../../../config/config').sendPmUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        InputBottom: 0,
        list: [],
        touid: 0,
        username: '',
        uid: 0,
        message: '',
        page: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        if (options.touid) {
            let touid = options.touid;
            let username = options.username;
            app.wxApi.setNavigationBarTitle({ title: username })
            that.setData({
                touid: touid,
                username: username,
                uid: app.globalData.uid
            });
            this.requestMore(false);
        } else {
            app.wxApi.navigateBack()
        }
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
        if (that.data.page != 1) {
            that.requestMore(true)
        } else {
            app.wxApi.stopPullDownRefresh()
            app.wxApi.showToast({ title: "没有更多了", icon: 'none' })
        }

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    InputFocus(e) {
        this.setData({
            InputBottom: e.detail.height
        })
    },
    InputBlur(e) {
        this.setData({
            InputBottom: 0
        })
    },

    // 刷新/请求更多
    requestMore(isMore) {
        let that = this
        let page = that.data.page;
        if (isMore) {
            page -= 1;
        } else {
            page = 0;
        }
        that.setData({
            page: page, // 更新当前页数
        })
        that.getList(); // 重新调用请求获取下一页数据 或者刷新数据
    },

    // 获取会话列表
    getList() {
        let that = this;
        let data = {
            page: that.data.page,
            touid: that.data.touid
        }
        app.apimanager.postRequest(pmDetailUrl, data)
            .then(res => {
                app.wxApi.hideLoading()
                app.wxApi.stopPullDownRefresh()
                    // console.log(res)
                if (res.Variables) {
                    let list = res.Variables.list
                    if (that.data.page > 0) {
                        // list = that.data.list.concat(list)
                        list = list.concat(that.data.list)
                    }
                    that.setData({
                        list: list,
                        page: res.Variables.page
                    })
                }
            })
            .catch(e => {
                app.wxApi.hideLoading()
                app.wxApi.stopPullDownRefresh()
                console.log(e)
                app.wxApi.navigateBack()
                app.wxApi.showToast({ title: '出错了', icon: 'none' })
            })
    },

    // 显示表情
    showEmoji() {
        let that = this
        app.wxApi.showToast({ title: '尚未开发，敬请期待', icon: 'none' })
    },


    // 发送聊天信息     
    send(e) {
        let that = this;
        console.log(e)
            // return
        let message = e.detail.value.message
        if (message == '') {
            app.wxApi.showToast({ title: '发送内容不能未空', icon: 'none' })
            return false
        }

        let data = {
            message: message,
            username: that.data.username,
            formhash: app.globalData.formhash
        }
        app.apimanager.postRequest(sendPmUrl, data)
            .then(res => {
                console.log(res)
                if (res.Message.messageval == "do_success") {
                    // 发送成功
                    // 1.将信息添加到列表中
                    that.requestMore(false)
                        // 2.清除文本框中的输入内容

                } else {
                    // 发送失败
                    app.wxApi.showToast({ title: res.Message.messagestr, icon: 'none' })
                }
            })
            .catch(e => {
                console.log(e)
            })

    }
})