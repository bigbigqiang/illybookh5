import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/index/home'
    },
    {
      path: '/index',
      name: 'Index',
      redirect: '/index/home',
      component: function (resolve) {
        require(['@/pages/Index'], resolve)
      },
      children: [
        {
          path: 'home',
          name: 'Home',
          component: function (resolve) {
            require(['@/pages/Home'], resolve)
          },
          meta: {
            title: '咿啦看书'
          }
        },
        {
          path: 'study',
          name: 'Study',
          component: function (resolve) {
            require(['@/pages/Study'], resolve)
          },
          meta: {
            title: '咿啦看书'
          }
        },
        {
          path: 'mine',
          name: 'Mine',
          component: function (resolve) {
            require(['@/pages/Mine'], resolve)
          },
          meta: {
            title: '咿啦看书'
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: function (resolve) {
        require(['@/pages/Login'], resolve)
      },
      meta: {
        title: '登录'
      }
    },
    {
      path: '/bindMobile',
      name: 'BindMobile',
      component: function (resolve) {
        require(['@/pages/BindMobile'], resolve)
      },
      meta: {
        title: '绑定手机号'
      }
    },
    {
      path: '/set/',
      name: 'Set',
      component: function (resolve) {
        require(['@/pages/Set'], resolve)
      },
      meta: {
        title: '设置'
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: function (resolve) {
        require(['@/pages/Register'], resolve)
      },
      meta: {
        title: '注册'
      }
    },
    {
      path: '/resetPassword',
      name: 'ResetPassword',
      component: function (resolve) {
        require(['@/pages/ResetPassword'], resolve)
      },
      meta: {
        title: '重置密码'
      }
    },
    {
      path: '/bookListRow/:sourceCode',
      name: 'BookListRow',
      component: function (resolve) {
        require(['@/pages/BookListRow'], resolve)
      },
      meta: {
        title: '图书列表'
      }
    },
    {
      path: '/guessList',
      name: 'GuessList',
      component: function (resolve) {
        require(['@/pages/GuessList'], resolve)
      },
      meta: {
        title: '猜你喜欢'
      }
    },
    {
      path: '/bookListColumn/:sourceCode',
      name: 'BookListColumn',
      component: function (resolve) {
        require(['@/pages/BookListColumn'], resolve)
      },
      meta: {
        title: '图书列表'
      }
    },
    {
      path: '/packageBook/:packageCode',
      name: 'PackageBook',
      component: function (resolve) {
        require(['@/pages/PackageBook'], resolve)
      },
      meta: {
        title: '图书包'
      }
    },
    {
      path: '/details/:bookCode',
      name: 'Details',
      component: function (resolve) {
        require(['@/pages/Details'], resolve)
      },
      meta: {
        title: '图书详情'
      }
    },
    {
      path: '/bookOrder',
      name: 'BookOrder',
      component: function (resolve) {
        require(['@/pages/BookOrder'], resolve)
      },
      meta: {
        title: ''
      }
    },
    {
      path: '/packageBookOrder',
      name: 'PackageBookOrder',
      component: function (resolve) {
        require(['@/pages/PackageBookOrder'], resolve)
      },
      meta: {
        title: ''
      }
    },
    {
      path: '/comments/:bookCode',
      name: 'Comments',
      component: function (resolve) {
        require(['@/pages/Comments'], resolve)
      },
      meta: {
        title: '全部书评'
      }
    },
    {
      path: '/coupon',
      name: 'Coupon',
      component: function (resolve) {
        require(['@/pages/Coupon'], resolve)
      },
      meta: {
        title: '我的红包'
      }
    },
    {
      path: '/dailyBook',
      name: 'DailyBook',
      component: function (resolve) {
        require(['@/pages/DailyBook'], resolve)
      },
      meta: {
        title: '历史推荐'
      }
    },
    {
      path: '/bookSort',
      name: 'BookSort',
      component: function (resolve) {
        require(['@/pages/BookSort'], resolve)
      },
      meta: {
        title: '图书分类'
      }
    },
    {
      path: '/ellaCoin',
      name: 'EllaCoin',
      component: function (resolve) {
        require(['@/pages/EllaCoin'], resolve)
      },
      meta: {
        title: '我的咿啦币'
      }
    },
    {
      path: '/buyHistory',
      name: 'BuyHistory',
      component: function (resolve) {
        require(['@/pages/BuyHistory'], resolve)
      },
      meta: {
        title: '消费记录'
      }
    },
    {
      path: '/vip',
      name: 'Vip',
      component: function (resolve) {
        require(['@/pages/Vip'], resolve)
      },
      meta: {
        title: '会员中心'
      }
    },
    {
      path: '/userAgreement',
      name: 'UserAgreement',
      component: function (resolve) {
        require(['@/pages/UserAgreement'], resolve)
      },
      meta: {
        title: '用户隐私协议-咿啦看书'
      }
    },
    {
      path: '/aboutUs',
      name: 'AboutUs',
      component: function (resolve) {
        require(['@/pages/AboutUs'], resolve)
      },
      meta: {
        title: '关于我们'
      }
    },
    {
      path: '/successfulBookPurchase',
      name: 'SuccessfulBookPurchase',
      component: function (resolve) {
        require(['@/pages/SuccessfulBookPurchase'], resolve)
      },
      meta: {
        title: '购买成功'
      }
    },
    {
      path: '/userInfo',
      name: 'UserInfo',
      component: function (resolve) {
        require(['@/pages/UserInfo'], resolve)
      },
      meta: {
        title: '个人信息'
      }
    },
    {
      path: '/babies',
      name: 'Babies',
      component: function (resolve) {
        require(['@/pages/Babies'], resolve)
      },
      meta: {
        title: '宝宝阅读信息'
      }
    },
    {
      path: '/feedback',
      name: 'Feedback',
      component: function (resolve) {
        require(['@/pages/Feedback'], resolve)
      },
      meta: {
        title: '信息反馈'
      }
    },
    {
      path: '/search',
      name: 'Search',
      component: function (resolve) {
        require(['@/pages/Search'], resolve)
      },
      meta: {
        title: '搜索'
      }
    },
    {
      path: '*',
      name: 'notfound',
      component: function (resolve) {
        require(['@/pages/Notfound'], resolve)
      }
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    // if (savedPosition) {
    //   return savedPosition
    // } else {
    //   return { x: 0, y: 0 }
    // }
    return { x: 0, y: 0 }
  }
})
