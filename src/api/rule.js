import request from '@/utils/request'

export function getRuleList(params) {
  return request({
    url: '/rules',
    method: 'get',
    params: params
  })
}

export function updateRule(data) {
  return request({
    url: '/rules',
    method: 'put',
    data
  })
}

export function createRule(data) {
  return request({
    url: '/rules',
    method: 'post',
    data
  })
}

export function running(data) {
  return request({
    url: '/rules/running',
    method: 'post',
    data
  })
}
