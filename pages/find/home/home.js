// pages/find/home/home.js
const app = getApp()
const checkUrl = require('../../../config/config').checkUrl
const newrepUrl = require('../../../config/config').newrepUrl
const newestUrl = require('../../../config/config').newestUrl
const hotUrl = require('../../../config/config').hotUrl
const digestUrl = require('../../../config/config').digestUrl
const userAvatar = require('../../../config/config').userAvatar
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
        navList: [{
                title: "最新回复"
            },
            {
                title: "最新主题"
            },
            {
                title: "本周热门"
            },
            // {
            //     title: "本周精华"
            // },
        ],
        // 索引
        index: 0,
        TabCur: 0,
        scrollLeft: 0,

        // 距离顶部距离
        topNum: 0,

        // 帖子列表
        datalist: [],
        // 帖子页面
        page: 1,

        userAvatar: userAvatar,

        // 下拉刷新状态（是否在下拉刷新）
        triggered: false,

        // 是否在触底加载
        isMore: false,

        // 是否显示底部模态框（分享）
        isShare: false,
        // 待分享的帖子信息
        shareInfo: {
            title: '',
            path: ''
        }
    },

    /**
     * 组件的生命周期
     */
    lifetimes: {
        attached: function() {
            // 在组件实例进入页面节点树时执行
            let that = this

            // 获取帖子列表
            app.wxApi.showLoading()
            that.getListData()

            that.allowpostcomment()


        },
        detached: function() {
            // 在组件实例被从页面节点树移除时执行
        }
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
            let that = this
            that.setData({
                TabCur: e.currentTarget.dataset.id,
                scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
                page: 1,
                fix: false,
                topNum: 0
            })
            app.wxApi.showLoading()
            that.getListData()
        },

        // 请求列表数据(最新回复/最新主题/热门回复/精华主题)
        getListData() {
            let that = this
            let url = ''
            let tabCur = that.data.TabCur
                // 选择主题类型
            switch (tabCur) {
                case 0:
                    url = newrepUrl
                    break;
                case 1:
                    url = newestUrl
                    break
                case 2:
                    url = hotUrl
                    break
                case 3:
                    url = digestUrl
                    break
                default:
                    url = newrepUrl
            }

            // 要请求第几页
            let data = {
                page: that.data.page,
            }
            that.setData({
                isMore: true
            })
            app.apimanager.getRequest(url, data).then(res => {
                app.wxApi.hideLoading();
                if (that.data.triggered == false) {
                    that.setData({
                        isMore: false
                    })
                } else {
                    that.setData({
                        isMore: false,
                        triggered: false
                    })
                }
                // wx.stopPullDownRefresh()

                // 请求到的帖子列表
                let datalist = res.Variables.data ? res.Variables.data : []

                if (datalist.length == 0) {
                    app.wxApi.showToast({ title: '没有更多了', icon: 'none' })
                }

                for (let i = 0; i < datalist.length; i++) {
                    let postItem = datalist[i]
                    let listindex = i + that.data.datalist.length
                        // ================附件处理 ===================
                    let attachlist = postItem.attachlist
                    let imageA = []
                    let audioA = []
                    let videoA = []
                    let DownloadA = [];
                    for (let aidKey in attachlist) {
                        let attItem = attachlist[aidKey]
                        let newUrl = attItem.attachment
                        attItem['newUrl'] = newUrl
                        if (attItem.type == 'image') {
                            imageA.push(attItem)
                        } else if (attItem.type == 'audio') {
                            let total_process = '00:00'
                            if (attItem.description) {
                                total_process = util.formatTime(parseInt(attItem.description))
                            }
                            attItem['toolUse'] = {
                                    attachment: newUrl,
                                    listIndex: listindex,
                                    total_process: total_process
                                }
                                // console.log(attItem);
                            audioA.push(attItem)
                        } else if (attItem.type == 'video') {
                            videoA.push(attItem)
                        } else if (attItem.ext == 'pdf' || attItem.ext == 'ppt' || attItem.ext == 'pptx' || attItem.ext == 'docx' || attItem.ext == 'doc' || attItem.ext == 'xls' || attItem.ext == 'xlsx') {
                            DownloadA.push(attItem);
                        }
                    }
                    postItem['imageA'] = imageA
                    postItem['audioA'] = audioA
                    postItem['videoA'] = videoA
                    postItem['DownloadA'] = DownloadA;
                }
                if (that.data.page > 1) {
                    datalist = that.data.datalist.concat(datalist)
                }

                that.setData({
                    datalist: datalist
                })
            }).catch(res => {
                app.wxApi.hideLoading();
                // wx.stopPullDownRefresh();
            })
        },

        // 获取评论权限
        allowpostcomment: function() {
            let url = checkUrl
            app.apimanager.getRequest(url).then(res => {
                // 回复等级
                let repliesrank = res.setting.repliesrank;
                // ？？？允许回复评论？？？
                let allowpostcomment = res.setting.allowpostcomment;
                app.globalData.repliesrank = repliesrank
                app.globalData.allowpostcomment = allowpostcomment
            }).catch(res => {
                console.log(res)
            })
        },

        // 查看图片
        lookImage(e) {
            let that = this
            let cellItem = that.data.datalist[e.currentTarget.dataset.cellindex]
            let imageA = cellItem.imageA
            let imageSrcArray = [];
            for (let i = 0; i < imageA.length; i++) {
                let item = imageA[i]
                imageSrcArray.push(item.attachment)
            }
            app.wxApi.previewImage({
                current: imageSrcArray[e.currentTarget.id],
                urls: imageSrcArray
            })
        },

        // 下拉刷新
        refresh() {
            let that = this
            app.wxApi.showLoading()
            that.setData({
                triggered: true
            })
            that.getListData()

        },

        // 触底加载更多
        loadMore() {
            let that = this
            that.data.page++
                app.wxApi.showLoading()
            that.getListData()
        },

        // 显示模态框
        showModal(e) {
            let that = this
            that.setData({
                isShare: true,
                shareInfo: {
                    title: e.currentTarget.dataset.title,
                    path: '/pages/mine/login/home?title=' + e.currentTarget.dataset.tid
                }
            })

        },

        // 隐藏模态框
        hideModal() {
            let that = this
            that.setData({
                isShare: false
            })
        },

        // 生成海报
        createPic() {
            console.log('生成海报')
            app.wxApi.showToast({ title: "尚未开发，敬请期待", icon: 'none' })
        }


    }
})