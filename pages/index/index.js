const { threadTypeUrl } = require("../../config/config")

// const app = getApp()
Page({
    data: {
        // 当前页面
        PageCur: 'message',
    },
    NavChange(e) {
        this.setData({
            PageCur: e.currentTarget.dataset.cur
        })
    },
    onShareAppMessage(res) {
        // console.log('12345')
        console.log(res)
        let shareInfo = (res.target != undefined) ? res.target.dataset.shareinfo : { title: "欢迎使用观海听涛校园助手" }
        return {
            title: shareInfo.title,
            path: shareInfo.path
        }
    }

})