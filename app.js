//app.js
import APIManager from './utils/api.js'
App({
  onLaunch: function () {
    let that = this;
    // that.printData('=====>000')
    that.customBarHeight()
    // that.printData('========>111')
    // wx.getSystemInfo({
    //   success: e => {
    //     this.globalData.StatusBar = e.statusBarHeight;
    //     let custom = wx.getMenuButtonBoundingClientRect();
    //     this.globalData.Custom = custom;
    //     this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
    //   }
    // })
    // that.printData('=======>222')
  },

  /**
   * 计算顶部导航栏高度
   */
  customBarHeight() {
    let that = this
    // 获取设备信息
    // try {
      let systemInfo = that.apiManager.getSystemInfoSync()
      // 获取状态栏高度
      that.globalData.StatusBar = systemInfo.statusBarHeight
      // 获取胶囊位置信息
      let custom = that.apiManager.getMenuButtonBoundingClientRect()
      that.globalData.Custom = custom
      // 计算顶部导航栏高度
      that.globalData.CustomBar = custom.bottom + custom.top - systemInfo.statusBarHeight

    // } catch (e) {

    // }

  },

  //打印数据
  printData(params) {
    let that = this;
    console.log(params)
    console.log(that.globalData.StatusBar)
    console.log(that.globalData.Custom)
    console.log(that.globalData.CustomBar)
  },


  globalData: {
    // 设备状态栏高度
    StatusBar: 10,
    // 胶囊按钮的布局位置信息
    Custom: {},
    // 顶部导航栏高度
    CustomBar: 0

  },
  // 实例化封装的 API
  apiManager: new APIManager()
})