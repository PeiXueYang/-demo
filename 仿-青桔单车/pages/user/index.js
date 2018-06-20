// pages/user/index.js
import {userInfo} from '../../config/api.js'
// 没有接口  暂时写个假的
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',//用户手机号
    counter:0,//骑行的次数
    couquoNumber:0,//优惠券的数量
    cardDays:0,//月卡使用天数
  },
  // 用户请求退出账号
  signOut:function(){
    wx.clearStorageSync()
    wx.navigateTo({
      url: '../index/index',
    })
  },
  //获取 用户信息
  getUserInfo:function(){
  
  },
  //行程
  routeFun:function(){
    wx.navigateTo({
      url: '../route-line/index',
    })
  },
  //优惠券
  couponFun:function(){
    wx.navigateTo({
      url: '../coupon/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
    let that = this 
    wx.getStorage({
      key: 'phone',
      success: function(res) {
       that.setData({
         phone:res.data
       })
      },
    })
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
  
  }
})