// pages/caculate/caculate.js
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    placeholder: '请输入公司名',
    companyerror: '',
    condition_25: [{ 'id': '78', 'name': '生产制造业' }, { 'id': '85', 'name': '战略性新兴产业和未来产业' }, { 'id': '83', 'name': '软件企业' }, { 'id': '211', 'name': '农业类' }, { 'id': '87', 'name': '文化企业' }, { 'id': '84', 'name': '出口企业' }],
    conditons: [],
    condition11: [{'id':'国家高新技术企业'}, '深圳市高新技术企业', '国家高新入库企业', '软件企业', '创新型中小微企业', '广东省守合同重信用企业', '市工业百强企业', '区工业百强企业', '区重点实验室', '区工程技术研究开发中心', '区战略性新兴产业重点企业', '贯标认证企业', '知识产权优势企业'],
    condition12: ['是否预申请知识产权'],
    company: '',
    mode:'',
    contents:'',
    display:"display",
    imgalist: ["https://wx.zhixiaobing.com/Template/pc/default/Static/api/kefu.jpg"],
    phone:''
  },
  // 绑定输入
  bindKeyInput: function (e) {
    // console.log(e)
    this.data.keyword = e.detail.value;

  },
  // bindKeyphone:function(e){
  //   // console.log(e)
  //   this.data.phone = e.detail.value;
  //   if (e.detail.value.length != 11 || !(/^1([35478]\d{9}|47\d{8})$/.test(e.detail.value))){
  //     wx.showToast({
  //       title: '手机号不正确',
  //       icon:'loading',
  //       duration:1000
  //     })
  //   }
  // },
  // 搜索
  search: function (e) {
    var that = this;
    if (that.data.keyword.length < 2) {
      wx.showToast({
        title: '请输入正确的公司名！',
        icon: 'loading',
        duration: 1000
      })

    } else {

      setTimeout(function () {
        wx.showToast({
          title: '正在查询...',
          icon: 'loading'
        })
        wx.request({
          url: 'https://wx.zhixiaobing.com/index.php?m=home&c=api&a=searchCompany',

          header: { "Content-Type": "application/x-www-form-urlencoded" },

          method: "POST",

          data: { keyword: that.data.keyword },

          success: function (res) {
            if (res.data.msg.length < 1) {
              res.data.msg = [{ 'Name': '暂无数据' }];
            }
            // 设置前台数据
            that.setData({
              companylist: res.data.msg
            })

          },
          fail: function () {
            console.log('网络错误！')
          }
        })
      }, 1000)

    }

  },
  // 把数据放在表格里
  putinput: function (e) {
    // console.log(e);
    var that = this;
    that.setData({
      keyword: e.currentTarget.dataset.name,
      companylist: [],
      company: e.currentTarget.dataset.name
    })

  },

  // 开始评测
  formSubmit: function (e) {
    var that = this;
    if (that.data.company) {

      if (e.detail.value.keyword.length < 2) {
        wx.showToast({
          title: '请输入正确公司名',
          icon: 'loading',
          duration: 1500
        })
      } else if (e.detail.value.condition1.length == 0) {
        wx.showToast({
          title: '请选择企业类型',
          icon: 'loading',
          duration: 1500
        })
      } else {
        console.log(e)
        var name = e.detail.value.keyword,
          condition_25 = e.detail.value.condition1,
          condition_3 = e.detail.value.condition2,
          condition_4 = e.detail.value.condition3,
          condition_12 = e.detail.value.condition4,
          condition_17 = e.detail.value.condition5,
          condition_18 = e.detail.value.condition6,
          condition_19 = e.detail.value.condition7,
          condition_9 = [],
          condition_20 = [],
          patent_count = e.detail.value.patent_count,
          condition_23 = e.detail.value.condition9,
          condition_34 = e.detail.value.condition10,
          check_patent = "on" ? 'on' : 'off';
          

        // condition_9 = e.detail.value.condition11,
        for (var i in e.detail.value.condition11) {
          condition_9[e.detail.value.condition11[i]] = e.detail.value.condition11[i]
         
        }
        for (var index in e.detail.value.condition8) {
          condition_20[e.detail.value.condition8[index]] = e.detail.value.condition8[index]
        }
        
        for (i in condition_20){
          condition_20[i] ? condition_20[i]:''
        }
        for (i in condition_9) {
          condition_9[i]!='undefined' ? condition_9[i] : ''
        }
        console.log(condition_20[36])
        console.log(condition_9)

        wx.request({
          url: 'https://wx.zhixiaobing.com/index.php?m=App&c=Api&a=checkEvaluationTool',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          method: 'post',
          data: { 'name': name, condition_3: condition_3, condition_4: condition_4, 'condition_20[36]': condition_20[36], 'condition_20[37]': condition_20[37], condition_12: condition_12, condition_17: condition_17, condition_18: condition_18, condition_19: condition_19, 'condition_9[19]': condition_9[19], 'condition_9[20]': condition_9[20], 'condition_9[32]': condition_9[32], 'condition_9[33]': condition_9[33], 'condition_9[34]': condition_9[34], 'condition_9[38]': condition_9[38], 'condition_9[97]': condition_9[97], 'condition_9[98]': condition_9[98], 'condition_9[197]': condition_9[197], 'condition_9[198]': condition_9[198], 'condition_9[199]': condition_9[199], 'condition_9[204]': condition_9[204], 'condition_9[207]': condition_9[207], condition_23: condition_23, condition_34: condition_34, check_patent: check_patent, patent_count: patent_count, condition_25: condition_25 },
          success: function (res) {
            // console.log(e);
            if (res.data.str) {
              that.setData({
                mode:'mode',
                contents:'contents',
                display:''
              })

              // wx.pageScrollTo({
              //   scrollTop: 2500,
              //   duration: 300
              // })
              var objectList = res.data.str;
              WxParse.wxParse('objectList', 'html', objectList, that, 5);
            }

          },
          fail: function () {
            wx.showToast({
              title: '网络错误',
              icon: 'loading',
              duration: 1500
            })
          }
        })

      }

    } else {

      wx.showToast({
        title: '请输入公司名',
        icon: 'loading',
        duration: 1500
      })

    }
  },
  // bookTap:function(e){
  //   wx.navigateTo({
  //     url: '../wx/wx',
  //     success: function(res) {},
  //     fail: function(res) {},
  //     complete: function(res) {},
  //   })
  // },
  close:function(){
    this.setData({
      mode:'',
      contents:'',
      display:'display'
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: this.data.imgalist, // 当前显示图片的http链接   
      urls: this.data.imgalist // 需要预览的图片http链接列表   
    })
    // wx.getImageInfo({// 获取图片信息（此处可不要）
    //   src: 'https://wx.zhixiaobing.com/api/api.jpg',
    //   success: function (res) {
    //     console.log(res.width)
    //     console.log(res.height)
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://wx.zhixiaobing.com/index.php?m=&c=api&a=conditions',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: {},
      success: function (res) {
        that.setData({
          conditions: res.data.msg
        })
        console.log(res.data.msg)

      }
    })
  },
  //打电话
  calling: function () {
      app.calling()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '知小兵--项目测评系统',
      path: '/pages/caculate/caculate',
      imageUrl: '../../imgs/icon/logo.png'
  
    }
  }
})