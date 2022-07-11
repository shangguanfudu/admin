import request from '@/utils/request'

/** 获得订单列表
 * query查询参数可以为空
*@pagenum当前页码不能为空
*@pagesize每页显示条数不能为空
*user_id用户 ID可以为空
*pay_status支付状态可以为空
*is_send是否发货可以为空
*order_fapiao_title['个人','公司']可以为空
*order_fapiao_company公司名称可以为空
*order_fapiao_content发票内容可以为空
*consignee_addr发货地址可以为空
 */
// eslint-disable-next-line camelcase
export const getOrders = ({ query, pagenum, pagesize, user_id, pay_status, is_send, order_fapiao_title, order_fapiao_company, order_fapiao_content, consignee_addr }) => {
  return request({
    url: 'orders',
    params: { query, pagenum, pagesize, user_id, pay_status, is_send, order_fapiao_title, order_fapiao_company, order_fapiao_content, consignee_addr }
  }
  )
}
