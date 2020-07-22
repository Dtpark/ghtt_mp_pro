// const app = getApp()
Page({
    data: {
        // 当前页面
        PageCur: 'find'
    },
    NavChange(e) {
        this.setData({
            PageCur: e.currentTarget.dataset.cur
        })
    },
    onShareAppMessage() {
        // console.log('12345')
        return {
            title: '123445',
            path: 'page/index/index'
        }
    },

})