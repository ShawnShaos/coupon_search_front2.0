//获取应用实例
var app = getApp()
const api = require("../../utils/api")
Page({
  data: {
    inputShowed: false, // 是否显示搜索框
    inputVal: "", // 搜索框内容
    category_box_width: 750, //分类总宽度
    goodsRecommend: [], // 推荐商品
    kanjiaList: [], //砍价商品列表
    pingtuanList: [], //拼团商品列表

    loadingHidden: false, // loading
    userInfo: {},
    selectCurrent: 0,
    categories: [],

    goods: [],

    scrollTop: 0,
    loadingMoreHidden: true,

    coupons: [],


    pageSize: 20,
    cateScrollTop: 0,
    TabCur: 0,
    scrollLeft: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
    }],


    categoies: [],
    activeCategoryId: 0, //分类id
    curPage: 1,
    isShowMap: true, //是否显示轮播图和爆款推荐页以及排序选项
    TabListCur: 0,
    isShowSort:false, //是否显示销量价格排序导航
    priceUp: false //价格排序设置，默认升序
  },
  onLoad() {
    var that = this;
    //获取商品标签列表（自定义）
    api.GoodsOptGetByCustomize({}).then(function(data) {
      that.setData({
        categoies: data
      })
    })

    //获取商品标签列表（官方）
    // api.GoodsOptGet({
    //   data:{
    //     parent_opt_id:0
    //   }
    // }).then(function(data){
    //   console.log(data.goods_opt_get_response.goods_opt_list)
    // })

    this.topGoodsListQuery({
      page: 1
    })
  },
  topGoodsListQuery(data) {
    var that = this;
    //获取商品爆款列表
    api.TopGoodsListQuery({
      method: "GET",
      data: data
    }).then(
      function(data) {
        if (data.page == 1) { //第一页
          that.setData({
            goodsRecommend: data.data.top_goods_list_get_response.list
          })
        } else {
          that.setData({
            goodsRecommend: that.data.goodsRecommend.concat(data.data.top_goods_list_get_response.list)
          })
        }
      })
  },
  tabSelect(e) { //栏目分类标签
    wx.showLoading({
      title: '加载中',
    });
    var that = this;
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      activeCategoryId: e.currentTarget.dataset.opt_id,
      curPage: 1
    })

    this.goodsSearch({
      opt_id: e.currentTarget.dataset.opt_id, //分类栏目id
      page: 1
    })

  },
  goodsSearch: function(data) { //获取商品列表
    var that = this;
    if (data.opt_id == 0) { //热搜排行榜
      this.topGoodsListQuery(data)
    } else {

      that.setData({
        isShowMap: false
      });

      api.GoodsSearch({
        data: data
      }).then(function(data) {
        if (data.goods_search_response.goods_list.length <= 0) { //没有更多了
          that.setData({
            loadingMoreHidden: false
          })
          return;
        }

        if (data.page == 1) { //第一页
          that.setData({
            goodsRecommend: data.goods_search_response.goods_list,
          })
        } else {
          that.setData({
            goodsRecommend: that.data.goodsRecommend.concat(data.goods_search_response.goods_list)
          })
        }

      })
    };
  },
  tabListSelect(e) {
    this.setData({
      TabListCur: e.currentTarget.dataset.id,
    });
    if (e.currentTarget.dataset.id == 3) {
      if (this.data.priceUp) {
        this.setData({
          priceUp: false
        })
      } else {
        this.setData({
          priceUp: true
        })
      }
    }
  },
  toDetailsTap: function(e) {
    var goodsId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/goods-details/goods-details?goodsId=" + goodsId
    })
  },
  // tapBanner: function(e) {
  //   if (e.currentTarget.dataset.id != 0) {
  //     wx.navigateTo({
  //       url: "/pages/goods-details/goods-details?id=" + e.currentTarget.dataset.id
  //     })
  //   }
  // },
  // bindTypeTap: function(e) {
  //   this.setData({
  //     selectCurrent: e.index
  //   })
  // },
  // onLoad: function(e) {   
  //   wx.showShareMenu({
  //     withShareTicket: true
  //   }) 
  //   const that = this
  //   // if (e && e.query && e.query.inviter_id) { 
  //   //   wx.setStorageSync('referrer', e.query.inviter_id)
  //   // }
  //   if (e && e.scene) {
  //     const scene = decodeURIComponent(e.scene)
  //     if (scene) {        
  //       wx.setStorageSync('referrer', scene.substring(11))
  //     }
  //   }
  //   wx.setNavigationBarTitle({
  //     title: wx.getStorageSync('mallName')
  //   })
  //   /**
  //    * 示例：
  //    * 调用接口封装方法
  //    */
  //   WXAPI.banners({
  //     type: 'new'
  //   }).then(function(res) {
  //     if (res.code == 700) {
  //       wx.showModal({
  //         title: '提示',
  //         content: '请在后台添加 banner 轮播图片，自定义类型填写 new',
  //         showCancel: false
  //       })
  //     } else {
  //       that.setData({
  //         banners: res.data
  //       });
  //     }
  //   }).catch(function(e) {
  //     wx.showToast({
  //       title: res.msg,
  //       icon: 'none'
  //     })
  //   })
  //   WXAPI.goodsCategory().then(function(res) {
  //     // let categories = [{
  //     //   id: 0,
  //     //   icon: '/images/fl.png',
  //     //   name: "全部"
  //     // }];
  //     let categories = [];
  //     if (res.code == 0) {
  //       categories = categories.concat(res.data)
  //     }
  //     const _n = Math.ceil(categories.length / 2)
  //     // const _n = Math.ceil(categories.length)
  //     that.setData({
  //       categories: categories,
  //       category_box_width: 150 * _n,
  //       activeCategoryId: 0,
  //       curPage: 1
  //     });
  //     that.getGoodsList(0);
  //   })
  //   WXAPI.goods({
  //     recommendStatus: 1
  //   }).then(res => {
  //     if (res.code === 0){
  //       that.setData({
  //         goodsRecommend: res.data
  //       })
  //     }      
  //   })
  //   that.getCoupons()
  //   that.getNotice()
  //   that.kanjiaGoods()
  //   that.pingtuanGoods()
  // },
  // onPageScroll(e) {
  //   let scrollTop = this.data.scrollTop
  //   this.setData({
  //     scrollTop: e.scrollTop
  //   })
  // },
  // getGoodsList: function(categoryId, append) {
  //   if (categoryId == 0) {
  //     categoryId = "";
  //   }
  //   var that = this;
  //   wx.showLoading({
  //     "mask": true
  //   })
  //   WXAPI.goods({
  //     categoryId: categoryId,
  //     nameLike: that.data.inputVal,
  //     page: this.data.curPage,
  //     pageSize: this.data.pageSize
  //   }).then(function(res) {
  //     wx.hideLoading()
  //     if (res.code == 404 || res.code == 700) {
  //       let newData = {
  //         loadingMoreHidden: false
  //       }
  //       if (!append) {
  //         newData.goods = []
  //       }
  //       that.setData(newData);
  //       return
  //     }
  //     let goods = [];
  //     if (append) {
  //       goods = that.data.goods
  //     }
  //     for (var i = 0; i < res.data.length; i++) {
  //       goods.push(res.data[i]);
  //     }
  //     that.setData({
  //       loadingMoreHidden: true,
  //       goods: goods,
  //     });
  //   })
  // },
  // getCoupons: function() {
  //   var that = this;
  //   WXAPI.coupons().then(function (res) {
  //     if (res.code == 0) {
  //       that.setData({
  //         coupons: res.data
  //       });
  //     }
  //   })
  // },
  // onShareAppMessage: function() {    
  //   return {
  //     title: '"' + wx.getStorageSync('mallName') + '" ' + CONFIG.shareProfile,
  //     path: '/pages/index/index?inviter_id=' + wx.getStorageSync('uid')
  //   }
  // },
  // getNotice: function() {
  //   var that = this;
  //   WXAPI.noticeList({pageSize: 5}).then(function (res) {
  //     if (res.code == 0) {
  //       that.setData({
  //         noticeList: res.data
  //       });
  //     }
  //   })
  // },
  // toSearch: function() {
  //   this.setData({
  //     curPage: 1
  //   });
  //   this.getGoodsList(this.data.activeCategoryId);
  // },
  onReachBottom: function() { //上滑加载更多
    wx.showLoading({
      title: '加载中...',
    })
    var curPage = this.data.curPage + 1;
    var activeCategoryId = this.data.activeCategoryId;
    this.setData({
      curPage: curPage
    });

    this.goodsSearch({
      opt_id: activeCategoryId, //分类栏目id
      page: curPage
    })
  },
  onPullDownRefresh: function() { //下滑刷新
    wx.showLoading({
      title: '刷新中...',
    })
    var activeCategoryId = this.data.activeCategoryId;
    this.setData({
      curPage: 1
    });
    this.goodsSearch({
      opt_id: activeCategoryId, //分类栏目id
      page: 1
    })
    wx.stopPullDownRefresh()
  },
  // // 以下为搜索框事件
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  // // 获取砍价商品
  // async kanjiaGoods(){
  //   const res = await WXAPI.goods({
  //     kanjia: true
  //   });
  //   if (res.code == 0) {
  //     this.setData({
  //       kanjiaList: res.data
  //     })
  //   }
  // },
  // goCoupons: function (e) {
  //   wx.navigateTo({
  //     url: "/pages/coupons/index"
  //   })
  // },
  // pingtuanGoods(){ // 获取团购商品列表
  //   const _this = this
  //   WXAPI.goods({
  //     pingtuan: true
  //   }).then(res => {
  //     if (res.code === 0) {
  //       _this.setData({
  //         pingtuanList: res.data
  //       })
  //     }
  //   })
  // }
})