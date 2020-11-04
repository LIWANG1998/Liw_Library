const payPage = () => import('views/pay/page/payPage.vue')
const payBill = () => import('views/pay/paybill/payBill.vue')

const children = [
    {
        path: '',
        name: 'paypage',
        component: payPage    //pay首页
    },
    {
        path: 'page-bill',
        name: 'page-bill',  //账单页面
        component: payBill
    }

]

export default children