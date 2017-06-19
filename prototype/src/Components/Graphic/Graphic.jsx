import { h, render, Component } from 'preact';
import s from './Graphic.css';

export default class Graphic extends Component {
  handleClick(name) {
    alert(`Just clicked on ${name}!`);
  }

  getCircles() {
    const { data } = this.props;
    return data.map((item, key) => {
        const { name, value } = item;
        const size = value * 3;
        const style = {
          width: size,
          height: size
        };

        return (
          <button className={s.circle} key={key} style={style} onClick={this.handleClick.bind(false, name)}>{name}</button>
        )
      }
    );
  }

  render(props, state) {
    const circles = this.getCircles();

    return (
      <div className={s.container}>
        {circles}
      </div>
    )
  }
}