// pages/home/home/home.js
Component({
    options: {
        addGlobalClass: true,
    },

    /**
     * 页面的初始数据
     */
    data: {
        // 轮播图
        bannerImgUrls: {
            0: {
                image_url: "https://ghttdata.hitwh.cc/data/attachment/forum/201907/08/151218k9m51mm5f61mk5v9.png",
                type: 0,
                title: '',
                d_id: ''
            },
            1: {
                image_url: "https://ghttdata.hitwh.cc/data/attachment/forum/201907/08/151218k9m51mm5f61mk5v9.png",
                type: 0,
                title: '',
                d_id: ''
            }

        },

        // 快讯（公告）列表
        noticeList: {
            0: {
                type: '通知',
                title: '关于巴拉巴拉小魔仙的123456789012345'
            },
            1: {
                type: '通知',
                title: '关于巴拉巴拉小魔仙的123456789012345'
            }
        },


        // 应用列表
        iconList: [{
            icon: 'cardboardfill',
            color: 'red',
            badge: 120,
            name: 'VR'
        }, {
            icon: 'recordfill',
            color: 'orange',
            badge: 1,
            name: '录像'
        }, {
            icon: 'picfill',
            color: 'yellow',
            badge: 0,
            name: '图像'
        }, {
            icon: 'noticefill',
            color: 'olive',
            badge: 22,
            name: '通知'
        }, {
            icon: 'upstagefill',
            color: 'cyan',
            badge: 0,
            name: '排行榜'
        }, {
            icon: 'clothesfill',
            color: 'blue',
            badge: 0,
            name: '皮肤'
        }, {
            icon: 'discoverfill',
            color: 'purple',
            badge: 0,
            name: '发现'
        }, {
            icon: 'questionfill',
            color: 'mauve',
            badge: 0,
            name: '帮助'
        }, {
            icon: 'commandfill',
            color: 'purple',
            badge: 0,
            name: '问答'
        }, {
            icon: 'brandfill',
            color: 'mauve',
            badge: 0,
            name: '版权'
        }],
        // 课表列表
        todayCurriculum: {
            0: {
                name: '11111',
                time: '111122',
                room: '33333'
            }
        }
    }
})