import axios from "axios";

export const createPerson = ({ name, number }) => {
  return axios
    .post("http://localhost:3001/persons", { name, number })
    .then((res) => {
      const { data } = res;
      return data;
    });
};
