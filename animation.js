let scene, camera, renderer, particles;
const particleCount = 7000;
let mouse = new THREE.Vector2(0, 0);
let target = new THREE.Vector2(0, 0);

function init() {
    scene = new THREE.Scene();
    
    const container = document.getElementById('animation-background');
    const aspect = container.clientWidth / container.clientHeight;
    const frustumSize = 30;

    camera = new THREE.OrthographicCamera(
        frustumSize * aspect / -2,
        frustumSize * aspect / 2,
        frustumSize / 2,
        frustumSize / -2,
        1,
        1000
    );
    camera.position.z = 10;
    
    renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const opacities = [];
    const sizes = [];
    const randoms = [];

    const spreadX = frustumSize * aspect;
    const spreadY = frustumSize;

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * spreadX;
        const y = (Math.random() - 0.5) * spreadY;
        const z = (Math.random() - 0.5) * 2;
        
        positions.push(x, y, z);
        // Increased opacity range: now 0.2 to 0.5 (was 0.1 to 0.3)
        opacities.push(Math.random() * 0.3 + 0.2);
        // Increased size range slightly
        sizes.push(Math.random() * 0.04 + 0.02);
        randoms.push(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random()
        );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('opacity', new THREE.Float32BufferAttribute(opacities, 1));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    geometry.setAttribute('random', new THREE.Float32BufferAttribute(randoms, 3));

    const material = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
            time: { value: 0 },
            mouse: { value: new THREE.Vector2(0, 0) }
        },
        vertexShader: `
            attribute float opacity;
            attribute float size;
            attribute vec3 random;
            
            uniform float time;
            uniform vec2 mouse;
            
            varying float vOpacity;
            
            void main() {
                vOpacity = opacity;
                
                vec3 pos = position;
                float dist = distance(mouse, pos.xy);
                
                float movement = sin(time * 0.5 + random.z * 12.28) * 0.1;
                pos.x += movement * random.x;
                pos.y += movement * random.y;
                
                float mouseInfluence = 1.0 - min(dist * 0.1, 1.2);
                vec2 mouseDir = normalize(pos.xy - mouse);
                pos.xy += mouseDir * mouseInfluence * 0.5;
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying float vOpacity;
            
            void main() {
                float dist = length(gl_PointCoord - vec2(0.5));
                if (dist > 0.5) discard;
                
                float glow = 1.0 - smoothstep(0.0, 0.5, dist);
                glow = pow(glow, 1.5); 
                
                float alpha = glow * vOpacity;
                gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * 1.2);
            }
        `
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
}

function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const frustumSize = 30;
    const aspect = rect.width / rect.height;
    
    target.x = ((event.clientX - rect.left) / rect.width * 2 - 1) * (frustumSize * aspect / 2);
    target.y = (-(event.clientY - rect.top) / rect.height * 2 + 1) * (frustumSize / 2);
}

function onWindowResize() {
    const container = document.getElementById('animation-background');
    const aspect = container.clientWidth / container.clientHeight;
    const frustumSize = 30;

    camera.left = frustumSize * aspect / -2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    mouse.x += (target.x - mouse.x) * 0.1;
    mouse.y += (target.y - mouse.y) * 0.1;
    
    if (particles) {
        particles.material.uniforms.time.value = performance.now() * 0.001;
        particles.material.uniforms.mouse.value = mouse;
    }
    
    renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', () => {
    init();
    animate();
});

