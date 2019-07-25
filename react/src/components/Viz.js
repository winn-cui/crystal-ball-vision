import React, { useEffect } from 'react';
import initGraph from './viz_helpers.js';
import styled from 'styled-components';


const SVG = styled.svg`
    width: 100%;
    height: 100%;
`;


const Viz = ( props ) => {
    const [state, setState] = React.useState({
        container_width: props.width,
        container_height: props.height,
        data: props.data,
    });

    console.log('nannii', state.container_width)
    useEffect( () => {
        if (state.data != undefined) {
            console.log('artrs')
            initGraph(state.container_width, state.container_height, state.data)
        }
    })
    
    return <SVG height={props.height} width={props.width} className="viz" />
};


export default Viz;