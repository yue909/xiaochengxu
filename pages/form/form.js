var app = getApp();
var interval =null;
var WxParse = require('../../wxParse/wxParse.js');
Page({

  data: {
    placeholder:'请输入公司名',
    keyword:'',
    companylist:[],
    company:'',
    time:'获取验证码',
    currentTime:61,
    phone:'',
    code:'',
    return_code:'',
    return_phone:'',
    displaynone:'displaynone',
    imgalist: ["https://wx.zhixiaobing.com/Template/pc/default/Static/api/kefu.jpg"]
  },
  bindKeyInput: function (e) {
    // console.log(e)
    this.data.keyword = e.detail.value;

  },
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
  formSubmit: function(e) {
    console.log(e);
    var  that=this,
        username = e.detail.value.username,
        condition_25 = e.detail.value.condition_25,
        yingye = e.detail.value.yingye,
        yanfa = e.detail.value.yanfa,
        jiajikouchu = e.detail.value.jiajikouchu,
        zizhi = e.detail.value.zizhi,
        qita = e.detail.value.qita,
        check_patent = e.detail.value.check_patent,
        patent_count = e.detail.value.patent_count,
        shebei = e.detail.value.shebei[0],
        zhanhui = e.detail.value.shebei[0],
        daikuan = e.detail.value.daikuan[0],
        xinxihua = e.detail.value.xinxihua[0],
        objectvalue = '',
        code = that.data.code,
        return_code = that.data.code,
        phone = that.data.phone,
        return_phone = that.data.return_phone,
        company= that.data.company;
        
    for (var i = 0; i < e.detail.value.object.length; i++) {
      objectvalue += e.detail.value.object[i]+',';
    }
    if (!company){
      wx.showToast({

        title: '请输入公司名',

        icon: 'loading',

        duration: 1500

      })
      return false;

    }
    if (!condition_25){
      wx.showToast({

        title: '请选择企业类型',

        icon: 'loading',

        duration: 1500

      })
      return false;

    }
    if (!yingye) {
      wx.showToast({

        title: '请选择营业额',

        icon: 'loading',

        duration: 1500

      })
      return false;

    }
    if (objectvalue.length == 0) {

      wx.showToast({

        title: '请选择项目类型!',

        icon: 'loading',

        duration: 1500

      })
      return false;

    }
    // console.log(objectvalue);
    if (username.length == 0 || phone.length == 0){

      wx.showToast({

        title: '姓名或手机号不得为空!',

        icon: 'loading',

        duration: 1500

      })
      return false;


    } 
    if (phone.length != 11 || !(/^1([35478]\d{9}|47\d{8})$/.test(phone))){

        wx.showToast({

        title: '请输入正确手机号码!',

        icon: 'loading',

        duration: 1500

      })

        return false;
    }

    if(username.length <2 ){

        wx.showToast({

        title: '请输入正确的姓名!',

        icon: 'loading',

        duration: 1500

      })

        return false;
    }
    if (code != return_code || code == '') {
      wx.showToast({

        title: '验证码不正确!',

        icon: 'loading',

        duration: 1500
      })
      return false;
    }
    if (return_phone != phone || return_phone=='' ) {
      wx.showToast({

        title: '手机和验证码不匹配!',

        icon: 'loading',

        duration: 1500
      })
      return false;
    }
    

    

    var urls = '小程序'+ app.getCurrentPageUrl();

      
      wx.request({  

            url: 'https://wx.zhixiaobing.com/index.php?m=&c=base&a=object',  

            header: { "Content-Type": "application/x-www-form-urlencoded"  },

            method: "POST",

            data: { lnktel: phone, lnkper: username, company: company , objectvalue: objectvalue, url: urls,code:code},

            success: function(res) {
              // console.log(res);

              if(res.data.status == '0'){

                  wx.showToast({

                    title: res.data.msg,

                    icon: 'loading',

                    duration: 1500

                  })

              }else{
                  wx.request({
                    url:'https://wx.zhixiaobing.com/index.php?m=App&c=Api&a=checkEvaluationToolEasy',
                    header: { "Content-Type": "application/x-www-form-urlencoded" },

                    method: "POST",

                    data: {
                        name: company, 
                        condition_25: condition_25,
                        yingye: yingye,
                        yanfa:yanfa,
                        jiajikouchu: jiajikouchu,
                        zizhi: zizhi,
                        qita: qita,
                        check_patent: check_patent,
                        patent_count: patent_count,
                        shebei: shebei,
                        zhanhui: zhanhui,
                        daikuan: daikuan,
                        xinxihua: xinxihua
                    },
                    success:function(result){
                      console.log(result)
                      if(result.data){
                        var objectList = result.data;
                        WxParse.wxParse('objectList', 'html', objectList, that, 5);
                        that.setData({
                          displaynone:'display'
                        })

                        wx.showToast({

                          title: '查询成功',//这里打印出登录成功

                          icon: 'success',

                          duration: 1000

                        })


                      }else{

                        wx.showToast({

                          title: '查询失败',//这里打印出登录成功

                          icon: 'success',

                          duration: 1000

                        })

                      }
                    },
                    fail:function(){
                      wx.showToast({

                        title: '网络错误',//这里打印出登录成功

                        icon: 'success',

                        duration: 1000

                      })
                    }

                  })

                  
              }

            }  

          })

   

  }, 
  bindgetPhone: function (e) {
    // console.log(e)
    this.data.phone = e.detail.value;
  },
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  },
  
  getVerificationCode:function() {
  var that = this;
  var phone = that.data.phone;
  // console.log(phone)
  if (phone.length == 11 && (/^1([35478]\d{9}|47\d{8})$/.test(phone))){
    wx.request({
      url: 'https://www.zhixiaobing.com/index.php?m=&c=login&a=sendCode',
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      method: "POST",
      data: { phone: phone},
      success:function(res){
        if(res.data.status==1){
          that.getCode();
          that.setData({
            disabled: true,
            return_code:res.data.code.code,
            return_phone: res.data.code.sender
          })
        }else{
          wx.showToast({
            title: '发送失败!',
            icon:'loading',
            duration:1000
          })
        }

      },


    })
  }else{
    wx.showToast({
      title: '手机号不正确',
    })
  }

  },

  bindCode:function(e){
    this.data.code = e.detail.value;
  },
  calling:function(){
    app.calling()
  },
  gaojiceping:function(e){
    wx.navigateTo({
      url: '/pages/caculate/caculate',
    })
  },
  
  onShareAppMessage: function () {
    return {
      title: '知小兵--项目测评系统',
      path: '/pages/caculate/caculate',
      imageUrl: '../../imgs/icon/logo.png'

    }

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

})