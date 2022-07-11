import request from '@/utils/request'

/** 获得商品列表
 * query查询参数可以为空
*@pagenum当前页码不能为空
*@pagesize每页显示条数不能为空
 */
// eslint-disable-next-line camelcase
export const getGoods = ({ query, pagenum, pagesize }) => {
  return request({
    url: 'goods',
    params: { query, pagenum, pagesize }
  }
  )
}
/** 编辑商品提交
 *goods_introduce, pics, attrs可以为空
 */
// eslint-disable-next-line camelcase
export const putEdit = (id, goods_name, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs) => {
  return request({
    method: 'PUT',
    url: `goods/${id}`,
    data: {
      goods_name, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs
    }
  })
}
/** 删除商品
 * @id
 */
export const delGood = (id) => {
  return request({
    method: 'DELETE',
    url: `goods/${id}`
  })
}
/** 添加商品
 * @username必填
 * @password必填
 * @email可选
 * @mobile可选
 */
export const addUser = ({ username, password, email, mobile }) => {
  return request({
    method: 'POST',
    url: 'users',
    data: { username, password, email, mobile }
  })
}

/** 添加商品
 * @goods_cat 以为','分割的分类列表
 *goods_introduce, pics上传的图片临时路径（对象）, attrs商品的参数（数组），包含 动态参数 和 静态属性可以为空
 */
// eslint-disable-next-line camelcase
export const addGood = ({ goods_name, goods_cat, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs }) => {
  return request({
    method: 'POST',
    url: 'goods',
    data: {
      goods_name, goods_cat, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs
    }
  })
}
// 上传图片
export const upload = (file) => {
  return request({
    method: 'POST',
    url: 'upload',
    data: file
  })
}
