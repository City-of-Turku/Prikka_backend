import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'
import { MemoryCard } from './MemoryCard'

const segmentStyle = {
  zIndex: 1,
  position: 'absolute',
  width: 'auto',
  top: '150px',
  left: '10px',
  maxHeight: 'calc(100vh - 3vw)',
  overflow: 'auto',
  padding: '20px',
  textAlign: 'left',
}

export class InfoSegment extends Component {
  render() {
    return (
      <Segment style={segmentStyle} raised>
        {this.props.memories.map(memory => (
          <MemoryCard memory={memory} />
        ))}
      </Segment>
    )
  }
}
