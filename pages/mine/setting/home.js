// pages/mine/setting/home.js
const app = getApp()
const loginmanager = require('../../../utils/loginManager')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否是登录态
    isLogin: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let that = this
    let uid = app.globalData.uid
    let token = app.globalData.token
    if (uid == '' || token == '') {
      // 未登录
      if (that.data.isLogin) {
        // 减少赋值提高性能
        that.setData({
          isLogin: false
        })
      }

    } else {
      // 已登录
      if (!that.data.isLogin) {
        // 减少赋值提高性能
        that.setData({
          isLogin: true
        })
      }
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
   * 退出登录
   */
  logout(){
    let that = this

    app.wxApi.showModal({
      title:"提示",
      content:"确认退出登录？"})
      .then(res => {
        if(res.confirm){
          // 点击确定
          loginmanager.loginOut()
          that.setData({
            isLogin:false
          })

        }else if(res.cancel){
          // 点击取消
        }
      })
      .catch(e => {
        console.log(e.toString())
      })
    
    
    
  }
})