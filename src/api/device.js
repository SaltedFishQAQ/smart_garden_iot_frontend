import request from '@/utils/request'

export function running(data) {
  return request({
    url: '/device/running',
    method: 'post',
    data
  })
}

export function approve(data) {
  return request({
    url: '/device/approve',
    method: 'post',
    data
  })
}
