function FindProxyForURL(url, host) {
  if (/package.tuhu.work/.test(url)) {
    return 'DIRECT';
  }
  if (url.indexOf('shop-gateway') > -1) {
    return "PROXY 10.100.5.246:8888;DIRECT";
  }
  return "PROXY 10.100.5.246:7890;DIRECT";
}