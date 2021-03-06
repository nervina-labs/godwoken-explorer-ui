import Image from 'next/image'
import { useState, useMemo, useEffect } from 'react'
import { Socket } from 'phoenix'
import { CHANNEL, IMG_URL, WS_ENDPOINT } from './constants'

export const useIsHidden = () => {
  const [isHidden, setisHidden] = useState(true)
  return useMemo(() => {
    const handleShowScript = () => setisHidden(h => !h)
    const HiddenIcon = () => (
      <span
        onClick={handleShowScript}
        className="flex items-center cursor-pointer"
        style={{ transform: isHidden ? 'unset' : 'rotate(0.5turn)' }}
        aria-label="toggle"
      >
        <Image loading="lazy" src={`${IMG_URL}show-more.svg`} width="17" height="17" alt="toggle" layout="fixed" />
      </span>
    )
    return [isHidden, HiddenIcon] as [boolean, () => JSX.Element]
  }, [isHidden, setisHidden])
}

export const useWS = (
  channel: CHANNEL | string,
  onJoin: (res?: any) => void,
  onReceivingData: (res?: any) => void,
  deps = [],
) => {
  useEffect(() => {
    const socket = new Socket(WS_ENDPOINT)
    socket.connect()
    const _channel = socket.channel(channel)
    _channel.on('refresh', onReceivingData)
    _channel.join().receive('ok', onJoin).receive('error', console.warn)
    return () => {
      socket.disconnect(() => {
        console.info(`disconnect to ${channel}`)
      })
    }
  }, deps)
}
