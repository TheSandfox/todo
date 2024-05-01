import Todo from 'components/Todo';
import { Routes, Route } from 'react-router-dom';
function App() {
  return <Routes>
    	<Route exact path={'/'} element={<Todo checkOnly={false}/>}/>
    	<Route path={'/checked/*'} element={<Todo checkOnly={true}/>}/>
  </Routes>
}
export default App;
