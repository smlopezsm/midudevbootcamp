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

const Notification = ({ message }) => {
  console.log("Error Message: ", message);
  if (message === null) {
    return null;
  }

  return <div className="success">{message}</div>;
};

const NotificationError = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="errorM">{message}</div>;
};

const Add = ({
  persons,
  newName,
  newNumber,
  setPersons,
  setNewName,
  setNewNumber,
  setSuccessMessage,
  setErrorMessage,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const toadd = { name: newName, number: newNumber };
    const exists = persons.find((person) => {
      return person.name.trim().toLowerCase() === newName.trim().toLowerCase();
    });

    if (exists) {
      const confirmUpdate = window.confirm(
        `${newName} is already added, replace the old number with a new one?`
      );
      if (confirmUpdate) {
        mutatePerson(`http://localhost:3001/persons/${exists.id}`, toadd)
          .then((updatedPerson) => {
            setPersons((prevPersons) =>
              prevPersons.map((person) =>
                person.id === exists.id ? updatedPerson : person
              )
            );
            setSuccessMessage(`Updated ${updatedPerson.name} successfully!`);
            setTimeout(() => setSuccessMessage(null), 3000);
          })
          .catch((error) => {
            console.log("Error en actualizacion: ", error); // Verificar el error
            setErrorMessage(`Error updating`);
            setTimeout(() => setErrorMessage(null), 5000);
          });
      }
    } else {
      createPerson(toadd)
        .then((newPerson) => {
          setPersons((prevPersons) => prevPersons.concat(newPerson));
          setSuccessMessage(`Added ${newPerson.name} successfully!`);
          setTimeout(() => setSuccessMessage(null), 3000);
        })
        .catch((error) => {
          console.log("Error en añadir: ", error); // Verificar el error
          setErrorMessage(`Error adding`);
          setTimeout(() => setErrorMessage(null), 5000);
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
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
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
      deletePerson(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
        })
        .catch((error) => {
          console.log("Error en eliminación: ", error); // Verificar el error
          setErrorMessage(`Error deleting`);
          setTimeout(() => setErrorMessage(null), 5000);
        });
    }
  };

  if (persons.length === 0) {
    return "No hay personas";
  }
  return (
    <div>
      <NotificationError message={errorMessage} />
      <Notification message={successMessage} />
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <Add
        persons={persons}
        newName={newName}
        newNumber={newNumber}
        setPersons={setPersons}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        setSuccessMessage={setSuccessMessage}
        setErrorMessage={setErrorMessage}
      />
      <Nums
        filtered={filtered}
        handleDelete={handleDelete}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

export default App;
