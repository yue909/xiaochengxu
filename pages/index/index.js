// pages/index/index.js
var app= getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  next:function(){
    wx.navigateTo({
      url: '/pages/form/form',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  calling:function(){
    app.calling()
  },

  bootTap:function(e){

    wx.navigateTo({
      url: '/pages/page/page',
      success: function (res) { console.log(1) },
      fail: function (res) { console.log(2)},
      complete: function (res) { console.log(3) },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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