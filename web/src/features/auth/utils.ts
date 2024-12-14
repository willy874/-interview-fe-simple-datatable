interface CountDownParams {
  timeout: number
  renderSpace?: number
  onTick?: (currentTime: number, nextTime: number) => void
  onEnd?: () => void
}

export function preciseCountDown(options: CountDownParams) {
  const { timeout, renderSpace = 1000, onTick, onEnd } = options
  let timerId: number
  let now = Date.now()
  let next = now + renderSpace
  const target = now + timeout * renderSpace
  if (target < next) {
    throw new Error('time must be greater than renderSpace')
  }
  const tick = () => {
    now = Date.now()
    next = next + renderSpace
    const space = next - now
    window.clearTimeout(timerId)
    if (target < next) {
      onEnd?.()
    } else {
      onTick?.(now, next)
      window.clearTimeout(timerId)
      timerId = window.setTimeout(tick, space)
    }
  }
  timerId = window.setTimeout(tick, renderSpace)

  return () => {
    window.clearTimeout(timerId)
  }
}
