// pages/mine/home/home.js
const app = getApp()
const profileUrl = require('../../../config/config').profileUrl
const loginPath = require('../../../utils/path').default.loginPath
const userAvatar = require('../../../config/config').userAvatar
// cosnt
Page({

  /**
   * 页面的初始数据
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
    grouptitle: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(123333)
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
    // let that = this
    console.log('00000000000000')
    // that.requestProfile()
    // 判断登录态
    let uid = app.globalData.uid
    let token = app.globalData.token
    if (!uid || !token) {
      // 本地没有登录信息
    } else {
      // 本地存在登录信息
      // 获取dz的用户信息
    }

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
   * 跳转到登录页面
   */
  toLogin() {
    app.wxApi.navigateTo(loginPath)
  },
  /**
   * 获取用户信息（discuz）
   */
  requestProfile() {
    let that = this
    console.log('========================>11111111111111111')
    app.apimanager.getRequest(profileUrl)
      .then(res => {
        console.log(res)
        let username = res.Variables.member_nickname ? res.Variables.member_nickname : res.Variables.member_username
        let avatar = res.Variables.member_avatar + "?t=" + Date.parse(new Date())

        if (res.Variables.auth) {
          let threads = res.Variables.space.threads
          let posts = res.Variables.space.posts
          let credits = res.Variables.space.credits
          let field4 = res.Variables.space.field4
          let grouptitle = res.Variables.space.group.grouptitle

          that.setDate({
            username: username,
            avatar: avatar,
            threads: threads,
            posts: posts,
            credits: credits,
            field4: field4,
            grouptitle: grouptitle
          })

        } else {
          that.setDate({
            username: username,
            avatar: avatar
          })
        }
      })
      .catch(e => {
        console.log(e)
        app.wxApi.showToast({ title: e, icon: 'none' })
      })
  }
})