<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                    @tabClick="tabClick"
                    ref="tabControl1" class="tab-control" v-show="isTabFixed"/>
    <scroll
        class="content"
        ref="scroll"
        :probe-type="3"
        @scroll="contentScroll"
        :pull-up-load="true"
        @pullingUp="loadMore">
      <home-swiper :banners = "banners" ref="swiper" @swiperImageLoad ="swiperImageLoad" />
      <recommend-view :recommends = "recommends"/>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <good-list :goods="showGoods" />
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodList from "components/content/goods/GoodsList"
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'
  import {debounce} from 'common/utils'

  import {getHomeMultidata, getHomeGoods} from "network/home"
  import {itemListenerMixin} from 'common/mixin'



  export default {
    name: "Home",
    data() {
      return {
        banners:[],
        recommends:[],
        goods: {
          'pop': {page: 0,list: []},
          'new': {page: 0,list: []},
          'sell': {page: 0,list: []}
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop:0,
        isTabFixed: false,
        saveY: 0,
      }
    },
    components:{
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodList,
      Scroll,
      BackTop
    },
    mixins:[itemListenerMixin],
    created() {
      //  1.请求多个数据
      this.getHomeMultidata()

      //  2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')


    },
    mounted() {},
    methods:{
      //事件监听相关的方法
      //
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      backClick() {
        this.$refs.scroll.scrollTo(0,0)
      },
      contentScroll(position) {
        // console.log(position);
        // if(position.y < -1000) {
        //   this.isShowBackTop = true
        // }
        // else {this.isShowBackTop = false}

        //  1.判断BackTop是否显示
        this.isShowBackTop = (-position.y) > 1000

        //  2.决定tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        // console.log('上拉加载更多');
        // this.getHomeGoods(this.currentType)
        // this.$refs.scroll.scroll.refresh()
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },

      //网络请求相关的方法
      //
      getHomeMultidata() {
      getHomeMultidata().then(res => {
          // this.message = res
          // console.log(res)
          // this.image = this.message.data.banner.list[0].image
          // console.log(res);
          // this.result = res
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
          // console.log(this.banners)
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        getHomeGoods(type, page).then(res => {
          // console.log('测试:',res)
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          // console.log($children)
          this.$refs.scroll.finishPullUp()
        })
      }

    },
    computed:{
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    destroyed() {
      console.log('home destroyed');
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // console.log('deactivated');
      //  1.保存Y值
      this.saveY = this.$refs.scroll.getScrollY()

      //  2.取消全局事件的监听
      this.$bus.$off('itemImgLoad',this.itemImgListener)
    }
  }
</script>

<style scoped>
   #home {
     /*padding-top: 44px;*/
     height: 100vh;
   }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;


    /*在使用浏览器原生滚动时，为了让导航不跟随仪器滚动*/
    /*position:fixed;*/
    /*left:0;*/
    /*right:0;*/
    /*top:0;*/
    /*z-index:9;*/
  }

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left:0;
    right:0;
  }

  .tab-control {
    position: relative;
    z-index:9;
  }

  /*.content {*/
    /*height:calc(100% - 93px);*/
    /*overflow:hidden;*/
    /*margin-top: 44px;*/
  /*}*/
</style>
