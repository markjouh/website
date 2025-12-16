// Christmas lights effect
(function() {
    const container = document.createElement('div');
    container.className = 'christmas-lights';
    document.body.appendChild(container);

    const colors = ['red', 'green', 'blue', 'yellow'];
    const bulbSpacing = 40;
    const droop = 6;

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // Seeded random for consistent results per strand
    function seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    function createStrand(yBase, xOffset, seed) {
        const numBulbs = Math.ceil(window.innerWidth / bulbSpacing) + 2;
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
        const nailSpacing = Math.floor(numBulbs / 4); // roughly 4-5 nails across
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

            // Find distance to nearest nail for gentle arc
            let minDistToNail = numBulbs;
            let prevNail = 0, nextNail = numBulbs;
            for (const nail of nails) {
                if (nail <= i && nail > prevNail) prevNail = nail;
                if (nail >= i && nail < nextNail) nextNail = nail;
            }
            const segmentLength = nextNail - prevNail;
            const posInSegment = i - prevNail;
            // Parabolic sag between nails
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

        // Create bulbs with shuffled colors
        let colorPool = [];
        bulbPositions.forEach((pos) => {
            if (colorPool.length === 0) {
                colorPool = shuffle(colors.slice());
            }

            const bulb = document.createElement('div');
            bulb.className = 'bulb ' + colorPool.pop();
            bulb.style.left = (pos.x - 4) + 'px';
            bulb.style.top = (pos.y) + 'px';

            // Vary animation more dramatically - apply to ::after pseudo-element
            const animations = ['glow', 'glow2', 'glow3'];
            const animName = animations[Math.floor(Math.random() * 3)];
            const animDelay = (Math.random() * 4) + 's';
            const animDuration = (1.5 + Math.random() * 2.5) + 's';
            bulb.style.setProperty('--anim-name', animName);
            bulb.style.setProperty('--anim-delay', animDelay);
            bulb.style.setProperty('--anim-duration', animDuration);
            container.appendChild(bulb);
        });
    }

    // Two rows of lights - second row first (behind), then first row (front)
    createStrand(12, 20, 42);  // back row
    createStrand(6, 0, 137);   // front row
})();
