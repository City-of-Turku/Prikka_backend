import React, { Component } from 'react'

import {
  Menu,
  Dropdown,
  MenuItem,
  Image,
} from 'semantic-ui-react'

const languageOptions = [
  { key: 'EN', text: 'EN', value: 'EN' },
  { key: 'FI', text: 'FI', value: 'FI' },
  { key: 'SWE', text: 'SWE', value: 'SWE' },
]
export class NavigationBar extends Component {
  state = { activeItem: 'Home', activeLanguage: 'EN' }

  handleItemClick = (e, { name }) =>
    this.setState({ activeItem: name })

  handleChangeLanguage = (e, { key }) =>
    this.setState({ activeLanguage: key })

  render() {
    const { activeItem } = this.state
    return (
      <div>
        <Menu secondary pointing>
          <MenuItem>
            <Image
              src="../../public/mtm_logo.png"
              size="mini"
            />
          </MenuItem>
          <Menu.Item
            key="1"
            active={activeItem === 'Home'}
            name="Home"
            content="Home"
            onClick={this.handleItemClick}
          />
          <Menu.Item
            key="2"
            active={activeItem === 'My Memories'}
            name="My Memories"
            content="My Memories"
            onClick={this.handleItemClick}
          />
          <Menu.Menu position="right">
            <Menu.Item
              key="3"
              active={activeItem === 'Login'}
              name="Login"
              content="Login"
              onClick={this.handleItemClick}
            />
            <Menu.Item>
              <Dropdown
                pointing="false"
                button
                className="icon"
                floating
                labeled
                icon="world"
                value={this.state.activeLanguage}
                options={languageOptions}
                onChange={this.handleChangeLanguage}
              />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    )
  }
}
