export function flow(value, ...fns) {
  return fns.reduce((x, fn) => fn(x), value)
}
