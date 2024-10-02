import { useState } from "react";
import PropTypes from "prop-types";

const Statistics = ({ good, neutral, bad, sumatory, average, positive }) => {
  return (
    <>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={sumatory} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive} />
        </tbody>
      </table>
    </>
  );
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Button = ({ handleGoodClick, handleNeutralClick, handleBadClick }) => {
  return (
    <>
      <button onClick={handleGoodClick}>good</button>
      <button onClick={handleNeutralClick}>neutral</button>
      <button onClick={handleBadClick}>bad</button>
    </>
  );
};

StatisticLine.propTypes = {
  text: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

Button.propTypes = {
  handleGoodClick: PropTypes.func.isRequired,
  handleNeutralClick: PropTypes.func.isRequired,
  handleBadClick: PropTypes.func.isRequired,
};

Statistics.propTypes = {
  good: PropTypes.number.isRequired,
  neutral: PropTypes.number.isRequired,
  bad: PropTypes.number.isRequired,
  sumatory: PropTypes.number.isRequired,
  average: PropTypes.number.isRequired,
  positive: PropTypes.number.isRequired,
};

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1);
  };

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  };

  const handleBadClick = () => {
    setBad(bad + 1);
  };

  const sumatory = good + neutral + bad;
  const average = (good - bad) / sumatory;
  const positive = (good * 100) / sumatory;
  return (
    <div>
      <h1>give feedback</h1>
      <Button
        handleGoodClick={handleGoodClick}
        handleNeutralClick={handleNeutralClick}
        handleBadClick={handleBadClick}
      />
      {sumatory === 0 ? (
        <p>No feedback given</p>
      ) : (
        <Statistics
          good={good}
          neutral={neutral}
          bad={bad}
          sumatory={sumatory}
          average={average}
          positive={positive}
        />
      )}
    </div>
  );
};

export default App;
