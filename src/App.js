import './App.css';
import SimpleLC from './components/SimpleLC'

function App() {
  return (
    <div className="App">
      <SimpleLC items={[{ text: 'vishnu' }, { text: 'vishnu' }, { text: 'vishnu' }]} />
    </div>
  );
}

export default App;
