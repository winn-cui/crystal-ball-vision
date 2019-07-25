import React from 'react';
import './App.css';
import Viz from './components/Viz';

import axios from 'axios';
import styled from 'styled-components';

function App() {



  const [state, setState] = React.useState({
    container_width: 0,
    container_height: 0,
    data: undefined
  });


  const containerRef = React.useRef(null);
  React.useEffect( () => {
    let clientRect = containerRef.current.getBoundingClientRect();
    let width = clientRect.width
    let height = clientRect.height
  
    if (width != undefined && state.container_width != undefined && state.container_width != clientRect.width) {
      setState({...state, container_width: width})

    }
    if (height != undefined && state.container_height != undefined && state.container_height != clientRect.height) {
      setState({...state, container_height: height})
    }
  });

  // const containerRef = React.useRef(null);
  // const handleContainerSizeChange = () => {
  //   let clientRect = containerRef.current.getBoundingClientRect();
  //   let width = clientRect.width
  //   let height = clientRect.height
  //   if (state.container_width != clientRect.width) {
  //     setState({container_width: width})
  //   }
  //   if (state.container_height != clientRect.height) {
  //     setState({container_height: height})
  //   }
  // }
  
  // axios.defaults.baseURL = 'http://localhost:5000';
  // const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'https://crystalballvision.herokuapp.com';
  // console.log('49: ', process.env.REACT_APP_API_ENDPOINT)
  // axios.defaults.proxy.host = "http://localhost:5000"
  React.useEffect( () => {
    axios.get(`https://crystalballvision.herokuapp.com/`)
    // fetch('/')
      .then( res => {
        setState({...state, data: res.data})
        console.log(res.data)
      })
      console.log('56')
  }, []);

    


  // console.warn(state.container_width)
  const Container = styled.div`
    width: 100vw;
    height: 100vh;
  `;
  // console.warn(state.container_width)


  // console.log('68',state.container_height)
  return (
    <Container id='Container' ref={containerRef}>
      <Viz 
        width = {state.container_width}
        height = {state.container_height}
        data = {state.data}
      />
    </Container>
  );
}

export default App;

