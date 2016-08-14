function getImmutableIterator(generator, maybeIterator = null, history = []) {

  let iterator = maybeIterator

  return (input) => {

    if (iterator === null) {
      iterator = generator()
      history.forEach(x => iterator.next(x))
    }

    const {value, done} = iterator.next(input)
    const next = done
      ? null
      : getImmutableIterator(generator, iterator, history.concat([input]))
    iterator = null

    return {value, next}

  }

}

const runGenerator = (T, generator) => {
  const step = iterator => prevResult => {
    const {value, next} = iterator(prevResult)
    return next
      ? T.chain(step(next), value)
      : value
  }
  return step(getImmutableIterator(generator))()
}

export default runGenerator
