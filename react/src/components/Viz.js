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
        loading: props.loading,
    });

    var d3_tracker = null;
    useEffect( () => {
        if (state.data != undefined) {
            // console.log('artrs')
            // async function init() {
            //     console.log(state.data)
            //     return initGraph(state.container_width, state.container_height, state.data);
            //     console.log('27 ??????')
            //     // await state.loading("Finished loading.")
            // }
            d3_tracker = initGraph(state.container_width, state.container_height, state.data, state.loading);
            // if (d3_pass) {
                // state.loading("Finished Loading")
            // }

            // init().then(state.loading("Finished loading."))
            // initGraph(state.container_width, state.container_height, state.data);

            // new Promise(function(resolve, reject) {
            //     initGraph(state.container_width, state.container_height, state.data);
            //     console.log('26???????')
            //   }).then(function(result) {
            //     console.log('what////////?')
            //     state.loading("Finished loading.")
            //   })
            
            // initGraph(state.container_width, state.container_height, state.data).then()
                // await state.loading("Finished loading.")
        } else {

        }
    })

    // useEffect( () => {
    //     if (d3_tracker) {
    //         state.loading('Finished Loading')
    //     }
    // });

    
    return (         
        <SVG height={props.height} width={props.width} className="viz" />
    )
};


export default Viz;