import { useState, useEffect } from "react";
import axios from "axios";

/* eslint-disable react/prop-types */
const Filter = ({ filter, setFilter }) => {
  const handleShowFilter = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div>
      {" "}
      filter by name: <input onChange={handleShowFilter} value={filter} />
    </div>
  );
};

const Add = ({
  persons,
  newName,
  newNumber,
  setPersons,
  setNewName,
  setNewNumber,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const toadd = { name: newName, number: newNumber };
    const repetido = persons.some((person) => person.name === toadd.name);
    if (repetido) {
      window.alert(`${toadd.name} ya existe`);
      return;
    }
    setPersons([...persons, toadd]);
    setNewName("");
    setNewNumber("");
  };

  const handleChange = (e) => {
    setNewName(e.target.value);
  };

  const handleChangeNum = (e) => {
    setNewNumber(e.target.value);
  };

  return (
    <>
      <h2>add a new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input onChange={handleChange} value={newName} />
        </div>
        <div>
          number: <input onChange={handleChangeNum} value={newNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

const Nums = ({ filtered }) => {
  return (
    <>
      <h2>Numbers</h2>
      <ul>
        {filtered.map((p) => (
          <li key={p.name}>
            {p.name} {p.number}
          </li>
        ))}
      </ul>
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((json) => {
      const { data } = json;
      setPersons(data);
    });
  }, []);

  const filtered = filter
    ? persons.filter((person) => person.name.includes(filter))
    : persons;

  if (persons.length === 0) {
    return "No hay personas";
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <Add
        persons={persons}
        newName={newName}
        newNumber={newNumber}
        setPersons={setPersons}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />
      <Nums filtered={filtered} />
    </div>
  );
};

export default App;
