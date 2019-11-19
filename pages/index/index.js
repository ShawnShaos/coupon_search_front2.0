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
    isShowSort: false, //是否显示销量价格排序导航
    priceUp: false, //价格排序设置，默认升序
    sort_type:0, //排序规则
    opt_id:0 //商品栏目id
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
      opt_id: e.currentTarget.dataset.opt_id, //分类栏目id
      TabListCur:0,
      curPage: 1
    })
  

    this.goodsSearch({
      page: 1
    })

  },
  goodsSearch: function(data) { //获取商品列表

    data.sort_type = this.data.sort_type; //排序方式
    data.opt_id = this.data.opt_id; //分类栏目id

    var that = this;
    if (data.opt_id == 0) { //热搜排行榜
      that.setData({
        isShowMap: true,
        isShowSort: false
      });
      this.topGoodsListQuery(data)
    } else {
      that.setData({
        isShowMap: false,
        isShowSort: true
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
        
        if (that.data.curPage == 1) { //第一页
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
    var that = this;
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
    };

    var sort_type = 0; //默认综合排序16
    if (e.currentTarget.dataset.id == 1) {  //好评
      sort_type = 16;
    } else if (e.currentTarget.dataset.id == 2){  //销量降序
      sort_type = 6;
    } else if (e.currentTarget.dataset.id == 3 && this.data.priceUp) {  //价格升序
      sort_type = 3;
    } else if (e.currentTarget.dataset.id == 3 && !this.data.priceUp) {  //价格降序
      sort_type = 4;
    };

    this.setData({
      sort_type: sort_type
    })

    this.goodsSearch({
      opt_id: that.data.opt_id, //分类栏目id
      page: 1,
      sort_type: sort_type
    });

  },
  toDetailsTap: function(e) {
    var goodsId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/goods-details/goods-details?goodsId=" + goodsId
    })
  },
  
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
})