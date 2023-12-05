import './App.css';
import Mensaje from './Mensaje.js';


const Description = () => {
  return <p>Esta es la app del curso</p>
}

function App() {
  return (
    <div className="App">
      <Mensaje color='red' message='estamos trabajando en un curso de react' />
      <Description />
    </div>
  );
}

export default App;
