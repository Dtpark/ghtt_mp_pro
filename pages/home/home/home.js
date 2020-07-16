// pages/home/home/home.js
Page({
  options: {
    addGlobalClass: true,
  },

  /**
   * 页面的初始数据
   */
  data: {
    bannerImgUrls: {
      0:{
        image_url:
          "https://ghttdata.hitwh.cc/data/attachment/forum/201907/08/151218k9m51mm5f61mk5v9.png",
        type: 0,
        title: '',
        d_id: ''
      },
      1:{
        image_url:
          "https://ghttdata.hitwh.cc/data/attachment/forum/201907/08/151218k9m51mm5f61mk5v9.png",
        type: 0,
        title: '',
        d_id: ''
      }

    }

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
    console.log(1234)
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

  }
})