/**
 * 本文件用于封装微信 API
 * 1. 可以统一管理
 * 2. 方便将代码迁移至 QQ 小程序
 */


class wxAPIManager {

    // 获取设备信息（同步）
    getSystemInfoSync() {
        return wx.getSystemInfoSync()
    }

    // 获取菜单按钮（右上角胶囊按钮）的布局位置信息
    // 坐标信息以屏幕左上角为原点
    getMenuButtonBoundingClientRect() {
        return wx.getMenuButtonBoundingClientRect()
    }

    // 监听主题切换事件
    onThemeChange() {
        return wx.onThemeChange()
    }

    // 页面跳转
    navigateTo(url = '') {
        return wx.navigateTo({ url: url })
    }

    // 同步获取storage信息
    getStorageSync(params = '') {
        return wx.getStorageSync(params)
    }

    // 同步删除storage信息
    removeStorageSync(params = ''){
        return wx.removeStorageSync({ key: params })
    }

    // 显示Toast弹窗
    // showToast(title = '', icon = 'success', duration = '2000', mask = true, params = {}){
    //     return wx.showToast({
    //       title: title, //提示的内容,
    //       icon: icon, //图标,
    //       duration: duration, //延迟时间,
    //       mask: mask, //显示透明蒙层，防止触摸穿透,
    //       success: res => {
    //           ...params
    //       }
    //     });
    // }

    //promise化接口
    promisify(functionName, params) {
        return new Promise((resolve, reject) => {
            wx[functionName]({
                ...params,
                success: res => resolve(res),
                fail: res => reject(res)
            });
        });
    }

    // 获取设备信息(异步)
    getSystemInfo(params = {}) {
        return this.promisify('getSystemInfo', params)
    }

    // 显示弹窗
    showToast(params = { title: '', icon: 'success', duration: '2000', mask: true }) {
        return this.promisify('showToast', params)
    }



}

export default wxAPIManager