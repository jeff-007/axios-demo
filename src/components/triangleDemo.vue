<template>
    <div>
        <canvas v-if="false" id="canvasElem2"></canvas>
        <!-- 小球散落 -->
<!--        <canvas id="canvasElem1"></canvas>-->

        <!-- 粒子花园 -->
        <canvas v-if="false" id="canvasElem3"></canvas>

        <!-- 3d星空环绕 -->
        <canvas v-if="false" id="canvasElem4"></canvas>

<!--        <canvas id="canvasElem5"></canvas>-->

        <!-- 三维正方体 -->
        <div class="container" id="container"></div>
        <div id="info"></div>

        <!-- pointerLocker -->
<!--        <div id="blocker">-->
<!--            <div id="instructions">-->
<!--                <span style="font-size:36px">Click to play</span>-->
<!--                <br /><br />-->
<!--                Move: WASD<br/>-->
<!--                Jump: SPACE<br/>-->
<!--                Look: MOUSE-->
<!--            </div>-->
<!--        </div>-->

<!--        <canvas id="c"></canvas>-->
<!--        <div id="content">-->
<!--            <div>-->
<!--                <h1>Cubes-R-Us!</h1>-->
<!--                <p>We make the best cubes!</p>-->
<!--            </div>-->
<!--        </div>-->
<!--        <button id="screenshot" type="button">Save...</button>-->

    </div>

</template>

<script>
    import * as Three from 'three';
    // import Three from '@/three/vtkLoader.js'
    const TWEEN = require('@tweenjs/tween.js')
    const Physijs = require('physijs')
    import C from '@/canvas/utils.js'
    import { Ball } from '@/canvas/ball.js';
    import * as Stats from 'three/examples/js/libs/stats.min.js'
    import * as dat from 'three/examples/jsm/libs/dat.gui.module.js'
    import { Lensflare } from 'three/examples/jsm/objects/Lensflare.js'
    import { Projector } from 'three/examples/jsm/renderers/Projector.js'
    import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
    import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
    import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils.js'
    import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js'
    import { TextureLoader } from 'three/src/loaders/TextureLoader'
    import { DragControls } from 'three/examples/jsm/controls/DragControls.js'
    import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
    import { Water } from 'three/examples/jsm/objects/Water.js'
    import { Sky } from 'three/examples/jsm/objects/Sky.js'
    import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
    import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
    import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'

    // 后期处理相关
    import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
    import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js'
    import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
    import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js'
    import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
    import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'
    import { SepiaShader } from 'three/examples/jsm/shaders/SepiaShader.js'
    import { ColorifyShader } from 'three/examples/jsm/shaders/ColorifyShader.js'
    import { MaskPass, ClearMaskPass } from 'three/examples/jsm/postprocessing/MaskPass.js'
    import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'


    export default {
        name: 'TriangleDemo',
        components: {},
        props: {},
        data() {
            return {
                camera: false,
                scene: false
            }
        },
        computed: {},
        created() {
            // let scene = new Physijs.Scene()
        },
        mounted() {
            // this.initSceneGraph()
            // this.initStarrySky()
            // this.initSound()
            // this.initDrag()
            // this.initPointer()
            this.initWater()
            // this.initScreenshot()
            // this.initPopulation()

            // this.initTank()
            // this.initPopulation3D()
            // this.initObjFile()
        },
        methods: {
            // 加载OBJ模型demo
            initObjFile() {
                const container = document.getElementById('container');
                const renderer = new Three.WebGLRenderer();
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setClearColor(0xAAAAAA);
                renderer.shadowMap.enabled = true;
                container.appendChild(renderer.domElement);

                const fov = 45;
                const aspect = 2;
                const near = 0.1;
                const far = 100;
                const camera = new Three.PerspectiveCamera(fov, aspect, near, far);
                camera.position.set(0, 10, 20);

                const controls = new OrbitControls(camera, renderer.domElement);
                controls.target.set(0, 5, 0);
                controls.update();

                const scene = new Three.Scene();
                scene.background = new Three.Color('black');

                {
                    const planeSize = 40;

                    const loader = new Three.TextureLoader();
                    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
                    texture.wrapS = Three.RepeatWrapping;
                    texture.wrapT = Three.RepeatWrapping;
                    texture.magFilter = Three.NearestFilter;
                    const repeats = planeSize / 2;
                    texture.repeat.set(repeats, repeats);

                    const planeGeo = new Three.PlaneGeometry(planeSize, planeSize);
                    const planeMat = new Three.MeshPhongMaterial({
                        map: texture,
                        side: Three.DoubleSide
                    });
                    const mesh = new Three.Mesh(planeGeo, planeMat);
                    mesh.rotation.x = Math.PI * -0.5;
                    scene.add(mesh);
                }

                {
                    const skyColor = 0xB1E1FF; // light blue
                    const groundColor = 0xB97A20; // brownish orange
                    const intensity = 1;
                    const light = new Three.HemisphereLight(skyColor, groundColor, intensity);
                    scene.add(light);
                }

                {
                    const color = 0xFFFFFF;
                    const intensity = 1;
                    const light = new Three.DirectionalLight(color, intensity);
                    light.position.set(5, 10, 2);
                    scene.add(light);
                    scene.add(light.target);
                }

                {
                    const mtlLoader = new MTLLoader();
                    mtlLoader.load('https://threejsfundamentals.org/threejs/resources/models/windmill/windmill-fixed.mtl', (mtl) => {
                        mtl.preload();
                        const objLoader = new OBJLoader();
                        mtl.materials.Material.side = Three.DoubleSide;
                        objLoader.setMaterials(mtl);
                        objLoader.load('https://threejsfundamentals.org/threejs/resources/models/windmill/windmill.obj', (root) => {
                            scene.add(root);
                        });
                    });
                }

                function resizeRendererToDisplaySize(renderer) {
                    const canvas = renderer.domElement;
                    const width = canvas.clientWidth;
                    const height = canvas.clientHeight;
                    const needResize = canvas.width !== width || canvas.height !== height;
                    if (needResize) {
                        renderer.setSize(width, height, false);
                    }
                    return needResize;
                }

                function render() {

                    if (resizeRendererToDisplaySize(renderer)) {
                        const canvas = renderer.domElement;
                        camera.aspect = canvas.clientWidth / canvas.clientHeight;
                        camera.updateProjectionMatrix();
                    }

                    renderer.render(scene, camera);

                    requestAnimationFrame(render);
                }

                requestAnimationFrame(render);
            },
            initTank() {
                const container = document.getElementById('container');
                const renderer = new Three.WebGLRenderer();
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setClearColor(0xAAAAAA);
                renderer.shadowMap.enabled = true;
                container.appendChild(renderer.domElement);

                function makeCamera(fov = 40) {
                    const aspect = 2; // the canvas default
                    const zNear = 0.1;
                    const zFar = 1000;
                    return new Three.PerspectiveCamera(fov, aspect, zNear, zFar);
                }
                const camera = makeCamera();
                camera.position.set(8, 4, 10).multiplyScalar(3);
                camera.lookAt(0, 0, 0);

                const scene = new Three.Scene();

                {
                    const light = new Three.DirectionalLight(0xffffff, 1);
                    light.position.set(0, 20, 0);
                    scene.add(light);
                    light.castShadow = true;
                    light.shadow.mapSize.width = 2048;
                    light.shadow.mapSize.height = 2048;

                    const d = 50;
                    light.shadow.camera.left = -d;
                    light.shadow.camera.right = d;
                    light.shadow.camera.top = d;
                    light.shadow.camera.bottom = -d;
                    light.shadow.camera.near = 1;
                    light.shadow.camera.far = 50;
                    light.shadow.bias = 0.001;
                }

                {
                    const light = new Three.DirectionalLight(0xffffff, 1);
                    light.position.set(1, 2, 4);
                    scene.add(light);
                }

                const groundGeometry = new Three.PlaneGeometry(50, 50);
                const groundMaterial = new Three.MeshPhongMaterial({ color: 0xCC8866 });
                const groundMesh = new Three.Mesh(groundGeometry, groundMaterial);
                groundMesh.rotation.x = Math.PI * -0.5;
                groundMesh.receiveShadow = true;
                scene.add(groundMesh);

                const carWidth = 4;
                const carHeight = 1;
                const carLength = 8;

                const tank = new Three.Object3D();
                scene.add(tank);

                const bodyGeometry = new Three.BoxGeometry(carWidth, carHeight, carLength);
                const bodyMaterial = new Three.MeshPhongMaterial({ color: 0x6688AA });
                const bodyMesh = new Three.Mesh(bodyGeometry, bodyMaterial);
                bodyMesh.position.y = 1.4;
                bodyMesh.castShadow = true;
                tank.add(bodyMesh);

                const tankCameraFov = 75;
                const tankCamera = makeCamera(tankCameraFov);
                tankCamera.position.y = 3;
                tankCamera.position.z = -6;
                tankCamera.rotation.y = Math.PI;
                bodyMesh.add(tankCamera);

                const wheelRadius = 1;
                const wheelThickness = 0.5;
                const wheelSegments = 6;
                const wheelGeometry = new Three.CylinderGeometry(
                    wheelRadius, // top radius
                    wheelRadius, // bottom radius
                    wheelThickness, // height of cylinder
                    wheelSegments);
                const wheelMaterial = new Three.MeshPhongMaterial({ color: 0x888888 });
                const wheelPositions = [
                    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, carLength / 3],
                    [carWidth / 2 + wheelThickness / 2, -carHeight / 2, carLength / 3],
                    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, 0],
                    [carWidth / 2 + wheelThickness / 2, -carHeight / 2, 0],
                    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, -carLength / 3],
                    [carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3]
                ];
                const wheelMeshes = wheelPositions.map((position) => {
                    const mesh = new Three.Mesh(wheelGeometry, wheelMaterial);
                    mesh.position.set(...position);
                    mesh.rotation.z = Math.PI * 0.5;
                    mesh.castShadow = true;
                    bodyMesh.add(mesh);
                    return mesh;
                });

                const domeRadius = 2;
                const domeWidthSubdivisions = 12;
                const domeHeightSubdivisions = 12;
                const domePhiStart = 0;
                const domePhiEnd = Math.PI * 2;
                const domeThetaStart = 0;
                const domeThetaEnd = Math.PI * 0.5;
                const domeGeometry = new Three.SphereGeometry(
                    domeRadius, domeWidthSubdivisions, domeHeightSubdivisions,
                    domePhiStart, domePhiEnd, domeThetaStart, domeThetaEnd);
                const domeMesh = new Three.Mesh(domeGeometry, bodyMaterial);
                domeMesh.castShadow = true;
                bodyMesh.add(domeMesh);
                domeMesh.position.y = 0.5;

                const turretWidth = 0.1;
                const turretHeight = 0.1;
                const turretLength = carLength * 0.75 * 0.2;
                const turretGeometry = new Three.BoxGeometry(
                    turretWidth, turretHeight, turretLength);
                const turretMesh = new Three.Mesh(turretGeometry, bodyMaterial);
                const turretPivot = new Three.Object3D();
                turretMesh.castShadow = true;
                turretPivot.scale.set(5, 5, 5);
                turretPivot.position.y = 0.5;
                turretMesh.position.z = turretLength * 0.5;
                turretPivot.add(turretMesh);
                bodyMesh.add(turretPivot);

                const turretCamera = makeCamera();
                turretCamera.position.y = 0.75 * 0.2;
                turretMesh.add(turretCamera);

                const targetGeometry = new Three.SphereGeometry(0.5, 6, 3);
                const targetMaterial = new Three.MeshPhongMaterial({ color: 0x00FF00, flatShading: true });
                const targetMesh = new Three.Mesh(targetGeometry, targetMaterial);
                const targetOrbit = new Three.Object3D();
                const targetElevation = new Three.Object3D();
                const targetBob = new Three.Object3D();
                targetMesh.castShadow = true;
                scene.add(targetOrbit);
                targetOrbit.add(targetElevation);
                targetElevation.position.z = carLength * 2;
                targetElevation.position.y = 8;
                targetElevation.add(targetBob);
                targetBob.add(targetMesh);

                const targetCamera = makeCamera();
                const targetCameraPivot = new Three.Object3D();
                targetCamera.position.y = 1;
                targetCamera.position.z = -2;
                targetCamera.rotation.y = Math.PI;
                targetBob.add(targetCameraPivot);
                targetCameraPivot.add(targetCamera);

                // Create a sine-like wave
                const curve = new Three.SplineCurve([
                    new Three.Vector2(-10, 0),
                    new Three.Vector2(-5, 5),
                    new Three.Vector2(0, 0),
                    new Three.Vector2(5, -5),
                    new Three.Vector2(10, 0),
                    new Three.Vector2(5, 10),
                    new Three.Vector2(-5, 10),
                    new Three.Vector2(-10, -10),
                    new Three.Vector2(-15, -8),
                    new Three.Vector2(-10, 0)
                ]);

                const points = curve.getPoints(50);
                const geometry = new Three.BufferGeometry().setFromPoints(points);
                const material = new Three.LineBasicMaterial({ color: 0xff0000 });
                const splineObject = new Three.Line(geometry, material);
                splineObject.rotation.x = Math.PI * 0.5;
                splineObject.position.y = 0.05;
                scene.add(splineObject);

                function resizeRendererToDisplaySize(renderer) {
                    const canvas = renderer.domElement;
                    const width = canvas.clientWidth;
                    const height = canvas.clientHeight;
                    const needResize = canvas.width !== width || canvas.height !== height;
                    if (needResize) {
                        renderer.setSize(width, height, false);
                    }
                    return needResize;
                }

                const targetPosition = new Three.Vector3();
                const tankPosition = new Three.Vector2();
                const tankTarget = new Three.Vector2();

                const cameras = [
                    { cam: camera, desc: 'detached camera' },
                    { cam: turretCamera, desc: 'on turret looking at target' },
                    { cam: targetCamera, desc: 'near target looking at tank' },
                    { cam: tankCamera, desc: 'above back of tank' }
                ];

                const infoElem = document.querySelector('#info');

                function render(time) {
                    time *= 0.001;

                    if (resizeRendererToDisplaySize(renderer)) {
                        const canvas = renderer.domElement;
                        cameras.forEach((cameraInfo) => {
                            const camera = cameraInfo.cam;
                            camera.aspect = canvas.clientWidth / canvas.clientHeight;
                            camera.updateProjectionMatrix();
                        });
                    }

                    // move target
                    targetOrbit.rotation.y = time * 0.27;
                    targetBob.position.y = Math.sin(time * 2) * 4;
                    targetMesh.rotation.x = time * 7;
                    targetMesh.rotation.y = time * 13;
                    targetMaterial.emissive.setHSL(time * 10 % 1, 1, 0.25);
                    targetMaterial.color.setHSL(time * 10 % 1, 1, 0.25);

                    // move tank
                    const tankTime = time * 0.05;
                    curve.getPointAt(tankTime % 1, tankPosition);
                    curve.getPointAt((tankTime + 0.01) % 1, tankTarget);
                    tank.position.set(tankPosition.x, 0, tankPosition.y);
                    tank.lookAt(tankTarget.x, 0, tankTarget.y);

                    // face turret at target
                    targetMesh.getWorldPosition(targetPosition);
                    turretPivot.lookAt(targetPosition);

                    // make the turretCamera look at target
                    turretCamera.lookAt(targetPosition);

                    // make the targetCameraPivot look at the at the tank
                    tank.getWorldPosition(targetPosition);
                    targetCameraPivot.lookAt(targetPosition);

                    wheelMeshes.forEach((obj) => {
                        obj.rotation.x = time * 3;
                    });

                    const camera = cameras[time * 0.25 % cameras.length | 0];
                    infoElem.textContent = camera.desc;

                    renderer.render(scene, camera.cam);

                    requestAnimationFrame(render);
                }

                requestAnimationFrame(render);
            },
            initSceneGraph() {
                const container = document.getElementById('container');
                const renderer = new Three.WebGLRenderer();
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);
                container.appendChild(renderer.domElement);

                const fov = 40;
                const aspect = 2; // the canvas default
                const near = 0.1;
                const far = 1000;
                const camera = new Three.PerspectiveCamera(fov, aspect, near, far);
                camera.position.set(0, 150, 0);
                camera.up.set(0, 0, 1);
                camera.lookAt(0, 0, 0);

                const scene = new Three.Scene();

                const color = 0xFFFFFF;
                const intensity = 3;
                const light = new Three.PointLight(color, intensity);
                scene.add(light);

                const objects = [];

                const solarSystem = new Three.Object3D();
                scene.add(solarSystem);
                objects.push(solarSystem);

                // earth local space
                const earthOrbit = new Three.Object3D();
                earthOrbit.position.x = 10;
                solarSystem.add(earthOrbit)
                objects.push(earthOrbit)

                // moon local space
                const moonOrbit = new Three.Object3D();
                moonOrbit.position.x = 2;
                earthOrbit.add(moonOrbit)
                objects.push(moonOrbit)

                const radius = 1;
                const widthSegments = 6;
                const heightSegments = 6;
                const sphereGeometry = new Three.SphereGeometry(radius, widthSegments, heightSegments);

                const sunMaterial = new Three.MeshPhongMaterial({ emissive: 0xFFFF00 });
                const sunMesh = new Three.Mesh(sphereGeometry, sunMaterial);
                sunMesh.scale.set(5, 5, 5);
                solarSystem.add(sunMesh);
                objects.push(sunMesh);

                const earthMaterial = new Three.MeshPhongMaterial({ color: 0x2233FF, emissive: 0x112244 });
                const earthMesh = new Three.Mesh(sphereGeometry, earthMaterial);
                earthOrbit.add(earthMesh);
                objects.push(earthMesh);

                const moonMaterial = new Three.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 });
                const moonMesh = new Three.Mesh(sphereGeometry, moonMaterial);
                moonMesh.scale.set(0.5, 0.5, 0.5);
                moonOrbit.add(moonMesh);
                objects.push(moonMesh);

                function resizeRendererToDisplaySize(renderer) {
                    const canvas = renderer.domElement;
                    const width = canvas.clientWidth;
                    const height = canvas.clientHeight;
                    const needResize = canvas.width !== width || canvas.height !== height;
                    if (needResize) {
                        renderer.setSize(width, height, false);
                    }
                    return needResize;
                }

                function render(time) {
                    time *= 0.001;

                    if (resizeRendererToDisplaySize(renderer)) {
                        const canvas = renderer.domElement;
                        camera.aspect = canvas.clientWidth / canvas.clientHeight;
                        camera.updateProjectionMatrix();
                    }

                    objects.forEach((obj) => {
                        obj.rotation.y = time;
                        const axes = new Three.AxesHelper();
                        axes.material.depthTest = false;
                        axes.renderOrder = 1;
                        obj.add(axes)
                    });

                    renderer.render(scene, camera);

                    requestAnimationFrame(render);
                }
                requestAnimationFrame(render);
            },
            initPopulation3D() {
                // const canvas = document.querySelector('#c');
                // const renderer = new Three.WebGLRenderer({ canvas });
                const container = document.getElementById('container');

                const renderer = new Three.WebGLRenderer();
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);
                container.appendChild(renderer.domElement);

                const fov = 60;
                const aspect = 2; // the canvas default
                const near = 0.1;
                const far = 10;
                const camera = new Three.PerspectiveCamera(fov, aspect, near, far);
                camera.position.z = 2.5;

                const controls = new OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.enablePan = false;
                controls.minDistance = 1.2;
                controls.maxDistance = 4;
                controls.update();

                const scene = new Three.Scene();
                scene.background = new Three.Color('black');

                {
                    const loader = new Three.TextureLoader();
                    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/world.jpg', render);
                    const geometry = new Three.SphereGeometry(1, 64, 32);
                    const material = new Three.MeshBasicMaterial({ map: texture });
                    scene.add(new Three.Mesh(geometry, material));
                }

                async function loadFile(url) {
                    const req = await fetch(url);
                    return req.text();
                }

                function parseData(text) {
                    const data = [];
                    const settings = { data };
                    let max;
                    let min;
                    // split into lines
                    text.split('\n').forEach((line) => {
                        // split the line by whitespace
                        const parts = line.trim().split(/\s+/);
                        if (parts.length === 2) {
                            // only 2 parts, must be a key/value pair
                            settings[parts[0]] = parseFloat(parts[1]);
                        } else if (parts.length > 2) {
                            // more than 2 parts, must be data
                            const values = parts.map((v) => {
                                const value = parseFloat(v);
                                if (value === settings.NODATA_value) {
                                    return undefined;
                                }
                                max = Math.max(max === undefined ? value : max, value);
                                min = Math.min(min === undefined ? value : min, value);
                                return value;
                            });
                            data.push(values);
                        }
                    });
                    return Object.assign(settings, { min, max });
                }

                function addBoxes(file) {
                    const { min, max, data } = file;
                    const range = max - min;

                    // these helpers will make it easy to position the boxes
                    // We can rotate the lon helper on its Y axis to the longitude
                    const lonHelper = new Three.Object3D();
                    scene.add(lonHelper);
                    // We rotate the latHelper on its X axis to the latitude
                    const latHelper = new Three.Object3D();
                    lonHelper.add(latHelper);
                    // The position helper moves the object to the edge of the sphere
                    const positionHelper = new Three.Object3D();
                    positionHelper.position.z = 1;
                    latHelper.add(positionHelper);
                    // Used to move the center of the cube so it scales from the position Z axis
                    const originHelper = new Three.Object3D();
                    originHelper.position.z = 0.5;
                    positionHelper.add(originHelper);

                    const color = new Three.Color();

                    const lonFudge = Math.PI * 0.5;
                    const latFudge = Math.PI * -0.135;
                    const geometries = [];
                    data.forEach((row, latNdx) => {
                        row.forEach((value, lonNdx) => {
                            if (value === undefined) {
                                return;
                            }
                            const amount = (value - min) / range;

                            const boxWidth = 1;
                            const boxHeight = 1;
                            const boxDepth = 1;
                            const geometry = new Three.BoxBufferGeometry(boxWidth, boxHeight, boxDepth);

                            // adjust the helpers to point to the latitude and longitude
                            lonHelper.rotation.y = Three.MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge;
                            latHelper.rotation.x = Three.MathUtils.degToRad(latNdx + file.yllcorner) + latFudge;

                            // use the world matrix of the origin helper to
                            // position this geometry
                            positionHelper.scale.set(0.005, 0.005, Three.MathUtils.lerp(0.01, 0.5, amount));
                            originHelper.updateWorldMatrix(true, false);
                            geometry.applyMatrix4(originHelper.matrixWorld);

                            // compute a color
                            const hue = Three.MathUtils.lerp(0.7, 0.3, amount);
                            const saturation = 1;
                            const lightness = Three.MathUtils.lerp(0.4, 1.0, amount);
                            color.setHSL(hue, saturation, lightness);
                            // get the colors as an array of values from 0 to 255
                            const rgb = color.toArray().map(v => v * 255);

                            // make an array to store colors for each vertex
                            const numVerts = geometry.getAttribute('position').count;
                            const itemSize = 3; // r, g, b
                            const colors = new Uint8Array(itemSize * numVerts);

                            // copy the color into the colors array for each vertex
                            colors.forEach((v, ndx) => {
                                colors[ndx] = rgb[ndx % 3];
                            });

                            const normalized = true;
                            const colorAttrib = new Three.BufferAttribute(colors, itemSize, normalized);
                            geometry.setAttribute('color', colorAttrib);

                            geometries.push(geometry);
                        });
                    });

                    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
                        geometries, false);
                    const material = new Three.MeshBasicMaterial({
                        vertexColors: true
                    });
                    const mesh = new Three.Mesh(mergedGeometry, material);
                    scene.add(mesh);
                }

                loadFile('https://threejsfundamentals.org/threejs/resources/data/gpw/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc')
                    .then(parseData)
                    .then(addBoxes)
                    .then(render);

                function resizeRendererToDisplaySize(renderer) {
                    const canvas = renderer.domElement;
                    const width = canvas.clientWidth;
                    const height = canvas.clientHeight;
                    const needResize = canvas.width !== width || canvas.height !== height;
                    if (needResize) {
                        renderer.setSize(width, height, false);
                    }
                    return needResize;
                }

                let renderRequested = false;

                function render() {
                    renderRequested = undefined;

                    if (resizeRendererToDisplaySize(renderer)) {
                        const canvas = renderer.domElement;
                        camera.aspect = canvas.clientWidth / canvas.clientHeight;
                        camera.updateProjectionMatrix();
                    }

                    controls.update();
                    renderer.render(scene, camera);
                }
                render();

                function requestRenderIfNotRequested() {
                    if (!renderRequested) {
                        renderRequested = true;
                        requestAnimationFrame(render);
                    }
                }

                controls.addEventListener('change', requestRenderIfNotRequested);
                window.addEventListener('resize', requestRenderIfNotRequested);
            },
            initPopulation() {
                async function loadFile(url) {
                    const req = await fetch(url);
                    return req.text();
                }

                function parseData(text) {
                    const data = [];
                    const settings = { data };
                    let max;
                    let min;
                    // split into lines
                    text.split('\n').forEach((line) => {
                        // split the line by whitespace
                        const parts = line.trim().split(/\s+/);
                        if (parts.length === 2) {
                            // only 2 parts, must be a key/value pair
                            settings[parts[0]] = parseFloat(parts[1]);
                        } else if (parts.length > 2) {
                            // more than 2 parts, must be data
                            const values = parts.map((v) => {
                                const value = parseFloat(v);
                                if (value === settings.NODATA_value) {
                                    return undefined;
                                }
                                max = Math.max(max === undefined ? value : max, value);
                                min = Math.min(min === undefined ? value : min, value);
                                return value;
                            });
                            data.push(values);
                        }
                    });
                    return Object.assign(settings, { min, max });
                }

                function drawData(file) {
                    const { min, max, ncols, nrows, data } = file;
                    const range = max - min;
                    const ctx = document.querySelector('canvas').getContext('2d');
                    // make the canvas the same size as the data
                    ctx.canvas.width = ncols;
                    ctx.canvas.height = nrows;
                    // but display it double size so it's not too small
                    ctx.canvas.style.width = px(ncols * 2);
                    // fill the canvas to dark gray
                    ctx.fillStyle = '#444';
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    // draw each data point
                    data.forEach((row, latNdx) => {
                        row.forEach((value, lonNdx) => {
                            if (value === undefined) {
                                return;
                            }
                            const amount = (value - min) / range;
                            const hue = 1;
                            const saturation = 1;
                            const lightness = amount;
                            ctx.fillStyle = hsl(hue, saturation, lightness);
                            ctx.fillRect(lonNdx, latNdx, 1, 1);
                        });
                    });
                }

                function px(v) {
                    return `${v | 0}px`;
                }

                function hsl(h, s, l) {
                    return `hsl(${h * 360 | 0},${s * 100 | 0}%,${l * 100 | 0}%)`;
                }

                loadFile('https://threejsfundamentals.org/threejs/resources/data/gpw/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc')
                    .then(parseData)
                    .then(drawData);
            },
            // canvas截屏
            initScreenshot() {
                const canvas = document.querySelector('#c');
                canvas.width = 1000
                canvas.height = 800
                const renderer = new Three.WebGLRenderer({
                    canvas,
                    alpha: true,
                    premultipliedAlpha: false
                });

                const fov = 75;
                const aspect = 2; // the canvas default
                const near = 0.1;
                const far = 5;
                const camera = new Three.PerspectiveCamera(fov, aspect, near, far);
                camera.position.z = 2;

                const scene = new Three.Scene();

                const color = 0xFFFFFF;
                const intensity = 1;
                const light = new Three.DirectionalLight(color, intensity);
                light.position.set(-1, 2, 4);
                scene.add(light);

                const boxWidth = 1;
                const boxHeight = 1;
                const boxDepth = 1;
                const geometry = new Three.BoxGeometry(boxWidth, boxHeight, boxDepth);

                function makeInstance(geometry, color, x) {
                    const material = new Three.MeshPhongMaterial({
                        color,
                        opacity: 0.5
                    });

                    const cube = new Three.Mesh(geometry, material);
                    scene.add(cube);

                    cube.position.x = x;

                    return cube;
                }

                const cubes = [
                    makeInstance(geometry, 0x44aa88, 0),
                    makeInstance(geometry, 0x8844aa, -2),
                    makeInstance(geometry, 0xaa8844, 2)
                ];

                function resizeRendererToDisplaySize(renderer) {
                    const canvas = renderer.domElement;
                    const width = canvas.clientWidth;
                    const height = canvas.clientHeight;
                    const needResize = canvas.width !== width || canvas.height !== height;
                    if (needResize) {
                        renderer.setSize(width, height, false);
                    }
                    return needResize;
                }

                const state = {
                    time: 0
                };

                function render() {
                    if (resizeRendererToDisplaySize(renderer)) {
                        const canvas = renderer.domElement;
                        camera.aspect = canvas.clientWidth / canvas.clientHeight;
                        camera.updateProjectionMatrix();
                    }

                    cubes.forEach((cube, ndx) => {
                        const speed = 1 + ndx * 0.1;
                        const rot = state.time * speed;
                        cube.rotation.x = rot;
                        cube.rotation.y = rot;
                    });

                    renderer.render(scene, camera);
                }

                function animate(time) {
                    state.time = time * 0.001;

                    render();

                    requestAnimationFrame(animate);
                }

                animate()

                const elem = document.querySelector('#screenshot');
                elem.addEventListener('click', () => {
                    render()
                    canvas.toBlob((blob) => {
                        saveBlob(blob, `screencapture-${canvas.width}x${canvas.height}.png`);
                    });
                });

                const saveBlob = (function() {
                    const a = document.createElement('a');
                    document.body.appendChild(a);
                    a.style.display = 'none';
                    return function saveData(blob, fileName) {
                        const url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = fileName;
                        a.click();
                    };
                }());
            },
            initWater() {
                let container, stats;
                let camera, scene, renderer;
                let controls, water, sun, mesh;

                init();
                animate();

                function init() {

                    container = document.getElementById('container');

                    renderer = new Three.WebGLRenderer();
                    renderer.setPixelRatio(window.devicePixelRatio);
                    renderer.setSize(window.innerWidth, window.innerHeight);
                    // ACESFilmicToneMapping常量定义了WebGLRenderer中色调映射的曝光级别toneMapping的属性
                    // 这个属性用于在普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围图像（HDR）效果
                    // renderer.toneMapping = Three.ACESFilmicToneMapping;
                    container.appendChild(renderer.domElement);

                    scene = new Three.Scene();

                    camera = new Three.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
                    camera.position.set(30, 30, 100);

                    sun = new Three.Vector3();

                    // Water

                    const waterGeometry = new Three.PlaneGeometry(10000, 10000);

                    water = new Water(
                        waterGeometry,
                        {
                            textureWidth: 512,
                            textureHeight: 512,
                            waterNormals: new TextureLoader().load('http://shanmao.site/assets/textures/waternormals.jpg', function(texture) {

                                texture.wrapS = texture.wrapT = Three.RepeatWrapping;

                            }),
                            sunDirection: new Three.Vector3(),
                            sunColor: 0xffffff,
                            waterColor: 0x001e0f,
                            alpha: 0.5,
                            distortionScale: 3.7,
                            fog: scene.fog !== undefined
                        }
                    );

                    water.rotation.x = -Math.PI / 2;
                    scene.add(water);


                    // Skybox
                    const sky = new Sky();
                    sky.scale.setScalar(10000);
                    scene.add(sky);

                    const skyUniforms = sky.material.uniforms;

                    skyUniforms[ 'turbidity' ].value = 10;
                    skyUniforms[ 'rayleigh' ].value = 2;
                    skyUniforms[ 'mieCoefficient' ].value = 0.005;
                    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

                    const parameters = {
                        elevation: 2,
                        azimuth: 180
                    };

                    const pmremGenerator = new Three.PMREMGenerator(renderer);

                    function updateSun() {

                        const phi = Three.MathUtils.degToRad(90 - parameters.elevation);
                        const theta = Three.MathUtils.degToRad(parameters.azimuth);

                        sun.setFromSphericalCoords(1, phi, theta);

                        sky.material.uniforms[ 'sunPosition' ].value.copy(sun);
                        water.material.uniforms[ 'sunDirection' ].value.copy(sun).normalize();

                        scene.environment = pmremGenerator.fromScene(sky).texture;

                    }

                    updateSun();

                    //

                    const geometry = new Three.BoxGeometry(30, 30, 30);
                    const material = new Three.MeshStandardMaterial({ roughness: 0 });

                    mesh = new Three.Mesh(geometry, material);
                    scene.add(mesh);

                    //

                    controls = new OrbitControls(camera, renderer.domElement);
                    controls.maxPolarAngle = Math.PI * 0.495;
                    controls.target.set(0, 10, 0);
                    controls.minDistance = 40.0;
                    controls.maxDistance = 200.0;
                    controls.update();

                    //

                    stats = new Stats();
                    container.appendChild(stats.dom);

                    // GUI

                    const gui = new dat.GUI();

                    const folderSky = gui.addFolder('Sky');
                    folderSky.add(parameters, 'elevation', 0, 90, 0.1).onChange(updateSun);
                    folderSky.add(parameters, 'azimuth', -180, 180, 0.1).onChange(updateSun);
                    folderSky.open();

                    const waterUniforms = water.material.uniforms;

                    const folderWater = gui.addFolder('Water');
                    folderWater.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('distortionScale');
                    folderWater.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('size');
                    folderWater.open();

                    //

                    window.addEventListener('resize', onWindowResize);

                }

                function onWindowResize() {

                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();

                    renderer.setSize(window.innerWidth, window.innerHeight);

                }

                function animate() {

                    requestAnimationFrame(animate);
                    render();
                    stats.update();

                }

                function render() {

                    const time = performance.now() * 0.001;

                    mesh.position.y = Math.sin(time) * 20 + 5;
                    mesh.rotation.x = time * 0.5;
                    mesh.rotation.z = time * 0.51;

                    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

                    renderer.render(scene, camera);

                }
            },
            // 指针锁定控制器
            initPointer() {
                let camera, scene, renderer, controls;

                const objects = [];

                let raycaster;

                let moveForward = false;
                let moveBackward = false;
                let moveLeft = false;
                let moveRight = false;
                let canJump = false;

                let prevTime = performance.now();
                const velocity = new Three.Vector3();
                const direction = new Three.Vector3();
                const vertex = new Three.Vector3();
                const color = new Three.Color();

                init();
                animate();

                function init() {

                    camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
                    camera.position.y = 10;

                    scene = new Three.Scene();
                    scene.background = new Three.Color(0xffffff);
                    scene.fog = new Three.Fog(0xffffff, 0, 750);

                    const light = new Three.HemisphereLight(0xeeeeff, 0x777788, 0.75);
                    light.position.set(0.5, 1, 0.75);
                    scene.add(light);

                    controls = new PointerLockControls(camera, document.body);

                    const blocker = document.getElementById('blocker');
                    const instructions = document.getElementById('instructions');

                    instructions.addEventListener('click', function() {
                        controls.lock();
                    });

                    controls.addEventListener('lock', function() {
                        instructions.style.display = 'none';
                        blocker.style.display = 'none';
                    });

                    controls.addEventListener('unlock', function() {
                        blocker.style.display = 'flex';
                        instructions.style.display = '';
                    });

                    // controls.getObject()返回的是PointerLockControls构造函数传入的camera
                    scene.add(controls.getObject());

                    const onKeyDown = function(event) {
                        console.log(event)
                        switch (event.code) {

                        case 'ArrowUp':
                        case 'KeyW':
                            moveForward = true;
                            break;

                        case 'ArrowLeft':
                        case 'KeyA':
                            moveLeft = true;
                            break;

                        case 'ArrowDown':
                        case 'KeyS':
                            moveBackward = true;
                            break;

                        case 'ArrowRight':
                        case 'KeyD':
                            moveRight = true;
                            break;

                        case 'Space':
                            if (canJump === true) velocity.y += 350;
                            canJump = false;
                            break;

                        }

                    };

                    const onKeyUp = function(event) {

                        switch (event.code) {

                        case 'ArrowUp':
                        case 'KeyW':
                            moveForward = false;
                            break;

                        case 'ArrowLeft':
                        case 'KeyA':
                            moveLeft = false;
                            break;

                        case 'ArrowDown':
                        case 'KeyS':
                            moveBackward = false;
                            break;

                        case 'ArrowRight':
                        case 'KeyD':
                            moveRight = false;
                            break;

                        }

                    };

                    document.addEventListener('keydown', onKeyDown);
                    document.addEventListener('keyup', onKeyUp);

                    raycaster = new Three.Raycaster(new Three.Vector3(), new Three.Vector3(0, -1, 0), 0, 10);

                    // floor

                    let floorGeometry = new Three.PlaneBufferGeometry(1, 1, 2, 2);
                    floorGeometry.rotateX(-Math.PI / 2);

                    // vertex displacement
                    let position = floorGeometry.attributes.position;
                    console.log('==1==')
                    console.log(floorGeometry)

                    for (let i = 0, l = position.count; i < l; i++) {

                        vertex.fromBufferAttribute(position, i);

                        vertex.x += Math.random() * 20 - 10;
                        vertex.y += Math.random() * 2;
                        vertex.z += Math.random() * 20 - 10;

                        position.setXYZ(i, vertex.x, vertex.y, vertex.z);

                    }

                    floorGeometry = floorGeometry.toNonIndexed() // ensure each face has unique vertices

                    position = floorGeometry.attributes.position;
                    const colorsFloor = [];

                    for (let i = 0, l = position.count; i < l; i++) {

                        color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
                        colorsFloor.push(color.r, color.g, color.b);

                    }

                    floorGeometry.setAttribute('color', new Three.Float32BufferAttribute(colorsFloor, 3));

                    const floorMaterial = new Three.MeshBasicMaterial({ vertexColors: true });

                    const floor = new Three.Mesh(floorGeometry, floorMaterial);
                    scene.add(floor);

                    // objects

                    const boxGeometry = new Three.BoxBufferGeometry(20, 20, 20).toNonIndexed();

                    position = boxGeometry.attributes.position;
                    const colorsBox = [];

                    for (let i = 0, l = position.count; i < l; i++) {

                        color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
                        colorsBox.push(color.r, color.g, color.b);

                    }

                    boxGeometry.setAttribute('color', new Three.Float32BufferAttribute(colorsBox, 3));

                    for (let i = 0; i < 500; i++) {

                        const boxMaterial = new Three.MeshPhongMaterial({ specular: 0xffffff, flatShading: true, vertexColors: true });
                        boxMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

                        const box = new Three.Mesh(boxGeometry, boxMaterial);
                        box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
                        box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
                        box.position.z = Math.floor(Math.random() * 20 - 10) * 20;

                        scene.add(box);
                        objects.push(box);

                    }

                    //

                    renderer = new Three.WebGLRenderer({ antialias: true });
                    renderer.setPixelRatio(window.devicePixelRatio);
                    renderer.setSize(window.innerWidth, window.innerHeight);
                    document.body.appendChild(renderer.domElement);

                    //

                    window.addEventListener('resize', onWindowResize);

                }

                function onWindowResize() {

                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();

                    renderer.setSize(window.innerWidth, window.innerHeight);

                }

                function animate() {

                    requestAnimationFrame(animate);

                    const time = performance.now();

                    if (controls.isLocked === true) {

                        raycaster.ray.origin.copy(controls.getObject().position);
                        raycaster.ray.origin.y -= 10;

                        const intersections = raycaster.intersectObjects(objects);

                        const onObject = intersections.length > 0;

                        const delta = (time - prevTime) / 1000;

                        velocity.x -= velocity.x * 10.0 * delta;
                        velocity.z -= velocity.z * 10.0 * delta;

                        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

                        direction.z = Number(moveForward) - Number(moveBackward);
                        direction.x = Number(moveRight) - Number(moveLeft);
                        direction.normalize(); // this ensures consistent movements in all directions

                        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
                        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

                        if (onObject === true) {

                            velocity.y = Math.max(0, velocity.y);
                            canJump = true;

                        }

                        controls.moveRight(-velocity.x * delta);
                        controls.moveForward(-velocity.z * delta);

                        controls.getObject().position.y += (velocity.y * delta); // new behavior

                        if (controls.getObject().position.y < 10) {

                            velocity.y = 0;
                            controls.getObject().position.y = 10;

                            canJump = true;

                        }

                    }

                    prevTime = time;

                    renderer.render(scene, camera);

                }
            },
            // 设置元素全屏
            setFullScreen(element) {
                var el = document.documentElement
                var rfs = el.requestFullscreen ||
                    el.webkitRequestFullscreen ||
                    el.mozRequestFullScreen ||
                    el.msRequestFullscreen;
                if (rfs) {
                    rfs.call(el);
                } else if (window.ActiveXObject) {
                    var ws = new ActiveXObject('WScript.Shell');
                    ws && ws.SendKeys('{F11}');
                }
            },
            initDrag() {
                let container;
                let camera, scene, renderer;
                let controls, group;
                let enableSelection = false;
                const objects = [];
                const mouse = new Three.Vector2(); const raycaster = new Three.Raycaster();

                init();

                function init() {
                    container = document.createElement('div');
                    document.body.appendChild(container);

                    camera = new Three.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 5000);
                    camera.position.z = 1000;

                    scene = new Three.Scene();
                    scene.background = new Three.Color(0xf0f0f0);

                    scene.add(new Three.AmbientLight(0x505050));

                    const light = new Three.SpotLight(0xffffff, 1.5);
                    light.position.set(0, 500, 2000);
                    light.angle = Math.PI / 9;

                    light.castShadow = true;
                    light.shadow.camera.near = 1000;
                    light.shadow.camera.far = 4000;
                    light.shadow.mapSize.width = 1024;
                    light.shadow.mapSize.height = 1024;

                    scene.add(light);

                    group = new Three.Group();
                    scene.add(group);

                    const geometry = new Three.BoxGeometry(40, 40, 40);

                    for (let i = 0; i < 100; i++) {

                        const object = new Three.Mesh(geometry, new Three.MeshLambertMaterial({ color: Math.random() * 0xffffff }));

                        object.position.x = Math.random() * 1000 - 500;
                        object.position.y = Math.random() * 600 - 300;
                        object.position.z = Math.random() * 800 - 400;

                        object.rotation.x = Math.random() * 2 * Math.PI;
                        object.rotation.y = Math.random() * 2 * Math.PI;
                        object.rotation.z = Math.random() * 2 * Math.PI;

                        object.scale.x = Math.random() * 2 + 1;
                        object.scale.y = Math.random() * 2 + 1;
                        object.scale.z = Math.random() * 2 + 1;

                        object.castShadow = true;
                        object.receiveShadow = true;

                        scene.add(object);

                        objects.push(object);

                    }

                    renderer = new Three.WebGLRenderer({ antialias: true });
                    // 设置设备像素比，通常用于避免HiDPI设备上绘图模糊
                    renderer.setPixelRatio(window.devicePixelRatio);
                    renderer.setSize(window.innerWidth, window.innerHeight);

                    renderer.shadowMap.enabled = true;
                    renderer.shadowMap.type = Three.PCFShadowMap;

                    container.appendChild(renderer.domElement);

                    controls = new DragControls([... objects], camera, renderer.domElement);
                    // 拖拽过程中也进行渲染
                    controls.addEventListener('drag', render);

                    window.addEventListener('resize', onWindowResize);
                    document.addEventListener('click', onClick);
                    window.addEventListener('keydown', onKeyDown);
                    window.addEventListener('keyup', onKeyUp);

                    render();

                }

                function onWindowResize() {

                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();

                    renderer.setSize(window.innerWidth, window.innerHeight);

                    render();

                }

                // keyCode = 16: shift键
                function onKeyDown(event) {
                    enableSelection = (event.keyCode === 16);
                }

                function onKeyUp() {
                    enableSelection = false;
                }

                function onClick(event) {

                    event.preventDefault();

                    console.log('=====')
                    console.log(enableSelection)

                    if (enableSelection === true) {

                        // 此时获取到的是通过DragControls添加的所有可拖拽对象，即循环渲染中的100个方块网格
                        const draggableObjects = controls.getObjects();
                        draggableObjects.length = 0;

                        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

                        raycaster.setFromCamera(mouse, camera);

                        const intersections = raycaster.intersectObjects(objects, true);
                        console.log('intersections: ', intersections)

                        if (intersections.length > 0) {

                            // 获取鼠标所指的第一个网格对象
                            const object = intersections[ 0 ].object;

                            if (group.children.includes(object) === true) {
                                // attach ( object : Object3D ) : this
                                // Object3D对象中的方法 attach：将object作为子级来添加到该对象中，同时保持该object的世界变换
                                object.material.emissive.set(0x000000);
                                scene.attach(object);

                            } else {

                                object.material.emissive.set(0xaaaaaa);
                                group.attach(object);

                            }

                            // 以网格组的形式进行拖拽
                            controls.transformGroup = true;
                            draggableObjects.push(group);

                        }
                        // 拖拽单个网格对象
                        if (group.children.length === 0) {
                            controls.transformGroup = false;
                            draggableObjects.push(...objects);
                        }
                    }

                    render();

                }

                function render() {

                    renderer.render(scene, camera);

                }
            },

            initSound() {
                let container;
                let camera, controls, scene, renderer;
                let light, pointLight;

                let mesh;
                let material_sphere1, material_sphere2;

                const clock = new Three.Clock();

                init();
                animate();

                function init() {
                    container = document.getElementById('container');
                    renderer = new Three.WebGLRenderer({ antialias: true });
                    renderer.setSize(window.innerWidth, window.innerHeight);

                    camera = new Three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
                    camera.position.set(-200, 25, 0);

                    const listener1 = new Three.AudioListener();
                    camera.add(listener1);
                    const listener2 = new Three.AudioListener();
                    camera.add(listener2);
                    const listener3 = new Three.AudioListener();
                    camera.add(listener3);

                    controls = new FirstPersonControls(camera, renderer.domElement);

                    controls.movementSpeed = 10;
                    controls.lookSpeed = 0.05;
                    controls.noFly = false;
                    controls.lookVertical = false;
                    // controls.autoForward = false
                    controls.activeLook = true
                    controls.mouseDragOn = false

                    scene = new Three.Scene();
                    scene.fog = new Three.FogExp2(0x000000, 0.0035);

                    light = new Three.DirectionalLight(0xffffff);
                    light.position.set(0, 0.5, 1).normalize();
                    scene.add(light);

                    const cube = new Three.BoxGeometry(40, 40, 40);

                    const material_1 = new Three.MeshBasicMaterial({
                        color: 0xffffff,
                        map: new TextureLoader().load('http://shanmao.site/assets/textures/animals/cow.png')
                    });

                    const material_2 = new Three.MeshBasicMaterial({
                        color: 0xffffff,
                        map: new TextureLoader().load('http://shanmao.site/assets/textures/animals/dog.jpg')
                    });

                    const material_3 = new Three.MeshBasicMaterial({
                        color: 0xffffff,
                        map: new TextureLoader().load('http://shanmao.site/assets/textures/animals/cat.jpg')
                    });

                    // sound spheres

                    const mesh1 = new Three.Mesh(cube, material_1);
                    mesh1.position.set(0, 20, 100);
                    const mesh2 = new Three.Mesh(cube, material_2);
                    mesh2.position.set(0, 20, 0);
                    const mesh3 = new Three.Mesh(cube, material_3);
                    mesh3.position.set(0, 20, -100);

                    scene.add(mesh1);
                    scene.add(mesh2);
                    scene.add(mesh3);

                    const posSound1 = new Three.PositionalAudio(listener1)
                    const posSound2 = new Three.PositionalAudio(listener2)
                    const posSound3 = new Three.PositionalAudio(listener3)

                    const audioLoader = new Three.AudioLoader();
                    audioLoader.load('http://shanmao.site/assets/audio/cow.ogg', function(buffer) {
                        posSound1.setBuffer(buffer);
                        posSound1.setRefDistance(30);
                        posSound1.play();
                        posSound1.setRolloffFactor(10);
                        posSound1.setLoop(true)
                    })

                    audioLoader.load('http://shanmao.site/assets/audio/dog.ogg', function(buffer) {
                        posSound2.setBuffer(buffer);
                        posSound2.setRefDistance(30);
                        posSound2.play();
                        posSound2.setRolloffFactor(10);
                        posSound2.setLoop(true)
                    })

                    audioLoader.load('http://shanmao.site/assets/audio/cat.ogg', function(buffer) {
                        posSound3.setBuffer(buffer);
                        posSound3.setRefDistance(30);
                        posSound3.play();
                        posSound3.setRolloffFactor(10);
                        posSound3.setLoop(true)
                    })

                    // ground

                    const helper = new Three.GridHelper(500, 10);
                    // helper.color1.setHex(0x444444);
                    // helper.color2.setHex(0x444444);
                    helper.position.y = 0.1;
                    scene.add(helper);

                    container.innerHTML = '';
                    container.appendChild(renderer.domElement);
                    window.addEventListener('resize', onWindowResize, false);
                }

                function onWindowResize() {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                    controls.handleResize();
                }

                function animate() {
                    requestAnimationFrame(animate);
                    render();
                }
                function render() {

                    const delta = clock.getDelta();
                    const time = clock.getElapsedTime() * 5;

                    controls.update(delta);
                    renderer.render(scene, camera);
                }
            },
            // 使用掩码在指定场景渲染通道
            initStarrySky() {
                const stats = initStats();

                // create a scene, that will hold all our elements such as objects, cameras and lights.
                const sceneEarth = new Three.Scene();
                const sceneMars = new Three.Scene();
                const sceneBG = new Three.Scene();

                // create a camera, which defines where we're looking at.
                const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
                // 使用OrthographicCamera添加背景图片，也可以直接使用场景的背景属性添加星光背景图片
                // sceneBG.background = new TextureLoader().load('http://shanmao.site/assets/textures/starry-deep-outer-space-galaxy.jpg')
                const cameraBG = new Three.OrthographicCamera(-window.innerWidth, window.innerWidth, window.innerHeight, -window.innerHeight, -10000, 10000);
                console.log('====')
                console.log(cameraBG)
                cameraBG.position.z = 50;

                // create a render and set the size
                const webGLRenderer = new Three.WebGLRenderer();
                webGLRenderer.setSize(window.innerWidth, window.innerHeight);
                webGLRenderer.shadowMap.enabled = true;

                const sphere = createEarthMesh(new Three.SphereGeometry(10, 40, 40));
                sphere.position.x = -10;
                const sphere2 = createMarshMesh(new Three.SphereGeometry(5, 40, 40));
                sphere2.position.x = 10;
                sceneEarth.add(sphere);
                sceneMars.add(sphere2);

                // position and point the camera to the center of the scene
                camera.position.x = -10;
                camera.position.y = 15;
                camera.position.z = 25;

                camera.lookAt(new Three.Vector3(0, 0, 0));

                const orbitControls = new OrbitControls(camera, webGLRenderer.domElement);
                orbitControls.autoRotate = false;
                const clock = new Three.Clock();

                const ambi = new Three.AmbientLight(0x181818);
                const ambi2 = new Three.AmbientLight(0x181818);
                sceneEarth.add(ambi);
                sceneMars.add(ambi2);

                const spotLight = new Three.DirectionalLight(0xffffff);
                spotLight.position.set(550, 100, 550);
                spotLight.intensity = 0.6;

                const spotLight2 = new Three.DirectionalLight(0xffffff);
                spotLight.position.set(550, 100, 550);
                spotLight.intensity = 0.6;

                sceneEarth.add(spotLight);
                sceneMars.add(spotLight2);

                const materialColor = new Three.MeshBasicMaterial({
                    map: new TextureLoader().load('http://shanmao.site/assets/textures/starry-deep-outer-space-galaxy.jpg'),
                    depthTest: false
                });
                const bgPlane = new Three.Mesh(new Three.PlaneGeometry(1, 1), materialColor);
                bgPlane.position.z = -100;
                bgPlane.scale.set(window.innerWidth * 2, window.innerHeight * 2, 1);
                sceneBG.add(bgPlane);

                // add the output of the renderer to the html element
                document.getElementById('container').appendChild(webGLRenderer.domElement);

                const bgPass = new RenderPass(sceneBG, cameraBG);
                const renderPass = new RenderPass(sceneEarth, camera);
                renderPass.clear = false;
                const renderPass2 = new RenderPass(sceneMars, camera);
                renderPass2.clear = false;


                const effectCopy = new ShaderPass(CopyShader);
                effectCopy.renderToScreen = true;


                const clearMask = new ClearMaskPass();
                // earth mask
                const earthMask = new MaskPass(sceneEarth, camera);
                earthMask.inverse = true;
                // mars mask
                const marsMask = new MaskPass(sceneMars, camera);
                // marsMask.inverse = true;


                const effectSepia = new ShaderPass(SepiaShader);
                effectSepia.uniforms['amount'].value = 0.8;

                const effectColorify = new ShaderPass(ColorifyShader);
                effectColorify.uniforms['color'].value.setRGB(0.5, 0.5, 1);


                const composer = new EffectComposer(webGLRenderer);
                composer.renderTarget1.stencilBuffer = true;
                composer.renderTarget2.stencilBuffer = true;

                composer.addPass(bgPass);
                composer.addPass(renderPass);
                composer.addPass(renderPass2);
                composer.addPass(marsMask);
                composer.addPass(effectColorify);
                composer.addPass(clearMask);
                composer.addPass(earthMask);
                composer.addPass(effectSepia);
                composer.addPass(clearMask);
                composer.addPass(effectCopy);

                render();

                function createMarshMesh(geom) {
                    const planetTexture = new TextureLoader().load('http://shanmao.site/assets/textures/planets/Mars_2k-050104.png')
                    const normalTexture = new TextureLoader().load('http://shanmao.site/assets/textures/planets/Mars-normalmap_2k.png')

                    const planetMaterial = new Three.MeshPhongMaterial();
                    planetMaterial.normalMap = normalTexture;
                    planetMaterial.map = planetTexture;
                    //               planetMaterial.shininess = 150;


                    // create a multimaterial
                    const mesh = SceneUtils.createMultiMaterialObject(geom, [planetMaterial]);

                    return mesh;
                }

                function createEarthMesh(geom) {
                    const planetTexture = new TextureLoader().load('http://shanmao.site/assets/textures/planets/Earth.png')
                    const specularTexture = new TextureLoader().load('http://shanmao.site/assets/textures/planets/EarthSpec.png')
                    const normalTexture = new TextureLoader().load('http://shanmao.site/assets/textures/planets/EarthNormal.png')


                    const planetMaterial = new Three.MeshPhongMaterial();
                    planetMaterial.specularMap = specularTexture;
                    planetMaterial.specular = new Three.Color(0x4444aa);


                    planetMaterial.normalMap = normalTexture;
                    planetMaterial.map = planetTexture;
                    //               planetMaterial.shininess = 150;


                    // create a multimaterial
                    const mesh = SceneUtils.createMultiMaterialObject(geom, [planetMaterial]);

                    return mesh;
                }

                function render() {

                    webGLRenderer.autoClear = false;

                    stats.update();


                    // sphere.rotation.y=step+=0.01;
                    const delta = clock.getDelta();
                    orbitControls.update(delta);

                    sphere.rotation.y += 0.002;
                    // sphere.rotation.x += 0.002;
                    sphere2.rotation.y += 0.002;
                    // sphere2.rotation.x += 0.002;

                    // render using requestAnimationFrame
                    requestAnimationFrame(render);
                    //            webGLRenderer.render(scene, camera);
                    composer.render(delta);
                }

                function initStats() {

                    const stats = new Stats();
                    stats.setMode(0); // 0: fps, 1: ms

                    // Align top-left
                    stats.domElement.style.position = 'absolute';
                    stats.domElement.style.left = '0px';
                    stats.domElement.style.top = '0px';

                    document.getElementById('container').appendChild(stats.domElement);

                    return stats;
                }
            },
            // 简单的后期通道处理demo
            initComposer() {
                const stats = initStats();
                const scene = new Three.Scene();
                const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

                // create a render and set the size
                const webGLRenderer = new Three.WebGLRenderer();
                // webGLRenderer.setClearColor(new Three.Color(0x000, 1.0));
                webGLRenderer.setSize(window.innerWidth, window.innerHeight);
                webGLRenderer.shadowMap.enabled = true;

                const sphere = createMesh(new Three.SphereGeometry(10, 40, 40));
                // add the sphere to the scene
                scene.add(sphere);

                // position and point the camera to the center of the scene
                camera.position.x = -10;
                camera.position.y = 15;
                camera.position.z = 25;

                camera.lookAt(new Three.Vector3(0, 0, 0));

                const orbitControls = new OrbitControls(camera, webGLRenderer.domElement);
                orbitControls.autoRotate = false;
                const clock = new Three.Clock();

                const ambi = new Three.AmbientLight(0x181818);
                scene.add(ambi);

                const spotLight = new Three.DirectionalLight(0xffffff);
                spotLight.position.set(550, 100, 550);
                spotLight.intensity = 0.6;

                scene.add(spotLight);

                // add the output of the renderer to the html element
                document.getElementById('container').appendChild(webGLRenderer.domElement);

                const renderPass = new RenderPass(scene, camera);
                const effectFilm = new FilmPass(0.8, 0.325, 256, false);
                const bloomPass = new BloomPass(3, 25, 5.0, 256);
                effectFilm.renderToScreen = true;

                const composer = new EffectComposer(webGLRenderer);
                composer.addPass(renderPass);
                composer.addPass(effectFilm);


                // setup the control gui
                const controls = new function() {
                    this.scanlinesCount = 256;
                    this.grayscale = false;
                    this.scanlinesIntensity = 0.3;
                    this.noiseIntensity = 0.8;

                    // bloomPass配置
                    this.strength = 3;
                    this.kernelSize = 25;
                    this.sigma = 5.0;
                    this.resolution = 256;

                    // 使用uniforms和WebGL进行通信，可以直接更改后期处理通道和着色器的配置
                    this.updateEffectFilm = function() {
                        effectFilm.uniforms.grayscale.value = controls.grayscale;
                        effectFilm.uniforms.nIntensity.value = controls.noiseIntensity;
                        effectFilm.uniforms.sIntensity.value = controls.scanlinesIntensity;
                        effectFilm.uniforms.sCount.value = controls.scanlinesCount;
                    };
                }();


                const gui = new dat.GUI();
                gui.add(controls, 'scanlinesIntensity', 0, 1).onChange(controls.updateEffectFilm);
                gui.add(controls, 'noiseIntensity', 0, 3).onChange(controls.updateEffectFilm);
                gui.add(controls, 'grayscale').onChange(controls.updateEffectFilm);
                gui.add(controls, 'scanlinesCount', 0, 2048).step(1).onChange(controls.updateEffectFilm);

                // call the render function
                const step = 0;
                render();

                function createMesh(geom) {
                    // const loader = new TextureLoader();
                    // loader.setCrossOrigin('')

                    const planetTexture = new TextureLoader().load('http://shanmao.site/assets/textures/planets/Earth.png')
                    const specularTexture = new TextureLoader().load('http://shanmao.site/assets/textures/planets/EarthSpec.png')
                    const normalTexture = new TextureLoader().load('http://shanmao.site/assets/textures/planets/EarthNormal.png')


                    const planetMaterial = new Three.MeshPhongMaterial();
                    planetMaterial.specularMap = specularTexture;
                    planetMaterial.specular = new Three.Color(0x4444aa);


                    planetMaterial.normalMap = normalTexture;
                    planetMaterial.map = planetTexture;
                    //               planetMaterial.shininess = 150;


                    // create a multimaterial
                    const mesh = SceneUtils.createMultiMaterialObject(geom, [planetMaterial]);

                    return mesh;
                }

                function render() {
                    stats.update();

                    // sphere.rotation.y=step+=0.01;
                    const delta = clock.getDelta();
                    orbitControls.update(delta);

                    sphere.rotation.y += 0.002;

                    // render using requestAnimationFrame
                    requestAnimationFrame(render);
                    //            webGLRenderer.render(scene, camera);
                    composer.render(delta);
                }

                function initStats() {

                    const stats = new Stats();
                    stats.setMode(0); // 0: fps, 1: ms

                    // Align top-left
                    stats.domElement.style.position = 'absolute';
                    stats.domElement.style.left = '0px';
                    stats.domElement.style.top = '0px';

                    document.getElementById('container').appendChild(stats.domElement);

                    return stats;
                }
            },
            bumpTexture() {
                const stats = initStats();

                // create a scene, that will hold all our elements such as objects, cameras and lights.
                const scene = new Three.Scene();

                // create a camera, which defines where we're looking at.
                const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

                // create a render and set the size
                const webGLRenderer = new Three.WebGLRenderer();
                webGLRenderer.setClearColor(new Three.Color(0xEEEEEE, 1.0));
                webGLRenderer.setSize(window.innerWidth, window.innerHeight);
                webGLRenderer.shadowMapEnabled = true;

                const sphere1 = createMesh(new Three.BoxGeometry(15, 15, 2), '');
                sphere1.rotation.y = -0.5;
                sphere1.position.x = 12;
                scene.add(sphere1);

                const sphere2 = createMesh(new Three.BoxGeometry(15, 15, 2), 'stone.jpg', 'stone-bump.jpg');
                sphere2.rotation.y = 0.5;
                sphere2.position.x = -12;
                scene.add(sphere2);
                console.log(sphere2.geometry.faceVertexUvs);

                const floorTex = new TextureLoader().load('http://testt2.wmnetwork.cc/res/index/banners/meet_cloud.png?ver=4.9.37');
                const plane = new Three.Mesh(new Three.BoxGeometry(200, 100, 0.1, 30), new Three.MeshPhongMaterial({
                    color: 0x3c3c3c,
                    map: floorTex
                }));
                plane.position.y = -7.5;
                plane.rotation.x = -0.5 * Math.PI;
                scene.add(plane);

                // position and point the camera to the center of the scene
                camera.position.x = 0;
                camera.position.y = 12;
                camera.position.z = 28;
                camera.lookAt(new Three.Vector3(0, 0, 0));

                const ambiLight = new Three.AmbientLight(0x242424);
                scene.add(ambiLight);

                const light = new Three.SpotLight();
                light.position.set(0, 30, 30);
                light.intensity = 1.2;
                scene.add(light);

                // add the output of the renderer to the html element
                document.getElementById('container').appendChild(webGLRenderer.domElement);

                // call the render function
                const step = 0;
                // setup the control gui
                const controls = new function() {
                    this.bumpScale = 0.2;
                    this.changeTexture = 'weave';
                    this.rotate = false;

                    this.changeTexture = function(e) {
                        const texture = new TextureLoader().load('http://testt2.wmnetwork.cc/res/index/banners/meet_cloud.png?ver=4.9.37')
                        sphere2.material.map = texture;
                        sphere1.material.map = texture;

                        const bump = new TextureLoader().load('http://testt2.wmnetwork.cc/res/index/banners/meet_cloud.png?ver=4.9.37')
                        sphere2.material.bumpMap = bump;
                    };

                    this.updateBump = function(e) {
                        console.log(sphere2.material.bumpScale);
                        sphere2.material.bumpScale = e;
                    }
                }();


                const gui = new dat.GUI();
                render();

                function createMesh(geom, imageFile, bump) {
                    const texture = new TextureLoader().load('http://testt2.wmnetwork.cc/res/index/banners/meet_cloud.png?ver=4.9.37')
                    geom.computeVertexNormals();
                    const mat = new Three.MeshPhongMaterial();
                    mat.map = texture;

                    if (bump) {
                        const bump = new TextureLoader().load('http://testt2.wmnetwork.cc/res/index/banners/meet_cloud.png?ver=4.9.37')
                        mat.bumpMap = bump;
                        mat.bumpScale = 0.2;
                        console.log('d');
                    }


                    // create a multimaterial
                    const mesh = new Three.Mesh(geom, mat);

                    return mesh;
                }

                function render() {
                    stats.update();

                    if (controls.rotate) {
                        sphere1.rotation.y -= 0.01;
                        sphere2.rotation.y += 0.01;
                    }

                    //            sphere1.rotation.y=step+=0.01;
                    //            sphere1.rotation.x=step;
                    //            sphere2.rotation.y=step;
                    //            sphere2.rotation.x=step;

                    // render using requestAnimationFrame
                    requestAnimationFrame(render);
                    webGLRenderer.render(scene, camera);
                }

                function initStats() {

                    const stats = new Stats();
                    stats.setMode(0); // 0: fps, 1: ms

                    // Align top-left
                    stats.domElement.style.position = 'absolute';
                    stats.domElement.style.left = '0px';
                    stats.domElement.style.top = '0px';

                    document.getElementById('container').appendChild(stats.domElement);

                    return stats;
                }
            },
            morphTarget() {
                const stats = initStats();

                // create a scene, that will hold all our elements such as objects, cameras and lights.
                const scene = new Three.Scene();

                // create a camera, which defines where we're looking at.
                const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);

                // create a render and set the size
                const webGLRenderer = new Three.WebGLRenderer();
                webGLRenderer.setClearColor(new Three.Color(0xEEEEEE, 1.0));
                webGLRenderer.setSize(window.innerWidth, window.innerHeight);
                webGLRenderer.shadowMapEnabled = true;

                // position and point the camera to the center of the scene
                camera.position.x = 250;
                camera.position.y = 250;
                camera.position.z = 350;
                camera.lookAt(new Three.Vector3(100, 50, 0));


                // add spotlight for the shadows
                const spotLight = new Three.DirectionalLight(0xffffff);
                spotLight.position.set(300, 200, 300);
                spotLight.intensity = 1;
                scene.add(spotLight);

                // add the output of the renderer to the html element
                document.getElementById('container').appendChild(webGLRenderer.domElement);

                // call the render function
                const step = 0;


                // setup the control gui
                const controls = new function() {
                    this.keyframe = 0;
                }();

                const gui = new dat.GUI();
                gui.add(controls, 'keyframe', 0, 15).step(1).onChange(function(e) {
                    showFrame(e);
                });
                let mesh;
                let meshAnim;
                const frames = [];
                let currentMesh;
                const clock = new Three.Clock();

                // let loader = new Three.JSONLoader();
                const loader = new Three.ObjectLoader();
                loader.load('../assets/models/horse.json', function(object) {
                    scene.add(object)
                })
                // loader.load('../assets/models/horse.json', function(geometry) {
                //
                //   let mat = new Three.MeshLambertMaterial(
                //     {
                //       morphTargets: true,
                //       vertexColors: Three.FaceColors
                //     });
                //
                //
                //   let mat2 = new Three.MeshLambertMaterial(
                //     { color: 0xffffff, vertexColors: Three.FaceColors });
                //
                //   mesh = new Three.Mesh(geometry, mat);
                //   mesh.position.x = -100;
                //   frames.push(mesh);
                //   currentMesh = mesh;
                //   morphColorsToFaceColors(geometry);
                //
                //   mesh.geometry.morphTargets.forEach(function(e) {
                //     let geom = new Three.Geometry();
                //     geom.vertices = e.vertices;
                //     geom.faces = geometry.faces;
                //
                //
                //     let morpMesh = new Three.Mesh(geom, mat2);
                //     frames.push(morpMesh);
                //     morpMesh.position.x = -100;
                //
                //   });
                //
                //   geometry.computeVertexNormals();
                //   geometry.computeFaceNormals();
                //   geometry.computeMorphNormals();
                //
                //   meshAnim = new Three.MorphAnimMesh(geometry, mat);
                //   meshAnim.duration = 1000;
                //   meshAnim.position.x = 200;
                //   meshAnim.position.z = 0;
                //
                //   scene.add(meshAnim);
                //
                //   showFrame(0);
                //
                // });

                function showFrame(e) {
                    scene.remove(currentMesh);
                    scene.add(frames[e]);
                    currentMesh = frames[e];
                    console.log(currentMesh);
                }

                function morphColorsToFaceColors(geometry) {

                    if (geometry.morphColors && geometry.morphColors.length) {

                        const colorMap = geometry.morphColors[0];
                        for (let i = 0; i < colorMap.colors.length; i++) {
                            geometry.faces[i].color = colorMap.colors[i];
                            geometry.faces[i].color.offsetHSL(0, 0.3, 0);
                        }
                    }
                }

                render();

                function render() {
                    stats.update();

                    const delta = clock.getDelta();
                    webGLRenderer.clear();
                    if (meshAnim) {
                        meshAnim.updateAnimation(delta * 1000);
                        meshAnim.rotation.y += 0.01;
                    }
                    // render using requestAnimationFrame


                    requestAnimationFrame(render);
                    webGLRenderer.render(scene, camera);
                }

                function initStats() {

                    const stats = new Stats();
                    stats.setMode(0); // 0: fps, 1: ms


                    // Align top-left
                    stats.domElement.style.position = 'absolute';
                    stats.domElement.style.left = '0px';
                    stats.domElement.style.top = '0px';

                    document.getElementById('container').appendChild(stats.domElement);

                    return stats;
                }
            },
            initOrbit() {
                const stats = initStats();

                // create a scene, that will hold all our elements such as objects, cameras and lights.
                const scene = new Three.Scene();

                // create a camera, which defines where we're looking at.
                const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

                // create a render and set the size
                const webGLRenderer = new Three.WebGLRenderer();
                webGLRenderer.setClearColor(new Three.Color(0x000, 1.0));
                webGLRenderer.setSize(window.innerWidth, window.innerHeight);
                webGLRenderer.shadowMap.enabled = true;

                const sphere = createMesh(new Three.SphereGeometry(20, 40, 40));
                // add the sphere to the scene
                scene.add(sphere);

                // position and point the camera to the center of the scene
                camera.position.x = -20;
                camera.position.y = 30;
                camera.position.z = 40;
                camera.lookAt(new Three.Vector3(0, 0, 0));

                const orbitControls = new OrbitControls(camera, webGLRenderer.domElement);
                orbitControls.autoRotate = true;
                const clock = new Three.Clock();

                const ambiLight = new Three.AmbientLight(0x111111);
                scene.add(ambiLight);
                const spotLight = new Three.DirectionalLight(0xffffff);
                spotLight.position.set(-20, 30, 40);
                spotLight.intensity = 1.5;
                scene.add(spotLight);

                // add the output of the renderer to the html element
                document.getElementById('container').appendChild(webGLRenderer.domElement);

                // call the render function
                const step = 0;

                render();

                function createMesh(geom) {
                    // const planetTexture = Three.ImageUtils.loadTexture('../assets/textures/planets/mars_1k_color.jpg');
                    const normalTexture = Three.ImageUtils.loadTexture('../assets/textures/planets/mars_1k_normal.jpg');

                    const textLoader = new Three.TextureLoader()
                    const planetTexture = textLoader.load('http://testt2.wmnetwork.cc/res/index/banners/meet_cloud.png?ver=4.9.37');
                    console.log(planetTexture)

                    planetTexture.wrapS = Three.RepeatWrapping;
                    planetTexture.wrapT = Three.RepeatWrapping;
                    planetTexture.repeat.set(1, 1);

                    const planeMaterial = new Three.MeshLambertMaterial({ map: planetTexture });

                    // const planetMaterial = new Three.MeshPhongMaterial({ map: planetTexture, bumpMap: normalTexture });


                    const wireFrameMat = new Three.MeshBasicMaterial();
                    wireFrameMat.wireframe = true;

                    // create a multimaterial
                    const mesh = new Three.Mesh(geom, planeMaterial);
                    // const mesh = SceneUtils.createMultiMaterialObject(geom, [planeMaterial, wireFrameMat]);
                    return mesh;
                }

                function render() {
                    stats.update();
                    const delta = clock.getDelta();
                    orbitControls.update(delta);

                    // render using requestAnimationFrame
                    requestAnimationFrame(render);
                    webGLRenderer.render(scene, camera);
                }

                function initStats() {

                    const stats = new Stats();
                    stats.setMode(0); // 0: fps, 1: ms

                    // Align top-left
                    stats.domElement.style.position = 'absolute';
                    stats.domElement.style.left = '0px';
                    stats.domElement.style.top = '0px';

                    document.getElementById('container').appendChild(stats.domElement);
                    return stats;
                }
            },
            //  ?未完成
            initTweenPoint() {
                const stats = initStats();

                // create a scene, that will hold all our elements such as objects, cameras and lights.
                const scene = new Three.Scene();

                // create a camera, which defines where we're looking at.
                const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

                // create a render and set the size
                const webGLRenderer = new Three.WebGLRenderer();
                webGLRenderer.setClearColor(new Three.Color(0x000, 1.0));
                webGLRenderer.setSize(window.innerWidth, window.innerHeight);
                webGLRenderer.shadowMap.enabled = true;

                // position and point the camera to the center of the scene
                camera.position.x = 10;
                camera.position.y = 10;
                camera.position.z = 10;
                camera.lookAt(new Three.Vector3(0, -2, 0));

                // add spotlight for the shadows
                const spotLight = new Three.SpotLight(0xffffff);
                spotLight.position.set(20, 20, 20);
                scene.add(spotLight);

                // add the output of the renderer to the html element
                document.getElementById('container').appendChild(webGLRenderer.domElement);

                // call the render function
                const step = 0;


                // setup the control gui
                const controls = new function() {
                    // we need the first child, since it's a multimaterial
                }();

                let pointCloud = new Three.Object3D();
                let loadedGeometry;


                // create a tween
                // http://sole.github.io/tween.js/examples/03_graphs.html
                const posSrc = { pos: 1 };
                const tween = new TWEEN.Tween(posSrc).to({ pos: 0 }, 5000);
                tween.easing(TWEEN.Easing.Sinusoidal.InOut);

                const tweenBack = new TWEEN.Tween(posSrc).to({ pos: 1 }, 5000);
                tweenBack.easing(TWEEN.Easing.Sinusoidal.InOut);

                tween.chain(tweenBack);
                tweenBack.chain(tween);


                const onUpdate = function() {
                    let count = 0;
                    const pos = this.pos;

                    loadedGeometry.groups.forEach(function(e) {
                        const newY = ((e.y + 3.22544) * pos) - 3.22544;
                        pointCloud.geometry.groups[count++].set(e.x, newY, e.z);
                    });

                    pointCloud.sortParticles = true;
                };

                tween.onUpdate(onUpdate);
                tweenBack.onUpdate(onUpdate);


                const gui = new dat.GUI();


                const loader = new PLYLoader();

                loader.load('../assets/models/test.ply', function(geometry) {
                    loadedGeometry = geometry.clone();
                    console.log('===');
                    console.log(loadedGeometry)

                    const material = new Three.PointCloudMaterial({
                        color: 0xffffff,
                        size: 0.4,
                        opacity: 0.6,
                        transparent: true,
                        blending: Three.AdditiveBlending,
                        map: generateSprite()
                    });

                    pointCloud = new Three.PointCloud(geometry, material);
                    pointCloud.sortParticles = true;

                    tween.start();
                    scene.add(pointCloud);
                });


                render();

                // from THREE.js examples
                function generateSprite() {

                    const canvas = document.createElement('canvas');
                    canvas.width = 16;
                    canvas.height = 16;

                    const context = canvas.getContext('2d');
                    const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
                    gradient.addColorStop(0, 'rgba(255,255,255,1)');
                    gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
                    gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
                    gradient.addColorStop(1, 'rgba(0,0,0,1)');

                    context.fillStyle = gradient;
                    context.fillRect(0, 0, canvas.width, canvas.height);

                    const texture = new Three.Texture(canvas);
                    texture.needsUpdate = true;
                    return texture;

                }

                function render() {
                    stats.update();
                    TWEEN.update();
                    requestAnimationFrame(render);
                    webGLRenderer.render(scene, camera);
                }

                function initStats() {

                    const stats = new Stats();
                    stats.setMode(0); // 0: fps, 1: ms

                    // Align top-left
                    stats.domElement.style.position = 'absolute';
                    stats.domElement.style.left = '0px';
                    stats.domElement.style.top = '0px';

                    document.getElementById('container').appendChild(stats.domElement);

                    return stats;
                }
            },
            //  使用Projector和Three.Raycaster来检测是否使用鼠标点击了某个对象
            getSelectObject() {
                const stats = initStats();

                // create a scene, that will hold all our elements such as objects, cameras and lights.
                const scene = new Three.Scene();

                // create a camera, which defines where we're looking at.
                const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

                // create a render and set the size
                const renderer = new Three.WebGLRenderer();

                renderer.setClearColor(new Three.Color(0xEEEEEE, 1.0));
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.shadowMap.enabled = true

                document.addEventListener('mousedown', onDocumentMouseDown, false);
                document.addEventListener('mousemove', onDocumentMouseMove, false);

                // create the ground plane
                const planeGeometry = new Three.PlaneGeometry(60, 20, 1, 1);
                const planeMaterial = new Three.MeshLambertMaterial({ color: 0xffffff });
                const plane = new Three.Mesh(planeGeometry, planeMaterial);
                plane.receiveShadow = true

                plane.rotation.x = -0.5 * Math.PI;
                plane.position.x = 15;
                plane.position.y = 0;
                plane.position.z = 0;

                // add the plane to the scene
                scene.add(plane);

                // create a cube
                const cubeGeometry = new Three.BoxGeometry(4, 4, 4);
                const cubeMaterial = new Three.MeshLambertMaterial({ color: 0xff0000 });
                const cube = new Three.Mesh(cubeGeometry, cubeMaterial);
                cube.castShadow = true

                // position the cube
                cube.position.x = -9;
                cube.position.y = 3;
                cube.position.z = 0;

                // add the cube to the scene
                scene.add(cube);

                const sphereGeometry = new Three.SphereGeometry(4, 20, 20);
                const sphereMaterial = new Three.MeshLambertMaterial({ color: 0x7777ff });
                const sphere = new Three.Mesh(sphereGeometry, sphereMaterial);

                // position the sphere
                sphere.position.x = 20;
                sphere.position.y = 0;
                sphere.position.z = 2;
                // add the sphere to the scene
                scene.add(sphere);
                sphere.castShadow = true

                const cylinderGeometry = new Three.CylinderGeometry(2, 2, 20);
                const cylinderMaterial = new Three.MeshLambertMaterial({ color: 0x77ff77 });
                const cylinder = new Three.Mesh(cylinderGeometry, cylinderMaterial);

                cylinder.position.set(0, 0, 1);

                scene.add(cylinder);


                // position and point the camera to the center of the scene
                camera.position.x = -30;
                camera.position.y = 40;
                camera.position.z = 30;
                camera.lookAt(scene.position);

                // add subtle ambient lighting
                const ambientLight = new Three.AmbientLight(0x0c0c0c);
                scene.add(ambientLight);

                // add spotlight for the shadows
                const spotLight = new Three.SpotLight(0xffffff);
                spotLight.position.set(-40, 60, -10);
                spotLight.castShadow = true

                scene.add(spotLight);

                // add the output of the renderer to the html element
                document.getElementById('container').appendChild(renderer.domElement);

                // call the render function
                let step = 0;
                let scalingStep = 0;

                const controls = new function() {
                    this.rotationSpeed = 0.02;
                    this.bouncingSpeed = 0.03;
                    this.scalingSpeed = 0.03;
                    this.showRay = false;
                }();

                const gui = new dat.GUI();
                gui.add(controls, 'rotationSpeed', 0, 0.5);
                gui.add(controls, 'bouncingSpeed', 0, 0.5);
                gui.add(controls, 'scalingSpeed', 0, 0.5);
                gui.add(controls, 'showRay').onChange(function(e) {
                    if (tube) scene.remove(tube)
                });

                render();

                function render() {
                    stats.update();
                    // rotate the cube around its axes
                    cube.rotation.x += controls.rotationSpeed;
                    cube.rotation.y += controls.rotationSpeed;
                    cube.rotation.z += controls.rotationSpeed;

                    // bounce the sphere up and down
                    step += controls.bouncingSpeed;
                    sphere.position.x = 20 + (10 * (Math.cos(step)));
                    sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

                    // scale the cylinder

                    scalingStep += controls.scalingSpeed;
                    const scaleX = Math.abs(Math.sin(scalingStep / 4));
                    const scaleY = Math.abs(Math.cos(scalingStep / 5));
                    const scaleZ = Math.abs(Math.sin(scalingStep / 7));
                    cylinder.scale.set(scaleX, scaleY, scaleZ);

                    // render using requestAnimationFrame
                    renderer.render(scene, camera);
                    requestAnimationFrame(render);

                }

                const projector = new Projector();
                let tube;

                function onDocumentMouseDown(event) {
                    //  通过鼠标点击的位置计算raycaster所需要的点的位置，以屏幕中心为原点，x和y值的范围均为-1到1
                    //  点击位置距离屏幕左上角距离/屏幕的大小 得出点击位置占全屏幕宽的百分比，转换成在屏幕中心为原点，-1到1范围内的坐标
                    let vector = new Three.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);

                    vector = vector.unproject(camera);

                    const raycaster = new Three.Raycaster(camera.position, vector.sub(camera.position).normalize());

                    const intersects = raycaster.intersectObjects([sphere, cylinder, cube]);

                    if (intersects.length > 0) {


                        intersects[0].object.material.transparent = true;
                        intersects[0].object.material.opacity = 0.1;
                    }
                }

                function onDocumentMouseMove(event) {
                    if (controls.showRay) {
                        let vector = new Three.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
                        vector = vector.unproject(camera);

                        const raycaster = new Three.Raycaster(camera.position, vector.sub(camera.position).normalize());
                        const intersects = raycaster.intersectObjects([sphere, cylinder, cube]);

                        if (intersects.length > 0) {

                            const points = [];
                            points.push(new Three.Vector3(-30, 39.8, 30));
                            points.push(intersects[0].point);

                            const mat = new Three.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.6 });
                            const tubeGeometry = new Three.TubeGeometry(new Three.SplineCurve3(points), 60, 0.001);

                            if (tube) scene.remove(tube);

                            if (controls.showRay) {
                                tube = new Three.Mesh(tubeGeometry, mat);
                                scene.add(tube);
                            }
                        }
                    }
                }

                function initStats() {

                    const stats = new Stats();

                    stats.setMode(0); // 0: fps, 1: ms

                    // Align top-left
                    stats.domElement.style.position = 'absolute';
                    stats.domElement.style.left = '0px';
                    stats.domElement.style.top = '0px';

                    document.getElementById('container').appendChild(stats.domElement);

                    return stats;
                }
            },
            //  pointCloud
            initPoints() {
                const stats = initStats();

                // create a scene, that will hold all our elements such as objects, cameras and lights.
                const scene = new Three.Scene();

                // create a camera, which defines where we're looking at.
                const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

                // create a render and set the size
                const webGLRenderer = new Three.WebGLRenderer();
                webGLRenderer.setClearColor(new Three.Color(0x000000, 1.0));
                webGLRenderer.setSize(window.innerWidth, window.innerHeight);

                // position and point the camera to the center of the scene
                camera.position.x = 0;
                camera.position.y = 0;
                camera.position.z = 150;

                // add the output of the renderer to the html element
                document.getElementById('container').appendChild(webGLRenderer.domElement);

                createParticles();
                render();

                function createParticles() {
                    const geom = new Three.Geometry();
                    const material = new Three.PointCloudMaterial({ size: 4, vertexColors: true, color: 0xffffff });

                    for (let x = -5; x < 5; x++) {
                        for (let y = -5; y < 5; y++) {
                            const particle = new Three.Vector3(x * 10, y * 10, 0);
                            geom.vertices.push(particle);
                            geom.colors.push(new Three.Color(Math.random() * 0x00ffff));
                        }
                    }

                    const cloud = new Three.PointCloud(geom, material);
                    scene.add(cloud);
                }
                function render() {
                    stats.update();
                    requestAnimationFrame(render);
                    webGLRenderer.render(scene, camera);
                }

                function initStats() {

                    const stats = new Stats();
                    stats.setMode(0); // 0: fps, 1: ms

                    // Align top-left
                    stats.domElement.style.position = 'absolute';
                    stats.domElement.style.left = '0px';
                    stats.domElement.style.top = '0px';

                    document.getElementById('container').appendChild(stats.domElement);

                    return stats;
                }
            },
            //  创建法向量
            initNormalMaterial() {
                const stats = initStats();

                // create a scene, that will hold all our elements such as objects, cameras and lights.
                const scene = new Three.Scene();

                // create a camera, which defines where we're looking at.
                const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

                // create a render and set the size
                let renderer;
                const webGLRenderer = new Three.WebGLRenderer();
                webGLRenderer.setClearColor(new Three.Color(0xEEEEEE, 1.0));
                webGLRenderer.setSize(window.innerWidth, window.innerHeight);
                webGLRenderer.shadowMap.enabled = true;


                // let canvasRenderer = new Three.CanvasRenderer();
                // canvasRenderer.setSize(window.innerWidth, window.innerHeight);
                renderer = webGLRenderer;

                const groundGeom = new Three.PlaneGeometry(100, 100, 4, 4);
                const groundMesh = new Three.Mesh(groundGeom, new Three.MeshBasicMaterial({ color: 0x777777 }));
                groundMesh.rotation.x = -Math.PI / 2;
                groundMesh.position.y = -20;
                scene.add(groundMesh);

                const sphereGeometry = new Three.SphereGeometry(14, 20, 20);
                const cubeGeometry = new Three.BoxGeometry(15, 15, 15);
                const planeGeometry = new Three.PlaneGeometry(14, 14, 4, 4);


                const meshMaterial = new Three.MeshNormalMaterial({ color: 0x7777ff });
                let sphere = new Three.Mesh(sphereGeometry, meshMaterial);
                let cube = new Three.Mesh(cubeGeometry, meshMaterial);
                let plane = new Three.Mesh(planeGeometry, meshMaterial);

                // position the sphere
                sphere.position.x = 0;
                sphere.position.y = 3;
                sphere.position.z = 2;

                console.log('======')
                console.log(sphere);

                // 生成每个面的法线
                // 每个面face中包含了构成该面的顶点在vertices中的索引
                // 通过centroid.add方法将当前三个点的x,y,z坐标分别相加
                for (let f = 0, fl = sphere.geometry.faces.length; f < fl; f++) {
                    const face = sphere.geometry.faces[f];
                    const centroid = new Three.Vector3(0, 0, 0);
                    centroid.add(sphere.geometry.vertices[face.a]);
                    centroid.add(sphere.geometry.vertices[face.b]);
                    centroid.add(sphere.geometry.vertices[face.c]);
                    console.log(centroid)
                    centroid.divideScalar(3);

                    const arrow = new Three.ArrowHelper(
                        face.normal,
                        centroid,
                        2,
                        0x3333FF,
                        0.5,
                        0.5);
                    sphere.add(arrow);
                }


                cube.position.set(sphere.position.x, sphere.position.y, sphere.position.z);
                plane.position.set(sphere.position.x, sphere.position.y, sphere.position.z);


                // add the sphere to the scene
                scene.add(cube);

                // position and point the camera to the center of the scene
                camera.position.x = -20;
                camera.position.y = 30;
                camera.position.z = 40;
                camera.lookAt(new Three.Vector3(10, 0, 0));

                // add subtle ambient lighting
                const ambientLight = new Three.AmbientLight(0x0c0c0c);
                scene.add(ambientLight);

                // add spotlight for the shadows
                const spotLight = new Three.SpotLight(0xffffff);
                spotLight.position.set(-40, 60, -10);
                spotLight.castShadow = true;
                scene.add(spotLight);

                // add the output of the renderer to the html element
                document.getElementById('container').appendChild(renderer.domElement);

                // call the render function
                let step = 0;
                const oldContext = null;

                const controls = new function() {
                    this.rotationSpeed = 0.02;
                    this.bouncingSpeed = 0.03;

                    this.opacity = meshMaterial.opacity;
                    this.transparent = meshMaterial.transparent;

                    this.visible = meshMaterial.visible;
                    this.side = 'front';

                    this.wireframe = meshMaterial.wireframe;
                    this.wireframeLinewidth = meshMaterial.wireframeLinewidth;

                    this.selectedMesh = 'cube';

                    this.shadow = 'flat';

                }();

                const gui = new dat.GUI();


                const spGui = gui.addFolder('Mesh');
                spGui.add(controls, 'opacity', 0, 1).onChange(function(e) {
                    meshMaterial.opacity = e
                });
                spGui.add(controls, 'transparent').onChange(function(e) {
                    meshMaterial.transparent = e
                });
                spGui.add(controls, 'wireframe').onChange(function(e) {
                    meshMaterial.wireframe = e
                });
                spGui.add(controls, 'wireframeLinewidth', 0, 20).onChange(function(e) {
                    meshMaterial.wireframeLinewidth = e
                });
                spGui.add(controls, 'visible').onChange(function(e) {
                    meshMaterial.visible = e
                });
                spGui.add(controls, 'side', ['front', 'back', 'double']).onChange(function(e) {
                    console.log(e);
                    switch (e) {
                    case 'front':
                        meshMaterial.side = Three.FrontSide;
                        break;
                    case 'back':
                        meshMaterial.side = Three.BackSide;
                        break;
                    case 'double':
                        meshMaterial.side = Three.DoubleSide;
                        break;
                    }
                    meshMaterial.needsUpdate = true;

                });
                spGui.add(controls, 'shadow', ['flat', 'smooth']).onChange(function(e) {
                    switch (e) {
                    case 'flat':
                        // https://github.com/mrdoob/three.js/issues/1929
                        meshMaterial.shading = Three.FlatShading;
                        break;
                    case 'smooth':
                        meshMaterial.shading = Three.SmoothShading;
                        break;
                    }

                    const oldPos = sphere.position.clone();
                    scene.remove(sphere);
                    scene.remove(plane);
                    scene.remove(cube);
                    sphere = new Three.Mesh(sphere.geometry.clone(), meshMaterial);
                    cube = new Three.Mesh(cube.geometry.clone(), meshMaterial);
                    plane = new Three.Mesh(plane.geometry.clone(), meshMaterial);

                    sphere.position.set(oldPos.x, oldPos.y, oldPos.z);
                    cube.position.set(oldPos.x, oldPos.y, oldPos.z);
                    plane.position.set(oldPos.x, oldPos.y, oldPos.z);

                    switch (controls.selectedMesh) {
                    case 'cube':
                        scene.add(cube);

                        break;
                    case 'sphere':
                        scene.add(sphere);

                        break;
                    case 'plane':
                        scene.add(plane);
                        break;

                    }

                    meshMaterial.needsUpdate = true;
                });

                spGui.add(controls, 'selectedMesh', ['cube', 'sphere', 'plane']).onChange(function(e) {

                    scene.remove(plane);
                    scene.remove(cube);
                    scene.remove(sphere);


                    switch (e) {
                    case 'cube':
                        scene.add(cube);

                        break;
                    case 'sphere':
                        scene.add(sphere);

                        break;
                    case 'plane':
                        scene.add(plane);
                        break;

                    }

                    scene.add(e);
                });

                render();

                function render() {
                    stats.update();

                    cube.rotation.y = step += 0.01;
                    plane.rotation.y = step;
                    sphere.rotation.y = step;


                    // render using requestAnimationFrame
                    requestAnimationFrame(render);
                    renderer.render(scene, camera);
                }

                function initStats() {

                    const stats = new Stats();

                    stats.setMode(0); // 0: fps, 1: ms


                    // Align top-left
                    stats.domElement.style.position = 'absolute';
                    stats.domElement.style.left = '0px';
                    stats.domElement.style.top = '0px';

                    document.getElementById('container').appendChild(stats.domElement);

                    return stats;
                }
            },
            //  半球光，更贴近环境光
            initHemiLight() {
                const stats = initStats();

                // create a scene, that will hold all our elements such as objects, cameras and lights.
                const scene = new Three.Scene();
                scene.fog = new Three.Fog(0xaaaaaa, 0.010, 200);

                // create a camera, which defines where we're looking at.
                const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);


                // create a render and set the size
                const renderer = new Three.WebGLRenderer();

                renderer.setClearColor(new Three.Color(0xaaaaff, 1.0));
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.shadowMap.enabled = true;


                // create the ground plane
                const textureGrass = Three.ImageUtils.loadTexture('../assets/textures/ground/grasslight-big.jpg');
                textureGrass.wrapS = Three.RepeatWrapping;
                textureGrass.wrapT = Three.RepeatWrapping;
                textureGrass.repeat.set(4, 4);


                const planeGeometry = new Three.PlaneGeometry(1000, 200, 20, 20);
                const planeMaterial = new Three.MeshLambertMaterial({ map: textureGrass });
                //        let planeMaterial = new Three.MeshLambertMaterial();
                const plane = new Three.Mesh(planeGeometry, planeMaterial);
                plane.receiveShadow = true;

                // rotate and position the plane
                plane.rotation.x = -0.5 * Math.PI;
                plane.position.x = 15;
                plane.position.y = 0;
                plane.position.z = 0;

                // add the plane to the scene
                scene.add(plane);

                // create a cube
                const cubeGeometry = new Three.BoxGeometry(4, 4, 4);
                const cubeMaterial = new Three.MeshLambertMaterial({ color: 0xff3333 });
                const cube = new Three.Mesh(cubeGeometry, cubeMaterial);
                cube.castShadow = true;

                // position the cube
                cube.position.x = -4;
                cube.position.y = 3;
                cube.position.z = 0;

                // add the cube to the scene
                scene.add(cube);

                const sphereGeometry = new Three.SphereGeometry(4, 25, 25);
                const sphereMaterial = new Three.MeshLambertMaterial({ color: 0x7777ff });
                const sphere = new Three.Mesh(sphereGeometry, sphereMaterial);

                // position the sphere
                sphere.position.x = 10;
                sphere.position.y = 5;
                sphere.position.z = 10;
                sphere.castShadow = true;

                // add the sphere to the scene
                scene.add(sphere);

                // position and point the camera to the center of the scene
                camera.position.x = -20;
                camera.position.y = 15;
                camera.position.z = 45;
                //        camera.position.x = -120;
                //        camera.position.y = 165;
                //        camera.position.z = 145;
                camera.lookAt(new Three.Vector3(10, 0, 0));


                // add spotlight for a bit of light
                const spotLight0 = new Three.SpotLight(0xcccccc);
                spotLight0.position.set(-40, 60, -10);
                spotLight0.lookAt(plane);
                scene.add(spotLight0);


                // let target = new Three.Object3D();
                // target.position.set(5, 0, 0)

                const hemiLight = new Three.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
                hemiLight.position.set(0, 500, 0);
                scene.add(hemiLight);


                const pointColor = '#ffffff';
                //    let dirLight = new THREE.SpotLight( pointColor);
                const dirLight = new Three.DirectionalLight(pointColor);
                dirLight.position.set(30, 10, -50);
                dirLight.castShadow = true;
                //        dirLight.shadowCameraNear = 0.1;
                //        dirLight.shadowCameraFar = 100;
                //        dirLight.shadowCameraFov = 50;
                dirLight.target = plane;
                dirLight.shadowCameraNear = 0.1;
                dirLight.shadowCameraFar = 200;
                dirLight.shadowCameraLeft = -50;
                dirLight.shadowCameraRight = 50;
                dirLight.shadowCameraTop = 50;
                dirLight.shadowCameraBottom = -50;
                dirLight.shadowMapWidth = 2048;
                dirLight.shadowMapHeight = 2048;


                scene.add(dirLight);


                // add the output of the renderer to the html element
                document.getElementById('container').appendChild(renderer.domElement);

                // call the render function
                let step = 0;

                // used to determine the switch point for the light animation
                const invert = 1;
                const phase = 0;

                const controls = new function() {
                    this.rotationSpeed = 0.03;
                    this.bouncingSpeed = 0.03;

                    this.hemisphere = true;
                    this.color = 0x00ff00;
                    this.skyColor = 0x0000ff;
                    this.intensity = 0.6;

                }();

                const gui = new dat.GUI();

                gui.add(controls, 'hemisphere').onChange(function(e) {

                    if (!e) {
                        hemiLight.intensity = 0;
                    } else {
                        hemiLight.intensity = controls.intensity;
                    }
                });
                gui.addColor(controls, 'color').onChange(function(e) {
                    hemiLight.groundColor = new Three.Color(e);
                });
                gui.addColor(controls, 'skyColor').onChange(function(e) {
                    hemiLight.color = new Three.Color(e);
                });
                gui.add(controls, 'intensity', 0, 5).onChange(function(e) {
                    hemiLight.intensity = e;
                });

                render();

                function render() {
                    stats.update();
                    // rotate the cube around its axes
                    cube.rotation.x += controls.rotationSpeed;
                    cube.rotation.y += controls.rotationSpeed;
                    cube.rotation.z += controls.rotationSpeed;

                    // bounce the sphere up and down
                    step += controls.bouncingSpeed;
                    sphere.position.x = 20 + (10 * (Math.cos(step)));
                    sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

                    requestAnimationFrame(render);
                    renderer.render(scene, camera);
                }

                function initStats() {

                    const stats = new Stats();

                    stats.setMode(0); // 0: fps, 1: ms

                    // Align top-left
                    stats.domElement.style.position = 'absolute';
                    stats.domElement.style.left = '0px';
                    stats.domElement.style.top = '0px';

                    document.getElementById('container').appendChild(stats.domElement);

                    return stats;
                }
            },
            //  环境光demo
            initAmbientLight() {
                const stats = initStats();

                // create a scene, that will hold all our elements such as objects, cameras and lights.
                const scene = new Three.Scene();

                // create a camera, which defines where we're looking at.
                const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

                // create a render and set the size
                const renderer = new Three.WebGLRenderer();

                renderer.setClearColor(new Three.Color(0xEEEEEE, 1.0));
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.shadowMapEnabled = true;

                // create the ground plane
                const planeGeometry = new Three.PlaneGeometry(60, 20, 1, 1);
                const planeMaterial = new Three.MeshLambertMaterial({ color: 0xffffff });
                const plane = new Three.Mesh(planeGeometry, planeMaterial);
                plane.receiveShadow = true;

                // rotate and position the plane
                plane.rotation.x = -0.5 * Math.PI;
                plane.position.x = 15;
                plane.position.y = 0;
                plane.position.z = 0;

                // add the plane to the scene
                scene.add(plane);

                // create a cube
                const cubeGeometry = new Three.BoxGeometry(4, 4, 4);
                const cubeMaterial = new Three.MeshLambertMaterial({ color: 0xff0000 });
                const cube = new Three.Mesh(cubeGeometry, cubeMaterial);
                cube.castShadow = true;

                // position the cube
                cube.position.x = -4;
                cube.position.y = 3;
                cube.position.z = 0;

                // add the cube to the scene
                scene.add(cube);

                const sphereGeometry = new Three.SphereGeometry(4, 20, 20);
                const sphereMaterial = new Three.MeshLambertMaterial({ color: 0x7777ff });
                const sphere = new Three.Mesh(sphereGeometry, sphereMaterial);

                // position the sphere
                sphere.position.x = 20;
                sphere.position.y = 0;
                sphere.position.z = 2;
                sphere.castShadow = true;

                // add the sphere to the scene
                scene.add(sphere);

                // position and point the camera to the center of the scene
                camera.position.x = -25;
                camera.position.y = 30;
                camera.position.z = 25;
                camera.lookAt(new Three.Vector3(10, 0, 0));

                // add subtle ambient lighting
                const ambiColor = '#0c0c0c';
                const ambientLight = new Three.AmbientLight(ambiColor);
                scene.add(ambientLight);

                // add spotlight for the shadows
                const spotLight = new Three.SpotLight(0xffffff);
                spotLight.position.set(-40, 60, -10);
                spotLight.castShadow = true;
                scene.add(spotLight);

                const helper = new Three.SpotLightHelper(spotLight);
                scene.add(helper);


                // 调试投影
                // let debugCamera = new Three.CameraHelper(spotLight.shadow.camera);
                // scene.add(debugCamera)

                // add the output of the renderer to the html element
                document.getElementById('container').appendChild(renderer.domElement);

                // call the render function
                let step = 0;

                const controls = new function() {
                    this.rotationSpeed = 0.02;
                    this.bouncingSpeed = 0.03;
                    this.ambientColor = ambiColor;
                    this.disableSpotlight = false;
                }();

                const gui = new dat.GUI();
                gui.addColor(controls, 'ambientColor').onChange(function(e) {
                    ambientLight.color = new Three.Color(e);
                });
                gui.add(controls, 'disableSpotlight').onChange(function(e) {
                    spotLight.visible = !e;
                });


                render();

                function render() {
                    helper.update();
                    stats.update();
                    // rotate the cube around its axes
                    cube.rotation.x += controls.rotationSpeed;
                    cube.rotation.y += controls.rotationSpeed;
                    cube.rotation.z += controls.rotationSpeed;

                    // bounce the sphere up and down
                    step += controls.bouncingSpeed;
                    sphere.position.x = 20 + (10 * (Math.cos(step)));
                    sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

                    // render using requestAnimationFrame
                    requestAnimationFrame(render);
                    renderer.render(scene, camera);
                }

                function initStats() {

                    const stats = new Stats();

                    stats.setMode(0); // 0: fps, 1: ms

                    // Align top-left
                    stats.domElement.style.position = 'absolute';
                    stats.domElement.style.left = '0px';
                    stats.domElement.style.top = '0px';

                    document.getElementById('container').appendChild(stats.domElement);

                    return stats;
                }
            },
            initDemo() {
                const stats = initStats();

                // create a scene, that will hold all our elements such as objects, cameras and lights.
                const scene = new Three.Scene();

                // create a camera, which defines where we're looking at.
                const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
                scene.add(camera);

                // create a render and set the size
                const renderer = new Three.WebGLRenderer();

                renderer.setClearColor(new Three.Color(0xEEEEEE, 1.0));
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.shadowMap.enabled = true;

                // create the ground plane
                const planeGeometry = new Three.PlaneGeometry(60, 40, 1, 1);
                const planeMaterial = new Three.MeshLambertMaterial({ color: 0xffffff });
                const plane = new Three.Mesh(planeGeometry, planeMaterial);
                plane.receiveShadow = true;

                // rotate and position the plane
                plane.rotation.x = -0.5 * Math.PI;
                plane.position.x = 0;
                plane.position.y = 0;
                plane.position.z = 0;

                // add the plane to the scene
                scene.add(plane);

                // position and point the camera to the center of the scene
                camera.position.x = -30;
                camera.position.y = 40;
                camera.position.z = 30;
                camera.lookAt(scene.position);

                // add subtle ambient lighting
                const ambientLight = new Three.AmbientLight(0x0c0c0c);
                scene.add(ambientLight);

                // add spotlight for the shadows
                const spotLight = new Three.SpotLight(0xffffff);
                spotLight.position.set(-40, 60, -10);
                spotLight.castShadow = true;
                scene.add(spotLight);

                // add the output of the renderer to the html element
                document.getElementById('container').appendChild(renderer.domElement);

                // call the render function
                const step = 0;

                const controls = new function() {
                    this.rotationSpeed = 0.02;
                    this.numberOfObjects = scene.children.length;

                    this.removeCube = function() {
                        const allChildren = scene.children;
                        const lastObject = allChildren[allChildren.length - 1];
                        if (lastObject instanceof Three.Mesh) {
                            scene.remove(lastObject);
                            this.numberOfObjects = scene.children.length;
                        }
                    };

                    this.addCube = function() {

                        const cubeSize = Math.ceil((Math.random() * 3));
                        const cubeGeometry = new Three.BoxGeometry(cubeSize, cubeSize, cubeSize);
                        const cubeMaterial = new Three.MeshLambertMaterial({ color: Math.random() * 0xffffff });
                        const cube = new Three.Mesh(cubeGeometry, cubeMaterial);
                        cube.castShadow = true;
                        cube.name = 'cube-' + scene.children.length;


                        // position the cube randomly in the scene

                        cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
                        cube.position.y = Math.round((Math.random() * 5));
                        cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

                        // add the cube to the scene
                        scene.add(cube);
                        this.numberOfObjects = scene.children.length;
                    };

                    this.outputObjects = function() {
                        console.log(scene.children);
                    }
                }();

                const gui = new dat.GUI();
                gui.add(controls, 'rotationSpeed', 0, 0.5);
                gui.add(controls, 'addCube');
                gui.add(controls, 'removeCube');
                gui.add(controls, 'outputObjects');
                gui.add(controls, 'numberOfObjects').listen();

                render();

                function render() {
                    stats.update();

                    // rotate the cubes around its axes
                    scene.traverse(function(e) {
                        if (e instanceof Three.Mesh && e != plane) {

                            e.rotation.x += controls.rotationSpeed;
                            e.rotation.y += controls.rotationSpeed;
                            e.rotation.z += controls.rotationSpeed;
                        }
                    });

                    // render using requestAnimationFrame
                    requestAnimationFrame(render);
                    renderer.render(scene, camera);
                }

                function initStats() {

                    const stats = new Stats();

                    stats.setMode(0); // 0: fps, 1: ms

                    // Align top-left
                    stats.domElement.style.position = 'absolute';
                    stats.domElement.style.left = '0px';
                    stats.domElement.style.top = '0px';

                    document.getElementById('container').appendChild(stats.domElement);

                    return stats;
                }
            },
            initShadowDemo() {
                const scene = new Three.Scene();
                const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
                const renderer = new Three.WebGL1Renderer();
                renderer.setClearColor(new Three.Color(0x000000));
                renderer.setSize(window.innerWidth, window.innerHeight);
                const axes = new Three.AxesHelper(20);
                scene.add(axes);

                const planeGeometry = new Three.PlaneGeometry(120, 40);
                const planeMaterial = new Three.MeshLambertMaterial({
                    color: 0xAAAAAA
                });

                const plane = new Three.Mesh(planeGeometry, planeMaterial);
                plane.rotation.x = -0.5 * Math.PI;
                plane.position.set(15, 0, 0);
                scene.add(plane);

                const cubeGeometry = new Three.BoxGeometry(6, 6, 6);
                const cubeMaterial = new Three.MeshLambertMaterial({
                    color: 0xFF0000,
                    wireframe: false
                });
                const cube = new Three.Mesh(cubeGeometry, cubeMaterial);
                cube.position.set(-4, 3, 0);
                scene.add(cube);

                const sphereGeometry = new Three.SphereGeometry(6, 20, 20);
                const sphereMaterial = new Three.MeshLambertMaterial({
                    color: 0x7777FF,
                    wireframe: false
                });
                const sphere = new Three.Mesh(sphereGeometry, sphereMaterial);
                sphere.position.set(20, 4, 2);
                scene.add(sphere);

                camera.position.set(-30, 40, 30);
                camera.lookAt(scene.position);

                const spotLight = new Three.SpotLight(0xFFFFFF);
                spotLight.position.set(-40, 40, -15);
                // 启用阴影功能
                spotLight.castShadow = true;
                spotLight.shadow.mapSize = new Three.Vector2(1024, 1024);
                spotLight.shadow.camera.far = 130;
                spotLight.shadow.camera.near = 40;
                scene.add(spotLight)

                document.getElementById('container').appendChild(renderer.domElement);
                // 设置接受和投射阴影的物体
                plane.receiveShadow = true;
                cube.castShadow = true;
                sphere.castShadow = true;
                spotLight.castShadow = true;
                renderer.shadowMap.enabled = true;

                // 添加动画控制面板
                const controls = new function() {
                    this.rotationSpeed = 0.02;
                    this.bounceSpeed = 0.02;
                }()
                const gui = new dat.GUI();
                gui.add(controls, 'rotationSpeed', 0, 0.5);
                gui.add(controls, 'bounceSpeed', 0, 0.5);

                const state = initState();
                renderScene()

                function renderScene() {
                    state.update();
                    cube.rotation.x += controls.rotationSpeed;
                    cube.rotation.y += controls.rotationSpeed;
                    cube.rotation.z += controls.rotationSpeed;
                    requestAnimationFrame(renderScene);
                    renderer.render(scene, camera)
                }
                function initState() {
                    const stats = new Stats();
                    stats.showPanel(0); // 0:fps 1:ms 2:mb 3+:custom
                    document.body.appendChild(stats.dom)
                    return stats
                }
                function onResize() {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                }
                // listen to the resize events
                window.addEventListener('resize', onResize, false);
            },
            initStars() {
                const canvas = document.querySelector('#canvasElem4');
                const ctx = canvas.getContext('2d');

                let W = canvas.width = window.innerWidth;
                const H = canvas.height = 600;

                const mouse = C.getOffSet(canvas);
                let hx; let hy; const f1 = 250;
                const maxZ = 1200; // 小球z坐标最远超过1200时进行重新绘制
                let particles = []; // 粒子保存数组
                const f = 0.8

                // 动态设置画布尺寸， 以及隐藏点坐标
                window.onresize = function() {
                    W = canvas.width = window.innerWidth;
                    hx = W / 2;
                    hy = H / 2;
                    createParticles(W * H / 3200)
                }

                function createParticles(num) {
                    // 窗口大小变化时，重新绘制粒子
                    if (particles.length != num) {
                        particles = [];
                    }
                    for (let i = 0; i < num; i++) {
                        particles.push(new Ball({
                            x3d: C.randomNum([-1.5 * W, 2 * W]),
                            y3d: C.randomNum([-1.5 * W, 2 * W]),
                            z3d: C.randomNum([0, maxZ]),
                            r: 10,
                            vz: C.randomNum([-2, 2]), // z轴上的速度
                            az: C.randomNum([-2, -1]) // z轴上的加速度
                        }))
                    }
                }

                window.onresize();

                function move(p) {
                    p.vz += p.az;
                    p.vz *= f;
                    p.z3d += p.vz

                    // 粒子运动到视点时，重制粒子至消失点
                    if (p.z3d < -f1) {
                        p.z3d += maxZ;
                    }

                    // 三维运动缩放比
                    const scale = f1 / (f1 + p.z3d);
                    p.scaleX = p.scaleY = scale;

                    // 粒子在画布中的真实坐标
                    p.x = hx + p.x3d * scale;
                    p.y = hy + p.y3d * scale;

                    p.alpha = Math.min(Math.abs(scale) * 1.5, 1)

                }

                function drawStar(p) {
                    p.render(ctx)
                }

                // 排序
                function zSort(a, b) {
                    return b.z3d - a.z3d
                }

                (function draw() {
                    window.requestAnimationFrame(draw)

                    ctx.clearRect(0, 0, W, H);

                    particles.forEach(move);
                    particles.forEach(zSort);
                    particles.forEach(drawStar);
                })()
            },
            initParticles() {
                const canvas = document.querySelector('#canvasElem3');
                const ctx = canvas.getContext('2d');

                let W = canvas.width = window.innerWidth;
                const H = canvas.height = 600;

                const mouse = C.getOffSet(canvas);

                const particles = []; const spring = 0.0001;

                function reCreate() {
                    W = canvas.width = window.innerWidth;
                    createParticles(W * H / 10000);
                }

                reCreate()
                window.onresize = reCreate

                function createParticles(num) {
                    // 窗口大小改变后，先清空粒子数组
                    if (num !== particles.length) {
                        particles.length = 0;
                    }
                    for (let i = 0; i < num; i++) {
                        particles.push(new Ball({
                            x: C.randomNum([0, W]),
                            y: C.randomNum([0, H]),
                            fillStyle: '#fff',
                            vx: C.randomNum([-2, 2]),
                            vy: C.randomNum([-2, 2]),
                            r: C.randomNum([3, 10])
                        }))
                    }
                }

                // 绘制粒子
                function draw(particle) {
                    particle.render(ctx);
                }

                // 绘制粒子连线，粒子距离越远线条越细
                function drawLine(current, target, dist, minDist) {
                    ctx.save();
                    ctx.lineWidth = 2 * Math.max(0, (1 - dist / minDist));
                    ctx.globalAlpha = Math.max(0, (1 - dist / minDist));
                    ctx.strokeStyle = '#fff';
                    ctx.beginPath();
                    ctx.lineTo(current.x, current.y);
                    ctx.lineTo(target.x, target.y);
                    ctx.stroke();
                    ctx.restore();
                }

                function checkSpring(current, target) {
                    // 两个粒子之间的距离
                    const dx = target.x - current.x;
                    const dy = target.y - current.y;
                    const dist = Math.sqrt(dx ** 2 + dy ** 2);

                    // 设置最小距离，当两个粒子之间的距离小于最小距离进行弹动，并绘制连线
                    const minDist = W / 10;
                    if (dist < minDist) {
                        drawLine(current, target, dist, minDist);
                        const ax = dx * spring;
                        const ay = dy * spring;
                        current.vx += ax;
                        current.vy += ay;
                        target.vx -= ax;
                        target.vy -= ay;
                    }
                }

                function move(particle, i) {
                    particle.x += particle.vx;
                    particle.y += particle.vy;

                    // 粒子之间的碰撞处理，target保存需要和当前粒子进行碰撞检测的目标粒子
                    for (let j = i + 1; j < particles.length; j++) {
                        const target = particles[j];
                        checkSpring(particle, target)
                    }

                    // 边界处理，超过某侧边界后会从另外一侧出现
                    if (particle.x - particle.r > W) {
                        particle.x = -particle.r;
                    } else if (particle.x + particle.r < 0) {
                        particle.x = W + particle.r;
                    }
                    if (particle.y - particle.r > H) {
                        particle.y = -particle.r;
                    } else if (particle.y + particle.r < 0) {
                        particle.y = H + particle.r;
                    }
                }

                (function drawFrame() {
                    window.requestAnimationFrame(drawFrame);

                    ctx.clearRect(0, 0, W, H);

                    particles.forEach(move)
                    particles.forEach(draw)
                })()
            },
            springBall() {
                const canvas = document.querySelector('#canvasElem1');
                const ctx = canvas.getContext('2d');

                const W = canvas.width = window.innerWidth;
                const H = canvas.height = 600;

                const mouse = C.getOffSet(canvas);

                // 小球模拟喷泉
                const balls = [];
                const g = 0.05;
                for (let i = 0; i < 100; i++) {
                    balls.push(new Ball({
                        x: W / 2,
                        y: H,
                        r: Math.random() > 0.9 ? C.randomNum([25, 40]) : C.randomNum([15, 30]),
                        fillStyle: C.randomColor(),
                        vx: C.randomNum([-3, 3]),
                        vy: C.randomNum([0, -10])
                    }))
                }
                const that = this;
                function drawBall(ball) {
                    ball.x += ball.vx;
                    ball.y += ball.vy;
                    ball.vy += g;
                    // 超过边界后初始化
                    if (ball.x - ball.r >= W || ball.x + ball.r <= 0 || ball.y - ball.r >= H || ball.y + ball.r <= 0) {
                        ball.x = W / 2;
                        ball.y = H;
                        ball.vx = C.randomNum([-3, 3]);
                        ball.vy = C.randomNum([0, -10]);
                    }
                    ball.render(ctx);
                }

                (function move() {
                    window.requestAnimationFrame(move);
                    ctx.clearRect(0, 0, W, H);
                    balls.forEach(drawBall);
                })();
            },
            drawBall() {
                const canvas = document.querySelector('#canvasElem2');
                const ctx = canvas.getContext('2d');

                const W = canvas.width = window.innerWidth;
                const H = canvas.height = 600;

                const mouse = C.getOffSet(canvas);
                const _that = this;
                // 小球散落
                const ballList = []; const num = 200; const g = 0.2; const bounce = -0.8;
                const floor = 300; // 小球落地高度
                const f1 = 250; // 视距
                const hx = W / 2; const hy = H / 2; // 消失点
                const ballColor = ctx.createRadialGradient(0, 0, 0, 0, 0, 10);
                ballColor.addColorStop(0, 'rgb(255, 255, 255)');
                ballColor.addColorStop(0.3, 'rgba(0, 255, 240, 1)');
                ballColor.addColorStop(0.5, 'rgba(0, 240, 255, 1)');
                ballColor.addColorStop(0.8, 'rgba(0, 110, 255, 0.8)');
                ballColor.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
                for (let i = 0; i < num; i++) {
                    ballList.push(new Ball({
                        y3d: -200,
                        r: 10,
                        fillStyle: ballColor,
                        vx: C.randomNum([-6, 6]),
                        vy: C.randomNum([-3, -6]),
                        vz: C.randomNum([-5, 5])
                    }))
                }
                function move(ball) {
                    ball.vy += g;
                    ball.x3d += ball.vx;
                    ball.y3d += ball.vy;
                    ball.z3d += ball.vz;
                    if (ball.y3d > floor) {
                        ball.y3d = floor;
                        ball.vy *= bounce;
                    }
                    if (ball.z3d > -f1) {
                        const scale = f1 / (f1 + ball.z3d);
                        ball.scaleX = ball.scaleY = scale;
                        ball.x = hx + ball.x3d * scale;
                        ball.y = hy + ball.y3d * scale;
                        ball.show = true
                    } else {
                        ball.show = false
                    }
                }
                function draw(ball) {
                    ball.show && ball.render(ctx)
                }
                function zSort(a, b) {
                    return b.z3d - a.z3d
                }
                (function drawBall() {
                    window.requestAnimationFrame(drawBall);
                    ctx.clearRect(0, 0, W, H);
                    ballList.forEach(move);
                    ballList.forEach(zSort);
                    ballList.forEach(draw)
                })();
            },

            initThree() {
                const container = document.getElementById('container');
                const camera = new Three.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 1, 3500);
                camera.position.z = 2750;

                const scene = new Three.Scene();
                scene.fog = new Three.Fog(0x050505, 2000, 3500);

                scene.add(new Three.AmbientLight(0x444444));

                const light1 = new Three.DirectionalLight(0xffffff, 0.5);
                light1.position.set(1, 1, 1);
                const light2 = new Three.DirectionalLight(0xffffff, 1.5);
                light2.position.set(0, -1, 0);
                scene.add(light1);
                scene.add(light2);

                const triangles = 30000;
                const geometry = new Three.BufferGeometry();
                const positions = new Float32Array(triangles * 3 * 3);
                const normals = new Float32Array(triangles * 3 * 3);
                const colors = new Float32Array(triangles * 3 * 3);

                const color = new Three.Color();
                const n = 800; const n2 = n / 2;
                const d = 12; const d2 = d / 2; // individual triangle size

                const pA = new Three.Vector3();
                const pB = new Three.Vector3();
                const pC = new Three.Vector3();

                const cb = new Three.Vector3();
                const ab = new Three.Vector3();

                for (let i = 0; i < positions.length; i += 9) {
                    const x = Math.random() * n - n2;
                    const y = Math.random() * n - n2;
                    const z = Math.random() * n - n2;

                    const ax = x + Math.random() * d - d2;
                    const ay = y + Math.random() * d - d2;
                    const az = z + Math.random() * d - d2;

                    const bx = x + Math.random() * d - d2;
                    const by = y + Math.random() * d - d2;
                    const bz = z + Math.random() * d - d2;

                    const cx = x + Math.random() * d - d2;
                    const cy = y + Math.random() * d - d2;
                    const cz = z + Math.random() * d - d2;

                    positions[i] = ax;
                    positions[i + 1] = ay;
                    positions[i + 2] = az;

                    positions[i + 3] = bx;
                    positions[i + 4] = by;
                    positions[i + 5] = bz;

                    positions[i + 6] = cx;
                    positions[i + 7] = cy;
                    positions[i + 8] = cz;

                    pA.set(ax, ay, az);
                    pB.set(bx, by, bz);
                    pC.set(cx, cy, cz);

                    // 求得每个三角形平面的法向量
                    // 此例中为每个顶点均设置了一个法向量，同一个平面的三个顶点法向量相同
                    cb.subVectors(pC, pB);
                    ab.subVectors(pA, pB);
                    cb.cross(ab);
                    cb.normalize();

                    const nx = cb.x;
                    const ny = cb.y;
                    const nz = cb.z;

                    // 将法向量的x, y, z坐标存放在normals数组中
                    normals[i] = nx;
                    normals[i + 1] = ny;
                    normals[i + 2] = nz;

                    normals[i + 3] = nx;
                    normals[i + 4] = ny;
                    normals[i + 5] = nz;

                    normals[i + 6] = nx;
                    normals[i + 7] = ny;
                    normals[i + 8] = nz;

                    const vx = (x / n) + 0.5;
                    const vy = (y / n) + 0.5;
                    const vz = (z / n) + 0.5;

                    color.setRGB(vx, vy, vz);
                    colors[i] = color.r;
                    colors[i + 1] = color.g;
                    colors[i + 2] = color.b;

                    colors[i + 3] = color.r;
                    colors[i + 4] = color.g;
                    colors[i + 5] = color.b;

                    colors[i + 6] = color.r;
                    colors[i + 7] = color.g;
                    colors[i + 8] = color.b;
                }
                geometry.addAttribute('position', new Three.BufferAttribute(positions, 3));
                geometry.addAttribute('normal', new Three.BufferAttribute(normals, 3));
                geometry.addAttribute('color', new Three.BufferAttribute(colors, 3));

                // 计算包裹该geometry的立方体或长方体大小
                geometry.computeBoundingSphere();

                const materail = new Three.MeshPhongMaterial({
                    color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
                    side: Three.DoubleSide, vertexColors: Three.VertexColors
                });

                const mesh = new Three.Mesh(geometry, materail);
                scene.add(mesh);
                // initTween()

                const renderer = new Three.WebGL1Renderer({ antialias: false });
                renderer.setClearColor(scene.fog.color);
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);

                renderer.gammaInput = true;
                renderer.gammaOutput = true;
                container.appendChild(renderer.domElement);

                // 鼠标拾取 mouse: 当前鼠标坐标
                const rayCaster = new Three.Raycaster();
                const mouse = { x: 0, y: 0 };
                let INTERSECTED;

                window.addEventListener('resize', onWindowResize, false);

                window.addEventListener('mousemove', onDocumentMouseMove, false);
                const that = this;

                // Tween.js动画
                function initTween() {
                    new TWEEN.Tween(mesh.position).to({ x: -400 }, 3000).repeat(Infinity).start()
                }
                function initGrid() {
                    // 网格的边长是1000，每个小网格的边长是50
                    const helper = new Three.GridHelper(1000, 50);
                    helper.setColors(0x0000ff, 0x808080);
                    scene.add(helper);
                }

                function onDocumentMouseMove(event) {
                    event.preventDefault();
                    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
                }

                function onWindowResize() {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                }

                function animate() {
                    requestAnimationFrame(animate);
                    render();
                    TWEEN.update()
                }
                function render() {
                    // 鼠标拾取元素
                    rayCaster.setFromCamera(mouse, camera); // 即获得一条从相机射向鼠标的线段
                    const intersects = rayCaster.intersectObjects(scene.children); // 获取所有添加到scene中的和相机指向鼠标的线段相交的元素
                    //  INTERSECTED 表示当前已选中的相交元素
                    //  该函数限制了只显示相交的第一个元素，并且设置相交元素所高亮显示的颜色
                    if (intersects.length > 0) {
                        if (INTERSECTED != intersects[0].object) {
                            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                            INTERSECTED = intersects[0].object;
                            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                            INTERSECTED.material.emissive.setHex('0xff0000')
                        }
                    } else {
                        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                        INTERSECTED = null
                    }

                    const time = Date.now() * 0.001;
                    mesh.rotation.x = time * 0.25;
                    mesh.rotation.y = time * 0.5;
                    renderer.render(scene, camera);
                }
                animate()
            }

            // vtk兔子模型
            // initVtkRabbit() {
            //   let container, stats;
            //   let camera, scene, renderer;
            //   let cross;
            //   let controls = {}
            //   init();
            //   animate();
            //
            //   function init() {
            //     camera = new Three.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1e10);
            //     camera.position.z = 0.2;
            //
            //     controls.rotateSpeed = 5.0;
            //     controls.zoomSpeed = 5;
            //     controls.panSpeed = 2;
            //
            //     controls.noZoom = false;
            //     controls.noPan = false;
            //
            //     controls.staticMoving = true;
            //     controls.dynamicDampingFactor = 0.3;
            //
            //     scene = new Three.Scene();
            //     scene.add(camera);
            //
            //     // 方向光
            //     let dirLight = new Three.DirectionalLight(0xffffff);
            //     dirLight.position.set(200, 200, 1000).normalize();
            //
            //     camera.add(dirLight);
            //     camera.add(dirLight.target);
            //     // A begin
            //     let material = new Three.MeshLambertMaterial({ color: 0xffffff, side: Three.DoubleSide });
            //     let loader = new Three.VTKLoader();
            //     loader.addEventListener('load', function(event) {
            //       let geometry = event.content;
            //       let mesh = new Three.Mesh(geometry, material);
            //       mesh.position.setY(-0.09);
            //       scene.add(mesh);
            //     });
            //     loader.load('../assets/three/bunny.vtk');
            //     // A end
            //     // renderer
            //     renderer = new Three.WebGLRenderer({ antialias: false });
            //     renderer.setSize(window.innerWidth, window.innerHeight);
            //     container = document.getElementById('container');
            //     container.appendChild(renderer.domElement);
            //
            //
            //     window.addEventListener('resize', onWindowResize, false);
            //   }
            //
            //   function onWindowResize() {
            //     camera.aspect = window.innerWidth / window.innerHeight;
            //     camera.updateProjectionMatrix();
            //     renderer.setSize(window.innerWidth, window.innerHeight);
            //     // controls.handleResize();
            //   }
            //
            //   function animate() {
            //     requestAnimationFrame(animate);
            //     // controls.update();
            //     renderer.render(scene, camera);
            //   }
            // }
        }
    }
</script>

<style scoped lang="scss">
    /*canvas{*/
    /*    background: rgba(0, 0, 0, 1);*/
    /*    margin: 40px 0;*/
    /*}*/

    #c {
        width: 100%;
        height: 100%;
        display: block;
        position: fixed;
        left: 0;
        top: 0;
        z-index: -1;
        pointer-events: none;
    }
    #content {
        font-size: 7vw;
        font-family: sans-serif;
        text-align: center;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #blocker {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #instructions {
        color: #ffffff;
        text-align: center;
        font-family: Arial;
        font-size: 14px;
        line-height: 24px;
        cursor: pointer;
    }
</style>
