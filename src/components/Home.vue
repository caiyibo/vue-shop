<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <!-- 组件就是一个类名 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <!-- Home组件是一个有权限的页面，只有登录成功才可以访问，可以使用导航守卫来控制 -->
      <!-- 如果用户没有登陆，直接通过URL访问特定的页面，需要重新导航到登录页面 -->
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--active-text-color 点击文本时的颜色  -->
        <!-- unique-opened="true" 每次只展开一个菜单项 -->
        <!-- 点击菜单选项会跳转页面  index可以当成跳转地址 若 path前没有/ 则手动添加 操作是开启路由模式  :router="true" -->
        <!--:router="true" 当出现冒号和true 可以简写 router -->
        <!-- 解决高亮问题 可以使用 default-active 首先在二级菜单定义一个点击事件 该事件把地址存储在sessionStorage 里 然后通过default-active 把地址取出来 这样 就算页面刷新 该菜单项也会常亮-->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
          <!-- 一级菜单 -->
          <!-- 循环每一项 -->
          <!-- 注意：index只接收字符串，item.id是数字 最简单办法是后面加一个空字符 -->
          <el-submenu :index="item.id+ ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <!-- 动态绑定名称 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path+''" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
          <!-- 右侧内容主题 -->
          <el-main>
            <!-- 路由占位符 -->
            <router-view></router-view>
          </el-main>
    </el-container>
  </el-container>
  
</template>

<script>
export default {
  data(){
    return {
      //把获取的菜单保存在menulist数组中
      menulist:[],
      iconObj:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-lock_fill',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      //是否折叠
      isCollapse:false,
      //被激活的链接地址
      activePath:''
    }
  },
  created(){
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout(){
      window.sessionStorage.clear()
      this.$router.push("/login")
    },
    //获取所有的菜单
    async getMenuList(){
      const {data: res} = await this.$http.get('menus')
      //如果状态码不为200 则请求错误
      //如果是200，则保存
      if(res.meta.status !==200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res);
    },
    toggleCollapse(){
      this.isCollapse=!this.isCollapse
    },
    //保存链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header {
  //贴边布局
  display: flex;
  justify-content: space-between;
  //居中效果
  padding-left: 0;
  align-items: center;
  background-color: #373d41;
  color: #fff;
  font-size: 20px;
  >div {
    //纵向居中布局
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: .2em;
  cursor: pointer;
}
</style>