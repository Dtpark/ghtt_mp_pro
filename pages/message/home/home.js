// pages/message/home/home.js
const app = getApp()
const myPmUrl = require('../../../config/config').myPmUrl
Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的生命周期
     */
    lifetimes: {
        attached: function() {
            // 在组件实例进入页面节点树时执行
            let that = this
                // 判断登录态
            let uid = app.globalData.uid
            let token = app.globalData.token
            if (uid == '' || token == '') {
                // 本地没有登录信息
                console.log('请登录')
            } else {
                // 本地存在登录信息
                // 设置用户id
                // that.setData({
                //         uid: uid
                //     })
                // 获取dz的用户信息
                app.wxApi.showLoading()
                that.requestMore(false)
            }

        },
        detached: function() {
            // 在组件实例被从页面节点树移除时执行
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

        // 消息分类
        iconList: [{
            icon: 'comment',
            color: 'red',
            badge: 120,
            name: '回复我的'
        }, {
            icon: 'loading',
            color: 'orange',
            badge: 1,
            name: '提到我的'
        }, {
            icon: 'notice',
            color: 'yellow',
            badge: 0,
            name: '系统提醒'
        }],

        // 会话列表
        list: [],
        // 会话数目
        count: 0,
        // 消息类型(私信)
        filter: 'privatepm',
        // 第几页
        page: 1
    },

    /**
     * 组件的方法列表
     */
    methods: {

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
            that.getPmList(); // 重新调用请求获取下一页数据 或者刷新数据
        },

        // 获取消息列表
        getPmList() {
            let that = this

            let data = {
                    page: that.data.page,
                    filter: that.data.filter
                }
                // app.wxApiwx.hideLoading();
                // app.wxApiwx.stopPullDownRefresh();
            app.apimanager.postRequest(myPmUrl, data)
                .then(res => {
                    app.wxApi.hideLoading();
                    app.wxApi.stopPullDownRefresh();
                    // console.log(res)
                    if (res.Variables.count != 0) {
                        that.setData({
                            list: res.Variables.list,
                            count: res.Variables.count
                        })
                    }
                })
                .catch(e => {
                    app.wxApi.hideLoading();
                    app.wxApi.stopPullDownRefresh();
                    console.log(e)
                })

        }

    }
})