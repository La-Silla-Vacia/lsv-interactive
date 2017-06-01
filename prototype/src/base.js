import { h, render, Component } from 'preact';

import s from './base.css';

export default class Base extends Component {

  constructor() {
    super();

    this.state = {
      data: []
    }
  }

  componentWillMount() {
    this.setData();
  }

  setData() {
    let dataExists = true;
    let interactiveData;
    try {
      if (<%= interactive_id %>_data) {
        dataExists = true;
        interactiveData = <%= interactive_id %>_data;
      }
    } catch (e) {
      dataExists = false;
    }

    if (dataExists) {
      if (interactiveData.dataUri) {
        this.fetchData(interactiveData.dataUri);
      }
    }
  }

  fetchData(uri) {
    fetch(uri)
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        this.setState({ data: json });
      })
      .catch((ex) => {
        console.log('parsing failed', ex)
      })
  }

  render(props, state) {
    return(
      <div className={s.container}>
        Hello <%= interactive_id %>!
      </div>
    )
  }
}