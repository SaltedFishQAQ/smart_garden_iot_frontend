import request from '@/utils/request'

export function getAreaList(params) {
  return request({
    url: '/area',
    method: 'get',
    params: { params }
  })
}

export function updateArea(data) {
  return request({
    url: '/area',
    method: 'put',
    data
  })
}

export function createArea(data) {
  return request({
    url: '/area',
    method: 'post',
    data
  })
}
