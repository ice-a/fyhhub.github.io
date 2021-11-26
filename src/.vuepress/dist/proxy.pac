function FindProxyForURL(url, host) {
  return "PROXY 10.100.5.246:8888;PROXY 10.100.5.246:8899;DIRECT";
}