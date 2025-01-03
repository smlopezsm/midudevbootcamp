import axios from "axios";

export const deletePerson = (id) => {
  return axios.delete(`http://localhost:3001/persons/${id}`);
};
