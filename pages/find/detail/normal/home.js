// pages/find/detail/normal/home.js
const app = getApp()
const detailUrl = require('../../../../config/config').detailUrl
const userAvatar = require('../../../../config/config').userAvatar
    // const baseUrl = require('../../../../config/config').baseUrl
const collectUrl = require('../../../../config/config').collectUrl
const unCollectUrl = require('../../../../config/config').unCollectUrl
const sendFlowerUrl = require('../../../../config/config').sendFlowerUrl
    // const detailPath = require('../../../../utils/path').default.detailPath
const loginmanager = require('../../../../utils/loginManager')
const loginPath = require('../../../../utils/path').default.loginPath
const datacheck = require('../../../../utils/dataCheck')
const postReplyUrl = require('../../../../config/config').postReplyUrl
const replyQuoteUrl = require('../../../../config/config').replyQuoteUrl
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
        index: 0,

        // 显示/隐藏 分享框
        isShare: false,

        // 富文本样式
        tagStyle: {
            blockquote: "background-color:var(--greyLight)"
        },

        // 评论工具栏距底部位置
        InputBottom: 0,

        // 是否在评论
        isCommend: false,

        // 评论上传的图片列表
        imageList: [],
        // 评论上传的post参数
        postDic: [],

        // 评论内容
        messageValue: '',
        // 楼层回复的id
        reppid: '',
        // 待引用内容
        noticetrimstr: '',

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this

        // 获取主题id
        let tid = options.tid;
        // 获取主题标题
        let title = options.title;
        app.wxApi.setNavigationBarTitle({ title: title })
            // tid = 2067399
            // tid = 9

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
        let that = this
        that.refreshRequest()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        let that = this
        if (that.data.hasMore) {
            that.requestMore(true)
        }
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


    // 收藏/取消收藏
    collectThread() {
        let that = this
        if (that.data.favorited == 1) { // 已收藏 取消收藏
            that.unCollect()
        } else { // 未收藏 去收藏
            that.collect()
        }
    },

    // 收藏主题
    collect() {
        let that = this
        let formhash = app.globalData.formhash
        let data = {
            formhash: formhash,
            id: that.data.tid
        }
        app.apimanager.getRequest(collectUrl, data)
            .then(res => {
                if (res.Message.messageval === "favorite_do_success") {
                    that.setData({
                        favorited: 1
                    })
                    that.resetCollectState()
                } else {
                    if (res.Message.messageval === "favorite_repeat") {
                        that.resetCollectState()
                    }
                    app.wxApi.showToast({
                        title: res.Message.messagestr,
                        icon: 'none'
                    })
                }
            })
            .catch(res => {
                app.wxApi.showToast({
                    title: '出错了！',
                    icon: 'none'
                })
            })
    },

    // 取消收藏
    unCollect() {
        let that = this
        let url = unCollectUrl + "&id=" + that.data.tid + "&type=thread";
        let formhash = app.globalData.formhash
        let postData = {
            formhash: formhash,
            deletesubmit: true
        }
        app.apimanager.postRequest(url, postData)
            .then(res => {
                if (res.Message.messageval == "do_success") {
                    that.setData({
                        favorited: 0
                    })
                    that.resetCollectState()
                } else {
                    app.wxApi.showToast({
                        title: res.Message.messagestr,
                        icon: 'none'
                    })
                }
            })
            .catch(res => {
                app.wxApi.showToast({
                    title: '出错了！',
                    icon: 'none'
                })
            })
    },



    // 切换回帖排序
    PickerChange(e) {
        let that = this
        that.setData({
            index: e.detail.value
        })
        that.makeRequest()
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
                app.wxApi.stopPullDownRefresh();
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
                            // let newUrl = baseUrl + '/' + attItem.url + attItem.attachment
                        let newUrl = attItem.url + attItem.attachment
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
                app.wxApi.stopPullDownRefresh()
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

    // 点赞
    sendFlower(e) {
        let that = this
        let index = parseInt(e.currentTarget.id)
        let replyItem = that.data.datalist[index]

        let formhash = app.globalData.formhash
        let data = {
                tid: that.data.tid,
                pid: replyItem.pid,
                hash: formhash
            }
            // 对主题进行点赞
        if (index == 0) {
            data['action'] = 'recommend'
            data['do'] = 'add'
        }

        app.apimanager.getRequest(sendFlowerUrl, data)
            .then(res => {
                if (res.Message.messageval == "thread_poll_succeed") {
                    replyItem.issupport = 1

                    if (replyItem.postreview && replyItem.postreview.support) {
                        replyItem.postreview.support = parseInt(replyItem.postreview.support) + 1;
                    } else {
                        let postreview = {
                            support: 1
                        };

                        replyItem['postreview'] = postreview;
                    }
                    let param = {}
                    let str = 'datalist[' + index + ']'
                    param[str] = replyItem
                    that.setData(param)

                    // console.log(self.data.datalist);
                } else if (res.Message.messageval == "recommend_succeed") {
                    // 主题评价成功
                    replyItem.issupport = 1
                    let thread = that.data.thread

                    if (thread.recommends && thread.recommend_add) {
                        thread.recommend_add = parseInt(thread.recommend_add) + 1;
                    } else {
                        let recommend_add = 1

                        thread['recommend_add'] = recommend_add;
                        thread['recommend'] = 1;
                    }
                    let param = {}
                    param["thread"] = thread
                    that.setData(param)

                } else {
                    if (this.data.repliesrank == '0' && res.Message.messageval == "to_login") {
                        app.wxApi.showToast({
                            title: '该功能暂未开启',
                            icon: 'none'
                        })
                    } else {
                        app.wxApi.showToast({
                            title: res.Message.messagestr,
                            icon: 'none'
                        })
                    }
                }
            })
            .catch(res => {
                app.wxApi.showToast({
                    title: '出错了',
                    icon: 'none'
                })
            })
    },
    // 主题点赞
    // mod: misc
    // action: recommend
    // do :add
    // tid: 9
    // hash: 1 d51af2f
    // ajaxmenu: 1
    // inajax: 1
    // ajaxtarget: recommend_add_menu_content

    // 回复点赞
    // mod: misc
    // action: postreview
    // do :support
    // tid: 9
    // pid: 23
    // hash: 1 d51af2f
    // ajaxmenu: 1
    // inajax: 1
    // ajaxtarget: _menu_content

    // 查看图片
    lookImage(e) {
        let that = this
        let cellItem = that.data.datalist[e.currentTarget.dataset.cellindex]
        let imageA = cellItem.imageA
        let imageSrcArray = [];
        for (let i = 0; i < imageA.length; i++) {
            let item = imageA[i]
            imageSrcArray.push(item.attachmenturl)
        }
        app.wxApi.previewImage({
            current: imageSrcArray[e.currentTarget.id],
            urls: imageSrcArray
        })
    },

    // 点击写评论
    commend() {
        let that = this
            // 判断登录态
        if (loginmanager.isLogin()) {
            that.setData({
                isCommend: true
            })
        } else {
            app.wxApi.navigateTo(loginPath)
        }

    },

    InputFocus(e) {
        this.setData({
            InputBottom: e.detail.height
        })
    },
    InputBlur(e) {
        this.setData({
            InputBottom: 0,
            isCommend: false
        })
    },
    // 显示表情
    showEmoji() {
        let that = this
        app.wxApi.showToast({ title: '尚未开发，敬请期待', icon: 'none' })
            .then(res => {
                that.InputBlur()
            })
    },

    // 楼层回复预处理
    reply(e) {
        let that = this

        // 判断登录态
        if (loginmanager.isLogin() == false) {
            app.wxApi.navigateTo(loginPath)
            return false
        }

        // 获取引用内容
        let repquote = e.currentTarget.dataset.pid
        let url = replyQuoteUrl + '&repquote=' + repquote + '&tid=' + that.data.tid
        let data = {
            formhash: app.globalData.formhash
        }
        app.apimanager.getRequest(url, data)
            .then(res => {
                // console.log(res)
                if (!res.Message) {
                    // 获取成功
                    that.setData({
                        noticetrimstr: res.Variables.noticetrimstr,
                        reppid: repquote,
                        isCommend: true
                    })
                } else {
                    // 获取失败
                    app.wxApi.showToast({ title: res.Message.messagestr, icon: 'none' })
                }
            })
            .catch(e => {
                console.log(e)
            })

    },

    // 预处理评论
    formSubmit(e) {
        let that = this

        // 过滤emoji
        if (datacheck.isEmojiCharacter(e.detail.value.message) || datacheck.isEmojiCharacter(e.detail.value.subject)) {
            app.wxApi.showToast({
                title: '不能使用emoji表情',
                icon: 'none'
            })
            that.setData({
                isCommend: false,
                reppid: '',
                noticetrimstr: ''
            })
            return;
        }

        // 构建post参数
        let postDic = {
            formhash: app.globalData.formhash,
        }

        let message = e.detail.value.message

        if (message.length == 0) {
            app.wxApi.showToast({ title: '评论内容不能为空', icon: 'none' })
            that.setData({
                isCommend: false,
                reppid: '',
                noticetrimstr: ''
            })
            return false
        }

        postDic['message'] = message

        // 判断是否为引用（楼层回复）
        if (that.data.reppid) {
            postDic['reppid'] = that.data.reppid
            postDic['noticetrimstr'] = that.data.noticetrimstr
        }

        // 图片附件
        if (that.data.imageList.length > 0) {
            for (let i = 0; i < that.data.imageList.length; i++) {
                let imgObj = that.data.imageList[i];
                let aid = imgObj['aid']
                let attachKey = "attachnew[" + aid + "][description]"
                postDic[attachKey] = ''
            }
        }
        // if (that.data.audio) {
        //     let attachKey = "attachnew[" + self.data.audio.aid + "][description]"
        //     postDic[attachKey] = self.data.recordTime
        // }

        // if (that.data.video) {
        //     let attachKey = "attachnew[" + self.data.video.aid + "][description]"
        //     postDic[attachKey] = ''
        // }

        // if (that.data.classTypeList && that.data.classTypeList.length > 0 && !that.data.isreply && !that.data.isevaluate) {
        //     if (e.detail.value.classType.length <= 0) {
        //         e.detail.value.classType = 0
        //     }
        //     let typeIndex = parseInt(e.detail.value.classType)
        //     let classObj = that.data.classTypeList[typeIndex]
        //     postDic['typeid'] = classObj.typeid
        // }

        that.setData({
            postDic: postDic
        })

        // 处理验证码
        // if (that.secode().haveCode()) {
        //     that.setData({
        //         codeShow: true
        //     })
        //     that.setData({
        //         fullScreen: true
        //     })
        //     return
        // }
        that.postThread()
    },

    // 发送评论
    postThread() {
        let that = this
            // that.setData({
            //     postLock: true
            // })

        let url = postReplyUrl + '&fid=' + that.data.fid + '&tid=' + that.data.tid

        app.wxApi.showLoading({
            title: '评论中...',
            icon: 'loading'
        })
        let postDic = that.data.postDic
        app.apimanager.postRequest(url, postDic).then(res => {
            app.wxApi.hideLoading()
            if (res.Message.messageval.indexOf('succeed') != -1 || res.Message.messageval.indexOf('success') != -1) {
                // 评论成功
                that.refreshRequest()
                that.setData({
                    messageValue: '',
                    isCommend: false,
                    reppid: '',
                    noticetrimstr: ''
                })

            } else {
                that.setData({
                    isCommend: false,
                    reppid: '',
                    noticetrimstr: ''
                })
            }
            app.wxApi.showToast({
                title: res.Message.messagestr,
                icon: 'none'
            })
        }).catch(res => {
            console.log(res)
            app.wxApi.hideLoading()
            that.setData({
                isCommend: false,
                reppid: '',
                noticetrimstr: ''
            })
            app.wxApi.showToast({
                title: '服务器繁忙，请稍后再试！',
                icon: 'none'
            })
        })
    },

    // 显示分享模态框
    showModal() {
        let that = this
        that.setData({
            isShare: true,
            // shareInfo: {
            //     title: e.currentTarget.dataset.title,
            //     path: detailPath + '?tid=' + e.currentTarget.dataset.tid
            // }
        })

    },

    // 隐藏分享模态框
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
})