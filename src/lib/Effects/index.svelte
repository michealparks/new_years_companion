<script lang='ts'>

import ParticleVert from './shaders/particle.vert.glsl'
import ParticleFrag from './shaders/particle.frag.glsl'
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl'

const renderer = new Renderer({ depth: false })
const { gl } = renderer
document.body.appendChild(gl.canvas)
gl.canvas.style.opacity = '0.7'
gl.clearColor(0, 0, 0, 0.5)

const camera = new Camera(gl, { fov: 15 })
camera.position.z = 15

const resize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.perspective({ aspect: gl.canvas.width / gl.canvas.height })
}

window.addEventListener('resize', resize, { passive: true })
resize()

const num = 100
const position = new Float32Array(num * 3)
const random = new Float32Array(num * 4)

for (let i = 0; i < num; i++) {
  position.set([Math.random(), Math.random(), Math.random()], i * 3)
  random.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4)
}

const geometry = new Geometry(gl, {
  position: { size: 3, data: position },
  random: { size: 4, data: random },
})

const program = new Program(gl, {
  vertex: ParticleVert,
  fragment: ParticleFrag,
  uniforms: { uTime: { value: 0 } },
  transparent: true,
  depthTest: false,
})

const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program })

const update = (t: number) => {
  requestAnimationFrame(update)

  // add some slight overall movement to be more interesting
  particles.rotation.x = Math.sin(t * 0.0002) * 0.1
  particles.rotation.y = Math.cos(t * 0.0005) * 0.15
  particles.rotation.z += 0.01

  program.uniforms.uTime.value = t * 0.001
  renderer.render({ scene: particles, camera })
}

requestAnimationFrame(update)

</script>
