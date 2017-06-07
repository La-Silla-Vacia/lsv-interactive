function getData(callback) {
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
      fetchData(interactiveData.dataUri, (data) => {
        if (callback) callback(data);
      });
    }
  }
}

function fetchData(uri, callback) {
  fetch(uri)
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      if (callback) callback(json);
    })
    .catch((ex) => {
      console.log('parsing failed', ex)
    })
}

export default getData;