import React, { Component } from 'react'

import { Card } from 'semantic-ui-react'

export class MemoryCard extends Component {
  render() {
    const memory = this.props.memory
    return (
      <Card>
        <Card.Content>
          <Card.Header>{memory.title}</Card.Header>
          <Card.Meta>
            <span className="date">{memory.date}</span>
          </Card.Meta>
          <Card.Description>
            {memory.description}
          </Card.Description>
        </Card.Content>
      </Card>
    )
  }
}
