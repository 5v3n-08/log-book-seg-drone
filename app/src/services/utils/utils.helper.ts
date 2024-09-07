export const tryCatch = <T>(func: () => T) => {
  try {
    const result = func()
    return { result, error: null }
  } catch (error) {
    if (error instanceof Error) {
      return { result: null, error }
    }
    return { result: null, error: new Error(typeof error === 'string' ? error : 'Unkown error!') }
  }
}

export const tryCatchAsync = async <T>(func: () => Promise<T>) => {
  try {
    const result = await func()
    return { result, error: null }
  } catch (error) {
    if (error instanceof Error) {
      return { result: null, error }
    }
    return { result: null, error: new Error(typeof error === 'string' ? error : 'Unkown error!') }
  }
}
