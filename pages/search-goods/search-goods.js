var app = getApp();
const api = require("../../utils/api")
Page({
  data: {
    focus: true,
    hotKeyShow: true,
    historyKeyShow: true,
    searchValue: '',
    page: 0,
    productData: [],
    historyKeyList: [{
        keyword: "羽绒服"
      },
      {
        keyword: "秋裤"
      },
      {
        keyword: "衬衫"
      },
      {
        keyword: "毛衣"
      },
      {
        keyword: "平底鞋"
      },
      {
        keyword: "苹果手机ipone"
      }
    ],
    hotKeyList: [],


    hidden: "display:none;",
    goodsTitle: '商品名称',
    categoies: [],
    activeCategoryId: 0, //分类id
    curPage: 1,
    isShowMap: true, //是否显示轮播图和爆款推荐页以及排序选项
    TabListCur: 0,
    isShowSort: false, //是否显示销量价格排序导航
    priceUp: false, //价格排序设置，默认升序
    sort_type: 0, //排序规则

  },
  async onLoad(e) {
    this.data.goodsId = e.goodsId
    this.reputation(e.goodsId); //获取商品详情
  },
  onReachBottom: function() {
    //下拉加载更多多...
    this.setData({
      page: (this.data.page + 10)
    })

    this.searchProductData();
  },
  doKeySearch: function(e) {
    var key = e.currentTarget.dataset.key;
    this.setData({
      searchValue: key,
      hotKeyShow: false,
      historyKeyShow: false,
    });

    this.data.productData.length = 0;
    this.searchProductData();
  },
  doSearch: function() {
    var searchKey = this.data.searchValue;
    if (!searchKey) {
      this.setData({
        focus: true,
        hotKeyShow: true,
        historyKeyShow: true,
      });
      return;
    };

    this.setData({
      hotKeyShow: false,
      historyKeyShow: false,
    })

    this.data.productData.length = 0;
    this.searchProductData();

    this.getOrSetSearchHistory(searchKey);
  },
  getOrSetSearchHistory: function(key) {
    var that = this;
    wx.getStorage({
      key: 'historyKeyList',
      success: function(res) {
        console.log(res.data);

        //console.log(res.data.indexOf(key))
        if (res.data.indexOf(key) >= 0) {
          return;
        }

        res.data.push(key);
        wx.setStorage({
          key: "historyKeyList",
          data: res.data,
        });

        that.setData({
          historyKeyList: res.data
        });
      }
    });
  },
  searchValueInput: function(e) {
    var value = e.detail.value;
    this.setData({
      searchValue: value,
    });
    if (!value && this.data.productData.length == 0) {
      this.setData({
        hotKeyShow: true,
        historyKeyShow: true,
      });
    }
  },
  searchProductData: function() {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Search/searches',
      method: 'post',
      data: {
        keyword: that.data.searchValue,
        uid: app.globalData.userInfo.id,
        page: that.data.page,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var data = res.data.pro;
        that.setData({
          productData: that.data.productData.concat(data),
        });
      },
      fail: function(e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },
  //点击加载更多
  getMore: function(e) {
    var that = this;
    var page = that.data.page;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Product/getlist',
      method: 'post',
      data: {
        page: page,
        brand_id: that.data.op_brand_id,
        cat_id: that.data.op_cat_id,
        ptype: that.data.op_ptype
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var prolist = res.data.pro;
        if (prolist == '') {
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          return false;
        }
        //that.initProductData(data);
        that.setData({
          page: page + 1,
          shopList: that.data.shopList.concat(prolist)
        });
        //endInitData
      },
      fail: function(e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  //搜索框双向绑定
  adInputChange: function(e) {
    let that = this;
    if (e.detail.value.length < 1) {
      that.setData({
        goodsTitle: '商品名称',
      })
    } else {
      that.setData({
        goodsTitle: e.detail.value,
      })
    }
  },
  //取消搜索
  channelSearch: function() {
    this.setData({
      hidden: "display:none;"
    })
  },
  //确认模糊搜索
  searchBytitle: function() {
    var title = this.data.goodsTitle;

    console.log("ssss")
  },
  getfocus: function() {
    this.setData({
      hidden: ""
    })
  },
  //搜索商品
  goodsSearch: function() { //获取商品列表
    var data = {};
    data.title = this.data.goodsTitle; //标题
    data.sort_type = this.data.sort_type; //排序方式
    data.page = this.data.curPage; //页码

    var that = this;

    this.setData({
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
  },
});