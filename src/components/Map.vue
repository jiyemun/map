<script setup lang="ts">
import Konva from "konva";
import {onMounted, reactive} from "vue";
import amrUrl from '../assets/amr.png'
import * as rgba from '../util/robotState'

defineProps<{ msg: string }>()

enum RobotState {
  Off,
  Wait,
  Charge,
  Alarm,
  Transfer,
  PreRun,
  Parking,
  Load
}

enum RackState {
  Off,
  Wait,
  Charge,
  Alarm,
  Transfer,
  PreRun,
  Parking,
  Load
}

interface KonvaRobot {
  Konva: Konva.Shape,
  tween: Konva.Tween
}

const ui = reactive({
  bgColor: '#d3d3d33b'
})

const state = reactive({
  stage: undefined as any,
  layer: undefined as any,
  robotLayer: undefined as any,
  objectLayer: undefined as any,
  circle: undefined as any,
  line: undefined as any,
  path: undefined as any,
  robots: {} as any,
  orderNumber: {} as any
})

function makeTweenRotate(shape: any, angle: number) {
  // let test = object.Konva.getAttr('rotation')
  // console.log(test, "test")
  let tween = new Konva.Tween({
    node: shape,
    rotation: angle,
    onFinish: () => {
      tween.destroy()
    }
  }).play()
}

function makeTween(shape: any, x: number, y: number, angle?: number) {
  let tween = new Konva.Tween({
    node: shape,
    duration: 1,
    x: x,
    y: y,
    onFinish: () => {
      if (angle) {
        makeTweenRotate(shape, angle);
      }
      tween.destroy();
    }
  }).play()
}

function wheel(e: WheelEvent): void {
  if (state.stage != null) {
    const scaleBy = 1.15;
    const oldScale = state.stage.scaleX();

    const pointer: Konva.Vector2d = state.stage.getPointerPosition() as Konva.Vector2d;
    const mousePointTo = {
      x: (pointer.x - state.stage.x()) / oldScale,
      y: (pointer.y - state.stage.y()) / oldScale,
    };

    let direction = e.deltaY > 0 ? -1 : 1;

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
    {x: 80, y: 506, name: 'line1'}, {x: 80, y: 308, name: 'line2'}, {x: 461, y: 311, name: 'line3'}, {
      x: 461,
      y: 257,
      name: 'line4'
    }, {x: 245, y: 490, name: 'line5'}, {x: 245, y: 310, name: 'line6'},
    {x: 330, y: 490, name: 'line7'}, {x: 330, y: 310, name: 'line8'}, {x: 395, y: 490, name: 'line9'}, {
      x: 395,
      y: 311,
      name: 'line10'
    }
  ]

  for (let i = 0; i < lineList.length; i++) {
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

  for (let i = 0; i < pointList.length; i++) {
    let circle = new Konva.Circle({
      x: pointList[i].x,
      y: pointList[i].y,
      radius: 3,
      fill: 'blue',
      name: pointList[i].name
    });

    let tooltip = new Konva.Label({
      x: pointList[i].x,
      y: pointList[i].y,
      opacity: 0.8,
    });

    tooltip.add(
        new Konva.Tag({
          fill: 'green',
          pointerDirection: 'down',
          pointerWidth: 0,
          pointerHeight: 10,
        })
    );

    tooltip.add(
        new Konva.Text({
          text: pointList[i].name,
          fontFamily: 'Calibri',
          fontSize: 10,
          padding: 3,
          fill: 'white',
        })
    );

    group.add(tooltip);
    group.add(circle);
  }

  state.objectLayer.add(group)
}

function setColor(shape: Konva.Shape, state: any) {
  shape.cache();
  shape.filters([Konva.Filters.RGB]);
  let color;
  switch (state) {
    case RobotState.Wait:
      color = rgba.wait
      break;
    case RobotState.Charge:
      color = rgba.charge
      break;
    case RobotState.Alarm:
      color = rgba.alarm
      break;
    case RobotState.Transfer:
      color = rgba.transfer
      break;
    case RobotState.PreRun:
      color = rgba.preRun
      break;
    case RobotState.Parking:
      color = rgba.parking
      break;
    case RobotState.Load:
      color = rgba.load
      break;
    default:
      color = rgba.off
      break;
  }
  shape.red(color.RED);
  shape.blue(color.BLUE);
  shape.green(color.GREEN);
  shape.alpha(color.ALPHA);
}

function copyShape(copyTarget: Konva.Shape, item: any) {

  let robot = copyTarget.clone({
    x: item.points.x,
    y: item.points.y,
  });
  setColor(robot, RobotState.Off)

  state.robotLayer.add(robot);

  return robot;
}

  function createImage() {
    return new Promise((resolve)=>{
      let img = new Image();
      img.onload = () => {
        let robot = new Konva.Image({
          x: 0,
          y: 0,
          image: img,
          scale: {x: 0.2, y: 0.2},
          offset: { // default 0 !!
            x: img.width / 2,
            y: img.height / 2
          },
          rotation: 0, // offset x,y 를 기준으로 돌아감 그래서 offset을 너비의 반으로 옮겨야지 가운데서 돌아감
        })

        robot.on('click tap', function () {
          alert('정보 보여줘')
        });
        robot.on('mouseenter', function () {
          state.stage.container().style.cursor = 'pointer';
        });
        robot.on('mouseleave', function () {
          state.stage.container().style.cursor = 'default';
        });

        resolve(robot)
      }
      img.src = amrUrl;
    })
  }

  async function createAMR() {
    let list = [
      {name: 'robot1', points: {x: 0, y: 0}},
      {name: 'robot2', points: {x: 20, y: 430}},
      {name: 'robot3', points: {x: 80, y: 506}}
    ]

    let img = await createImage()

    list.forEach(item => {
      state.robots[item.name] = copyShape(img as Konva.Shape, item)
    })
  }

  function createRect() {
    let rectList = [{x: 80, y: 550, name: 'RACK1'}, {x: 245, y: 530, name: 'RACK3'}, {x: 330, y: 530, name: 'RACK4'}, {x: 395, y: 530, name: 'RACK5'},{x: 460, y: 190, name: 'RACK8'}]

    rectList.forEach(item => {
      let group = new Konva.Group({
        x: item.x,
        y: item.y,
        offset: {
          x: 25,
          y: 25
        },
      });

      let rect = new Konva.Rect({
        width: 50,
        height: 50,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 1,
        cornerRadius: 7,
      });

      group.add(rect)

      let rectInner = new Konva.Rect({
        x: 5,
        y: 5,
        width: 40,
        height: 20,
        fill: 'blue',
        stroke: 'black',
        strokeWidth: 1,
        cornerRadius: 2,
      });

      let rectInner2 = new Konva.Rect({
        x: 5,
        y: 25,
        width: 40,
        height: 20,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 1,
        cornerRadius: 2,
      });

      group.add(rectInner).add(rectInner2)

      let rectInnerText = new Konva.Text({
        x: rectInner.x(),
        y: rectInner.y(),
        width: rectInner.width(),
        height: rectInner.height(),
        verticalAlign: 'middle',
        align: 'center',
        text: '39',
        fontSize: 10,
        fontFamily: 'Calibri',
        fill: '#ffffff',
      });

      var rectInnerText2 = new Konva.Text({
        x: rectInner2.x(),
        y: rectInner2.y(),
        width: rectInner.width(),
        height: rectInner.height(),
        verticalAlign: 'middle',
        align: 'center',
        text: '8',
        fontSize: 10,
        fontFamily: 'Calibri',
        fill: 'black',
      });

      let complexText = new Konva.Text({
        x: rect.x(),
        y: rect.y() + rect.height(),
        width: rect.width(),
        align: 'center',
        text: item.name,
        fontSize: 12,
        padding:3,
        fontFamily: 'Calibri',
        fill: '#555',
      });

      state.orderNumber = {...state.orderNumber, ...{[item.name]: rectInnerText2}}

      group.add(rectInnerText).add(rectInnerText2).add(complexText)

      state.objectLayer.add(group);
    })
  }

  function createCircle(x: number, y: number) {

    let group = new Konva.Group({
      x: 100,
      y: 100,
    });
    let test = new Konva.Circle({
      x,
      y,
      radius: 10,
      fill: 'red',
    });

    group.add(test)

    state.layer.add(group);
  }

  function makeBackground() {

    const xSnaps = Math.round(state.stage.width() / 10);
    const ySnaps = Math.round(state.stage.height() / 10);
    const cellWidth = state.stage.width() / xSnaps;
    const cellHeight = state.stage.height() / ySnaps;

    for (var i = 0; i < xSnaps; i++) {
      state.layer.add(
          new Konva.Line({
            x: i * cellWidth,
            points: [0, 0, 0, state.stage.height()],
            stroke: 'rgba(0,0,0,0.08)',
            strokeWidth: 1,
          })
      );
    }

    for (var i = 0; i < ySnaps; i++) {
      state.layer.add(
          new Konva.Line({
            y: i * cellHeight,
            points: [0, 0, state.stage.width(), 0],
            stroke: 'rgba(0,0,0,0.08)',
            strokeWidth: 1,
          })
      );
    }
  }

  function createPath() {
    // Load the path points up using M = moveto, L = lineto.
    // var data = [{"x":0,"y":0},{"x":50,"y":50},{"x":141,"y":79},{"x":181.5,"y":78.5},{"x":218,"y":62},{"x":223,"y":40},{"x":240,"y":26},{"x":259.5,"y":25},{"x":271,"y":40},{"x":292.5,"y":53},{"x":311.25,"y":55.5},{"x":330.625,"y":46.75},{"x":332.3125,"y":30.375},{"x":349.15625,"y":10.1875},{"x":374.578125,"y":10.09375},{"x":392,"y":26},{"x":411,"y":36},{"x":444.5,"y":37},{"x":453.875,"y":27.25},{"x":463.25,"y":17.5},{"x":472.9375,"y":10.625},{"x":494.625,"y":15.75},{"x":530,"y":48},{"x":534,"y":88},{"x":540,"y":150},{"x":552,"y":198},{"x":544,"y":227},{"x":522,"y":256},{"x":504.5,"y":263},{"x":471,"y":262},{"x":448,"y":252},{"x":372,"y":214},{"x":290,"y":146},{"x":256,"y":100},{"x":198,"y":104},{"x":182,"y":140},{"x":204,"y":185},{"x":203,"y":201.5},{"x":190,"y":214},{"x":174.5,"y":218},{"x":155,"y":214},{"x":124,"y":222},{"x":113.5,"y":232.5},{"x":95,"y":227},{"x":75.5,"y":211.5},{"x":72,"y":188},{"x":58,"y":136}]
    let data = [{x: 80, y: 506}, {x: 80, y: 308}, {x: 461, y: 311}, {x: 461, y: 257}]
    let p = "M" + data[0].x + " " + data[0].y;
    for (let i = 1; i < data.length; i = i + 1) {
      p = p + " L" + data[i].x + " " + data[i].y;
    }
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
    state.stage.container().style.backgroundColor = ui.bgColor
    state.layer = new Konva.Layer();
    state.robotLayer = new Konva.Layer();
    state.objectLayer = new Konva.Layer();
  }

  function createShape() {
    makeBackground()
    createPath()
    createLine()
    createRect()
    createCircle(100, 0)
    createAMR()

    state.stage.add(state.layer);
    state.stage.add(state.robotLayer);
    state.stage.add(state.objectLayer);

  }

  function moveShape(num: number) {
    switch (num) {
      case 1:
        makeTween(state.robots.robot3, 80, 308, 180)
        setColor(state.robots.robot3, RobotState.Charge)
        state.orderNumber['RACK1'].text('1000')
        break;
      case 2:
        makeTween(state.robots.robot3, 245, 310, 180)
        setColor(state.robots.robot3, RobotState.Parking)
        state.orderNumber['RACK1'].text('90')
        break;
      case 3:
        makeTween(state.robots.robot3, 330, 310)
        setColor(state.robots.robot3, RobotState.Alarm)
        state.orderNumber['RACK1'].text('10')
        break;
      case 4:
        makeTween(state.robots.robot3, 395, 311)
        setColor(state.robots.robot3, RobotState.Wait)
        state.orderNumber['RACK1'].text('1000')
        break;
      case 5:
        makeTween(state.robots.robot3, 461, 311)
        setColor(state.robots.robot3, RobotState.Load)
        state.orderNumber['RACK1'].text('1000')
        break;
      case 6:
        makeTween(state.robots.robot3, 461, 257, 270)
        setColor(state.robots.robot3, RobotState.Transfer)
        state.orderNumber['RACK1'].text('1000')
        break;
      default:
        break;
    }
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
    <button @click="moveShape(3)" style="margin-bottom: 30px">6이동</button>
    <button @click="moveShape(4)" style="margin-bottom: 30px">8이동</button>
    <button @click="moveShape(5)" style="margin-bottom: 30px">10이동</button>
    <button @click="moveShape(6)" style="margin-bottom: 30px">3이동</button>
    <div id="container" style="border: 1px solid black; transition: all ease-in-out 0.8s" @wheel="wheel"></div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
