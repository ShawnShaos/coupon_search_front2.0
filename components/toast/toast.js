// components/toast/toast.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    opacity:0,
    content:"default value"
  },
  ready:function(){
    var systeminfo = wx.getSystemInfoSync();
    var screenWidth = systeminfo.screenWidth;
    //根据屏幕宽度居中显示toast
    this.setData({
      marginleft: (screenWidth-110)/2
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //显示taost
    show:function(content){
      //创建一个动画
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
      })

      this.animation = animation
    //让组件显示
      animation.opacity(0.9).step()
  //赋值显示内容
      this.setData({
        content: content,
        animationData: animation.export()
      })
  //2秒后消失
      setTimeout(function () {
        animation.opacity(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 2000)
    }
  }
})
