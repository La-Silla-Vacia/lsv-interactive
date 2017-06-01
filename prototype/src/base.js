import { h, render, Component } from 'preact';

import s from './base.css';

export default class Base extends Component {

  constructor() {
    super();

    this.state = {
      data: [],
      loading: true
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
        this.setState({ data: json, loading: false });
      })
      .catch((ex) => {
        console.log('parsing failed', ex)
      })
  }

  render(props, state) {
    const { loading } = state;

    let content = (
      <img src="https://raw.githubusercontent.com/la-silla-vacia/lsv-interactive/master/misc/lsvi-loading.gif"
      alt="Interactive is loading" style="width:100%;max-width: 320px;margin: 4em auto;display: block;">
    );

    if (!loading) {
        content = (<div>Hello <%= interactive_id %>!</div>)
    }

    return(
      <div className={s.container}>
        { content }
      </div>
    )
  }
}