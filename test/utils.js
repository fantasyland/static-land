import test from 'tape-catch'

export function makeTest(prefix) {
  return (text, plan, cb) => {
    test(`${prefix}. ${text}`, t => {
      t.plan(plan)
      cb(t)
      t.end()
    })
  }
}
