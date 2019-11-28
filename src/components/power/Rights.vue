<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="权限路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <div v-if="scope.row.level === '0'">
              <el-tag>一级权限</el-tag>
            </div>
            <div v-else-if="scope.row.level === '1'">
              <el-tag type="success">二级权限</el-tag>
            </div>
            <div v-else>
              <el-tag type="warning">三级权限</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
      mockRights: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 以下为动态获取权限列表数据，rights方法是后台的接口
    // async getRightsList() {
    //   const { data: res } = await this.$http.get('rights')
    //   if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
    //   this.rightsList = res.data.rights
    // }
    // 以下为静态模拟权限列表数据
    getRightsList() {
      this.mockRights = [
        {
          id: '1',
          authName: '用户列表',
          path: 'users',
          level: '1',
          pid: '1'
        },
        {
          id: '2',
          authName: '权限列表',
          path: 'rights',
          level: '1',
          pid: '2'
        },
        {
          id: '3',
          authName: '角色列表',
          path: 'roles',
          level: '1',
          pid: '1'
        }
      ]
      this.rightsList = this.mockRights
    }
  }
}
</script>

<style lang="less">
</style>
