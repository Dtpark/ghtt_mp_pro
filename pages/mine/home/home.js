const app = getApp()
const profileUrl = require('../../../config/config').profileUrl
const loginPath = require('../../../utils/path').default.loginPath
const settingPath = require('../../../utils/path').default.settingPath
const userAvatar = require('../../../config/config').userAvatar
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
                that.setData({
                    avatar: userAvatar,
                    username: '',
                    uid: '',
                    threads: '-',
                    posts: '-',
                    credits: '-',
                    field4: '',
                    grouptitle: ''
                })
            } else {
                // 本地存在登录信息
                // 设置用户id
                that.setData({
                        uid: uid
                    })
                    // 获取dz的用户信息
                that.requestProfile()
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
            let that = this
                // 判断登录态
            let uid = app.globalData.uid
            let token = app.globalData.token
            if (uid == '' || token == '') {
                // 本地没有登录信息
                that.setData({
                    avatar: userAvatar,
                    username: '',
                    uid: '',
                    threads: '-',
                    posts: '-',
                    credits: '-',
                    field4: '',
                    grouptitle: ''
                })
            } else {
                // 本地存在登录信息
                // 设置用户id
                that.setData({
                        uid: uid
                    })
                    // 获取dz的用户信息
                that.requestProfile()
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 头像链接
        avatar: userAvatar,
        // 用户名（昵称）
        username: '',
        // 用户id
        uid: '',

        // 主题数
        threads: '-',
        // 回复数
        posts: '-',
        // 积分
        credits: '-',

        field4: '',
        // 用户组（含颜色的标签）
        grouptitle: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 跳转到登录页面
        toLogin() {
            app.wxApi.navigateTo(loginPath)
        },
        // 跳转到设置页
        toSetting() {
            app.wxApi.navigateTo(settingPath)
        },

        // 获取用户信息（discuz）
        requestProfile() {
            let that = this
            app.apimanager.getRequest(profileUrl)
                .then(res => {
                    let username = res.Variables.member_nickname ? res.Variables.member_nickname : res.Variables.member_username
                    let avatar = res.Variables.member_avatar + "?t=" + Date.parse(new Date())

                    if (res.Variables.auth) {
                        let threads = res.Variables.space.threads
                        let posts = res.Variables.space.posts
                        let credits = res.Variables.space.credits
                        let field4 = res.Variables.space.field4
                        let grouptitle = res.Variables.space.group.grouptitle.replace(/<\/?font[^>]*>/gi, '')

                        that.setData({
                            username: username,
                            avatar: avatar,
                            threads: threads,
                            posts: posts,
                            credits: credits,
                            field4: field4,
                            grouptitle: grouptitle
                        })

                    } else {
                        that.setData({
                            username: username,
                            avatar: avatar
                        })
                    }
                })
                .catch(e => {
                    console.log(e)
                    app.wxApi.showToast({ title: e.toString(), icon: 'none' })
                })
        }

    }
})