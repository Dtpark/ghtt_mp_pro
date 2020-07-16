// components/banner/banner.js
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 轮播图链接
    bannerImgUrls: {
      type: [String,Object],
      default: {
        0: {
          image_url:
            "https://ghttdata.hitwh.cc/data/attachment/forum/201907/08/151218k9m51mm5f61mk5v9.png",
          type: 0,
          title: '',
          d_id: ''
        }
      }
    }

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 跳转到banner详情页
     */
    toDetail(event) {
      let that = this;
      let banner = event.currentTarget.dataset.para;
      switch (banner.type) {
        // 判断banner类型
        case 0:
          // 纯图片，不跳转
          break;
        case 9:
          // 跳转到其他小程序（微信）
          wx.navigateToMiniProgram({
            appId: banner.detail_id,
            path: "",
            extraData: {},
            success(res) {
              // 打开成功
              // console.log('111');
            },
            fail(res) {
              // 打开失败
              wx.showToast({
                title: '跳转失败', //提示的内容,
                icon: 'none',
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
              });
            }
          });
          break;
      }
      return false;
    },

  }
})
