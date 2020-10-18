import request from '@/utils/request'
import axios from 'axios'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export function getDataAero(params) {
  var url = process.env.VUE_APP_AEROSPIKE;

  return request({
    url: url,
    method: 'get',
    params
  })
}

export async function addDataAerospike(namespace, setname, bin, key, value) {
  var url = process.env.VUE_APP_AEROSPIKE;

  var result = await axios.post(url, {
    namespace: namespace,
    setname: setname,
    keybin: bin,
    key: key,
    value: value
  });

  return result;
}


export async function deleteDataAerospike(key) {
  var url = process.env.VUE_APP_AEROSPIKE+'/'+key;
  var result = await axios.delete(url);

  return result;
}

export async function getDataAerospikeByKey(key) {
  var url = process.env.VUE_APP_AEROSPIKE+'/'+key;
  var result = await axios.get(url);

  return result;
}

export async function getSetNameAerospike() {
  var url = process.env.VUE_APP_AEROSPIKE+'/setName';
  var result = await axios.get(url);

  return result;
}

export async function getDataWithUrl(url) {
  var result = await axios.get(url);

  return result;
}


export function getInfoVariable() {
  return process.env;
}
