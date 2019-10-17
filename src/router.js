import React from 'react'
import { Router, Stack, Scene} from 'react-native-router-flux'
import Inicio from './components/inicio'
import List from './components/list'


const initial = {
    Inicio:false,
    List:true
}
const App = () => (
    <Router>
      <Stack key="root">
        <Scene key="Inicio" component={Inicio} initial={initial.Inicio} />
        <Scene key="List" component={List} initial={initial.List} />
      </Stack>
    </Router>
)
  
export default App
