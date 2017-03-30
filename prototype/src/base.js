import { h, render, Component } from 'preact';
import { Toggle } from 'lsv-components';

import s from './styles.css';

class Base extends Component {

  render(props, state) {
    return (
      <div className={s.container}>
        Hello world
      </div>
    );
  }
}

export default Base;