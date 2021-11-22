<template>
  <div class="hello">
    <h1>{{ $store.state.demo.count }}---{{ $store.state.demo.commonText }}</h1>
    <h3>Installed CLI Plugins</h3>
    <div id="canvas-frame"></div>
  </div>
</template>

<script>
// store中属性值调用的第二种方式
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
  import * as Three from 'three';

  export default {
    name: 'HelloWorld',
    props: {
      msg: String
    },
    data() {
      return {
        width: '',
        height: '',
        renderer: false,
        camera: false,
        scene: false,
        light: false
      };
    },
    computed: {
      ...mapState(['count', 'commonText']),

      // 把 `this.doneCount` 映射为 `this.$store.getters.doneTools`
      ...mapGetters({
        doneCount: 'doneTools',
        getTodoById: 'getTodoById'
      }),

      ...mapActions({
        add: 'actionA'
      })
    },
    created() {
      console.log(this.$route.params.id);
    },
    mounted() {
      const that = this
      that.initThree()
      // this.$nextTick(() => {
      //   that.initThree()
      //   that.init()
      // })
    },
    methods: {
      ...mapMutations(['increment']),

      // 绘制直线
      // 初始渲染器
      initThree() {
        const container = document.getElementById('canvas-frame')
        const width = container.clientWidth
        const height = container.clientHeight
        const renderer = new Three.WebGL1Renderer()
        renderer.setSize(width, height)
        container.appendChild(renderer.domElement)
        renderer.setClearColor('#ffffff', 1.0)

        const camera = new Three.PerspectiveCamera(45, width / height, 1, 10000); // 透视摄像机
        camera.position.set(0, 0, 100); // 设置坐标
        camera.lookAt(0, 0, 0);
        const scene = new Three.Scene(); // 场景

        const light = new Three.DirectionalLight(0x444444, 1)
        scene.add(light)

        const material = new Three.LineBasicMaterial({ vertexColors: true }); // 定义线条的材料，接收字典类型的参数
        const color1 = new Three.Color('#ff0000');
        const color2 = new Three.Color('#40e');
        const color3 = new Three.Color('yellow');

        const geometry = new Three.Geometry(); // 声明一个几何体geometry
        // geometry.vertices.push(new Three.Vector3(-10, 0, 0));
        // geometry.vertices.push(new Three.Vector3(0, 10, 0));
        // 线的材质可以由两点的颜色决定
        const p1 = new Three.Vector3(0, 0, 0)
        const p2 = new Three.Vector3(10, 0, 0)
        const p3 = new Three.Vector3(5, -10, 0)
        geometry.vertices.push(p1, p2, p3);
        geometry.colors.push(color1, color2, color3)
        const line = new Three.Line(geometry, material, Three.LineSegments)
        scene.add(line)

        // 添加坐标系
        const axes = new Three.AxesHelper(50)
        scene.add(axes)

        renderer.render(scene, camera)
      },

      init() {
        // 初始化场景，相机，渲染器
        // 设置渲染器大小，并将渲染后的dom插入到body中
        const scene = new Three.Scene();
        const camera = new Three.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          1,
          1000
        );
        const renderer = new Three.WebGL1Renderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor('#ffffff')
        document.body.appendChild(renderer.domElement);

        // 定义几何体和材质
        const geometry = new Three.CubeGeometry(2, 2, 2);
        const material = new Three.MeshBasicMaterial({ color: '#42b983' });

        // 材质和几何体组成最后的网格对象
        const cube = new Three.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;
        function render() {
          requestAnimationFrame(render)
          cube.rotateY(0.01)
          renderer.render(scene, camera);
        }
        render()
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  #canvas-frame{
    border: none;
    cursor: pointer;
    width: 100%;
    height: 600px;
    background: #eeeeee;
  }
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
