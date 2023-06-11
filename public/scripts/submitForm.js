const submitForm = async (data, endpoint) => {
  try {
    const response = await axios.post(endpoint, data);
    if (response.statusText === 'OK') {
      return response.data;
    } else {
      console.log(response);
      return response.data;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};
