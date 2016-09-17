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
  if (T.chainRec && T.map) {
    return T.chainRec((n, d, {value, iterator}) => {
      const {value: nextValue, next: nextIterator} = iterator(value)
      return nextIterator
        ? T.map(x => n({value: x, iterator: nextIterator}), nextValue)
        : T.map(d, nextValue)
    }, {value: undefined, iterator: getImmutableIterator(generator)})
  }

  const step = iterator => prevResult => {
    const {value, next} = iterator(prevResult)
    return next
      ? T.chain(step(next), value)
      : value
  }
  return step(getImmutableIterator(generator))()
}

export default runGenerator
