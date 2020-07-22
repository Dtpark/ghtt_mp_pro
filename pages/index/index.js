const { threadTypeUrl } = require("../../config/config")

// const app = getApp()
Page({
    data: {
        // 当前页面
        PageCur: 'find',
    },
    NavChange(e) {
        this.setData({
            PageCur: e.currentTarget.dataset.cur
        })
    },
    onShareAppMessage(res) {
        // console.log('12345')
        console.log(res)
        let shareInfo = res.target.dataset.shareinfo
        return {
            title: shareInfo.title,
            path: shareInfo.path
        }
    }

})