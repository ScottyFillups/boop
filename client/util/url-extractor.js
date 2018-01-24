function _extract (type) {
  const parse = /\/(controller|host)\/(.*)/g.exec(window.location.pathname)

  return parse !== null ? parse[type] : null
}

export function getType () {
  return _extract(1)
}

export function getRoomId () {
  return _extract(2)
}
