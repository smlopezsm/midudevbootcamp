import axios from "axios";

export const mutatePerson = (url, data) => {
  return axios
    .put(url, data)
    .then((res) => {
      console.log("Response from server:", res);
      return res.data;
    })
    .catch((error) => {
      console.error("Error in mutatePerson:", error);
      throw error;
    });
};
