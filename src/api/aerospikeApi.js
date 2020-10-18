import request from '@/utils/request'

export function getAllData(params) {

  var url = 'http://localhost:1323';

  return request({
    url: url,
    method: 'get',
    params
  })
}
