import React from 'react';
import './App.css';
import Viz from './components/Viz';

import axios from 'axios';
import styled from 'styled-components';

import PacmanLoader from 'react-spinners/PacmanLoader';

function App() {



  const [state, setState] = React.useState({
    container_width: 0,
    container_height: 0,
    data: undefined,
    loading: true
  });


  const containerRef = React.useRef(null);
  React.useEffect( () => {
    var resp = null
    instance.get(`/data`)
    // fetch('/')
      .then( res => {
        resp = res
        setState({...state, data: res.data})
      })
    
    const interval = setTimeout(() => {
      setState({...state, data: resp.data, loading: false})
    }, 5000);

    }, []);
  
    
  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     setState({...state, loading: false})
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

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
  const instance = axios.create({
    proxy: {
      host: '0.0.0.0',
      port: 5000,
    }
  });
  
  // axios.defaults.proxy.host = "http://localhost:5000"
  // React.useEffect( () => {
  //   instance.get(`/data`)
  //   // fetch('/')
  //     .then( res => {
  //       setState({...state, data: res.data})
  //       console.log('WTFFFFRSTRSTSRSRT:', res.data)
  //     })
  //     console.log('56')
  // }, []);

  // var progress = (childData) => {
  //   console.log('73', childData)
  //   setState({...state, loading: false})
  // }


  // console.warn(state.container_width)
  const Container = styled.div`
    width: 100vw;
    height: 100vh;
  `;
  // console.warn(state.container_width)


  const override = "display: block; margin: 0; position: absolute; top:48%; left:48%; -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%); border-color: blue;"


  // console.log('68',state.container_height)
  return (
    <Container id='Container' ref={containerRef}>
      {state.loading ? 
      <PacmanLoader
        css={override}
        sizeUnit={"px"}
        size={25}
        color={'#7ec0ee'}
        loading={state.loading}
      /> : 
      <Viz 
        width = {state.container_width}
        height = {state.container_height}
        data = {state.data}
        // loading = {progress}
        />
      }
      
      

    </Container>
  );
}

export default App;

