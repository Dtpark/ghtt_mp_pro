// pages/mine/register/home.js
const app = getApp()
const registerUrl = require('../../../config/config').registerUrl
const loginmanager = require('../../../utils/loginManager')
const datacheck = require('../../../utils/dataCheck')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 验证码
    sechash: '',
    imageSrc: '',

    usernamekey: '',
    passwordkey: '',
    password2key: '',
    emailkey: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // 获取验证码
    that.downSeccode()

    // 获取表单索引
    let regnameurl = registerUrl + '&mod=' + app.globalData.regname;
    app.apimanager.getRequest(regnameurl)
      .then(res => {
        if (res.Variables.reginput.username) {
          that.setData({
            usernamekey: res.Variables.reginput.username,
            passwordkey: res.Variables.reginput.password,
            password2key: res.Variables.reginput.password2,
            emailkey: res.Variables.reginput.email
          })
        }
      })
      .catch(res => {
        app.wxApi.showToast({
          title: "出错了",
          icon: 'none'
        })
      })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 获取注册验证码
   */
  downSeccode() {
    let that = this
    app.apimanager.requstSeccode('register')
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
   * 用户注册
   */
  register(e) {
    let that = this
    let dzRes = null
    // 获取token时的参数
    let param = e.detail.value;
    param['type'] = 'gh'
    // discuz注册成功的标志 true：成功
    let flag = false

    // 过滤用户名中的emoji表情
    if (datacheck.isEmojiCharacter(e.detail.value.username)) {

      app.wxApi.showToast({
        title: '用户名不能包含表情',
        icon:'none'
      })
      return false
    }

    let data = {
      regsubmit: true,
      formhash: app.globalData.formhash,
    }
    data[that.data.usernamekey] = e.detail.value.username;
    data[that.data.passwordkey] = e.detail.value.password;
    data[that.data.password2key] = e.detail.value.password2;
    data[that.data.emailkey] = e.detail.value.email;


    let regnameurl = registerUrl + '&mod=' + app.globalData.regname;
    // 弹出加载框
    app.wxApi.showLoading();
    app.apimanager.postRequest(regnameurl, data)
    .then(res => {
      dzRes = res
      if (res.Message.messageval.indexOf('succeed') != -1) {
        // 注册成功
        flag = true
        loginmanager.loginSetUserInfo(res)
        return app.apimanager.getRequest(getTokenUrl, param)
      }else{
        // 注册失败
        app.wxApi.hideLoading()
        flag = false
        // app.wxApi.showToast({
        //   title: res.Message.messagestr,
        //   icon: 'none'
        // });
        throw new BreakSignal();
      }
      
    })
    .then(res => {
      // 获取token成功
      app.wxApi.hideLoading()
      app.globalData.token = res.data.token
      app.wxApi.setStorageSync('token',res.data.token)
      app.wxApi.navigateBack({
        delta: 2, // 因为本页只能通过登录页进入，所以返回要跳过登录页
      })
      // 提示信息
      app.wxApi.showToast({
        title: dzRes.Message.messagestr,
        icon: 'none'
      });
    }, err => {
      app.wxApi.hideLoading()
      // 注册 或 获取token失败 
      // 提示信息
      if(flag){
        // 注册成功 但 获取token失败
        // 视为成功
        app.wxApi.navigateBack(2)
        app.wxApi.showToast({
          title: dzRes.Message.messagestr,
          icon: 'none'
        })
        
      }	else{
        // 注册失败 且 没有获取token
        app.wxApi.showToast({
          title: dzRes.Message.messagestr,
          icon: 'none'
        })
      }
    })
    .catch(res => {
      app.wxApi.hideLoading();
      console.log(res)
    })
  }
})