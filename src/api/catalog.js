import request from '@/utils/request'

export function getDeviceList() {
  return request({
    url: '/catalog/devices',
    method: 'get',
    params: {}
  })
}

export function getDeviceCount() {
  return request({
    url: '/catalog/devices/count',
    method: 'get',
    params: {}
  })
}

export function getServiceList() {
  return request({
    url: '/catalog/services',
    method: 'get',
    params: {}
  })
}
