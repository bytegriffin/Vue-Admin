<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="12">
        <el-col :xs="24" :sm="16" :md="14" :lg="10" :xl="7">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="Email" prop="email"></el-table-column>
        <el-table-column label="联系方式" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="是否可用" width="100px">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.user_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="320px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" title="修改用户" @click="showEditDialog(scope.row.id)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" title="删除用户" @click="remove(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-share" size="mini" title="分配权限">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handlePerPageChange"
        @current-change="handleCurrentPageChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog @close="addDialogClose" title="新增用户" :visible.sync="addDialogVisible" width="50%">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密 码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
    </el-dialog>
    <el-dialog @close="editDialogClose" title="修改用户" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editForm" :rules="eidtFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="密 码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-z,A-Z,0-9]+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的Email'))
    }
    var checkMobile = (rule, value, callback) => {
      if (value === '') {
        callback()
      }
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号码'))
    }
    return {
      queryInfo: {
        // 用户列表数据
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userlist: [],
      total: 0,
      addDialogVisible: false, // 控制是否显示对话框
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度要在2到20个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度要在6到20个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入Email', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editForm: {},
      eidtFormRules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度要在6到20个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入Email', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      mockUsers: []
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 以下为动态获取用户列表数据，users方法是后台的接口
    // async getUserList() {
    //   const { data: res } = await this.$http.get('users', { params: this.queryInfo })
    //   if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
    //   this.userlist = res.data.users
    //   this.total = res.data.total
    // }
    // 以下为静态模拟用户列表数据
    getUserList() {
      this.mockUsers = [
        {
          id: '1',
          username: '张三',
          email: 'zhangsan@gmail.com',
          mobile: '13800138000',
          role_name: '超级管理员',
          user_state: true
        },
        {
          id: '2',
          username: '李四',
          email: 'lisi@gmail.com',
          mobile: '13800138000',
          role_name: '普通用户',
          user_state: false
        },
        {
          id: '3',
          username: '王五',
          email: 'wangwu@gmail.com',
          mobile: '13800138000',
          role_name: '普通用户',
          user_state: true
        },
        {
          id: '4',
          username: '赵六',
          email: 'zhaoliu@gmail.com',
          mobile: '13800138000',
          role_name: '管理员',
          user_state: false
        },
        {
          id: '5',
          username: '马七',
          email: 'maqi@gmail.com',
          mobile: '13800138000',
          role_name: '超级管理员',
          user_state: false
        },
        {
          id: '6',
          username: '神马',
          email: 'maqi@gmail.com',
          mobile: '13800138000',
          role_name: '普通用户',
          user_state: false
        },
        {
          id: '7',
          username: '古人',
          email: 'maqi@gmail.com',
          mobile: '13800138000',
          role_name: '普通用户',
          user_state: false
        }
      ]
      if (JSON.parse(window.localStorage.getItem('mockUsers')) == null) {
        window.localStorage.setItem('mockUsers', JSON.stringify(this.mockUsers))
      } else if (this.queryInfo.query !== '') { // 搜索功能
        let content = this.queryInfo.query
        this.mockUsers = JSON.parse(window.localStorage.getItem('mockUsers')).filter(function(item) {
          return item.username.indexOf(content) !== -1
        })
      } else {
        this.mockUsers = JSON.parse(window.localStorage.getItem('mockUsers'))
      }
      this.userlist = this.mockUsers.slice((this.queryInfo.pagenum - 1) * this.queryInfo.pagesize, this.queryInfo.pagenum * this.queryInfo.pagesize)
      this.total = this.mockUsers.length
    },
    handlePerPageChange(newpagesize) {
      this.queryInfo.pagesize = newpagesize
      this.getUserList()
    },
    handleCurrentPageChange(newpagenum) {
      this.queryInfo.pagenum = newpagenum
      this.getUserList()
    },
    addDialogClose() { // 关闭表单时重置表单
      this.$refs.addFormRef.resetFields()
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    addUser() {
      // 以下为动态代码
      // this.$refs.addFormRef.validate(async valid => {
      //   if (!valid) return
      //   const { data: res } = await this.$http.post('adduser', this.addForm)
      //   if (res.meta.status !== 200) {
      //     this.$message.error('添加用户失败')
      //   }
      //   this.addDialogVisible = false
      //   this.getUserList()
      //   this.$message.success('添加用户成功')
      // })
      // 以下为静态代码
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        let obj = {
          username: this.addForm.username,
          email: this.addForm.password,
          mobile: this.addForm.mobile,
          role_name: '普通用户',
          user_state: true
        }
        this.mockUsers.push(obj)
        window.localStorage.setItem('mockUsers', JSON.stringify(this.mockUsers))
        this.getUserList()
        this.addDialogVisible = false
        this.$message.success('添加用户成功')
      })
    },
    // 以下为动态请求某id用户的信息
    // async showEditDialog (id) {
    //   this.editDialogVisible = true
    //   const { data: res } = await this.$http.get('users' + id)
    //   if (res.meta.status !== 200) return this.$message.error('查询用户失败')
    //   this.editForm = res.data
    // },
    // 以下为静态模拟数据
    showEditDialog (id) {
      this.editDialogVisible = true
      let user = this.mockUsers.find(ele => ele.id === id)
      this.editForm = user
    },
    // 以下为动态请求代码
    // async userStateChanged(userinfo) {
    //   注意：put方法中包含${userinfo.xxx}时不能使用单引号，要使用单撇号(Tab键上面的)
    //   const {data: res} = await this.$http.put(`user/${userinfo.id}/state/${userinfo.user_state}`)
    //   if (res.meta.status !== 200) {
    //     userinfo.user_state = !userinfo.user_state
    //     return this.$message.error('更新用户状态失败')
    //   }
    //   this.$message.success('更新用户状态成功')
    // }
    // 以下为静态修改
    userStateChanged(userinfo) {
      let result = this.mockUsers.find(ele => ele.id === userinfo.id)
      result.user_state = userinfo.user_state
      window.localStorage.setItem('mockUsers', JSON.stringify(this.mockUsers))
    },
    editUser() {
      // 以下为动态修改数据
      // this.$refs.editFormRef.validate(async valid => {
      //   if (!valid) return
      //   const { data: res } = await this.$http.put('edituser', this.editForm)
      //   if (res.meta.status !== 200) {
      //     this.$message.error('修改用户失败')
      //   }
      //   this.editDialogVisible = false
      //   this.getUserList()
      //   this.$message.success('修改用户成功')
      // })
      // 以下为静态修改数据
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        let obj = this.mockUsers.find(ele => ele.id === this.editForm.id)
        obj.email = this.editForm.email
        obj.mobile = this.editForm.mobile
        window.localStorage.setItem('mockUsers', JSON.stringify(this.mockUsers))
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('修改用户成功')
      })
    },
    // 以下为动态删除
    // async remove(id) {
    //   const confirmResult = await this.$confirm('是否删除该用户?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).catch(err => err)
    //   if (confirmResult !== 'confirm') this.$message.info('已取消删除')
    //   const { data: res } = await this.$http.delete('deluser/' + id)
    //   if (res.meta.status !== 200) return this.$message.error('删除用户失败')
    //   this.$message.success('删除用户成功')
    // }
    // 以下为静态删除
    remove(id) {
      this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = this.mockUsers.filter(ele => ele.id === id)
        let index = this.mockUsers.indexOf(obj[0])
        index > -1 && this.mockUsers.splice(index, 1)
        window.localStorage.setItem('mockUsers', JSON.stringify(this.mockUsers))
        this.getUserList()
        this.$message.success('删除用户成功')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>

<style scoped>
</style>
