const complaintPage = () => import('views/complaint/page/complaintPage.vue')
const complaintAdd = () => import('views/complaint/complaintadd/complaintAdd')

const children = [
    {
        name: 'complaint-page',
        path: '',
        component: complaintPage
    },
    {
        name: 'complaint-add',
        path: 'complaint-add',
        component: complaintAdd
    }
]

export default children