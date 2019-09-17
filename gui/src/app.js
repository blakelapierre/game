import { h, render } from 'preact-cycle';

//import mathbox from './mathbox-bundle.min.js';

const {
  INIT_GUI
} = {
  INIT_GUI: (_, mutation) => {
    _.inited = true;
    _.mutation = mutation;

    requestAnimationFrame(() => {
      console.log('load');
      var mathbox = _.mathbox = mathBox({element: document.getElementById('mathbox')});
      if (_.mathbox.fallback) throw 'WebGL not supported!';

      _.three = _.mathbox.three;

      var camera = _.camera = mathbox.camera({proxy: true, position: [0, 0, 3]});

      var view = _.view = mathbox.cartesian({
        range: [[-2, 2], [-1, 1]],
        scale: [2, 1]
      });


      view
        .axis({
          axis: 1,
          width: 3
        })
        .axis({
          axis: 2,
          width: 3
        })
        .grid({
          width: 2,
          divideX: 20,
          divideY: 10
        });
    });

    // animate();

    // function animate() {

    //   requestAnimationFrame(animate);
    // }
  }
};

const INIT = ({}, {inited, mutation}) => (
  inited === true ? <GUI /> : mutation(INIT_GUI)(mutation)
);

const Canvas = ({width = 100, height = 50}, {}) => (
  <canvas width={width} height={height} />
);

const GUI = () => (
  <gui>
    <Canvas />
  </gui>
);

render(
  INIT, {
  }, document.body
);