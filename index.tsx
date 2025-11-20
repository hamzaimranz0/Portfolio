

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

// --- Generative Shader Background ---
function initGenerativeBackground() {
    const container = document.getElementById('hero-canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-1';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const clock = new THREE.Clock();

    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        #ifdef GL_ES
            precision lowp float;
        #endif
        uniform float iTime;
        uniform vec2 iResolution;
        uniform vec3 themeColor;
        uniform vec3 bgColor;
        varying vec2 vUv;
        
        vec4 buf[8];
        
        vec4 sigmoid(vec4 x) { return 1. / (1. + exp(-x)); }
        
        vec4 cppn_fn(vec2 coordinate, float in0, float in1, float in2) {
            buf[6] = vec4(coordinate.x, coordinate.y, 0.3948333106474662 + in0, 0.36 + in1);
            buf[7] = vec4(0.14 + in2, sqrt(coordinate.x * coordinate.x + coordinate.y * coordinate.y), 0., 0.);
            buf[0] = mat4(vec4(6.5404263, -3.6126034, 0.7590882, -1.13613), vec4(2.4582713, 3.1660357, 1.2219609, 0.06276096), vec4(-5.478085, -6.159632, 1.8701609, -4.7742867), vec4(6.039214, -5.542865, -0.90925294, 3.251348)) * buf[6] + mat4(vec4(0.8473259, -5.722911, 3.975766, 1.6522468), vec4(-0.24321538, 0.5839259, -1.7661959, -5.350116), vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0)) * buf[7] + vec4(0.21808943, 1.1243913, -1.7969975, 5.0294676);
            buf[1] = mat4(vec4(-3.3522482, -6.0612736, 0.55641043, -4.4719114), vec4(0.8631464, 1.7432913, 5.643898, 1.6106541), vec4(2.4941394, -3.5012043, 1.7184316, 6.357333), vec4(3.310376, 8.209261, 1.1355612, -1.165539)) * buf[6] + mat4(vec4(5.24046, -13.034365, 0.009859298, 15.870829), vec4(2.987511, 3.129433, -0.89023495, -1.6822904), vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0)) * buf[7] + vec4(-5.9457836, -6.573602, -0.8812491, 1.5436668);
            buf[0] = sigmoid(buf[0]);
            buf[1] = sigmoid(buf[1]);
            buf[2] = mat4(vec4(-15.219568, 8.095543, -2.429353, -1.9381982), vec4(-5.951362, 4.3115187, 2.6393783, 1.274315), vec4(-7.3145227, 6.7297835, 5.2473326, 5.9411426), vec4(5.0796127, 8.979051, -1.7278991, -1.158976)) * buf[6] + mat4(vec4(-11.967154, -11.608155, 6.1486754, 11.237008), vec4(2.124141, -6.263192, -1.7050359, -0.7021966), vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0)) * buf[7] + vec4(-4.17164, -3.2281182, -4.576417, -3.6401186);
            buf[3] = mat4(vec4(3.1832156, -13.738922, 1.879223, 3.233465), vec4(0.64300746, 12.768129, 1.9141049, 0.50990224), vec4(-0.049295485, 4.4807224, 1.4733979, 1.801449), vec4(5.0039253, 13.000481, 3.3991797, -4.5561905)) * buf[6] + mat4(vec4(-0.1285731, 7.720628, -3.1425676, 4.742367), vec4(0.6393625, 3.714393, -0.8108378, -0.39174938), vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0)) * buf[7] + vec4(-1.1811101, -21.621881, 0.7851888, 1.2329718);
            buf[2] = sigmoid(buf[2]);
            buf[3] = sigmoid(buf[3]);
            buf[4] = mat4(vec4(5.214916, -7.183024, 2.7228765, 2.6592617), vec4(-5.601878, -25.3591, 4.067988, 0.4602802), vec4(-10.57759, 24.286327, 21.102104, 37.546658), vec4(4.3024497, -1.9625226, 2.3458803, -1.372816)) * buf[0] + mat4(vec4(-17.6526, -10.507558, 2.2587414, 12.462782), vec4(6.265566, -502.75443, -12.642513, 0.9112289), vec4(-10.983244, 20.741234, -9.701768, -0.7635988), vec4(5.383626, 1.4819539, -4.1911616, -4.8444734)) * buf[1] + mat4(vec4(12.785233, -16.345072, -0.39901125, 1.7955981), vec4(-30.48365, -1.8345358, 1.4542528, -1.1118771), vec4(19.872723, -7.337935, -42.941723, -98.52709), vec4(8.337645, -2.7312303, -2.2927687, -36.142323)) * buf[2] + mat4(vec4(-16.298317, 3.5471997, -0.44300047, -9.444417), vec4(57.5077, -35.609753, 16.163465, -4.1534753), vec4(-0.07470326, -3.8656476, -7.0901804, 3.1523974), vec4(-12.559385, -7.077619, 1.490437, -0.8211543)) * buf[3] + vec4(-7.67914, 15.927437, 1.3207729, -1.6686112);
            buf[5] = mat4(vec4(-1.4109162, -0.372762, -3.770383, -21.367174), vec4(-6.2103205, -9.35908, 0.92529047, 8.82561), vec4(11.460242, -22.348068, 13.625772, -18.693201), vec4(-0.3429052, -3.9905605, -2.4626114, -0.45033523)) * buf[0] + mat4(vec4(7.3481627, -4.3661838, -6.3037653, -3.868115), vec4(1.5462853, 6.5488915, 1.9701879, -0.58291394), vec4(6.5858274, -2.2180402, 3.7127688, -1.3730392), vec4(-5.7973905, 10.134961, -2.3395722, -5.965605)) * buf[1] + mat4(vec4(-2.5132585, -6.6685553, -1.4029363, -0.16285264), vec4(-0.37908727, 0.53738135, 4.389061, -1.3024765), vec4(-0.70647055, 2.0111287, -5.1659346, -3.728635), vec4(-13.562562, 10.487719, -0.9173751, -2.6487076)) * buf[2] + mat4(vec4(-8.645013, 6.5546675, -6.3944063, -5.5933375), vec4(-0.57783127, -1.077275, 36.91025, 5.736769), vec4(14.283112, 3.7146652, 7.1452246, -4.5958776), vec4(2.7192075, 3.6021907, -4.366337, -2.3653464)) * buf[3] + vec4(-5.9000807, -4.329569, 1.2427121, 8.59503);
            buf[4] = sigmoid(buf[4]);
            buf[5] = sigmoid(buf[5]);
            buf[6] = mat4(vec4(-1.61102, 0.7970257, 1.4675229, 0.20917463), vec4(-28.793737, -7.1390953, 1.5025433, 4.656581), vec4(-10.94861, 39.66238, 0.74318546, -10.095605), vec4(-0.7229728, -1.5483948, 0.7301322, 2.1687684)) * buf[0] + mat4(vec4(3.2547753, 21.489103, -1.0194173, -3.3100595), vec4(-3.7316632, -3.3792162, -7.223193, -0.23685838), vec4(13.1804495, 0.7916005, 5.338587, 5.687114), vec4(-4.167605, -17.798311, -6.815736, -1.6451967)) * buf[1] + mat4(vec4(0.604885, -7.800309, -7.213122, -2.741014), vec4(-3.522382, -0.12359311, -0.5258442, 0.43852118), vec4(9.6752825, -22.853785, 2.062431, 0.099892326), vec4(-4.3196306, -17.730087, 2.5184598, 5.30267)) * buf[2] + mat4(vec4(-6.545563, -15.790176, -6.0438633, -5.415399), vec4(-43.591583, 28.551912, -16.00161, 18.84728), vec4(4.212382, 8.394307, 3.0958717, 8.657522), vec4(-5.0237565, -4.450633, -4.4768, -5.5010443)) * buf[3] + mat4(vec4(1.6985557, -67.05806, 6.897715, 1.9004834), vec4(1.8680354, 2.3915145, 2.5231109, 4.081538), vec4(11.158006, 1.7294737, 2.0738268, 7.386411), vec4(-4.256034, -306.24686, 8.258898, -17.132736)) * buf[4] + mat4(vec4(1.6889864, -4.5852966, 3.8534803, -6.3482175), vec4(1.3543309, -1.2640043, 9.932754, 2.9079645), vec4(-5.2770967, 0.07150358, -0.13962056, 3.3269649), vec4(28.34703, -4.918278, 6.1044083, 4.085355)) * buf[5] + vec4(6.6818056, 12.522166, -3.7075126, -4.104386);
            buf[7] = mat4(vec4(-8.265602, -4.7027016, 5.098234, 0.7509808), vec4(8.6507845, -17.15949, 16.51939, -8.884479), vec4(-4.036479, -2.3946867, -2.6055532, -1.9866527), vec4(-2.2167742, -1.8135649, -5.9759874, 4.8846445)) * buf[0] + mat4(vec4(6.7790847, 3.5076547, -2.8191125, -2.7028968), vec4(-5.743024, -0.27844876, 1.4958696, -5.0517144), vec4(13.122226, 15.735168, -2.9397483, -4.101023), vec4(-14.375265, -5.030483, -6.2599335, 2.9848232)) * buf[1] + mat4(vec4(4.0950394, -0.94011575, -5.674733, 4.755022), vec4(4.3809423, 4.8310084, 1.7425908, -3.437416), vec4(2.117492, 0.16342592, -104.56341, 16.949184), vec4(-5.22543, -2.994248, 3.8350096, -1.9364246)) * buf[2] + mat4(vec4(-5.900337, 1.7946124, -13.604192, -3.8060522), vec4(6.6583457, 31.911177, 25.164474, 91.81147), vec4(11.840538, 4.1503043, -0.7314397, 6.768467), vec4(-6.3967767, 4.034772, 6.1714606, -0.32874924)) * buf[3] + mat4(vec4(3.4992442, -196.91893, -8.923708, 2.8142626), vec4(3.4806502, -3.1846354, 5.1725626, 5.1804223), vec4(-2.4009497, 15.585794, 1.2863957, 2.0252278), vec4(-71.25271, -62.441242, -8.138444, 0.50670296)) * buf[4] + mat4(vec4(-12.291733, -11.176166, -7.3474145, 4.390294), vec4(10.805477, 5.6337385, -0.9385842, -4.7348723), vec4(-12.869276, -7.039391, 5.3029537, 7.5436664), vec4(1.4593618, 8.91898, 3.5101583, 5.840625)) * buf[5] + vec4(2.2415268, -6.705987, -0.98861027, -2.117676);
            buf[6] = sigmoid(buf[6]);
            buf[7] = sigmoid(buf[7]);
            buf[0] = mat4(vec4(1.6794263, 1.3817469, 2.9625452, 0.0), vec4(-1.8834411, -1.4806935, -3.5924516, 0.0), vec4(-1.3279216, -1.0918057, -2.3124623, 0.0), vec4(0.2662234, 0.23235129, 0.44178495, 0.0)) * buf[0] + mat4(vec4(-0.6299101, -0.5945583, -0.9125601, 0.0), vec4(0.17828953, 0.18300213, 0.18182953, 0.0), vec4(-2.96544, -2.5819945, -4.9001055, 0.0), vec4(1.4195864, 1.1868085, 2.5176322, 0.0)) * buf[1] + mat4(vec4(-1.2584374, -1.0552157, -2.1688404, 0.0), vec4(-0.7200217, -0.52666044, -1.438251, 0.0), vec4(0.15345335, 0.15196142, 0.272854, 0.0), vec4(0.945728, 0.8861938, 1.2766753, 0.0)) * buf[2] + mat4(vec4(-2.4218085, -1.968602, -4.35166, 0.0), vec4(-22.683098, -18.0544, -41.954372, 0.0), vec4(0.63792, 0.5470648, 1.1078634, 0.0), vec4(-1.5489894, -1.3075932, -2.6444845, 0.0)) * buf[3] + mat4(vec4(-0.49252132, -0.39877754, -0.91366625, 0.0), vec4(0.95609266, 0.7923952, 1.640221, 0.0), vec4(0.30616966, 0.15693925, 0.8639857, 0.0), vec4(1.1825981, 0.94504964, 2.176963, 0.0)) * buf[4] + mat4(vec4(0.35446745, 0.3293795, 0.59547555, 0.0), vec4(-0.58784515, -0.48177817, -1.0614829, 0.0), vec4(2.5271258, 1.9991658, 4.6846647, 0.0), vec4(0.13042648, 0.08864098, 0.30187556, 0.0)) * buf[5] + mat4(vec4(-1.7718065, -1.4033192, -3.3355875, 0.0), vec4(3.1664357, 2.638297, 5.378702, 0.0), vec4(-3.1724713, -2.6107926, -5.549295, 0.0), vec4(-2.851368, -2.249092, -5.3013067, 0.0)) * buf[6] + mat4(vec4(1.5203838, 1.2212278, 2.8404984, 0.0), vec4(1.5210563, 1.2651345, 2.683903, 0.0), vec4(2.9789467, 2.4364579, 5.2347264, 0.0), vec4(2.2270417, 1.8825914, 3.8028636, 0.0)) * buf[7] + vec4(-1.5468478, -3.6171484, 0.24762098, 0.0);
            buf[0] = sigmoid(buf[0]);
            return vec4(buf[0].x, buf[0].y, buf[0].z, 1.0);
        }
        
        void main() {
            vec2 uv = vUv * 2.0 - 1.0; 
            uv.y *= -1.0;

            vec4 generated = cppn_fn(uv, 0.1 * sin(0.3 * iTime), 0.1 * sin(0.69 * iTime), 0.1 * sin(0.44 * iTime));
            
            // Calculate luminance to get the pattern's brightness
            float luminance = dot(generated.rgb, vec3(0.299, 0.587, 0.114));
            
            // Create a monochrome blue version of the pattern
            vec3 patternColor = themeColor * luminance;
            
            // Mix it with the background to make it muted and subtle
            vec3 finalColor = mix(bgColor, patternColor, 0.9); 

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            themeColor: { value: new THREE.Color(0x007aff) },
            bgColor: { value: new THREE.Color(0x0a0a0a) }
        }
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function onResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        material.uniforms.iResolution.value.set(
            window.innerWidth, 
            window.innerHeight
        );
    }
    window.addEventListener('resize', onResize);

    function animate() {
        requestAnimationFrame(animate);
        material.uniforms.iTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
    }
    
    animate();
}

// --- Animated Text Initialization ---
function initAnimatedText() {
    const animatedHeadings = document.querySelectorAll('.animated-heading');
    animatedHeadings.forEach(heading => {
        // FIX: Cast heading to HTMLElement to access dataset property.
        if ((heading as HTMLElement).dataset.animated) return;
        // FIX: Cast heading to HTMLElement to access dataset property.
        (heading as HTMLElement).dataset.animated = "true";

        const text = heading.textContent.trim();
        if (!text) return;

        heading.innerHTML = ''; 

        // FIX: Cast heading to HTMLElement to access dataset property.
        // FIX: Ensure dataset properties used in arithmetic are converted to numbers.
        const duration = Number((heading as HTMLElement).dataset.duration) || 1.5;
        // FIX: Cast heading to HTMLElement to access dataset property.
        // FIX: Ensure dataset properties used in arithmetic are converted to numbers.
        const delayMultiplier = Number((heading as HTMLElement).dataset.delayMultiplier) || 0.08;

        // FIX: Cast heading to HTMLElement to access style property.
        (heading as HTMLElement).style.setProperty('--duration', `${duration}s`);

        const characters = text.split('');
        const numLetters = characters.length;
        
        characters.forEach((char, i) => {
            const span = document.createElement('span');
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            const mappedIndex = i - numLetters / 2;
            span.style.animationDelay = `${mappedIndex * delayMultiplier}s`;
            heading.appendChild(span);
        });
    });
}

// --- Tubelight Navigation ---
function initTubelightNav() {
    const navContainer = document.getElementById('tubelight-nav');
    if (!navContainer) return;

    const nav = navContainer.querySelector('div');
    const links = nav.querySelectorAll('.nav-item');
    const lamp = document.getElementById('nav-lamp');

    function positionLampUnder(targetLink) {
        if (!targetLink || !nav) return;
        const linkRect = targetLink.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        const left = linkRect.left - navRect.left + nav.scrollLeft;
        
        lamp.style.width = `${linkRect.width}px`;
        lamp.style.left = `${left}px`;
    }

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            positionLampUnder(link);
        });
    });

    nav.addEventListener('mouseenter', () => {
        lamp.style.opacity = '1';
    });

    nav.addEventListener('mouseleave', () => {
        lamp.style.opacity = '0';
    });
}

// --- Custom Inverted Cursor ---
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    let visible = false;

    // Apply position directly for 1:1 tracking (no lag)
    const handleMouseMove = (e) => {
        if (!visible) {
            visible = true;
            cursor.style.opacity = '1';
        }
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    const handleMouseLeave = () => {
        visible = false;
        cursor.style.opacity = '0';
    };
    
    const handleMouseEnter = (e) => {
        if (!visible) {
            visible = true;
            cursor.style.opacity = '1';
            // Snap to position on re-enter to avoid lag from off-screen
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        }
    };
    
    document.body.style.cursor = "none"; // Hide native cursor

    // Setup main mouse listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    
    // Logic to toggle inverting effect based on hovering text-like elements
    const textElements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, a, li, span, button");
    
    const onEnterText = () => cursor.classList.add('invert-cursor');
    const onLeaveText = () => cursor.classList.remove('invert-cursor');

    textElements.forEach(el => {
      el.addEventListener("mouseenter", onEnterText);
      el.addEventListener("mouseleave", onLeaveText);
    });
}

// --- Calendar Generation ---
function generateCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const monthYearEl = document.getElementById('calendar-month-year');
    if (!calendarGrid || !monthYearEl) return;

    const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    monthYearEl.textContent = `${now.toLocaleString('default', { month: 'long' })}, ${year}`;

    calendarGrid.innerHTML = '';

    dayNames.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.className = 'font-bold text-xs text-[var(--color-text-muted)]';
        dayEl.textContent = day;
        calendarGrid.appendChild(dayEl);
    });
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'h-7 w-7 flex items-center justify-center rounded-full';
        // FIX: The `day` variable is a number, but `textContent` expects a string.
        // This was likely the cause of the "Type 'number' is not assignable to type 'string'" error.
        dayCell.textContent = String(day);

        if (Math.random() < 0.25) {
            dayCell.classList.add('bg-[var(--color-accent)]', 'text-white', 'font-semibold');
        } else {
            dayCell.classList.add('text-[var(--color-text-muted)]');
        }

        calendarGrid.appendChild(dayCell);
    }
}

// --- Past Work Carousel ---
function initCarousel() {
    const items = [
      { id: 1, url: 'https://drive.google.com/uc?id=1SY2xp7YJ1HugAsg_IrW4XEUwnuL7UMSA', title: 'Black Toyota Supra' },
      { id: 2, url: 'https://storage.googleapis.com/aide-user-images/c7f9dc6e-a9d9-4b13-81b4-25e865f3a097.jpeg', title: 'Mapping Journeys' },
      { id: 3, url: 'https://storage.googleapis.com/aide-user-images/916d7a42-706f-4740-9706-96a1a1f49630.jpeg', title: 'Focused Training' },
      { id: 4, url: 'https://storage.googleapis.com/aide-user-images/409a25b2-3837-43ca-a6d1-008298da5545.jpeg', title: 'Airplane Above Architecture' },
      { id: 5, url: 'https://storage.googleapis.com/aide-user-images/fd3bf45d-7ac3-4a11-a8ac-896898d2279b.jpeg', title: 'City Sunset with Fountain' },
      { id: 6, url: 'https://drive.google.com/uc?id=1H15bniKKWchDHS69uB7M-1U-079biNUb', title: 'Twilight Lamppost' },
    ];
    
    const AUTOPLAY_INTERVAL = 5000; // 5 seconds
    const playIcon = `<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.018 14.385V5.615a.8.8 0 011.23-.655l7.98 4.385a.8.8 0 010 1.31l-7.98 4.385a.8.8 0 01-1.23-.655z"></path></svg>`;
    const pauseIcon = `<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5 4h3a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1zm7 0h3a1 1 0 011 1v10a1 1 0 01-1 1h-3a1 1 0 01-1-1V5a1 1 0 011-1z" clip-rule="evenodd"></path></svg>`;

    const container = document.getElementById('carousel-container');
    const track = document.getElementById('carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');
    const prevButton = document.getElementById('carousel-prev');
    const nextButton = document.getElementById('carousel-next');
    const playPauseButton = document.getElementById('carousel-play-pause');
    
    if (!container || !track || !dotsContainer || !prevButton || !nextButton || !playPauseButton) return;

    let currentIndex = 0;
    let isPlaying = true;
    let autoplayInterval = null;
    let dots = [];

    function updateCarouselUI() {
        const containerWidth = container.offsetWidth;
        track.style.transform = `translateX(-${currentIndex * containerWidth}px)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        playPauseButton.innerHTML = isPlaying ? pauseIcon : playIcon;
        playPauseButton.setAttribute('aria-label', isPlaying ? 'Pause autoplay' : 'Play autoplay');
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarouselUI();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarouselUI();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarouselUI();
    }

    function startAutoplay() {
        if(isPlaying) {
           clearInterval(autoplayInterval);
           autoplayInterval = setInterval(nextSlide, AUTOPLAY_INTERVAL);
        }
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    function toggleAutoplay() {
        isPlaying = !isPlaying;
        if(isPlaying) {
            startAutoplay();
        } else {
            stopAutoplay();
        }
        updateCarouselUI();
    }
    
    function resetAutoplay() {
        if (isPlaying) {
            stopAutoplay();
            startAutoplay();
        }
    }
    
    // Generate slides and dots
    track.innerHTML = items.map(item => `
        <div class="shrink-0 w-full h-full relative">
            <img src="${item.url}" alt="${item.title}" class="w-full h-full object-cover select-none pointer-events-none" draggable="false" />
            <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <h3 class="text-white font-bold text-lg">${item.title}</h3>
            </div>
        </div>
    `).join('');

    dotsContainer.innerHTML = items.map((_, i) => `
        <button data-index="${i}" class="carousel-dot" aria-label="Go to slide ${i + 1}"></button>
    `).join('');
    
    dots = Array.from(dotsContainer.querySelectorAll('.carousel-dot'));

    // Setup Event Listeners
    prevButton.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });

    nextButton.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });
    
    playPauseButton.addEventListener('click', toggleAutoplay);
    
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            // FIX: Cast `dot` to `HTMLElement` to access `dataset`. The reported error "Type 'number' is not assignable to type 'string'" is likely a misleading secondary error due to `dataset` not existing on `Element`. Using `?? '0'` for safety.
            // FIX: Add radix to parseInt for robustness.
            goToSlide(parseInt((dot as HTMLElement).dataset.index ?? '0', 10));
            resetAutoplay();
        });
    });

    window.addEventListener('resize', updateCarouselUI);

    // Initial setup
    updateCarouselUI();
    startAutoplay();
}

// --- Main Initializer ---
document.addEventListener('DOMContentLoaded', () => {
    initGenerativeBackground();
    initAnimatedText();

    // --- Intersection Observer for scroll animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });

    // --- Experience Card Glow Effect ---
    document.querySelectorAll('.experience-card').forEach(card => {
        // FIX: Type the event `e` as `MouseEvent` to access `clientX` and `clientY`.
        card.addEventListener('mousemove', (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // FIX: Cast `card` to `HTMLElement` to access the `style` property.
            (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
            (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- Interactive Glow Effect for Buttons/Links ---
    document.querySelectorAll('.interactive-glow').forEach(el => {
        // FIX: Type the event `e` as `MouseEvent` to access `clientX` and `clientY`.
        el.addEventListener('mousemove', (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // FIX: Cast `el` to `HTMLElement` to access the `style` property.
            (el as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
            (el as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
        });
    });

    initTubelightNav();
    initCustomCursor();

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    generateCalendar();
    initCarousel();
});
