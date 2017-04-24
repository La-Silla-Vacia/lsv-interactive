import { h, render, Component } from 'preact';

import s from './base.css';
const data = require('../data/data.json');

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
    let dataUri;
    try {
      if (<%= interactive_id %>_data) {
        dataExists = true;
        interactiveData = <%= interactive_id %>_data;
      }
    } catch (e) {
      dataExists = false;
    }

    if (!dataExists) {
      this.setState({data: data});
    } else {
      if (interactiveData.dataUri) {
        dataUri = interactiveData.dataUri;
        this.fetchData(dataUri);
      }
    }
  }

  fetchData(uri) {
    fetch(uri)
      .then((response) => {
        return response.json()
    }).then((json) => {
      this.setState({ data: json });
    }).catch((ex) => {
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