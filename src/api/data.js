import request from '@/utils/request'

export function getMeasurementList() {
  return request({
    url: '/measurement',
    method: 'get',
    params: {}
  })
}

export function getDataList(params) {
  return request({
    url: '/data',
    method: 'get',
    params: params
  })
}
