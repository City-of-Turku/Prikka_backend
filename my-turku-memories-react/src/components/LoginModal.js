import React, { Component } from 'react'

import { Modal, Button, Container } from 'semantic-ui-react'
import { SignInContent } from './SignInContent'
import { SignUpContent } from './SignUpContent'

export class LoginModal extends Component {
  constructor(props) {
    super(props)
    this.handleChangeContent = this.handleChangeContent.bind(
      this,
    )
  }

  state = { toDisplay: 'SignIn' }

  handleChangeContent(event, value) {
    event.preventDefault()
    this.setState({ toDisplay: value })
    console.log(this.state.toDisplay)
  }

  render() {
    const toDisplay = this.state.toDisplay
    let content

    if (this.state.toDisplay === 'SignIn') {
      content = (
        <SignInContent
          callbackFn={this.handleChangeContent}
        />
      )
    } else {
      content = (
        <SignUpContent
          callbackFn={this.handleChangeContent}
        />
      )
    }

    return (
      <Modal
        size="mini"
        trigger={<Button>Login</Button>}
        dimmer="blurring"
      >
        <Modal.Header>
          <Container textAlign="center">
            Welcome to My Turku Memories
          </Container>
        </Modal.Header>
        {content}
      </Modal>
    )
  }
}

export default LoginModal
