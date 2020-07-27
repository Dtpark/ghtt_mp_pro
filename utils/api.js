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

    // 同步设置storage信息
    setStorageSync(key = null, value = null) {
        return wx.setStorageSync(key, value)
    }

    // 同步删除storage信息
    removeStorageSync(params = '') {
        return wx.removeStorageSync(params)
    }

    // 关闭当前页面并返回之前的页面
    navigateBack(delta = 1) {
        return wx.navigateBack({
            delta: delta //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
        })
    }

    // 隐藏loading弹窗
    hideLoading() {
        return wx.hideLoading()
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

    // 显示Toast弹窗
    showToast(params = { title: '', icon: 'success', duration: '2000', mask: true }) {
        return this.promisify('showToast', params)
    }

    // 显示Loading弹窗
    showLoading(params = { title: 'Loading', mask: true }) {
        return this.promisify('showLoading', params)
    }

    // 显示模态框
    showModal(params = { title: '提示', content: '', showCancel: true, cancelText: '取消', cancelColor: '#000', confimText: '确认', confirmColor: '#3CC51F' }) {
        return this.promisify('showModal', params)
    }

    // 预览图片
    previewImage(params = {}) {
        return this.promisify('previewImage', params)
    }

    // 设置标题栏文字
    setNavigationBarTitle(params = { title: '' }) {
        return this.promisify('setNavigationBarTitle', params)
    }

    // 停止下拉刷新
    stopPullDownRefresh() {
        return this.promisify('stopPullDownRefresh')
    }



}

export default wxAPIManager