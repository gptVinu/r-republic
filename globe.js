import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r126/three.module.min.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.0/examples/jsm/controls/OrbitControls.js";

const demo = document.querySelector(".demo");
const container = document.querySelector(".animation-wrapper");
const globeCanvas = container.querySelector("#globe-3d");
const globeOverlayCanvas = container.querySelector("#globe-2d-overlay");
const popup = container.querySelector(".globe-popup");

document.addEventListener("DOMContentLoaded", () => {
  gsap.set(demo, {
    height: window.innerHeight,
  });

  let surface = new Surface();

  new THREE.TextureLoader().load("img/earthmap1k.jpg", (mapTex) => {
    surface.earthTexture = mapTex;
    surface.earthTexture.repeat.set(1, 1);
    surface.earthTextureData = surface.getImageData();
    surface.createGlobe();
    surface.addAnchor();
    surface.addCanvasEvents();
    surface.updateDotSize();
    surface.loop();
  });

  window.addEventListener(
    "resize",
    () => {
      gsap.set(demo, {
        height: window.innerHeight,
      });

      surface.updateSize();
      surface.setupOverlayGraphic();
      surface.updateDotSize();
      surface.addCanvasEvents();
    },
    false
  );

  gsap.to(".title", {
    delay: 5,
    duration: 0.2,
    opacity: 1,
  });
});

class Surface {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: globeCanvas,
      alpha: true,
    });
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2);
    this.camera.position.z = 1.1;
    this.updateSize();

    this.rayCaster = new THREE.Raycaster();
    this.rayCaster.far = 1.15;
    this.mouse = new THREE.Vector2();
    this.coordinates2D = [0, 0];

    this.setupOverlayGraphic();
    this.createOrbitControls();

    this.clock = new THREE.Clock();
    this.clickTime = 0;

    this.group = new THREE.Group();
    this.group.scale.setScalar(0.9);
    this.scene.add(this.group);

    this.selectionVisible = false;
  }

  createOrbitControls() {
    this.controls = new OrbitControls(this.camera, globeCanvas);
    this.controls.enablePan = true;
    this.controls.enableZoom = false;
    this.controls.enableDamping = true;
    this.controls.minPolarAngle = 0.35 * Math.PI;
    this.controls.maxPolarAngle = 0.65 * Math.PI;
    this.controls.autoRotate = true;
  }

  createGlobe() {
    const globeGeometry = new THREE.IcosahedronGeometry(1, 14);
    this.mapMaterial = new THREE.ShaderMaterial({
      vertexShader: document.getElementById("vertex-shader-map").textContent,
      fragmentShader: document.getElementById("fragment-shader-map")
        .textContent,
      uniforms: {
        u_visibility: { type: "t", value: this.earthTexture },
        u_size: { type: "f", value: 0 },
        u_color_main: { type: "v3", value: new THREE.Color(0x372f8) },
        u_clicked: { type: "v3", value: new THREE.Vector3(0.0, 0.0, 1) },
        u_time_since_click: { value: 3 },
      },
      alphaTest: false,
      transparent: true,
    });

    const globe = new THREE.Points(globeGeometry, this.mapMaterial);
    this.group.add(globe);

    this.blackGlobe = new THREE.Mesh(
      globeGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x2c2c2e,
        transparent: true,
        opacity: 0.2,
      })
    );
    this.blackGlobe.scale.setScalar(0.99);
    this.group.add(this.blackGlobe);
  }

  addAnchor() {
    const geometry = new THREE.SphereGeometry(0.02, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0x4bc0c8,
      transparent: true,
      opacity: 1,
    });
    this.anchor = new THREE.Mesh(geometry, material);
    this.group.add(this.anchor);
  }

  setupOverlayGraphic() {
    this.overlayCtx = globeOverlayCanvas.getContext("2d");
    this.overlayCtx.strokeStyle = "#4BC0C8";
    this.overlayCtx.lineWidth = 5;
    this.overlayCtx.lineCap = "round";
  }

  updateOverlayGraphic() {
    if (this.anchor) {
      let activePointPosition = this.anchor.position.clone();
      activePointPosition.applyMatrix4(this.group.matrixWorld);
      const activePointPositionProjected = activePointPosition.clone();
      activePointPositionProjected.project(this.camera);
      this.coordinates2D[0] =
        (activePointPositionProjected.x + 1) * container.offsetWidth * 0.5;
      this.coordinates2D[1] =
        (-activePointPositionProjected.y + 1) * container.offsetHeight * 0.5;

      const matrixWorldInverse = this.controls.object.matrixWorldInverse;
      activePointPosition.applyMatrix4(matrixWorldInverse);

      if (activePointPosition.z > -1) {
        if (this.selectionVisible === false) {
          this.selectionVisible = true;
          this.showPopupAnimation(false);
        }

        let popupX = this.coordinates2D[0];
        let popupY = this.coordinates2D[1];
        popupX -= activePointPositionProjected.x * container.offsetWidth * 0.3;
        const upDown = activePointPositionProjected.y > 0.6;
        popupY += upDown ? 20 : -20;
        gsap.set(popup, {
          x: popupX,
          y: popupY,
          xPercent: -50,
          yPercent: upDown ? 0 : -100,
        });

        popupY += upDown ? -10 : 10;
        const curveStartX = this.coordinates2D[0];
        const curveStartY = this.coordinates2D[1];
        let curveMidX = popupX + activePointPositionProjected.x * 100;
        const curveMidY =
          popupY + (upDown ? -0.5 : 0.1) * this.coordinates2D[1];

        this.drawPopupConnector(
          curveStartX,
          curveStartY,
          curveMidX,
          curveMidY,
          popupX,
          popupY
        );
      } else {
        if (this.selectionVisible) {
          this.hidePopupAnimation();
        }
        this.selectionVisible = false;
      }
    }
  }

  addCanvasEvents() {
    container.addEventListener("mousemove", (e) => {
      updateMousePosition(e.clientX, e.clientY, this);
    });

    function updateMousePosition(eX, eY, surface) {
      const x = eX - container.offsetLeft;
      const y = eY - container.offsetTop;
      surface.mouse.x = (x / container.offsetWidth) * 2 - 1;
      surface.mouse.y = -(y / container.offsetHeight) * 2 + 1;
    }

    container.addEventListener("click", (e) => {
      updateMousePosition(
        e.targetTouches ? e.targetTouches[0].pageX : e.clientX,
        e.targetTouches ? e.targetTouches[0].pageY : e.clientY,
        this
      );
      this.checkIntersects();
      if (this.landIsHovered) {
        const intersects = this.rayCaster.intersectObject(this.blackGlobe);
        if (intersects.length) {
          this.anchor.position.set(
            intersects[0].face.normal.x,
            intersects[0].face.normal.y,
            intersects[0].face.normal.z
          );
          this.mapMaterial.uniforms.u_clicked.value = this.anchor.position;
          popup.innerHTML = this.getLatLong();
          this.showPopupAnimation(true);
          gsap.delayedCall(0.15, () => {
            this.clickTime = this.clock.getElapsedTime();
          });
        }
      }
    });
  }

  drawPopupConnector(startX, startY, midX, midY, endX, endY) {
    this.overlayCtx.clearRect(
      0,
      0,
      container.offsetWidth,
      container.offsetHeight
    );
    this.overlayCtx.beginPath();
    this.overlayCtx.shadowOffsetX = startX > endX ? -4 : 4;
    this.overlayCtx.moveTo(startX, startY);
    this.overlayCtx.quadraticCurveTo(midX, midY, endX, endY);
    this.overlayCtx.stroke();
  }

  showPopupAnimation(lifted) {
    let positionLifted = this.anchor.position.clone();
    if (lifted) {
      positionLifted.multiplyScalar(1.1);
    }
    gsap
      .timeline({})
      .fromTo(
        this.anchor.position,
        {
          x: positionLifted.x,
          y: positionLifted.y,
          z: positionLifted.z,
        },
        {
          duration: 0.35,
          x: this.anchor.position.x,
          y: this.anchor.position.y,
          z: this.anchor.position.z,
          ease: "back(4).out",
        },
        0
      )
      .to(
        this.anchor.material,
        {
          duration: 0.2,
          opacity: 1,
        },
        0
      )
      .fromTo(
        globeOverlayCanvas,
        {
          opacity: 0,
        },
        {
          duration: 0.3,
          opacity: 1,
        },
        0.15
      )
      .fromTo(
        popup,
        {
          opacity: 0,
          scale: 0.9,
          transformOrigin: "center bottom",
        },
        {
          duration: 0.1,
          opacity: 1,
          scale: 1,
        },
        0.15 + 0.1
      );
  }

  hidePopupAnimation() {
    gsap
      .timeline({})
      .to(
        this.anchor.material,
        {
          duration: 0.1,
          opacity: 0.2,
        },
        0
      )
      .to(
        globeOverlayCanvas,
        {
          duration: 0.15,
          opacity: 0,
        },
        0
      )
      .to(
        popup,
        {
          duration: 0.15,
          opacity: 0,
          scale: 0.9,
          transformOrigin: "center bottom",
        },
        0
      );
  }

  getImageData() {
    const image = this.earthTexture.image;
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, image.width, image.height);
  }

  getLatLong() {
    const pos = this.anchor.position;
    const lat = 90 - (Math.acos(pos.y) * 180) / Math.PI;
    const lng =
      ((270 + (Math.atan2(pos.x, pos.z) * 180) / Math.PI) % 360) - 180;
    return lat.toFixed(6) + ",&nbsp;" + lng.toFixed(6);
  }

  checkIntersects() {
    let isLand = (imageData, x, y) => {
      x = Math.floor(x * imageData.width);
      y = Math.floor((1 - y) * imageData.height);
      const position = (x + imageData.width * y) * 4;
      const data = imageData.data;
      return data[position] < 100;
    };
    this.rayCaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.rayCaster.intersectObject(this.blackGlobe);
    if (intersects.length) {
      this.landIsHovered = isLand(
        this.earthTextureData,
        intersects[0].uv.x,
        intersects[0].uv.y
      );
      document.body.style.cursor = this.landIsHovered ? "pointer" : "auto";
    } else {
      document.body.style.cursor = "auto";
    }
  }

  render() {
    this.mapMaterial.uniforms.u_time_since_click.value =
      this.clock.getElapsedTime() - this.clickTime;
    this.updateOverlayGraphic();
    this.controls.update();
    this.checkIntersects();
    this.renderer.render(this.scene, this.camera);
  }

  loop() {
    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }

  updateSize() {
    const minSide = 0.85 * Math.min(window.innerWidth, window.innerHeight);
    container.style.width = minSide + "px";
    container.style.height = minSide + "px";
    this.renderer.setSize(minSide, minSide);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.camera.updateProjectionMatrix();
    globeOverlayCanvas.width = minSide;
    globeOverlayCanvas.height = minSide;
  }

  updateDotSize() {
    this.mapMaterial.uniforms.u_size.value = 0.03 * container.offsetWidth;
  }
}
