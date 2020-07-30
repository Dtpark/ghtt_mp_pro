// pages/mine/login/home.js
const app = getApp()
const commonLoginUrl = require('../../../config/config').commonLoginUrl
const getTokenUrl = require('../../../config/config').tokenUrl
const loginmanager = require('../../../utils/loginManager')
const registerPath = require('../../../utils/path').default.registerPath
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 密码类型
        pwdType: true,

        // 验证码相关
        sechash: '',
        imageSrc: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this
        let uid = app.globalData.uid
        if (uid) {
            loginmanager.loginOut()
        }
        that.downSeccode()
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


    /**
     * 获取登录验证码
     */
    downSeccode() {
        let that = this
        app.apimanager.requstSeccode('login')
            .then(res => {
                if (res.sechash) {
                    that.setData({
                        sechash: res.sechash,
                        imageSrc: res.imageSrc
                    })
                }
            })
    },

    /**
     * 显示/隐藏密码
     */
    showOrHide() {
        let that = this
        let status = that.data.pwdType
        if (status) {
            // 已经隐藏，要显示密码
            that.setData({
                pwdType: false
            })
        } else {
            // 已经显示，要隐藏密码
            that.setData({
                pwdType: true
            })
        }
    },

    /**
     * 登录
     */
    login(e) {
        let that = this
        let dzRes = null
            // 前台校验数据
        if (e.detail.value.username == '' || e.detail.value.password == '') {
            app.wxApi.showModal({
                content: '输入不能为空！',
                showCancel: false
            })
            return false
        }
        // 组合数据
        let param = {
            username: e.detail.value.username,
            password: e.detail.value.password,
            type: 'gh',
            loginsubmit: 'yes'
        }

        if (that.data.sechash) { // 有验证码
            param['sechash'] = that.data.sechash
            param['seccodeverify'] = e.detail.value.seccodeverify
        }

        // 显示加载中
        app.wxApi.showLoading({ title: '加载中' })

        app.apimanager.postRequest(commonLoginUrl, param)
            .then(res => {
                if (res.Message.messageval == 'login_succeed') {
                    // 登录成功
                    // 获取token
                    dzRes = res
                    return app.apimanager.getRequest(getTokenUrl, param)
                } else {
                    app.wxApi.showToast({
                            title: res.Message.messagestr, //提示的内容,
                            icon: 'none', //图标
                        })
                        // 刷新验证码
                    that.downSeccode()
                        // 中断链式操作
                    throw new BreakSignal()
                }

            })
            .then(res => {
                // 获取token成功
                // 保存用户信息和token
                app.globalData.token = res.data.token
                loginmanager.loginSetUserInfo(dzRes)
                app.wxApi.setStorageSync('token', res.data.token)
                    // 返回并提示成功信息
                app.wxApi.navigateBack()
                app.wxApi.showToast({
                    title: dzRes.Message.messagestr,
                    icon: 'none'
                })

            }, err => {
                console.log(err)
                    // 获取token失败 或  登录失败
                    // 提示错误
                if (err.data.msg != undefined) {
                    // 获取token失败
                    app.wxApi.showToast({
                        title: err.data.msg,
                        icon: 'none'
                    })
                } else {
                    // 登录失败 或 接口出错
                    app.wxApi.showToast({
                        title: err.statusCode.toString(),
                        icon: 'none'
                    })
                    loginmanager.loginOut()
                }

                app.wxApi.hideLoading()
                    // 刷新验证码
                that.downSeccode()

            })
            .catch(e => {
                // 出错了
                app.wxApi.hideLoading()
                console.log(e)
            })
    },

    /**
     * 跳转到注册页
     */
    toRegister() {
        app.wxApi.navigateTo(registerPath);
    }
})