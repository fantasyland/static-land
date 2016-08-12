import makeTest from 'lobot/test'

const test = makeTest.wrap('tmp')

test('tmp', 1, t => {
  t.equal(1, 1)
})
