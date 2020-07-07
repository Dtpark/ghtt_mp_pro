//app.js
import APIManager from './utils/api.js'
App({
  onLaunch: function () {
    let that = this;
    that.customBarHeight()
  },

  /**
   * 计算顶部导航栏高度
   */
  customBarHeight() {
    let that = this
    // 获取设备信息
      let systemInfo = that.apiManager.getSystemInfoSync()
      // 获取状态栏高度
      that.globalData.StatusBar = systemInfo.statusBarHeight
      // 获取胶囊位置信息
      let custom = that.apiManager.getMenuButtonBoundingClientRect()
      that.globalData.Custom = custom
      // 计算顶部导航栏高度
      that.globalData.CustomBar = custom.bottom + custom.top - systemInfo.statusBarHeight

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