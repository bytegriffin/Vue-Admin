<template>
    <el-container class="home_container">
      <el-header>
        <div>
          <img src="../assets/logo.png" width="16%"/>
          <span>VUE管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="isCollapsed ? '64px': '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu :unique-opened="true"
                   :collapse="isCollapsed"
                   :collapse-transition="false"
                   :router="true"
                   :default-active="activePath"
              background-color="#333744"
              text-color="#fff"
              active-text-color="#409EFF">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item index="/users" @click="saveNavState('/users')">
                <i class="el-icon-menu"></i>
                <span slot="title">用户列表</span>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item index="/rights" @click="saveNavState('/rights')">
                <i class="el-icon-menu"></i>
                <span slot="title">权限列表</span>
              </el-menu-item>
              <el-menu-item index="/roles" @click="saveNavState('/roles')">
                <i class="el-icon-menu"></i>
                <span slot="title">角色列表</span>
              </el-menu-item>
            </el-submenu>
            <!-- 以下部分为动态内容  以上为静态内容  -->
<!--            <el-submenu :index="item.id+'' " v:for="item in menulist" :key="item.id">-->
<!--              <template slot="title">-->
<!--                <i class="{{item.icons}}"></i>-->
<!--                <span>{{item.authName}}</span>-->
<!--              </template>-->
<!--              <el-menu-item :index="'/' + subItem.path " v:for="subItem in item.children"
                    :key="subItem.id" @click="saveNavState('/' + subItem.path)">-->
<!--                <template slot="title">-->
<!--                  <i class="el-icon-menu"></i>-->
<!--                  <span slot="title">{{subItem.authName}}</span>-->
<!--                </template>-->
<!--              </el-menu-item>-->
<!--            </el-submenu>-->
          </el-menu>
        </el-aside>
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      isCollapsed: false, // 默认菜单不折叠
      activePath: ''
    }
  },
  created() {
    // this.getMenuList() // 获取动态菜单
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleCollapse () { // 取反操作
      this.isCollapsed = !this.isCollapsed
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
    //  以下内容为动态数据
    //, async getMenuList () {
    //   const { data: res } = await this.$http.get('menus')
    //   if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    //   this.menulist = res.data
    // }
  }
}
</script>

<style lang="less" scoped>
  .home_container {
    height: 100%;
  }
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
  .iconfont {
    margin-right: 10px;
  }
  .toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
