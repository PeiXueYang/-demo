//index.js
//获取应用实例
const app = getApp()
import { BICYCLE } from '../../config/api';
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
Page({
  data: {
    markers: [],
    polyline: [],
    controls: [],
    latitude:'',
    longitude:'',
    lastLongitude:'',// 终点的经度
    lastLatitude:'',//终点的维度
  },
  //事件处理函数
  // 扫码
  toScan:function(){
   wx.getStorage({
     key: 'loginStatus',
     success: function(res) {
       // 只允许从相机扫码
       wx.scanCode({
         onlyFromCamera: true,
         success: (res) => {
           console.log(res, 'res')
         }
       })
     },
     fail:function(e){
       wx.showModal({
         content: '登录后才能用车哦~',
         success: function (res) {
           if (res.confirm) {
             wx.navigateTo({
               url: '../login/index',
             })  
           } else if (res.cancel) {
             console.log('用户点击取消')
           }
         }
       })
     },

   })
  
  },
  
  regionchange(e) {
    wx.showLoading({
      title: '加载中',
    })
    // 拿到当前经纬度
 // 创建map上下文  保存map信息的对象
let map = wx.createMapContext('map');
    // 拿到起点经纬度
    if (e.type == 'begin') {
     map.getCenterLocation({
        type: 'gcj02',
        success: (res) => {
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
          this.setData({
            lastLongitude: res.longitude,
            lastLatitude: res.latitude,
            polyline: [{
              points: [{
                longitude: 113.3245211,
                latitude: 23.10229
              }],
              color: "#333",
              width: 2,
              arrowLine: true
            }]
          })
        }
      })
    }
    // 拿到当前经纬度
    if (e.type == 'end') {
      map.getCenterLocation({
        type: 'gcj02',
        success: (res) => {
          let lon_distance = res.longitude - this.data.lastLongitude;
          let lat_distance = res.latitude - this.data.lastLatitude;
          // console.log(lon_distance,lat_distance)
          // 判断屏幕移动距离，如果超过设定的阈值，模拟刷新单车
          if (Math.abs(lon_distance) >= 0.0035 || Math.abs(lat_distance) >= 0.0022) {
            console.log('刷新单车')
            this.setData({
              // 清空
              markers: []
            })
            this.tocreate(res)
          }
        }
      })
    }
  },
  //随机函数，根据所在地  模拟单车经纬度数据伪造单车
  tocreate(res) {
    // 随机单车数量设置
    let markers = this.data.markers;
    console.log(markers,'markers -----')
    let ran = Math.ceil(Math.random() * 20);
    // console.log(ran);
    for (let i = 0; i < ran; i++) {
      // 定义一个临时单车对象
      var t_bic = {
        "id": 0,
        "title": '去这里',
        "iconPath": "/images/map-bicycle.png",
        "callout": {},
        "latitude": 0,
        "longitude": 0,
        "width": 52.5,
        "height": 30,
        "callout":'',
        "label":''
      }
      // 随机
      var sign_a = Math.random();
      var sign_b = Math.random();
      // 单车分布密集度设置
      // Math.ceil()  向上取整...
      var a = (Math.ceil(Math.random() * 99)) * 0.00002;
      var b = (Math.ceil(Math.random() * 99)) * 0.00002;
      t_bic.id = i;
      t_bic.longitude = (sign_a > 0.5 ? res.longitude + a : res.longitude - a);
      t_bic.latitude = (sign_b > 0.5 ? res.latitude + b : res.latitude - b);
      markers.push(t_bic);
    }
    // console.log(markers)
    //将模拟的单车数据暂时存储到本地
    wx.setStorage({
      key: 'bicycle',
      data: markers
    })
    this.setData({
      markers
    })

  },
  //获取当前位置信息
  getLocationInfo:function(){
    wx.showLoading({
      title: '加载中',
    })
    let that = this
    // 获取当前的位置信息
    wx.getLocation({
      success: function(res) {
          let obj = {
            iconPath: "",
            id: 0,
            latitude: res.latitude,
            longitude: res.longitude,
            width: 50,
            height: 50
          }
          let arr  = []
          arr.push(obj)
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            markers:arr
          })
          setTimeout(() => {
            wx.request({
              url: BICYCLE,
              method: 'GET',
              success: (res) => {

               console.log(res,'res res')
                wx.setStorage({
                  key: 'bicycle',
                  data: res.data.data.markers
                })
                // that.setData({
                //   markers: res.data.data.markers
                // })
                wx.hideLoading();
              }
            })
          }, 1000)
          
      },
    })
  },
  //点击显示当前位置
  currentLocation:function(){
    var that = this
    // 实例化腾讯地图API核心类
    var qqmapsdk = new QQMapWX({
      key: 'SAZBZ-DRYCG-UQTQB-IJTLI-T7EGQ-FWBIQ' // 必填
    });
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            console.log(addressRes, '9999999999')

            wx.showModal({
              title: '当前位置',
              content: addressRes.result.address,
            })
          },
          fail: function (res) {
            console.log(res);
          },
        })
      }
    })

  },
// 选择位置
  locationInfo:function(){
    // 获取当前的位置信息
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })
  },
  //点击查看用户个人中心界面
  toUserInfo:function(){
    wx.getStorage({
      key: 'loginStatus',
      success: function(res) {
        console.log(res,'res')
        if(res.data){
          wx.navigateTo({
            url: '../user/index',
          })
        }
      },
      fail:function(res){
        wx.navigateTo({
          url: '../login/index',
        })
      }
    })
  },
  onLoad: function() {
    this.getLocationInfo()
   
  },

})