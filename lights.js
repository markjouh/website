// Christmas lights effect
(function() {
    const container = document.createElement('div');
    container.className = 'christmas-lights';
    document.body.appendChild(container);

    const colors = ['red', 'green', 'blue', 'yellow'];
    const bulbSpacing = 40;
    const droop = 6;
    const strandConfigs = [
        { yBase: 12, xOffset: 20, seed: 42 },  // back row
        { yBase: 6, xOffset: 0, seed: 137 }    // front row
    ];

    let generatedWidth = 0;

    // Seeded random for consistent results
    function seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    // Seeded shuffle for consistent color patterns
    function seededShuffle(arr, seed) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom(seed + i * 17) * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function createStrand(yBase, xOffset, seed, targetWidth) {
        const numBulbs = Math.ceil(targetWidth / bulbSpacing) + 1;
        const bulbPositions = [];

        // Create SVG for wire
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'wire-svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '60');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        container.appendChild(svg);

        // Create "nail" positions - where the strand is pinned up
        const nailSpacing = Math.floor(numBulbs / 4);
        const nails = new Set();
        for (let i = 0; i < numBulbs; i += nailSpacing) {
            const nailPos = i + Math.floor(seededRandom(seed + i * 7) * 3) - 1;
            if (nailPos >= 0 && nailPos <= numBulbs) nails.add(nailPos);
        }
        nails.add(0);
        nails.add(numBulbs);

        // Generate random variations for each anchor point
        const anchors = [];
        for (let i = 0; i <= numBulbs; i++) {
            const xVariation = (seededRandom(seed + i * 3) - 0.5) * 8;
            const yVariation = (seededRandom(seed + i * 3 + 1) - 0.5) * 3;
            const droopVariation = (seededRandom(seed + i * 3 + 2) - 0.5) * 4;

            let prevNail = 0, nextNail = numBulbs;
            for (const nail of nails) {
                if (nail <= i && nail > prevNail) prevNail = nail;
                if (nail >= i && nail < nextNail) nextNail = nail;
            }
            const segmentLength = nextNail - prevNail;
            const posInSegment = i - prevNail;
            const sagAmount = segmentLength > 0 ?
                8 * Math.sin(Math.PI * posInSegment / segmentLength) : 0;

            anchors.push({
                x: i * bulbSpacing + xOffset + xVariation,
                y: yBase + yVariation + sagAmount,
                droop: droop + droopVariation
            });
        }

        // Build path with curves between bulbs
        let pathD = `M ${anchors[0].x - 20} ${anchors[0].y}`;

        for (let i = 0; i < numBulbs; i++) {
            const curr = anchors[i];
            const next = anchors[i + 1];
            const midX = (curr.x + next.x) / 2;
            const midY = Math.max(curr.y, next.y) + curr.droop;

            pathD += ` Q ${midX} ${midY}, ${next.x} ${next.y}`;

            bulbPositions.push({
                x: midX,
                y: midY
            });
        }

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathD);
        path.setAttribute('class', 'wire-path');
        svg.appendChild(path);

        // Create bulbs with seeded colors and animations
        let colorSeed = seed * 1000;
        let colorPool = [];
        bulbPositions.forEach((pos, idx) => {
            if (colorPool.length === 0) {
                colorPool = seededShuffle(colors.slice(), colorSeed++);
            }

            const bulb = document.createElement('div');
            bulb.className = 'bulb ' + colorPool.pop();
            bulb.style.left = (pos.x - 4) + 'px';
            bulb.style.top = (pos.y) + 'px';

            // Seeded animation properties for consistency
            const bulbSeed = seed + idx * 100;
            const animations = ['glow', 'glow2', 'glow3'];
            const animName = animations[Math.floor(seededRandom(bulbSeed) * 3)];
            const animDelay = (seededRandom(bulbSeed + 1) * 4) + 's';
            const animDuration = (1.5 + seededRandom(bulbSeed + 2) * 2.5) + 's';
            bulb.style.setProperty('--anim-name', animName);
            bulb.style.setProperty('--anim-delay', animDelay);
            bulb.style.setProperty('--anim-duration', animDuration);
            container.appendChild(bulb);
        });
    }

    function generateLights(targetWidth) {
        // Clear existing lights
        container.innerHTML = '';

        // Create strands (back row first, then front)
        strandConfigs.forEach(config => {
            createStrand(config.yBase, config.xOffset, config.seed, targetWidth);
        });

        generatedWidth = targetWidth;
    }

    // Initial generation
    generateLights(window.innerWidth);

    // Handle resize - only regenerate when window gets larger
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const newWidth = window.innerWidth;
            // Only regenerate if window is significantly larger (by at least one bulb spacing)
            if (newWidth > generatedWidth + bulbSpacing) {
                generateLights(newWidth);
            }
        }, 150);
    });
})();
