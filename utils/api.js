/**
 * 本文件用于封装微信 API
 * 1. 可以统一管理
 * 2. 方便将代码迁移至 QQ 小程序
 */


class APIManager {

    // 获取设备信息（同步）
    getSystemInfoSync(){
        return wx.getSystemInfoSync()
    }

    // 获取菜单按钮（右上角胶囊按钮）的布局位置信息
    // 坐标信息以屏幕左上角为原点
    getMenuButtonBoundingClientRect() {
        return wx.getMenuButtonBoundingClientRect()
    }

    // 监听主题切换事件
    onThemeChange(){
        return wx.onThemeChange()
    }

    // 页面跳转
    navigateTo(url = ''){
        return wx.navigateTo({ url: url})
    }
    


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



}

export default APIManager