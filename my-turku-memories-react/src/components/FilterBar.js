import React, { Component } from 'react'

import {
  Menu,
  Input,
  Icon,
  Dropdown,
} from 'semantic-ui-react'

const tagThemeOptions = [
  {
    key: 'Theme 1',
    text: 'Theme 1',
    value: 'Theme 1',
    label: { color: 'red', empty: true, circular: true },
  },
  {
    key: 'Theme 2',
    text: 'Theme 2',
    value: 'Theme 2',
    label: { color: 'blue', empty: true, circular: true },
  },
  {
    key: 'Theme 3',
    text: 'Theme 3',
    value: 'Theme 3',
    label: { color: 'purple', empty: true, circular: true },
  },
]

const tagEventOptions = [
  {
    key: 'Event 1',
    text: 'Event 1',
    value: 'Event 1',
    label: { color: 'red', empty: true, circular: true },
  },
  {
    key: 'Event 2',
    text: 'Event 2',
    value: 'Event 2',
    label: { color: 'blue', empty: true, circular: true },
  },
  {
    key: 'Event 3',
    text: 'Event 3',
    value: 'Event 3',
    label: { color: 'purple', empty: true, circular: true },
  },
]
export class FilterBar extends Component {
  state = {}
  handleThemeChange
  render() {
    return (
      <div>
        <Menu secondary>
          <Menu.Item>
            <Input
              icon={<Icon name="search" circular link />}
              focus
              placeholder="Search..."
            />
          </Menu.Item>
          <Menu.Item>
            <Dropdown
              text="Theme"
              icon="filter"
              floating
              labeled
              button
              className="icon"
            >
              <Dropdown.Menu>
                <Input
                  icon="search"
                  iconPosition="left"
                  className="search"
                />
                <Dropdown.Divider />
                <Dropdown.Header
                  icon="tags"
                  content="Themes"
                />
                <Dropdown.Menu scrolling>
                  {tagThemeOptions.map(option => (
                    <Dropdown.Item
                      key={option.value}
                      {...option}
                    />
                  ))}
                </Dropdown.Menu>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>

          <Menu.Item>
            <Dropdown
              text="Event"
              icon="filter"
              floating
              labeled
              button
              className="icon"
            >
              <Dropdown.Menu>
                <Input
                  icon="search"
                  iconPosition="left"
                  className="search"
                />
                <Dropdown.Divider />
                <Dropdown.Header
                  icon="tags"
                  content="Events"
                />
                <Dropdown.Menu scrolling>
                  {tagEventOptions.map(option => (
                    <Dropdown.Item
                      key={option.value}
                      {...option}
                    />
                  ))}
                </Dropdown.Menu>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}
