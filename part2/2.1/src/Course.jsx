const Course = (props) => {
  // eslint-disable-next-line react/prop-types
  const { course } = props;
  // eslint-disable-next-line react/prop-types
  const total = course.parts.reduce(
    (total, parts) => total + parts.exercises,
    0
  );
  return (
    <div>
      {/*eslint-disable-next-line react/prop-types*/}
      <h1>{course.name}</h1>
      <ul>
        {/*eslint-disable-next-line react/prop-types*/}
        {course.parts.map((part) => (
          <li key={part.id}>
            {part.name} {part.exercises}
          </li>
        ))}
        <p>
          <b>total of {total}</b>
        </p>
      </ul>
    </div>
  );
};

export default Course;
