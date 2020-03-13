<template>
  <a-layout-sider width="260">
    <a-menu
      mode="inline"
      :defaultSelectedKeys="defaultSelectedKeys"
      :defaultOpenKeys="defaultOpenKeys"
      :style="{ height: '100%', borderRight: 0, overflowY:'scroll' }"
      theme="dark"
    >
      <template v-for="(item) in list">
        <a-sub-menu :key="item.id">
          <span slot="title">
           <img :src="item.img" />
           <b style="vertical-align: middle;">{{item.name}}</b>
          </span>
          <template v-for="(item2) in item.child">
            <a-menu-item :key="item2.id" @click="_bounce2(item2,item)">{{item2.name}}</a-menu-item>
          </template>
        </a-sub-menu>
      </template>
    </a-menu>
  </a-layout-sider>
</template>
<script>
export default {
  name: "navSider",
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      defaultSelectedKeys:[],
      defaultOpenKeys:[],
    };
  },
  methods: {
    bounce(item, parent) {
      // console.log(parent, item);
      this.$router.push({ path: `${item.url}` });
    },
    _bounce1(opt) {
      this._.debounce(opt => {}, 1000, false)(opt);
    },
    get_current_index(newVal) {
      if (this.list.length == 0) {
        setTimeout(() => {
          this.get_current_index(newVal);
        }, 200);
      } else {
        this.list.map((item, index) => {
          item.child.forEach((item2, index2) => {
            if (item2.url == newVal) {
              this.defaultSelectedKeys[0] = item.id
              this.defaultOpenKeys[0] = item2.id
            }
          });
        });
      }
    }
  },
  computed: {
    current_url() {
      return this.$route.fullPath;
    }
  },
  watch: {
    current_url: function(newVal, oldVal) {
      this.get_current_index(newVal);
    }
  },
  mounted() {
    // 函数防抖
    this._bounce2 = this._.debounce(this.bounce, 300, false);
    this.get_current_index(this.$route.fullPath);
  }
};
</script>
<style scoped lang="stylus">
.ant-menu-submenu-selected /deep/ > .ant-menu-submenu-title {
  color:#1890FF!important
}
.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
  height: 62px;
  line-height: 62px;
}

.ant-layout-sider {
  background-color: #f0f2f5;
}
img {
  width: 15px;
  height: 15px;
  margin-right: 8px;
  vertical-align: middle;
}
</style>