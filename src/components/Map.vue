<script setup lang="ts">
import Konva from "konva";
import {onMounted, reactive} from "vue";
import amrUrl from '../assets/amr.png'

defineProps<{ msg: string }>()

const state = reactive({
  stage: undefined as any,
  layer: undefined as any,
  point: 0,
  circle: undefined as any,
  line: undefined as any,
  path: undefined as any,
  robots: {
    "robot1": undefined as any,
    "robot2": undefined as any,
    "robot3": undefined as any,
  }
})

function wheel(e: WheelEvent): void {
  if (state.stage != null) {
    const scaleBy = 1.15;
    const oldScale = state.stage.scaleX();

    //const oldScaleY = this.stage.scaleY();

    const pointer: Konva.Vector2d = state.stage.getPointerPosition() as Konva.Vector2d;
    const mousePointTo = {
      x: (pointer.x - state.stage.x()) / oldScale,
      y: (pointer.y - state.stage.y()) / oldScale,
    };

    // how to scale? Zoom in? Or zoom out?
    let direction = e.deltaY > 0 ? -1 : 1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.ctrlKey) {
      direction = -direction;
    }

    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    state.stage.setAttrs({
      scaleX: newScale,
      scaleY: newScale,
    });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    state.stage.position(newPos);
  }
}


function createLine() {
  // [x1, y1, x2, y2, x3, y3]
  let group = new Konva.Group({
    x: 0,
    y: 0,
  });

  let lineList = [
    {
      name: 'line1',
      points: [80, 506, 80, 308, 461, 311, 461, 257]
    },
    {
      name: 'line2',
      points: [245, 490, 245, 310]
    },
    {
      name: 'line3',
      points: [330, 490, 330, 310]
    },
    {
      name: 'line4',
      points: [395, 490, 395, 311]
    }
  ]

  let pointList = [
    {x: 80, y: 506}, {x: 80, y: 308}, {x: 461, y: 311}, {x: 461, y: 257}, {x: 245, y: 490}, {x: 245, y: 310},
    {x: 330, y: 490}, {x: 330, y: 310}, {x: 395, y: 490}, {x: 395, y: 311}
  ]

  for (var i = 0; i < lineList.length; i++) {
    let line = new Konva.Line({
      points: lineList[i].points,
      stroke: 'blue',
      strokeWidth: 1,
      lineCap: 'round',
      lineJoin: 'round',
      // dash: [29, 20, 0.001, 20],
    });

    group.add(line);
  }

  for (var i = 0; i < pointList.length; i++) {
    let circle = new Konva.Circle({
      x: pointList[i].x,
      y: pointList[i].y,
      radius: 3,
      fill: 'blue',
    });
    group.add(circle);
  }


  state.layer.add(group)


  // state.line = new Konva.Line({
  //   points: [80, 506, 80, 308, 461, 311, 461, 257],
  //   stroke: 'red',
  //   strokeWidth: 5,
  //   lineCap: 'round',
  //   lineJoin: 'round',
  //   dash: [29, 20, 0.001, 20],
  // });
  //
  // state.layer.add(state.line);
}

function createAMR() {
  let list = [
    {name: 'robot1', points: {x: 0, y: 0}},
    {name: 'robot2', points: {x: 20, y: 430}},
    {name: 'robot3', points: {x: 50, y: 80}}
  ]

  list.forEach(item => {
    let imageObj = new Image();
    imageObj.onload = function () {

      state.robots[item.name] = new Konva.Image({
        x: item.points.x, // 왼쪽 꼭지점 기준
        y: item.points.y, // 왼쪽 꼭지점 기준
        image: imageObj,
        scale: {x: 0.2, y: 0.2},
        rotation: 0 // x,y 를 기준으로 돌아감 제자리에서 돌아가는거 x
      });
      // add the shape to the layer
      console.log(state.robots[item.name].width(),"3")

      state.robots[item.name].offsetX = state.robots[item.name].width()/2
      state.robots[item.name].offsetY = state.robots[item.name].height()/2
      state.layer.add(state.robots[item.name]);
    };
    imageObj.src = amrUrl;
  })
}

function createRect(x: number, y: number) {
  let rect = new Konva.Rect({
    x: x,
    y: y,
    width: 50,
    height: 50,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 1,
    cornerRadius: 7,
  });

  var complexText = new Konva.Text({
    x: rect.x(),
    y: rect.y(),
    width: rect.width(),
    height: rect.height(),
    verticalAlign: 'middle',
    align: 'center',
    text: "TM",
    fontSize: 10,
    fontFamily: 'Calibri',
    fill: '#555',
  });


  state.layer.add(rect);
  state.layer.add(complexText);
}

function createCircle(x: number, y: number) {
  state.circle = new Konva.Circle({
    x,
    y,
    radius: 10,
    fill: 'red',
  });

  state.layer.add(state.circle);

  let transForm = new Konva.Transformer({
    nodes: [state.circle],
    centeredScaling: false,
    rotationSnaps: [0, 90, 180, 270],
    resizeEnabled: false,
  });
  state.layer.add(transForm);
}

function createPath() {
  // Load the path points up using M = moveto, L = lineto.
  // var data = [{"x":0,"y":0},{"x":50,"y":50},{"x":141,"y":79},{"x":181.5,"y":78.5},{"x":218,"y":62},{"x":223,"y":40},{"x":240,"y":26},{"x":259.5,"y":25},{"x":271,"y":40},{"x":292.5,"y":53},{"x":311.25,"y":55.5},{"x":330.625,"y":46.75},{"x":332.3125,"y":30.375},{"x":349.15625,"y":10.1875},{"x":374.578125,"y":10.09375},{"x":392,"y":26},{"x":411,"y":36},{"x":444.5,"y":37},{"x":453.875,"y":27.25},{"x":463.25,"y":17.5},{"x":472.9375,"y":10.625},{"x":494.625,"y":15.75},{"x":530,"y":48},{"x":534,"y":88},{"x":540,"y":150},{"x":552,"y":198},{"x":544,"y":227},{"x":522,"y":256},{"x":504.5,"y":263},{"x":471,"y":262},{"x":448,"y":252},{"x":372,"y":214},{"x":290,"y":146},{"x":256,"y":100},{"x":198,"y":104},{"x":182,"y":140},{"x":204,"y":185},{"x":203,"y":201.5},{"x":190,"y":214},{"x":174.5,"y":218},{"x":155,"y":214},{"x":124,"y":222},{"x":113.5,"y":232.5},{"x":95,"y":227},{"x":75.5,"y":211.5},{"x":72,"y":188},{"x":58,"y":136}]
  var data = [{x: 80, y: 506}, {x: 80, y: 308}, {x: 461, y: 311}, {x: 461, y: 257}]
  var p = "M" + data[0].x + " " + data[0].y;
  for (var i = 1; i < data.length; i = i + 1) {
    p = p + " L" + data[i].x + " " + data[i].y;
  }
  console.log(p, "p Data")
  state.path = new Konva.Path({
    x: 0,
    y: 0,
    data: p,
    stroke: 'cyan'
  });
  state.layer.add(state.path);
}

function createStage() {
  state.stage = new Konva.Stage({
    container: 'container',
    width: 1050,
    height: 661,
    draggable: true,
  });
  state.stage.container().style.backgroundColor = '#d3d3d33b';
  state.layer = new Konva.Layer();
}

function createShape() {
  // createPath()
  createAMR()
  createLine()
  let rectList = [{x: 55, y: 500}, {x: 0, y: 0}, {x: 220, y: 450}, {x: 304, y: 450}, {x: 370, y: 450}, {
    x: 450,
    y: 450
  }, {x: 533, y: 450}, {x: 437, y: 210}]
  rectList.forEach(item => {
    createRect(item.x, item.y)
  })

  createCircle(50, 50)

  state.stage.add(state.layer);
}

function moveShape(num: number) {
  console.log(num,"num")
  // var amplitude = 100;
  // var period = 2000;
  //
  // setTimeout(() => {
  //   let anim = new Konva.Animation(function (frame) {
  //     // state.layer.children[0].x(200);
  //     if (frame) {
  //       let test = amplitude * Math.sin((frame.time * 2 * Math.PI) / period);
  //       state.layer.children[0].x(test)
  //       console.log(test, "계산된 값")
  //     }
  //   }, state.layer);
  //
  //   anim.start();
  //   setTimeout(() => {
  //     anim.stop();
  //     console.log('ani stop')
  //   }, 3000)
  // }, 2000)

  // {x: 80, y: 308}, {x: 461, y: 311}, {x: 461, y: 257},
  switch (num){
    case 1:
      state.robots.robot3.position({x: 80, y: 308})
      break;
    case 2:
      state.robots.robot3.position({x: 461, y: 311})
      break;
    case 3:
      state.robots.robot3.position({x: 461, y: 257})
      break;
    default:
      break;
  }

  // // number of steps in animation
  // var steps = 100;
  // var pathLen = state.path.getLength();
  // console.log(pathLen, "pathLen")
  // var step = pathLen / steps;
  // console.log(step, "step")
  // var frameCnt = 0, pos = 0, pt;
  //
  // console.log(state.line, "line")
  // let test = state.line.getClientRect
  // console.log(test, "test")
  // let anim = new Konva.Animation(function (frame) {
  //   pos = pos + 1;
  //   pt = state.path.getPointAtLength(pos * step);
  //   console.log(pos, "pos")
  //   console.log(pos * step, "pos * step")
  //   console.log(pt, "pt")
  //   state.circle.position({x: pt.x, y: pt.y});
  //   // setTimeout(()=>{
  //   //   anim.stop();
  //   // },500)
  // }, state.layer);
  //
  // anim.start();

}

onMounted(() => {
  createStage();
  createShape();
})
</script>

<template>
  <div>
    <button @click="moveShape(1)" style="margin-bottom: 30px">1이동</button>
    <button @click="moveShape(2)" style="margin-bottom: 30px">2이동</button>
    <button @click="moveShape(3)" style="margin-bottom: 30px">3이동</button>
    <div id="container" style="border: 1px solid black; transition: all ease-in-out 0.8s" @wheel="wheel"></div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
