var app = getApp();
const api = require("../../utils/api")
Page({
  data: {
    focus: true,

    historyKeyList: [], //历史搜索项
    hotKeyList: [],

    goodsRecommend: [],
    hidden: "display:none;",
    goodsTitle: '',
    categoies: [],
    activeCategoryId: 0, //分类id
    curPage: 1,
    TabListCur: 0,
    isShowSort: false, //是否显示销量价格排序导航
    priceUp: false, //价格排序设置，默认升序
    sort_type: 0, //排序规则
    isShowContent: true,
    hotKeyShow: false,
    loadingMoreHidden: true,
    showGoTop: false
  },
  onLoad(e) {
    var goodsTitle = e.goodsTitle;
    console.log(goodsTitle);
    this.dialog = this.selectComponent(".mydialog");
    this.setData({
      goodsTitle: goodsTitle
    });
    this.goodsSearch();
  },
  //点击历史搜索关键字
  doKeySearch: function(e) {
    var key = e.currentTarget.dataset.key;
    this.setData({
      goodsTitle: key,
      curPage: 1,
      hidden: "display:none;",
      hotKeyShow: false,
      isShowContent: true
    });
    wx.showLoading({
      title: '搜索中...',
    });
    this.historyKeyStro();
    this.goodsSearch();
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

  //失去焦点
  blursearch() {
    var goodsTitle = this.data.goodsTitle;

    this.setData({
      goodsTitle: goodsTitle
    })
  },
  //取消搜索
  channelSearch: function() {
    this.setData({
      hidden: "display:none;",
      hotKeyShow: false,
      isShowContent: true
    })
  },
  //确认模糊搜索
  searchBytitle: function(e) {

    var goodsTitleInput = e.detail.value.replace(/^\s+|\s+$/g, ""); //去前后空格
    if (goodsTitleInput != undefined && goodsTitleInput != '') {
      this.setData({
        goodsTitle: goodsTitleInput,
      })
    } else {
      this.dialog.show("请输入商品名称");
      return;
    }

    wx.showLoading({
      title: '搜索中...',
    })
    this.setData({
      curPage: 1,
      hidden: 'display:none',
      hotKeyShow: false,
      isShowContent: true
    });

    this.historyKeyStro();
    this.goodsSearch();
  },
  //缓存历史搜索策略
  historyKeyStro: function() {
    var goodsTitle = this.data.goodsTitle;
    if (goodsTitle.length > 0) {
      var historyKeyList = [];
      var historyKeyListStor = wx.getStorageSync('historyKeyList');
      if (historyKeyListStor) { //存在历史搜索记录
        for (var i = 0; i < historyKeyListStor.length; i++) {
          if (historyKeyListStor[i].keyword == goodsTitle) {
            historyKeyListStor.splice(i, 1);
          }
        }
        if (historyKeyListStor.length > 20) {
          historyKeyListStor = historyKeyListStor.slice(0, 20)
        }
        historyKeyList = historyKeyListStor;
      }
      historyKeyList.unshift({ //在第一位插入一个元素
        keyword: goodsTitle
      });
      //缓存历史搜索项
      wx.setStorageSync('historyKeyList', historyKeyList)
    }
  },
  //聚焦搜索框
  getfocus: function() {

    var historyKeyListStor = wx.getStorageSync('historyKeyList');

    if (historyKeyListStor) {
      this.setData({
        historyKeyList: historyKeyListStor
      })
    };
    this.setData({
      hidden: "",
      hotKeyShow: true,
      isShowContent: false
    });
  },
  tabListSelect(e) {
    wx.showLoading({
      title: '加载中...',
    })
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
    } else {
      this.setData({
        priceUp: false
      })
    };

    var sort_type = 0; //默认综合排序16
    if (e.currentTarget.dataset.id == 1) { //好评
      sort_type = 16;
    } else if (e.currentTarget.dataset.id == 2) { //销量降序
      sort_type = 6;
    } else if (e.currentTarget.dataset.id == 3 && this.data.priceUp) { //价格升序
      sort_type = 3;
    } else if (e.currentTarget.dataset.id == 3 && !this.data.priceUp) { //价格降序
      sort_type = 4;
    };

    this.setData({
      sort_type: sort_type,
      curPage: 1
    })

    this.goodsSearch();

  },
  //搜索商品
  goodsSearch: function() { //获取商品列表
    var data = {};
    data.title = this.data.goodsTitle; //标题
    data.sort_type = this.data.sort_type; //排序方式
    data.page = this.data.curPage; //页码

    var that = this;

    api.GoodsSearch({
      data: data
    }).then(function(data) {
      if (data.goods_search_response.goods_list.length <= 0) { //没有更多了
        that.setData({
          loadingMoreHidden: false
        })
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
    var that = this;

    this.setData({
      curPage: that.data.curPage + 1
    });

    this.goodsSearch();
  },
  // 获取滚动条当前位置，并显隐按钮
  onPageScroll: function (e) {
    if (e.scrollTop > 200) {
      this.setData({
        showGoTop: true
      })
    } else {
      this.setData({
        showGoTop: false
      })
    }
  },
  // 回到顶部
  goTop: function (e) {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  deleteHistoryKeyList: function () {
    var that = this;
    wx.showModal({
      content: '确认删除全部历史记录？',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('historyKeyList');
          that.setData({
            historyKeyList: []
          })
        }
      }
    })
  }
});