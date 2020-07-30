// pages/message/home/home.js
const app = getApp()
const myPmUrl = require('../../../config/config').myPmUrl
const chatDetailPath = require('../../../utils/path').default.chatDetailPath
const systemPath = require('../../../utils/path').default.systemPath
const myPostPath = require('../../../utils/path').default.myPostMsgPath
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
     * 组件所在页面的生命周期
     */
    pageLifetimes: {
        show: function() {
            // 页面被展示
            // let that = this
            //     // 判断登录态
            // let uid = app.globalData.uid
            // let token = app.globalData.token
            // if (uid == '' || token == '') {
            //     // 本地没有登录信息
            //     console.log('请登录')
            // } else {
            //     // 本地存在登录信息
            //     // 设置用户id
            //     // that.setData({
            //     //         uid: uid
            //     //     })
            //     // 获取dz的用户信息
            //     app.wxApi.showLoading()
            //     that.requestMore(false)
            // }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 屏幕信息
        // 屏幕高度
        screenHeight: app.globalData.ScreenHeight,
        // 可用窗口高度
        windowHeight: app.globalData.WindowHeight,
        // 状态栏相关参数
        // 状态栏高度
        statusBar: app.globalData.StatusBar,
        // 导航栏高度
        customBar: app.globalData.CustomBar,

        // 距离顶部距离
        topNum: 0,

        // 下拉刷新状态（是否在下拉刷新）
        triggered: false,

        // 是否在触底加载
        isMore: false,


        // 会话列表
        list: [],
        // 会话总数目
        count: 0,
        // 消息类型(私信)
        filter: 'privatepm',
        // 第几页
        page: 1,
        // 每页几条
        perpage: 15,

        // 通知信息
        notice: []
    },

    /**
     * 组件的方法列表
     */
    methods: {

        // 下拉刷新
        refresh() {
            let that = this
            app.wxApi.showLoading()
            that.setData({
                triggered: true
            })
            that.requestMore(false)

        },

        // 触底加载更多
        loadMore() {
            let that = this
            app.wxApi.showLoading()
            if (Math.ceil(that.data.count / that.data.perpage) >= that.data.page + 1) {
                that.requestMore(true)
            } else {
                app.wxApi.hideLoading()
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
                isMore: true
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
            app.apimanager.postRequest(myPmUrl, data)
                .then(res => {
                    app.wxApi.hideLoading();
                    if (that.data.triggered == false) {
                        that.setData({
                            isMore: false
                        })
                    } else {
                        that.setData({
                            isMore: false,
                            triggered: false
                        })
                    }

                    let list = res.Variables.list
                    if (that.data.page > 1) {
                        list = that.data.list.concat(list)
                    }
                    that.setData({
                        list: list,
                        count: res.Variables.count,
                        notice: res.Variables.notice,
                        isMore: false
                    })
                })
                .catch(e => {
                    app.wxApi.hideLoading();
                    that.setData({
                        isMore: false,
                        triggered: false
                    })
                    console.log(e)
                })

        },

        // 进入系统通知详情
        toSystem() {
            let that = this
            if (that.data.notice.newprompt != 0) {
                that.setData({
                    [notice.newprompt]: 0
                })
            }
            app.wxApi.navigateTo(systemPath)
        },

        // 进入帖子通知详情
        toMyPost() {
            let that = this
            if (that.data.notice.newmypost != 0) {
                that.setData({
                    [notice.newmypost]: 0
                })
            }
            app.wxApi.navigateTo(myPostPath)
        },

        // 进入对话框详情
        toDetail(e) {
            let that = this
            let touid = e.currentTarget.dataset.touid
            let username = e.currentTarget.dataset.username
                // 去掉已读提醒
            let index = e.currentTarget.id
            let isNew = that.data.list[index]['isnew']
            if (isNew != 0) {
                that.setData({
                    [`list[${index}].isnew`]: 0

                })
            }

            let url = chatDetailPath + '?touid=' + touid + '&username=' + username
            app.wxApi.navigateTo(url)

        }

    }
})