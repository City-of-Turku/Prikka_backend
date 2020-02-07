import React, { Component } from 'react'
import {
  Button,
  Header,
  Modal,
  Icon,
  Form,
  Container,
} from 'semantic-ui-react'

export class LoginModal extends Component {
  state = { toDisplay: 'SignIn' }

  handleChangeContent() {}

  render() {
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
        <Modal.Content>
          {/* 
      <Image
        wrapped
        size="medium"
        src="/images/avatar/large/rachel.png"
      /> */}

          <Modal.Description>
            <Container textAlign="center">
              <Header>Login</Header>

              <Form>
                <Button
                  icon
                  labelPosition="left"
                  color="blue"
                >
                  <Icon name="facebook" />
                  Facebook
                </Button>
                <Button
                  icon
                  labelPosition="left"
                  color="red"
                >
                  <Icon name="google" />
                  Google
                </Button>
              </Form>
              <Form>
                <Form.Group grouped>
                  <Form.Input
                    iconPosition="left"
                    label="Email"
                    placeholder="Email"
                  >
                    <Icon name="at" />
                    <input />
                  </Form.Input>
                  <br />
                  <br />
                  <Form.Input
                    iconPosition="left"
                    label="Password"
                    placeholder="Password"
                    type="password"
                  >
                    <Icon name="lock" />
                    <input />
                  </Form.Input>
                  <Form.Button>Log In</Form.Button>
                  <a href="">Forgotten your password ?</a>
                </Form.Group>
              </Form>
            </Container>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
  }
}

export default LoginModal
