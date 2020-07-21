// pages/find/home/home.js
const app = getApp()
Component({
    options: {
        addGlobalClass: true,
    },

    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        // 屏幕信息
        // 屏幕高度
        screenHeight: app.globalData.ScreenHeight,
        // 可用窗口高度
        windowHeight: app.globalData.WindowHeight,
        // 状态栏相关参数
        // 状态栏高度
        statusBar: app.globalData.StatusBar,
        // 导航栏高度
        customBar: app.globalData.CustomBar,
        // 分类导航栏是否固定
        fix: false,
        // 顶部导航列表
        navList: {
            0: {
                title: "最新回复"
            },
            1: {
                title: "最新主题"
            },
            2: {
                title: "热门主题"
            },
            3: {
                title: "精华主题"
            },
        },
        // 索引
        index: 0,
        TabCur: 0,
        scrollLeft: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {

        // 控制导航栏固定与否
        bindScroll(e) {
            let that = this
            let top = e.detail.scrollTop
            if (top > 230 && that.data.fix == false) {
                that.setData({
                    fix: true
                })
            } else if (top < 230 && that.data.fix == true) {
                that.setData({
                    fix: false
                })
            }
        },



        // 切换顶部导航页面
        tabSelect(e) {
            this.setData({
                TabCur: e.currentTarget.dataset.id,
                scrollLeft: (e.currentTarget.dataset.id - 1) * 60
            })
        }
    }
})