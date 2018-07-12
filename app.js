//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // var code = res.code;
        // console.log(code);
        // if(code){
        //   wx.showToast({
        //     title: '登录成功！',
        //     icon: 'success',
        //     duration: 1500
        //   })

        // }else{
        //   wx.showToast({
        //     title: '登录失败！',
        //     icon: 'loading',
        //     duration: 1500
        //   })
        // }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              wx.setStorageSync('userInfo', this.globalData.userInfo)
              // console.log(res)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: this.data.imgalist, // 当前显示图片的http链接   
      urls: this.data.imgalist // 需要预览的图片http链接列表   
    })
    // wx.getImageInfo({// 获取图片信息（此处可不要）
    //   src: 'https://www.cslpyx.com/weiH5/jrkj.jpg',
    //   success: function (res) {
    //     console.log(res.width)
    //     console.log(res.height)
    //   }
    // })
  },
  // 打电话
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: '400-990-2996', //此号码并非真实电话号码
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  // 获取访问页面url
  getCurrentPageUrl:function (){
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    return url
  },
  globalData: {
    userInfo: null
  },
  
})