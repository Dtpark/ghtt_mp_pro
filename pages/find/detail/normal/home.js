// pages/find/detail/normal/home.js
const app = getApp()
const detailUrl = require('../../../../config/config').detailUrl
const userAvatar = require('../../../../config/config').userAvatar
const baseUrl = require('../../../../config/config').baseUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {

        // 主题号
        tid: 0,
        // 回帖页码
        pagenum: 1,
        // 每页条数
        ppp: 10,
        // 回复等级？
        repliesrank: '',
        allowpostcomment: {},
        // 用户id
        uid: '',
        // 用户名？
        nickname: '',
        // 头像链接
        userAvatar: userAvatar,

        // 是否收藏: 1:收藏；其他：未收藏
        favorited: 0,
        collecttext: '未收藏',

        // ?????????
        isShare: false,

        loading: false,

        hasMore: true,

        // 主题信息
        thread: {},
        // 回帖列表
        datalist: {},

        // 回帖列表展示顺序
        picker: ['默认顺序', '按时间'],
        index: 0

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this

        // 获取主题id
        let tid = options.tid;

        // 是否是圈子
        // var is_quan = options.is_quan ? options.is_quan : false
        // 获取用户id
        let uid = app.globalData.uid
            // 获取回复等级？？？？？？
        let repliesrank = app.globalData.repliesrank;
        let allowpostcomment = app.globalData.allowpostcomment;
        that.setData({
            tid: tid,
            pagenum: 1,
            repliesrank: repliesrank,
            allowpostcomment: allowpostcomment,
            uid: uid
        })
        if (options.type == 'share') {
            that.data.isShare = true
        }

        app.wxApi.showLoading();
        that.refreshRequest()
            // self.setupAudioPlayer()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    // 刷新页面
    refreshRequest() {
        let that = this
        that.requestMore(false)
    },

    // 
    requestMore(isMore) {
        let that = this
        let pagenum = that.data.pagenum;
        if (isMore) {
            pagenum += 1;
        } else {
            pagenum = 1;
        }
        that.setData({
            pagenum: pagenum, // 更新当前页数
        })
        that.makeRequest(); // 重新调用请求获取下一页数据 或者刷新数据
    },

    // 切换回帖排序
    PickerChange(e) {
        let that = this
        that.setData({
            index: e.detail.value
        })
    },



    // 请求数据
    makeRequest() {
        let that = this
            // self.setData({
            //     loading: true
            // })
            // ordertype: 1:时间倒叙；2：时间正序
        let ordertype = 2
        if (that.data.index == 1) {
            ordertype = 1
        }
        // 拼接请求参数
        let getDic = {
            tid: that.data.tid,
            page: that.data.pagenum,
            ppp: that.data.ppp,
            ordertype: ordertype
        }
        app.apimanager.getRequest(detailUrl, getDic)
            .then(res => {
                app.wxApi.hideLoading();
                // wx.stopPullDownRefresh();
                let threads = res.Variables.thread;
                that.data.fid = threads.fid
                let nickname = res.Variables.member_nickname ? res.Variables.member_nickname : res.Variables.member_username
                that.setData({
                    nickname: nickname
                })
                if (res.Message) {
                    let messageval = res.Message.messageval

                    // 用户组无权查看
                    if (messageval == 'forum_group_noallowed') {
                        console.log(77777);
                        app.wxApi.showModal({
                                title: "提示",
                                content: res.Message.messagestr,
                                showCancel: false,
                                confirmText: "知道了",
                            })
                            .then(res => {
                                if (res.confirm) {
                                    app.wxApi.navigateBack()
                                }
                            })
                        return false
                    }

                    // 不知道是做什么判断
                    if (messageval.indexOf('nonexistence') != -1 ||
                        messageval.indexOf('nopermission') != -1 ||
                        messageval.indexOf('beoverdue') != -1 ||
                        messageval.indexOf('nomedal') != -1) {
                        app.wxApi.showModal({
                                title: "提示",
                                content: res.Message.messagestr,
                                showCancel: false,
                                confirmText: "知道了"
                            })
                            .then(res => {
                                if (res.confirm) {
                                    app.wxApi.navigateBack()
                                }
                            })
                        return false
                    }
                }

                that.setData({
                    favorited: threads.favorited
                });

                // 改变状态
                that.resetCollectState();

                var usernicknames = res.Variables.usernicknames

                let arr1 = that.data.datalist;
                let listArray = res.Variables.postlist;
                for (let i = 0; i < listArray.length; i++) {
                    let postItem = listArray[i]
                    if (usernicknames) {
                        if (usernicknames[postItem.authorid]) {
                            postItem.nickname = usernicknames[postItem.authorid]
                        }
                    }
                    postItem.message = postItem.message.replace(/\<img/gi, '<img class="rich-img"')
                    postItem.message = postItem.message.replace(/<font (.*?)>/gi, "");
                    postItem.message = postItem.message.replace(/<\/font>/gi, "");
                    // 作业评论处理
                    let comments = res.Variables.comments
                    if (comments && comments.length != 0) {
                        if (comments[postItem.pid]) {
                            let comment = comments[postItem.pid]
                            for (let key in comment) {
                                let item = comment[key]
                                if (usernicknames) {
                                    item.nickname = usernicknames[item.authorid]
                                }
                            }
                            postItem.comments = comment
                        }
                    }

                    let listindex = i + that.data.datalist.length
                        // 附件处理
                    let attachments = postItem.attachments
                    let imageA = []
                    let audioA = []
                    let videoA = []
                    let DownloadA = [];
                    for (let aidKey in attachments) {
                        let attItem = attachments[aidKey]
                        let newUrl = baseUrl + '/' + attItem.url + attItem.attachment
                        attItem['newUrl'] = newUrl
                        if (attItem.isimage != 0) {
                            imageA.push(attItem)
                        } else if (attItem.ext == 'mp3') {
                            let total_process = '00:00'
                            console.log(attItem.description);
                            if (attItem.description) {
                                total_process = util.formatTime(parseInt(attItem.description))
                            }
                            attItem['toolUse'] = {
                                attachment: newUrl,
                                listIndex: listindex,
                                total_process: total_process
                            }
                            audioA.push(attItem)
                        } else if (attItem.ext == 'mp4' || attItem.ext == 'avi') {
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

                if (that.data.pagenum > 1) {
                    arr1 = arr1.concat(listArray);
                } else {
                    arr1 = listArray;
                }

                if (arr1.length - 1 >= threads.replies) {
                    that.setData({
                        hasMore: false
                    })
                } else {
                    that.setData({
                        hasMore: true
                    })
                }
                // console.log(arr1);
                that.setData({
                    loading: false,
                    datalist: arr1,
                    thread: threads,
                })
            })
            .catch(res => {
                // wx.stopPullDownRefresh()
                console.log(res)
                app.wxApi.hideLoading();
                that.setData({
                    loading: false
                })
                app.wxApi.showToast({
                    title: '出错了！',
                    icon: 'none'
                })
            })
    },

    // 改变收藏状态
    resetCollectState() {
        let that = this
        let collecttext = that.data.collecttext
        if (that.data.favorited == 1) {
            collecttext = "已收藏"
        } else {
            collecttext = "收藏"
        }
        that.setData({
            collecttext: collecttext,
        })
    },
})