const setList = () => import('views/set/setlist/setList.vue') //系统设置
const userPower = () => import('views/set/userpower/userPower.vue') //系统用户权限
const userPowerEdit = () => import('views/set/userpoweredit/userPowerEdit.vue') //系统用户权限编辑
const userLog = () => import('views/set/userlog/userLog.vue') //操作日志

const children = [
    {
        path: '',
        name: 'setlist',
        component: setList    //设置首页
    },
    {
        name: 'user-power',
        path: 'user-power',
        component: userPower   //设置用户权限
    },
    {
        name: 'user-power-edit',
        path: 'user-power-edit',
        component: userPowerEdit  //设置用户权限修改
    },
    {
        name: 'user-log',
        path: 'user-log',
        component: userLog    //用户日志
    }

]

export default children