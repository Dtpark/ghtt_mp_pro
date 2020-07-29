// pages/message/post/home.js
const app = getApp()
const mypostUrl = require('../../../config/config').mypostUrl
const userAvatar = require('../../../config/config').userAvatar
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 顶部导航列表
        navList: [{
                title: "回复我的",
                type: 'post'
            },
            {
                title: "提到我的",
                type: 'at'
            }
        ],
        // 导航索引
        index: 0,
        TabCur: 0,
        scrollLeft: 0,
        // 用户头像
        userAvatar: userAvatar,
        // 通知列表
        list: [],
        // 当前第几页
        page: 1,
        // 每页几条
        perpage: 30,
        // 总条数
        count: 0

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
        that.requestMore(false)

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        let that = this
        if (Math.ceil(that.data.count / that.data.perpage) >= that.data.page + 1) {
            that.requestMore(true)
        }

    },

    // 切换顶部导航页面
    tabSelect(e) {
        let that = this
        let TabCur = e.currentTarget.dataset.id
        that.setData({
            TabCur: TabCur,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
            page: 1
        })
        app.wxApi.showLoading()
        that.requestMore(false, that.data.navList[TabCur]['type'])
        app.wxApi.pageScrollTo()
    },

    // 获取更多
    requestMore(isMore = false, type = 'post') {
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
        that.getList(type); // 重新调用请求获取下一页数据 或者刷新数据
    },


    // 获取信息
    getList(type = 'post') {
        let that = this
        let data = {
            page: that.data.page,
            type: type
        }
        app.apimanager.postRequest(mypostUrl, data)
            .then(res => {
                app.wxApi.hideLoading()
                app.wxApi.stopPullDownRefresh()
                if (!res.Message) {
                    let list = res.Variables.list
                    if (that.data.page > 1) {
                        list = that.data.list.concat(res.Variables.list)
                    }
                    that.setData({
                        list: list,
                        count: res.Variables.count,
                        perpage: res.Variables.perpage
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