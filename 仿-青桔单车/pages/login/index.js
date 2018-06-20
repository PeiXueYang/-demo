// pages/login/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',//手机号
    iconClear:false,
    showNext:false,// 下一步按钮 和 输入验证码部分
    disabled:false,// 下一步 按钮 禁用
    loading:false,//懒加载
    btn_disable:'btn_disable',
    codeText:'获取验证码',
    codeStatus:true,//验证码的状态
    YzCode:'',//验证码的值
    loginStatus:false,//登录的状态
  },
  //获取输入框的值
  clearPhone:function(){
     this.setData({
       phone:'',
       showNext:false,
       btn_disable:'btn_disable'
     })
  },
  //获取  输入手机号的值
  getPhone:function(e){
    if (e.detail.value){
      this.setData({
        iconClear:true,
      })
    }
    var phone = e.detail.value
    phone = phone.replace(/[\u4E00-\u9FA5`~!@#$%^&*()_+<>?:"{},.\/;'[\]\-\sa-zA-Z]*/g, "");
    let result = [];
    for (let i = 0; i < phone.length; i++) {
      if (i == 3 || i == 7) {
        result.push(" ", phone.charAt(i));
      }
      else {
        result.push(phone.charAt(i));
      }
    }
    let finPhone = result.join("")
    this.setData({
      phone: finPhone
    })
    if (finPhone.length ==13){

      this.setData({
        showNext: true,
        btn_disable:'',
      })
    }
  },
  //获取输入的验证码的值
  getYzCode:function(e){
    let code = e.detail.value   
    this.setData({
      YzCode:code
    })     
  },
  // 正则校验手机号
  toCheck(str) {
    // 定义手机号的正则
    var isMobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    //拿到去除空格后的手机号
    // 校验手机号
    return isMobile.test(str);
  },
  //获取验证码 倒计时
  codeFun:function(){
    var phoneNumber = this.data.phone.replace(/\s+/g, "");
    if (!this.toCheck(phoneNumber)) {
      wx.showModal({
        content:'请输入有效手机号',
        showCancel:false
      })
      return false
    }
    if (!this.data.codeStatus){
       return false
    }
    this.setData({
      codeStatus:false
    })
     let sec = 60
   let counterdown =   setInterval(()=>{
         if(sec>0){
           sec--
           this.setData({
             codeText:sec+'s重新获取'
           })
         }else{
           clearInterval(counterdown)
           this.setData({
             codeText: '获取验证码',
             codeStatus:true
           })
         }
     },1000)
  },
  nextFun:function(){
    if (this.data.btn_disable){  return  }
    if(!this.data.phone){
       wx.showModal({
         content:'请输入手机号',
         showCancel:false
       })
       return false
    }
    if (!this.data.YzCode) {
      wx.showModal({
        content: '请输入验证码',
        showCancel: false
      })
      return false
    }
    if (this.data.phone && this.data.YzCode){
      wx.setStorage({
        key: "phone",
        data: this.data.phone
      })
      wx.setStorage({
        key: "loginStatus",
        data: true
      })
        wx.showToast({
          title:'登录成功.'
        })
      wx.navigateTo({
        url:'../index/index'
      })

    }

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
  
  }
})