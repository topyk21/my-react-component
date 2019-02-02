export const parseNestedObjectToFlattern =
  // tslint:disable-next-line
  (data: any, childPropName: string) => {
    const array = Array.isArray(data) ? data : [data]

    return array.reduce((acc, value) => {
      acc.push(value)
      if (value[childPropName]) {
        // tslint:disable-next-line
        acc = acc.concat(parseNestedObjectToFlattern(value[childPropName], childPropName))
        delete value[childPropName]
      }
      return acc
      // tslint:disable-next-line
    }, [])
  }
