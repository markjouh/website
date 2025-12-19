// Christmas lights effect
(function() {
    const container = document.createElement('div');
    container.className = 'christmas-lights';
    document.body.appendChild(container);

    const colors = ['red', 'green', 'blue', 'yellow'];
    const animations = ['glow', 'glow2', 'glow3'];
    const bulbSpacing = 40;
    const droop = 6;

    // Seeded random for consistent results per strand
    function seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    // Seeded shuffle for consistent color order
    function seededShuffle(arr, seed) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom(seed + i * 17) * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function createStrand(yBase, xOffset, seed, fragment) {
        const numBulbs = Math.ceil(window.innerWidth / bulbSpacing) + 1;

        // Create SVG for wire
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'wire-svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '60');
        svg.style.cssText = 'position:absolute;top:0;left:0';
        fragment.appendChild(svg);

        // Create "nail" positions - where the strand is pinned up
        const nailSpacing = Math.floor(numBulbs / 4);
        const nails = new Set([0, numBulbs]);
        for (let i = 0; i < numBulbs; i += nailSpacing) {
            const nailPos = i + Math.floor(seededRandom(seed + i * 7) * 3) - 1;
            if (nailPos >= 0 && nailPos <= numBulbs) nails.add(nailPos);
        }
        const sortedNails = Array.from(nails).sort((a, b) => a - b);

        // Generate anchors and build path simultaneously
        const pathParts = [];
        let colorPool = [];
        let colorPoolSeed = seed + 1000;
        let bulbIdx = 0;
        let prevAnchor = null;
        let nailIdx = 0;

        for (let i = 0; i <= numBulbs; i++) {
            // Advance nail index
            while (nailIdx < sortedNails.length - 1 && sortedNails[nailIdx + 1] < i) nailIdx++;
            const prevNail = sortedNails[nailIdx];
            const nextNail = sortedNails[nailIdx + 1] || numBulbs;

            const segmentLength = nextNail - prevNail;
            const posInSegment = i - prevNail;
            const sagAmount = segmentLength > 0 ? 8 * Math.sin(Math.PI * posInSegment / segmentLength) : 0;

            const anchor = {
                x: i * bulbSpacing + xOffset + (seededRandom(seed + i * 3) - 0.5) * 8,
                y: yBase + (seededRandom(seed + i * 3 + 1) - 0.5) * 3 + sagAmount,
                droop: droop + (seededRandom(seed + i * 3 + 2) - 0.5) * 4
            };

            if (i === 0) {
                pathParts.push('M', anchor.x - 20, anchor.y);
            } else {
                const midX = (prevAnchor.x + anchor.x) / 2;
                const midY = Math.max(prevAnchor.y, anchor.y) + prevAnchor.droop;
                pathParts.push('Q', midX, midY + ',', anchor.x, anchor.y);

                if (colorPool.length === 0) {
                    colorPool = seededShuffle(colors, colorPoolSeed);
                    colorPoolSeed += 100;
                }
                const bulb = document.createElement('div');
                bulb.className = 'bulb ' + colorPool.pop();
                const animSeed = seed + bulbIdx * 13;
                bulb.style.cssText = 'left:' + (midX - 4) + 'px;top:' + midY + 'px;' +
                    '--anim-name:' + animations[Math.floor(seededRandom(animSeed) * 3)] +
                    ';--anim-delay:' + (seededRandom(animSeed + 1) * 4) + 's' +
                    ';--anim-duration:' + (1.5 + seededRandom(animSeed + 2) * 2.5) + 's';
                fragment.appendChild(bulb);
                bulbIdx += 1;
            }
            prevAnchor = anchor;
        }

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathParts.join(' '));
        path.setAttribute('class', 'wire-path');
        svg.appendChild(path);

        // Bulbs are appended during path generation.
    }

    function renderLights() {
        container.innerHTML = '';
        const fragment = document.createDocumentFragment();
        createStrand(12, 20, 42, fragment);
        createStrand(6, 0, 137, fragment);
        container.appendChild(fragment);
    }

    renderLights();

    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(renderLights, 150);
    });
})();
