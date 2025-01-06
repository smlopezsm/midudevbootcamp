import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const getAllCountries = () => {
  return axios
    .get("https://studies.cs.helsinki.fi/restcountries/api/all")
    .then((json) => {
      const { data } = json;
      return data;
    });
};

interface Weather {
  location: string;
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    wind_dir: string;
  };
}

const getWeather = (capital: string) => {
  const API_KEY = "61b7ebd5605941a58d3203927250601"; // Reemplaza con tu clave de API
  return axios
    .get(
      `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${capital}`
    )
    .then((response) => response.data);
};

interface FilterProps {
  filter: string;
  setFilter: (filter: string) => void;
}
const Filter = ({ filter, setFilter }: FilterProps) => {
  const handleShowFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };
  return (
    <div>
      {" "}
      find countries <input onChange={handleShowFilter} value={filter} />
    </div>
  );
};

interface Country {
  name: {
    common: string;
  };
  capital: string;
  population: number;
  languages: { [key: string]: string };
  flag: string;
}

interface CountryProps {
  filtered: Country[];
  handleShowDetails: (country: Country) => void;
  weathers: Weather[];
  selectedCountry: Country | null;
}
const Country = ({
  filtered,
  handleShowDetails,
  weathers,
  selectedCountry,
}: CountryProps) => {
  if (filtered.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (filtered.length > 1) {
    return (
      <div>
        {filtered.map((country: Country) => (
          <div key={country.name.common}>
            {country.name.common}
            <button
              onClick={() => {
                handleShowDetails(country);
              }}
            >
              show
            </button>
          </div>
        ))}
      </div>
    );
  } else if (filtered.length === 1) {
    const country = filtered[0];
    return (
      <div>
        <h1>{country.name.common}</h1>
        <div>capital {country.capital}</div>
        <div>population {country.population}</div>
        <h2>languages</h2>
        <ul>
          {Object.values(country.languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <p>{country.flag}</p>
        {selectedCountry && weathers.length > 0 && (
          <>
            <h2>Weather in {selectedCountry!.capital}</h2>
            <p>temperature: {weathers[0].current.temp_c} Celsius</p>
            <img src={weathers[0].current.condition.icon} alt="weather icon" />
            <p>
              wind: {weathers[0].current.wind_kph} kph direction{" "}
              {weathers[0].current.wind_dir}
            </p>
          </>
        )}
      </div>
    );
  } else {
    return <p>No matches</p>;
  }
};

function App() {
  const [filter, setFilter] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [weathers, setWeathers] = useState<Weather[]>([]);

  const filtered = filter
    ? countries.filter((country) =>
        country.name.common.toLowerCase().includes(filter.toLowerCase())
      )
    : countries;

  useEffect(() => {
    getAllCountries().then((countries) => {
      setCountries(countries);
    });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      getWeather(selectedCountry && selectedCountry.capital)
        .then((weather) => {
          setWeathers([weather]); // Asegúrate de almacenar el clima en un array
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    }
  }, [selectedCountry]);

  const handleShowDetails = (country: Country) => {
    setSelectedCountry(country);
    getWeather(country.capital).then((weather) => {
      setWeathers([weather]); // Ajusta para manejar un solo clima
    });
  };

  return (
    <>
      <Filter filter={filter} setFilter={setFilter} />
      {selectedCountry && weathers.length > 0 ? (
        <div>
          <h1>{selectedCountry.name.common}</h1>
          <div>capital {selectedCountry.capital}</div>
          <div>population {selectedCountry.population}</div>
          <h2>languages</h2>
          <ul>
            {Object.values(selectedCountry.languages).map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <p>{selectedCountry.flag}</p>
          <h2>Weather in {selectedCountry.capital}</h2>
          <p>temperature: {weathers[0].current.temp_c} Celsius</p>
          <img src={weathers[0].current.condition.icon} alt="weather icon" />
          <p>
            wind: {weathers[0].current.wind_kph} kph direction{" "}
            {weathers[0].current.wind_dir}
          </p>
          <button onClick={() => setSelectedCountry(null)}>back</button>
        </div>
      ) : (
        <Country
          filtered={filtered}
          handleShowDetails={handleShowDetails}
          weathers={weathers}
          selectedCountry={selectedCountry}
        />
      )}
    </>
  );
}

export default App;
