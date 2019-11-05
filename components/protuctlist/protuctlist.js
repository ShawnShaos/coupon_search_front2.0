// components/protuctlist/protuctlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goods_thumbnail_url:String,
    goods_name: String,
    coupon_discount: Number,
    min_group_price:Number,
    min_normal_price:Number,
    sales_tip:String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetailsTap: function (e) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  }
})
