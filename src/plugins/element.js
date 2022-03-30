import Vue from 'vue'
import { Button,
         Input,Form,
         FormItem,
         Message,
         Container,
         Header,
         Aside,
         Main,
         Menu,
         Submenu,
         MenuItemGroup,
         MenuItem,
         Breadcrumb,
         BreadcrumbItem,
         Card,
         Row,
         Col,
         Table,
         TableColumn,
         Switch,
         Tooltip,
         Pagination,
         Dialog,
         MessageBox
        } from 'element-ui'

//全局注册
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//Message挂在到vue上
//$message是自定义属性，可以任意改名字  Message是组件 含义是 把弹窗组件挂在到Vue的实例上
Vue.prototype.$message = Message
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.prototype.$confirm = MessageBox.confirm
