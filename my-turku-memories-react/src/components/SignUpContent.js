import React, { Component } from 'react'

import {
  Header,
  Modal,
  Icon,
  Form,
  Container,
  Button,
} from 'semantic-ui-react'

export class SignUpContent extends Component {
  render() {
    return (
      <Modal.Content>
        {/* 
                <Image
                wrapped
                size="medium"
                src="/images/avatar/large/rachel.png"
                /> */}

        <Modal.Description>
          <Header textAlign="center">Register</Header>

          <Form>
            <Form.Group grouped>
              {/* Email */}
              <Form.Input
                iconPosition="left"
                label="Email"
                placeholder="Email"
                required
              >
                <Icon name="at" />
                <input />
              </Form.Input>
              <br />
              {/* Username */}
              <Form.Input
                iconPosition="left"
                label="Username"
                placeholder="Username"
                required
              >
                <Icon name="user" />
                <input />
              </Form.Input>
              <br />
              {/* Password */}
              <Form.Input
                iconPosition="left"
                label="Password"
                placeholder="Password"
                type="password"
                required
              >
                <Icon name="lock" />
                <input />
              </Form.Input>

              <Container textAlign="center">
                <Form.Button>Register</Form.Button>
                <br />
                Already have an account ?{' '}
                <Button
                  className="tertiary"
                  onClick={e =>
                    this.props.callbackFn(e, 'SignIn')
                  }
                >
                  Sign In
                </Button>
              </Container>
            </Form.Group>
          </Form>
        </Modal.Description>
      </Modal.Content>
    )
  }
}
