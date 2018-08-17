<template>
  <div :class="b([type])">
    <div
      ref="wrap"
      :class="[
        b('wrap', [position, { scrollable }]),
        { 'van-hairline--top-bottom': type === 'line' }
      ]"
    >
      <div :class="b('nav', [type])" ref="nav">
        <div v-if="type === 'line'" :class="b('line')" :style="lineStyle" />
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          ref="tabs"
          class="van-tab"
          :class="{
            'van-tab--active': index === curActive,
            'van-tab--disabled': tab.disabled
          }"
          @click="onClick(index)"
        >
          <span class="van-ellipsis" ref="title">{{ tab.title }}</span>
        </div>
      </div>
    </div>
    <div :class="b('content')" ref="content">
      <slot />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import create from "../utils/create";
import { raf } from "../utils/raf";
import { on, off } from "../utils/event";
import scrollUtils from "../utils/scroll";
import Touch from "../mixins/touch";

export default create({
  name: "tabs",

  mixins: [Touch],

  model: {
    prop: "active"
  },

  props: {
    sticky: Boolean,
    lineWidth: Number,
    swipeable: Boolean,
    active: {
      type: [Number, String],
      default: 0
    },
    type: {
      type: String,
      default: "line"
    },
    duration: {
      type: Number,
      default: 0.2
    },
    swipeThreshold: {
      type: Number,
      default: 4
    }
  },

  data() {
    return {
      tabs: [],
      position: "content-top",
      curActive: null,
      lineStyle: {},
      events: {
        resize: false,
        sticky: false,
        swipeable: false
      }
    };
  },

  computed: {
    // whether the nav is scrollable
    scrollable() {
      return this.tabs.length > this.swipeThreshold;
    }
  },

  watch: {
    active(val) {
      if (val !== this.curActive) {
        this.correctActive(val);
      }
    },

    tabs(tabs) {
      this.correctActive(this.curActive || this.active);
      this.scrollIntoView();
      this.setLine();
    },

    curActive() {
      this.scrollIntoView();
      this.setLine();

      // scroll to correct position
      if (this.position === "page-top" || this.position === "content-bottom") {
        scrollUtils.setScrollTop(window, scrollUtils.getElementTop(this.$el));
      }
    },

    sticky() {
      this.handlers(true);
    },

    swipeable() {
      this.handlers(true);
    }
  },

  mounted() {
    this.correctActive(this.active);
    this.setLine();

    this.$nextTick(() => {
      this.handlers(true);
      this.scrollIntoView(true);
    });
  },

  activated() {
    this.$nextTick(() => {
      this.handlers(true);
      this.scrollIntoView(true);
    });
  },

  deactivated() {
    this.handlers(false);
  },

  beforeDestroy() {
    this.handlers(false);
  },

  methods: {
    // whether to bind sticky listener
    handlers(bind) {
      const { events } = this;
      const sticky = this.sticky && bind;
      const swipeable = this.swipeable && bind;

      // listen to window resize event
      if (events.resize !== bind) {
        events.resize = bind;
        (bind ? on : off)(window, "resize", this.setLine, true);
      }

      // listen to scroll event
      if (events.sticky !== sticky) {
        events.sticky = sticky;
        this.scrollEl =
          this.scrollEl || scrollUtils.getScrollEventTarget(this.$el);
        (sticky ? on : off)(this.scrollEl, "scroll", this.onScroll, true);
        this.onScroll();
      }

      // listen to touch event
      if (events.swipeable !== swipeable) {
        events.swipeable = swipeable;
        const { content } = this.$refs;
        const action = swipeable ? on : off;

        action(content, "touchstart", this.touchStart);
        action(content, "touchmove", this.touchMove);
        action(content, "touchend", this.onTouchEnd);
        action(content, "touchcancel", this.onTouchEnd);
      }
    },

    // watch swipe touch end
    onTouchEnd() {
      const { direction, deltaX, curActive } = this;
      const minSwipeDistance = 50;

      /* istanbul ignore else */
      if (direction === "horizontal" && this.offsetX >= minSwipeDistance) {
        /* istanbul ignore else */
        if (deltaX > 0 && curActive !== 0) {
          this.setCurActive(curActive - 1);
        } else if (deltaX < 0 && curActive !== this.tabs.length - 1) {
          this.setCurActive(curActive + 1);
        }
      }
    },

    // adjust tab position
    onScroll() {
      const scrollTop = scrollUtils.getScrollTop(window);
      const elTopToPageTop = scrollUtils.getElementTop(this.$el);
      const elBottomToPageTop =
        elTopToPageTop + this.$el.offsetHeight - this.$refs.wrap.offsetHeight;
      if (scrollTop > elBottomToPageTop) {
        this.position = "content-bottom";
      } else if (scrollTop > elTopToPageTop) {
        this.position = "page-top";
      } else {
        this.position = "content-top";
      }
    },

    // update nav bar style
    setLine() {
      this.$nextTick(() => {
        if (!this.$refs.tabs || this.type !== "line") {
          return;
        }

        const tab = this.$refs.tabs[this.curActive];
        const width = this.lineWidth || tab.offsetWidth;
        const left = tab.offsetLeft + (tab.offsetWidth - width) / 2;

        this.lineStyle = {
          width: `${width}px`,
          transform: `translateX(${left}px)`,
          transitionDuration: `${this.duration}s`
        };
      });
    },

    // correct the value of active
    correctActive(active) {
      active = +active;
      const exist = this.tabs.some(tab => tab.index === active);
      const defaultActive = (this.tabs[0] || {}).index || 0;
      this.setCurActive(exist ? active : defaultActive);
    },

    setCurActive(active) {
      if (active !== this.curActive) {
        this.$emit("input", active);

        if (this.curActive !== null) {
          this.$emit("change", active, this.tabs[active].title);
        }
        this.curActive = active;
      }
    },

    // emit event when clicked
    onClick(index) {
      const { title, disabled } = this.tabs[index];
      if (disabled) {
        this.$emit("disabled", index, title);
      } else {
        this.setCurActive(index);
        this.$emit("click", index, title);
      }
    },

    // scroll active tab into view
    scrollIntoView(immediate) {
      if (!this.scrollable || !this.$refs.tabs) {
        return;
      }

      const tab = this.$refs.tabs[this.curActive];
      const { nav } = this.$refs;
      const { scrollLeft, offsetWidth: navWidth } = nav;
      const { offsetLeft, offsetWidth: tabWidth } = tab;

      this.scrollTo(
        nav,
        scrollLeft,
        offsetLeft - (navWidth - tabWidth) / 2,
        immediate
      );
    },

    // animate the scrollLeft of nav
    scrollTo(el, from, to, immediate) {
      if (immediate) {
        el.scrollLeft += to - from;
        return;
      }

      let count = 0;
      const frames = Math.round(this.duration * 1000 / 16);
      const animate = () => {
        el.scrollLeft += (to - from) / frames;
        /* istanbul ignore next */
        if (++count < frames) {
          raf(animate);
        }
      };
      animate();
    },

    // render title slot of child tab
    renderTitle(el, index) {
      this.$nextTick(() => {
        const title = this.$refs.title[index];
        title.parentNode.replaceChild(el, title);
      });
    }
  }
});
</script>

<style>
.van-tabs {
  position: relative;
}
.van-tabs__wrap {
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  overflow: hidden;
  position: absolute;
}
.van-tabs__wrap--page-top {
  position: fixed;
}
.van-tabs__wrap--content-bottom {
  top: auto;
  bottom: 0;
}
.van-tabs__wrap--scrollable .van-tab {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 22%;
  flex: 0 0 22%;
}
.van-tabs__wrap--scrollable .van-tabs__nav {
  overflow: hidden;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.van-tabs__wrap--scrollable .van-tabs__nav::-webkit-scrollbar {
  display: none;
}
.van-tabs__nav {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-user-select: none;
  user-select: none;
  position: relative;
  background-color: #fff;
}
.van-tabs__nav--line {
  height: 100%;
  padding-bottom: 15px;
  box-sizing: content-box;
}
.van-tabs__nav--card {
  margin: 0 15px;
  border-radius: 2px;
  box-sizing: border-box;
  border: 1px solid #40d8b0;
  height: 30px;
}
.van-tabs__nav--card .van-tab {
  color: #40d8b0;
  border-right: 1px solid #40d8b0;
  line-height: 28px;
}
.van-tabs__nav--card .van-tab:last-child {
  border-right: none;
}
.van-tabs__nav--card .van-tab.van-tab--active {
  color: #fff;
  background-color: #40d8b0;
}
.van-tabs__line {
  z-index: 1;
  left: 0;
  bottom: 15px;
  height: 4px;
  position: absolute;
  background-color: #40d8b0;
}
.van-tabs--line {
  padding-top: 44px;
}
.van-tabs--line .van-tabs__wrap {
  height: 75px;
}
.van-tabs--card {
  padding-top: 30px;
}
.van-tabs--card .van-tabs__wrap {
  height: 30px;
}
.van-tab {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  cursor: pointer;
  padding: 0 5px;
  font-size: 28px;
  position: relative;
  color: #333;
  line-height: 75px;
  text-align: center;
  box-sizing: border-box;
  background-color: #fff;
  min-width: 0;
}
.van-tab span {
  display: block;
}
.van-tab:active {
  background-color: #e8e8e8;
}
.van-tab--active {
  color: #40d8b0;
}
.van-tab--disabled {
  color: #c9c9c9;
}
.van-tab--disabled:active {
  background-color: #fff;
}
</style>
