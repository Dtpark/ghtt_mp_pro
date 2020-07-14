import cookies from '../vendor/weapp-cookie/dist/weapp-cookie'
const app = getApp()

function loginOut() {
  let uid = app.globalData.uid
  console.log(uid)
  if (uid) {
    app.globalData.uid = ''
    // app.globalData.avatar = ''
    // app.globalData.username = ''
    app.globalData.token = ''
    app.wxApi.removeStorageSync('uid')
    app.wxApi.removeStorageSync('token')
    let cookiepre = app.wxApi.getStorageSync('cookiepre')
    let authKey = cookiepre + "auth"
    if (cookies.has(authKey)) {
      cookies.remove(authKey)
    }
  }
}

function loginSetUserInfo(obj) {
  wx.setStorageSync('uid', obj.Variables.member_uid)
  app.globalData.uid = obj.Variables.member_uid
  app.globalData.avatar = obj.Variables.member_avatar
  app.globalData.username = obj.Variables.member_username
}

function isLogin() {
  if (getApp().globalData.uid) {
    return true
  }
  toLogin()
  return false
}

function toLogin() {
  wx.navigateTo({
    url: '/pages/login/login',
  });
}

var openid = ''
var unionid = ''

module.exports = {
  loginOut: loginOut,
  loginSetUserInfo: loginSetUserInfo,
  isLogin: isLogin,
  toLogin: toLogin,
  openid: openid,
  unionid: unionid
}