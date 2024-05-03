import Todo from 'components/Todo';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
function App() {
	// return <Todo checkOnly={false}/>
	return <BrowserRouter basename={process.env.PUBLIC_URL}>
	<Routes>
			<Route exact path={''} element={<Todo checkOnly={false}/>}/>
			<Route path={'/checked/*'} element={<Todo checkOnly={true}/>}/>
	</Routes>
  </BrowserRouter>
}
export default App;
