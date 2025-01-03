import { useState, useEffect } from "react";
import { getAllPersons } from "./services/persons/getAllPersons";
import { createPerson } from "./services/createPerson";
import { deletePerson } from "./services/persons/deletePerson";
import { mutatePerson } from "./services/persons/mutatePerson";

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
    const exists = persons.find((person) => {
      return person.name.trim().toLowerCase() === newName.trim().toLowerCase();
    });

    if (exists) {
      // const confirmUpdate = window.confirm(
      //   `${newName} is already added, replace the old number with a new one?`
      // );
      // console.log("Confirmación después del confirm:", confirmUpdate);
      //if (confirmUpdate) { I dont know why but window.confirm is not working
      mutatePerson(`http://localhost:3001/persons/${exists.id}`, toadd)
        .then((updatedPerson) => {
          setPersons((prevPersons) =>
            prevPersons.map((person) =>
              person.id === exists.id ? updatedPerson : person
            )
          );
        })
        .catch((error) => {
          console.error("Error updating person:", error);
        });
      //}
    } else {
      createPerson(toadd).then((newPerson) => {
        setPersons((prevPersons) => prevPersons.concat(newPerson));
      });
    }
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

const Nums = ({ filtered, handleDelete }) => {
  return (
    <>
      <h2>Numbers</h2>
      <ul>
        {filtered.map((p) => (
          <li key={p.name}>
            {p.name} {p.number}
            <button onClick={() => handleDelete(p.id)}>delete</button>
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
    getAllPersons().then((persons) => {
      setPersons(persons);
    });
  }, []);

  const filtered = filter
    ? persons.filter((person) => person.name.includes(filter))
    : persons;

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(`Sure to delete?`);
    if (confirmDelete) {
      deletePerson(id).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      });
    }
  };

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
      <Nums filtered={filtered} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
