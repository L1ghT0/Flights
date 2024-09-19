import React from 'react'
import { Flights } from './components/flights/Flights'
import './App.scss'

type AppProps = {
    
}


const App:React.FC<AppProps> = () => {
    return (
        <main>
            <Flights/>
        </main>
    )
}


export default App