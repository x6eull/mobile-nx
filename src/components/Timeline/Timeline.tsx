import React, { ReactNode } from 'react'
import './Timeline.css'

export type TimelineBlock = {
  /**起始块索引，0为首个块 */
  fromBlock: number
  /**持续块长度 */
  duration: number
  content: ReactNode
}

/**
 * 一条纵向时间线（一列）。
 *
 * 此元素将尽可能占满父元素的空间。
 *
 * 分割线通过css变量--sep-color --sep-size配置
 */
export default function Timeline({
  blockCount,
  blocks,
}: {
  blockCount: number
  blocks: TimelineBlock[]
}) {
  return (
    <div
      className='timeline'
      style={{ '--block-count': blockCount } as React.CSSProperties}
    >
      <div className='layer back'>
        {Array.from({ length: blockCount }).map((_, i) => (
          <div key={i} className='block'></div>
        ))}
      </div>
      <div className='layer content'>
        {blocks.map((b, i) => (
          <div
            key={i}
            style={
              {
                '--from-block': b.fromBlock,
                '--from-block-floored': Math.floor(b.fromBlock),
                '--duration': b.duration,
                // 0+1 不跨sep
                // 0+2 跨1sep
                // 0.5+0.1 不跨sep
                // 0.5+0.6 跨1sep
                '--crossed-sep-count':
                  Math.ceil(b.fromBlock + b.duration) -
                  Math.floor(b.fromBlock) -
                  1,
              } as React.CSSProperties
            }
            className='block'
          >
            {b.content}
          </div>
        ))}
      </div>
    </div>
  )
}
