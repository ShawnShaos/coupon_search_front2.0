const SelectSizePrefix = "选择："
const api = require("../../utils/api")

Page({
  data: {
    goodsDetail: {},
    hasMoreSelect: false,
    selectSize: SelectSizePrefix,
    selectSizePrice: 0,
    totalScoreToPay: 0,
    shopNum: 0,
    hideShopPopup: true,
    buyNumber: 0,
    buyNumMin: 1,
    buyNumMax: 0,

    propertyChildIds: "",
    propertyChildNames: "",
    canSubmit: false, //  选中规格尺寸时候是否允许加入购物车
    shopCarInfo: {},
    shopType: "addShopCar", //购物类型，加入购物车或立即购买，默认为加入购物车
    currentPages: undefined,

    openShare: false,

  },
  async onLoad(e) {
    this.data.goodsId = e.goodsId
    this.reputation(e.goodsId); //获取商品详情
  },
  onShareAppMessage: function(res) {
    return {
      title: this.data.goodsDetail.goods_name,
      path: 'pages/goods-details/goods-details?goodsId=' + this.data.goodsId,
      success: function(res) {
        console.log('成功', res)
      }
    }
  },
  toPdd() {
    var that = this;

    wx.showLoading({
      title: '加载中',
    });

    //获取推广链接并跳转到pdd
    api.GetProByGid({
      method: "GET",
      data: {
        goods_id: that.data.goodsId
      }
    }).then(function(e) {
      if (e.data.error_response == undefined) {
        var path = e.data.goods_promotion_url_generate_response.goods_promotion_url_list[0].we_app_info.page_path
        wx.navigateToMiniProgram({
          appId: api.appId,
          path: path,
          success(res) {

          }
        })
      } else {

      }
    })


  },

  reputation: function(goodsId) { //获取商品详情
    var that = this;

    api.GetGoodsDetail({
      method: "GET",
      data: {
        goods_id: goodsId
      }
    }).then(function(res) {

      if (res.data.error_response == undefined) {
        that.setData({
          goodsDetail: res.data.goods_detail_response.goods_details[0]
        })
      }
    })
  },
  // pingtuanList: function(goodsId) {
  //   var that = this;
  //   WXAPI.pingtuanList({
  //     goodsId: goodsId,
  //     status: 0
  //   }).then(function(res) {
  //     if (res.code == 0) {
  //       that.setData({
  //         pingtuanList: res.data.result
  //       });
  //     }
  //   })
  // },
  // getVideoSrc: function(videoId) {
  //   var that = this;
  //   WXAPI.videoDetail(videoId).then(function(res) {
  //     if (res.code == 0) {
  //       that.setData({
  //         videoMp4Src: res.data.fdMp4
  //       });
  //     }
  //   })
  // },
  // joinKanjia(){
  //   AUTH.checkHasLogined().then(isLogined => {
  //     if (isLogined) {
  //       this.doneJoinKanjia();
  //     } else {
  //       wx.showModal({
  //         title: '提示',
  //         content: '本次操作需要您的登录授权',
  //         cancelText: '暂不登录',
  //         confirmText: '前往登录',
  //         success(res) {
  //           if (res.confirm) {
  //             wx.switchTab({
  //               url: "/pages/my/index"
  //             })
  //           }
  //         }
  //       })
  //     }
  //   })
  // },
  // doneJoinKanjia: function() { // 报名参加砍价活动
  //   const _this = this;
  //   if (!_this.data.curGoodsKanjia) {
  //     return;
  //   }
  //   wx.showLoading({
  //     title: '加载中',
  //     mask: true
  //   })
  //   WXAPI.kanjiaJoin(wx.getStorageSync('token'), _this.data.curGoodsKanjia.id).then(function(res) {
  //     wx.hideLoading()
  //     if (res.code == 0) {
  //       _this.data.kjJoinUid = wx.getStorageSync('uid')
  //       _this.getGoodsDetailAndKanjieInfo(_this.data.goodsDetail.basicInfo.id)
  //     } else {
  //       wx.showToast({
  //         title: res.msg,
  //         icon: 'none'
  //       })
  //     }
  //   })
  // },
  // joinPingtuan: function(e) {
  //   let pingtuanopenid = e.currentTarget.dataset.pingtuanopenid
  //   wx.navigateTo({
  //     url: "/pages/to-pay-order/index?orderType=buyNow&pingtuanOpenId=" + pingtuanopenid
  //   })
  // },
  // goIndex() {
  //   wx.switchTab({
  //     url: '/pages/index/index',
  //   });
  // },
  // helpKanjia() {
  //   const _this = this;
  //   AUTH.checkHasLogined().then(isLogined => {
  //     if (isLogined) {
  //       if (CONFIG.kanjiaRequirePlayAd) {
  //         // 显示激励视频广告
  //         if (videoAd) {
  //           videoAd.show().catch(() => {
  //             // 失败重试
  //             videoAd.load()
  //               .then(() => videoAd.show())
  //               .catch(err => {
  //                 console.log('激励视频 广告显示失败')
  //               })
  //           })
  //         }
  //         return;
  //       } else {
  //         _this.helpKanjiaDone()
  //       }
  //     } else {
  //       app.goLoginPageTimeOut()
  //     }
  //   })
  // },
  // helpKanjiaDone(){
  //   const _this = this;
  //   WXAPI.kanjiaHelp(wx.getStorageSync('token'), _this.data.kjId, _this.data.kjJoinUid, '').then(function (res) {
  //     if (res.code != 0) {
  //       wx.showToast({
  //         title: res.msg,
  //         icon: 'none'
  //       })
  //       return;
  //     }
  //     _this.setData({
  //       myHelpDetail: res.data
  //     });
  //     wx.showModal({
  //       title: '成功',
  //       content: '成功帮TA砍掉 ' + res.data.cutPrice + ' 元',
  //       showCancel: false
  //     })
  //     _this.getGoodsDetailAndKanjieInfo(_this.data.goodsDetail.basicInfo.id)
  //   })
  // },
  // openShareDiv () {
  //   this.setData({
  //     openShare: true
  //   })
  // },
  // closeShareDiv() {
  //   this.setData({
  //     openShare: false
  //   })
  // },
  // toPoster: function (e) { // 千万生成海报界面
  //   wx.navigateTo({
  //     url: "/pages/goods-details/poster?goodsid=" + e.currentTarget.dataset.goodsid
  //   })
  // }
})