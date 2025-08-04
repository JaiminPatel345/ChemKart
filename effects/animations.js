class AnimationManager {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.particles = [];
    this.isAnimating = false;
  }

  start() {
    this.isAnimating = true;
    this.animate();
  }

  stop() {
    this.isAnimating = false;
  }

  createParticle(x, y, color, isExplosion = false) {
    const angle = Math.random() * Math.PI * 2;
    const speed = isExplosion ? Math.random() * 6 + 2 : 2;
    return {
      x: x, y: y,
      vx: isExplosion ? Math.cos(angle) * speed : (Math.random() - 0.5) * 2,
      vy: isExplosion ? Math.sin(angle) * speed : (Math.random() - 1.5) * 2,
      radius: Math.random() * (isExplosion ? 6 : 4) + 2,
      alpha: 1,
      color: color,
    };
  }

  createSuccessParticles() {
    for(let i = 0; i < 30; i++) {
      const x = this.canvas.width / 2 + (Math.random() - 0.5) * 100;
      const y = this.canvas.height / 2 + (Math.random() - 0.5) * 100;
      const colors = ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push(this.createParticle(x, y, color, false));
    }
  }

  createExplosionParticles() {
    for(let i = 0; i < 50; i++) {
      const x = this.canvas.width / 2;
      const y = this.canvas.height / 2;
      this.particles.push(this.createParticle(x, y, '#e74c3c', true));
    }
  }

  createBubbleParticles() {
    if (Math.random() < 0.4) {
      const startX = this.canvas.width / 2 + (Math.random() - 0.5) * 50;
      const startY = this.canvas.height - 10;
      this.particles.push(this.createParticle(startX, startY, 'rgba(255, 255, 255, 0.7)', false));
    }
  }

  animate() {
    if (!this.isAnimating) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Create bubbling animation when heat is applied
    if (window.gameModules && window.gameModules.workbenchContents.tools.includes('Bunsen Burner') &&
        window.gameModules.workbenchContents.elements.length > 0) {
      this.createBubbleParticles();
    }

    // Particle animation logic
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.02;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      } else {
        this.ctx.beginPath();
        this.ctx.globalAlpha = p.alpha;
        this.ctx.fillStyle = p.color;
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
        this.ctx.fill();
        this.ctx.globalAlpha = 1.0;
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}
