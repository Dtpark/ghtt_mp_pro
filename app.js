//app.js
import wxAPIManager from './utils/api.js'
import apimanager from './utils/apiManager.js'
const checkUrl = require('/config/config.js').checkUrl
App({
  onLaunch: function () {
    let that = this;
    // 获取自定义状态栏高度
    that.customBarHeight()

    // 获取本地登录态信息
    that.getStatus()
    
    // 获取Dz信息
    that.checkUrlDz()
      .then(res => {
        that.globalData.regname = res.regname
        that.globalData.repliesrank = res.setting.repliesrank
        that.globalData.allowpostcomment = res.setting.allowpostcomment
      })
  },

  /**
   * 计算顶部导航栏高度
   */
  customBarHeight() {
    let that = this
    // 获取设备信息
    let systemInfo = that.wxApi.getSystemInfoSync()
    // 获取状态栏高度
    that.globalData.StatusBar = systemInfo.statusBarHeight
    // 获取胶囊位置信息
    let custom = that.wxApi.getMenuButtonBoundingClientRect()
    that.globalData.Custom = custom
    // 计算顶部导航栏高度
    that.globalData.CustomBar = custom.bottom + custom.top - systemInfo.statusBarHeight

  },

  /**
   * 访问DZ checkurl
   */
  checkUrlDz() {
    let that = this
    return new Promise((resolve, rejects) => {
      that.apimanager.getRequest(checkUrl)
        .then(res => {
          // console.log(res)
          resolve(res)
        }, err => {
          rejects(err)
        })
    })

  },

  /**
   * 获取 uid && token
   */
  getStatus(){
    let that = this
    // 获取uid
    if(that.globalData.uid == ''){
      try {
        let uid = that.wxApi.getStorageSync('uid')
        if (uid) {
          // uid存在
          that.globalData.uid = uid
        }
      } catch (e) {
        // Do something when catch error
        console.log(e)
      }
    }


    // 获取token
    if(that.globalData.token == ''){
      try {
        let token = that.wxApi.getStorageSync('token')
        if (token) {
          // token存在
          that.globalData.token = token
        }
      } catch (e) {
        // Do something when catch error
        console.log(e)
      }
    }

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
    CustomBar: 0,

    // check获得的
    regname: '',
    // ？？？用户等级？？？
    repliesrank: '',
    // 允许评论？？？
    allowpostcomment: {},

    // 用户id（用户判断登录态）
    uid: '',
    // api 的token（同uid一起联合判断登录态）
    token: ''

  },
  // 实例化封装的 API
  wxApi: new wxAPIManager(),
  // 实例化 封装的 request API
  apimanager: new apimanager()

})