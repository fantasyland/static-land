import test from 'tape-catch'
import stuff from '../src/index.js' // eslint-disable-line


/* Wraps a group of tests
 */
const wrap = (prefix, cb) => {
  cb((text, cb) => {
    test(`${prefix}. ${text}`, t => {
      cb({
        ...t,
        calledWith(...xs) {
          return (x, ...rest) => {
            if (rest.length > 0) {
              t.fail('called with more than one arg')
            }
            t.deepEqual(x, xs.shift())
          }
        },
        calledOnce() {
          let haveBeenCalled = false
          return () => {
            t.ok(!haveBeenCalled, 'called more than once')
            haveBeenCalled = true
          }
        },
      })
      t.end() // we don't have any async tests...
    })
  })
}



wrap('123', test => {

  test('123', t => {
    t.plan(1)
    t.equal(1, 1)
  })

})
