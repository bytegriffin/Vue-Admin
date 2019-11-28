<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']">
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.roleName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.roleName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">
                      {{item3.roleName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="320px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" title="修改" @click="showEditDialog(scope.row.id)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" @click="remove(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-share" size="mini" title="分配权限" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @click="setRightDialogClosed">
      <el-tree :data="rightsList" :props="treeProps" show-checkbox default-expand-all
               node-key="id" :default-checked-keys="defaultKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
      mockRights: [],
      treeProps: {
        children: 'children',
        label: 'roleName'
      },
      defaultKeys: [],
      setRightDialogVisible: false,
      roleId: ''
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 以下为动态获取角色列表数据，rights方法是后台的接口
    // async getRightsList() {
    //   const { data: res } = await this.$http.get('rights')
    //   if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
    //   this.rightsList = res.data.roles
    // }
    // 以下为静态模拟权限列表数据
    getRightsList() {
      this.mockRights = [
        {
          id: '1',
          roleName: '主管',
          roleDesc: '主要负责技术',
          children: [
            {
              id: '1-1',
              roleName: '组长1',
              roleDesc: '主要负责11技术',
              children: [
                {
                  id: '1-1-1',
                  roleName: '人员1',
                  roleDesc: '主要负责111技术',
                  children: [
                    {
                      id: '1-1-1-1',
                      roleName: '孩子1',
                      roleDesc: '主要负责11技术'
                    },
                    {
                      id: '1-1-1-2',
                      roleName: '孩子2',
                      roleDesc: '主要负责11技术'
                    }
                  ]
                },
                {
                  id: '1-1-2',
                  roleName: '人员2',
                  roleDesc: '主要负责112技术',
                  children: []
                }
              ]
            },
            {
              id: '1-2',
              roleName: '组长2',
              roleDesc: '主要负责12技术',
              children: [
                {
                  id: '1-2-1',
                  roleName: '人员1',
                  roleDesc: '主要负责121技术',
                  children: []
                }
              ]
            }
          ]
        },
        {
          id: '2',
          roleName: '测试人员',
          roleDesc: '主要负责测试手机',
          level: '1'
        },
        {
          id: '3',
          roleName: '开发人员',
          roleDesc: '负责开发系统软件',
          level: '1'
        }
      ]
      if (JSON.parse(window.localStorage.getItem('mockRights')) == null) {
        window.localStorage.setItem('mockRights', JSON.stringify(this.mockRights))
      } else {
        this.mockRights = JSON.parse(window.localStorage.getItem('mockRights'))
      }
      this.rightsList = this.mockRights
    },
    // 以下为动态删除权限
    // async removeRightById(role, rightId) {
    //   const confirmResult = await this.$confirm('是否删除该用户?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).catch(err => err)
    //   if (confirmResult !== 'confirm') this.$message.info('已取消删除')
    //   const { data: res } = await this.$http.delete('roles/${role.id}/rights/${right.id}' + id)
    //   if (res.meta.status !== 200) return this.$message.error('删除用户失败')
    //   role.children = res.data // 重新赋值可以让下拉列表不会自动关闭
    //   this.$message.success('删除用户成功')
    // }
    // 以下为静态删除权限
    removeRightById(role, rightId) {
      this.$confirm('是否删除该权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let roleObj = this.mockRights.filter(ele => ele.id === role.id)
        this.delItem(roleObj[0].children, rightId)
        window.localStorage.setItem('mockRights', JSON.stringify(this.mockRights))
        this.getRightsList()
        this.$message.success('删除权限成功')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 此方法是静态代码 用于删除静态页面上数据
    delItem(list, rid) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === rid) {
          list.splice(i, 1)
          break
        } else if (list[i].children) {
          this.delItem(list[i].children, rid)
        }
      }
    },
    // 以下是动态获取树形权限数据
    // async showSetRightDialog(role) {
    //   this.roleId = role.id
    //   const { data: res } = await this.$http.get('rights/tree')
    //   if (res.meta.status !== 200) return this.$message.error('获取权限失败')
    //   this.rightsList = res.data // 重新赋值可以让下拉列表不会自动关闭
    //   this.getLeafKeys(role, this.defaultKeys)
    //   this.setRightDialogVisable = true
    // }
    // 以下是静态代码
    showSetRightDialog(role) {
      this.roleId = role.id
      this.setRightDialogVisible = true
      this.rightsList = this.mockRights
    },
    // 递归获取所有子权限id
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    setRightDialogClosed () {
      this.defaultKeys = []
    },
    // 以下为动态设置权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef, // ...为展开运算符
        this.getCheckedKeys(),
        ...this.$refs.treeRef,
        this.getHalfCheckedKeys()
      ] // 将两个数组拼接成一个数组
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post('roles/ro', { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }
      this.$message.success('分配权限成功！')
      this.getRightsList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less">
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
