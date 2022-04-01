<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userlist" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 4, 8]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
   <!-- visible.sync 弹出显示对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主题区域 -->
      <el-form :model="addForm" :rules="addFoemrules" ref="addFormRef" label-width="70px">
        <!-- 数据通过prop绑定 -->
        <el-form-item label="用户名" prop="username">
          <!-- 代表用户名 -->
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <!-- 代表密码 -->
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <!-- 代表用户名 -->
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <!-- 代表用户名 -->
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <!-- 修改表单项 首先通过element ui 提供框架 ：model提供了数据绑定对象 ：rules提供验证规则 ref 表单的引用 通过 el-form 创建了用户名 邮箱 手机 其中每一项提供了editForm 这样才能把数据保存上去 在data中定义了editFormRules 表示验证规则 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
       <el-form-item label="用户名">
         <!-- disabled 表示禁用 -->
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    //验证邮箱的规则
    var checkEmail=(rule,value,cb)=>{
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }

    //验证手机号的规则
    var checkMobile=(rule,value,cb)=>{
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }

    return{
      //获取用户列表额参数对象
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:2
      },
      userlist:[],
      total:0,
      //控制添加用户对话框的显示与隐藏
      addDialogVisible:false,
      //添加用户的表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      //添加表单规则验证的对象
      addFoemrules:{
        //用户名为必填项，使用以下语句 required 规则为必填项 trigger为触发规则
        username:[
          {required:true,message:'请输入用户名称',trigger:'blur'},{min:3,max:10,message:'用户名的长度在3~10个字符之间',trigger:'blur'}
        ],
        password:[           
          {required:true,message:'请输入密码',trigger:'blur'},{min:6,max:15,message:'用户名的长度在6~15个字符之间',trigger:'blur'}
        ],
        email:[
          {required:true,message:'请输入邮箱',trigger:'blur'},
          {validator:checkEmail,trigger:'blur'}
        ],
        mobile:[
          {required:true,message:'请输入手机号',trigger:'blur'},
          {validator:checkMobile,trigger:'blur'}
        ]
      },
      //控制修改用户对话框的显示与隐藏
      editDialogVisible:false,
      //查询到用户信息对象
      editForm:{},
      editFormRules:{
        email:[
          {required:true,message:'请输入邮箱',trigger:'blur'},
          {validator:checkEmail,trigger:'blur'}
        ],
        mobile:[
          {required:true,message:'请输入手机号',trigger:'blur'},
          {validator:checkMobile,trigger:'blur'}
        ]
      },
      setRoleDialogVisible:false,
      // 需要被分配角色的用户信息
      userInfo:{},
      // 已选中的角色Id值
      selectedRoleId: '',
      // 所有角色的数据列表
      rolesList: [],
    }
  },
  created(){
    this.getUserList()
  },
  methods:{
    async getUserList(){
      const {data :res} = await this.$http.get('users',{params:this.queryInfo})
      if(res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userlist = res.data.users
      this.total=res.data.total
      //console.log(res);
       //console.log(getUserList);
    },
    //监听pagesize 改变组件的事件
    handleSizeChange(newSize){
      //console.log(newSize);
      this.queryInfo.pagesize=newSize
      this.getUserList()
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage){
      //console.log(newPage);
      this.queryInfo.pagenum=newPage
      // 把监听到的值保存到queryInfo里
      this.getUserList()
    },
    async userStateChange(userinfo){
      // console.log(userinfo);
      const {data:res}=await  this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if(res.meta.status !== 200){
        userinfo.mg_state=!userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
    },
     //监听添加用户对话框的关闭事件  关闭后可以重置表单
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    //点击按钮添加新用户
    addUser(){
      //表单预验证
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return
        //可以发起添加用户的网络请求
        const {data: res} = await this.$http.post('users',this.addForm)
        if(res.meta.status!==201){
          this.$message.error('用户添加失败')
        }
         this.$message.success('用户添加成功')
         //隐藏添加用户的对话框
         this.addDialogVisible=false
         //重新获取用户列表数据
         this.getUserList()
      }) 
    },
    async showEditDialog(id){
      //展示编辑用户的对话框
      const {data:res}= await this.$http.get('users/' +id)
      this.editDialogVisible=true
      if(res.meta.status!==200){
        return this.$message.error('查询用户信息失败')
      }
      //把修改的用户信息重新赋给editForm
      this.editForm = res.data
      //console.log(id)
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    //修改用户信息并提交
    editUserInfo(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return
        //发起修改用户信息的数据请求
        const {data:res}=await this.$http.put('users/' +this.editForm.id,{
          //把新的信息修改给用户
          email:this.editForm.email,
          mobile:this.editForm.mobile
        })
        if(res.meta.status!==200){
          return this.$message.error('更新用户失败')
        }
        //更新信息成功 后有三个操作
        // 关闭对话框
        this.editDialogVisible=false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新用户信息成功')

      })
    },
    //根据id删除对应的用户信息
    async removeUserById(id){
      //询问用户是否删除数据 通过弹框
      const confirmResult=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err =>err)
        //catch(err =>{return err})可以简写为catch(err =>err)
      //如果用户确认删除，则返回值为字符串 confirm
      //如果用户取消删除，则返回的为字符串 cancel
      if(confirmResult!=='confirm'){
        return this.$message.info('已取消删除')
      }
      const {data:res}=await this.$http.delete('users/'+ id)
      if(res.meta.status!==200){
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    async setRole(userInfo) {
      this.userInfo = userInfo

      // 在展示对话框之前，获取所有角色的列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }

      this.rolesList = res.data

      this.setRoleDialogVisible = true
    },
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }

      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败！')
      }

      this.$message.success('更新角色成功！')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>

</style>