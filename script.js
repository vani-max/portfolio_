/* ==========================================================================
   VANI VASHISHTHA PORTFOLIO JAVASCRIPT
   Interactivity: Neural Canvas, Quant Alpha Engine, NextFlow DAG, CIFAR-10 Inspector
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initNeuralCanvas();
  initResumeModal();
  initCopyActions();
  initLabTabs();
  initAlphaSimulator();
  initNextFlowDag();
  initCifarInspector();
  initSkillFilters();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. Theme Toggle (Dark/Light)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;

  // Check saved preference or default to dark
  const savedTheme = localStorage.getItem('vani_theme') || 'dark';
  htmlEl.className = savedTheme;

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = htmlEl.classList.contains('dark');
      const nextTheme = isDark ? 'light' : 'dark';
      htmlEl.className = nextTheme;
      localStorage.setItem('vani_theme', nextTheme);
    });
  }
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const hamburger = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   3. Neural Network Particle Canvas
   -------------------------------------------------------------------------- */
function initNeuralCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 12000), 55);

  let mouse = { x: -1000, y: -1000, radius: 120 };

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repel / attract
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 1.5;
        this.y -= (dy / dist) * force * 1.5;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.65)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* --------------------------------------------------------------------------
   4. Resume Modal
   -------------------------------------------------------------------------- */
function initResumeModal() {
  const modal = document.getElementById('resumeModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const triggers = document.querySelectorAll('.resume-modal-trigger');

  if (!modal) return;

  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   5. Toast & Copy Actions
   -------------------------------------------------------------------------- */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function initCopyActions() {
  const email = 'vani.vashishtha2024@nst.rishihood.edu.in';
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyPill = document.querySelector('.email-copy-btn');

  const copyHandler = e => {
    e.preventDefault();
    navigator.clipboard.writeText(email).then(() => {
      showToast('Copied email to clipboard: ' + email);
    });
  };

  if (copyBtn) copyBtn.addEventListener('click', copyHandler);
  if (copyPill) copyPill.addEventListener('click', copyHandler);
}

/* --------------------------------------------------------------------------
   6. Lab Tabs Controller
   -------------------------------------------------------------------------- */
function initLabTabs() {
  const tabs = document.querySelectorAll('.lab-tab-btn');
  const panelAlpha = document.getElementById('labPanelAlpha');
  const panelNextFlow = document.getElementById('labPanelNextFlow');
  const panelCifar = document.getElementById('labPanelCifar');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.lab;
      if (panelAlpha) panelAlpha.classList.toggle('active', target === 'alpha');
      if (panelNextFlow) panelNextFlow.classList.toggle('active', target === 'nextflow');
      if (panelCifar) panelCifar.classList.toggle('active', target === 'cifar');
    });
  });
}

/* --------------------------------------------------------------------------
   7. LAB 1: Quant Alpha Simulator
   -------------------------------------------------------------------------- */
function initAlphaSimulator() {
  const canvas = document.getElementById('alphaChartCanvas');
  const runBtn = document.getElementById('runAlphaBtn');
  const operatorSelect = document.getElementById('alphaOperator');
  const lookbackSlider = document.getElementById('lookbackSlider');
  const lookbackVal = document.getElementById('lookbackVal');
  const formulaDisplay = document.getElementById('alphaFormulaDisplay');

  // Stats elements
  const statSharpe = document.getElementById('statSharpe');
  const statFitness = document.getElementById('statFitness');
  const statReturn = document.getElementById('statReturn');
  const statDrawdown = document.getElementById('statDrawdown');
  const statTurnover = document.getElementById('statTurnover');

  if (!canvas || !runBtn) return;

  const ctx = canvas.getContext('2d');

  if (lookbackSlider && lookbackVal) {
    lookbackSlider.addEventListener('input', e => {
      lookbackVal.textContent = e.target.value;
    });
  }

  const simulateAlpha = () => {
    const operator = operatorSelect.value;
    const lookback = parseInt(lookbackSlider.value, 10);
    const textLabel = operatorSelect.options[operatorSelect.selectedIndex].text;
    if (formulaDisplay) formulaDisplay.textContent = `Current: ${textLabel} | Lookback: ${lookback}d`;

    // Generate pseudo-random realistic equity curve with high Sharpe
    let sharpe, fitness, annReturn, maxDd, turnover;
    let seedDrift = 0.0012;
    let volatility = 0.008;

    if (operator === 'momentum') {
      sharpe = (2.2 + Math.random() * 0.45).toFixed(2);
      fitness = (1.8 + Math.random() * 0.35).toFixed(2);
      annReturn = `+${(24 + Math.random() * 6).toFixed(1)}%`;
      maxDd = `-${(3.8 + Math.random() * 1.5).toFixed(1)}%`;
      turnover = `${(13 + Math.random() * 3).toFixed(1)}%`;
      seedDrift = 0.0014;
    } else if (operator === 'mean_revert') {
      sharpe = (2.55 + Math.random() * 0.4).toFixed(2);
      fitness = (2.1 + Math.random() * 0.4).toFixed(2);
      annReturn = `+${(28 + Math.random() * 5).toFixed(1)}%`;
      maxDd = `-${(3.2 + Math.random() * 1.1).toFixed(1)}%`;
      turnover = `${(18 + Math.random() * 4).toFixed(1)}%`;
      seedDrift = 0.0016;
    } else if (operator === 'volatility') {
      sharpe = (1.95 + Math.random() * 0.35).toFixed(2);
      fitness = (1.6 + Math.random() * 0.3).toFixed(2);
      annReturn = `+${(21 + Math.random() * 4).toFixed(1)}%`;
      maxDd = `-${(4.6 + Math.random() * 1.4).toFixed(1)}%`;
      turnover = `${(10 + Math.random() * 2.5).toFixed(1)}%`;
      seedDrift = 0.0011;
    } else {
      sharpe = (2.4 + Math.random() * 0.4).toFixed(2);
      fitness = (1.9 + Math.random() * 0.35).toFixed(2);
      annReturn = `+${(26 + Math.random() * 5).toFixed(1)}%`;
      maxDd = `-${(3.9 + Math.random() * 1.2).toFixed(1)}%`;
      turnover = `${(15 + Math.random() * 3).toFixed(1)}%`;
      seedDrift = 0.0015;
    }

    statSharpe.textContent = sharpe;
    statFitness.textContent = fitness;
    statReturn.textContent = annReturn;
    statDrawdown.textContent = maxDd;
    statTurnover.textContent = turnover;

    // Build cumulative return series
    const days = 180;
    const points = [1.0];
    for (let t = 1; t < days; t++) {
      const shock = (Math.random() - 0.48) * volatility;
      const r = seedDrift + shock;
      points.push(points[t - 1] * (1 + r));
    }

    // Benchmark curve
    const benchmark = [1.0];
    for (let t = 1; t < days; t++) {
      const bShock = (Math.random() - 0.495) * 0.009;
      benchmark.push(benchmark[t - 1] * (1 + 0.0004 + bShock));
    }

    drawChart(points, benchmark);
    showToast(`Simulation completed! Sharpe: ${sharpe} | Fitness: ${fitness}`);
  };

  const drawChart = (equityCurve, benchCurve) => {
    const w = (canvas.width = canvas.offsetWidth);
    const h = (canvas.height = canvas.offsetHeight);

    ctx.clearRect(0, 0, w, h);

    // Padding
    const pTop = 20;
    const pBottom = 30;
    const pLeft = 45;
    const pRight = 20;

    const minVal = Math.min(...equityCurve, ...benchCurve) * 0.98;
    const maxVal = Math.max(...equityCurve, ...benchCurve) * 1.02;

    const getY = val => h - pBottom - ((val - minVal) / (maxVal - minVal)) * (h - pTop - pBottom);
    const getX = idx => pLeft + (idx / (equityCurve.length - 1)) * (w - pLeft - pRight);

    // Horizontal grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pTop + (i / 4) * (h - pTop - pBottom);
      ctx.beginPath();
      ctx.moveTo(pLeft, y);
      ctx.lineTo(w - pRight, y);
      ctx.stroke();

      const labelVal = (maxVal - (i / 4) * (maxVal - minVal)).toFixed(2);
      ctx.fillStyle = '#64748b';
      ctx.font = '10px JetBrains Mono';
      ctx.textAlign = 'right';
      ctx.fillText(labelVal, pLeft - 8, y + 3);
    }

    // Benchmark line
    ctx.beginPath();
    benchCurve.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Gradient fill under Alpha curve
    const grad = ctx.createLinearGradient(0, pTop, 0, h - pBottom);
    grad.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
    grad.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(equityCurve[0]));
    equityCurve.forEach((val, i) => {
      ctx.lineTo(getX(i), getY(val));
    });
    ctx.lineTo(getX(equityCurve.length - 1), h - pBottom);
    ctx.lineTo(getX(0), h - pBottom);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Alpha curve line
    ctx.beginPath();
    equityCurve.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Legend
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(w - 180, pTop + 5, 12, 3);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '11px Plus Jakarta Sans';
    ctx.textAlign = 'left';
    ctx.fillText('Alpha Strategy PnL', w - 162, pTop + 9);

    ctx.strokeStyle = '#64748b';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(w - 180, pTop + 22);
    ctx.lineTo(w - 168, pTop + 22);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Broad Market Universe', w - 162, pTop + 25);
  };

  runBtn.addEventListener('click', simulateAlpha);
  setTimeout(simulateAlpha, 200);
}

/* --------------------------------------------------------------------------
   8. LAB 2: NextFlow DAG Execution Simulator
   -------------------------------------------------------------------------- */
function initNextFlowDag() {
  const executeBtn = document.getElementById('executeDagBtn');
  const consoleStream = document.getElementById('dagConsoleStream');
  const finalOutput = document.getElementById('dagFinalOutput');

  const nodeInput = document.getElementById('nodeInput');
  const nodeLlm = document.getElementById('nodeLlm');
  const nodeMedia = document.getElementById('nodeMedia');
  const nodeOutput = document.getElementById('nodeOutput');

  const wire1 = document.getElementById('wire1');
  const wire2 = document.getElementById('wire2');
  const wire3 = document.getElementById('wire3');
  const wire4 = document.getElementById('wire4');

  if (!executeBtn || !consoleStream) return;

  let isRunning = false;

  const appendLog = (msg, type = 'normal') => {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type === 'success' ? 'log-success' : type === 'info' ? 'log-info' : 'text-muted'}`;
    const time = new Date().toISOString().substring(11, 19);
    entry.textContent = `[${time}] ${msg}`;
    consoleStream.appendChild(entry);
    consoleStream.scrollTop = consoleStream.scrollHeight;
  };

  const setNodeStatus = (node, status, text) => {
    const pill = node.querySelector('.node-state-pill');
    pill.className = `node-state-pill ${status}`;
    pill.textContent = text;
  };

  executeBtn.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    executeBtn.disabled = true;
    consoleStream.innerHTML = '';

    appendLog('Starting NextFlow Visual DAG Orchestration...', 'info');
    appendLog('DAG validation: 4 active nodes, 4 type-safe edge connections passed.', 'info');

    // Step 1: Input node activation
    nodeInput.classList.add('active-executing');
    setNodeStatus(nodeInput, 'running', 'Emitting');
    wire1.classList.add('active');
    wire2.classList.add('active');

    setTimeout(() => {
      setNodeStatus(nodeInput, 'complete', 'Passed');
      nodeInput.classList.remove('active-executing');
      appendLog('Input payload validated & serialized to JSON stream.', 'success');

      // Step 2: Parallel branch (Groq LLM + Media)
      nodeLlm.classList.add('active-executing');
      nodeMedia.classList.add('active-executing');
      setNodeStatus(nodeLlm, 'running', 'Inferring...');
      setNodeStatus(nodeMedia, 'running', 'Transforming');
      appendLog('[Groq API] Streaming tokens with LLaMA-3 (70B) @ 840 tokens/sec...', 'info');
      appendLog('[Transloadit] Encoding WebP graphic attachments in background worker...', 'info');

      setTimeout(() => {
        wire3.classList.add('active');
        wire4.classList.add('active');
        setNodeStatus(nodeLlm, 'complete', 'Completed');
        setNodeStatus(nodeMedia, 'complete', 'Transcoded');
        nodeLlm.classList.remove('active-executing');
        nodeMedia.classList.remove('active-executing');
        appendLog('[Groq API] LLM inference completed (284 tokens emitted, latency: 142ms).', 'success');
        appendLog('[Transloadit] Media assets processed & signed CDN URL generated.', 'success');

        // Step 3: Sink & Database Persistence
        nodeOutput.classList.add('active-executing');
        setNodeStatus(nodeOutput, 'running', 'Persisting');
        appendLog('[Prisma+Postgres] Writing workflow snapshot & execution trace...', 'info');

        setTimeout(() => {
          setNodeStatus(nodeOutput, 'complete', 'Saved');
          nodeOutput.classList.remove('active-executing');
          wire1.classList.remove('active');
          wire2.classList.remove('active');
          wire3.classList.remove('active');
          wire4.classList.remove('active');

          if (finalOutput) {
            finalOutput.innerHTML = '<span style="color:#10b981;font-weight:600;">Execution Complete (200 OK)</span><br>Workflow ID: #flow_8f3a921c';
          }

          appendLog('DAG execution finished successfully in 1.48s! Result saved to Prisma DB.', 'success');
          showToast('NextFlow DAG pipeline executed successfully!');
          isRunning = false;
          executeBtn.disabled = false;
        }, 800);
      }, 1000);
    }, 600);
  });
}

/* --------------------------------------------------------------------------
   9. LAB 3: CIFAR-10 Visual Inspector
   -------------------------------------------------------------------------- */
function initCifarInspector() {
  const picker = document.getElementById('cifarPicker');
  const selectedLabel = document.getElementById('cifarSelectedLabel');
  const bigEmoji = document.getElementById('cifarBigEmoji');
  const probList = document.getElementById('probBarsList');

  if (!picker || !probList) return;

  const classData = {
    airplane: { emoji: '✈️', accuracy: 84, topProb: 0.88, second: 'ship', secondProb: 0.06 },
    automobile: { emoji: '🚗', accuracy: 88, topProb: 0.91, second: 'truck', secondProb: 0.05 },
    bird: { emoji: '🐦', accuracy: 59, topProb: 0.62, second: 'airplane', secondProb: 0.16 },
    cat: { emoji: '🐱', accuracy: 52, topProb: 0.58, second: 'dog', secondProb: 0.28 },
    deer: { emoji: '🦌', accuracy: 66, topProb: 0.71, second: 'horse', secondProb: 0.14 },
    dog: { emoji: '🐶', accuracy: 58, topProb: 0.64, second: 'cat', secondProb: 0.22 },
    frog: { emoji: '🐸', accuracy: 79, topProb: 0.82, second: 'cat', secondProb: 0.08 },
    horse: { emoji: '🐴', accuracy: 76, topProb: 0.79, second: 'deer', secondProb: 0.11 },
    ship: { emoji: '🚢', accuracy: 82, topProb: 0.86, second: 'airplane', secondProb: 0.08 },
    truck: { emoji: '🚚', accuracy: 81, topProb: 0.84, second: 'automobile', secondProb: 0.11 }
  };

  const allClasses = Object.keys(classData);

  const renderPredictions = className => {
    const data = classData[className];
    if (!data) return;

    if (selectedLabel) selectedLabel.textContent = `${className.toUpperCase()} (Test Holdout Sample)`;
    if (bigEmoji) bigEmoji.textContent = data.emoji;

    probList.innerHTML = '';

    allClasses.forEach(c => {
      let probVal = 0.01;
      if (c === className) {
        probVal = data.topProb;
      } else if (c === data.second) {
        probVal = data.secondProb;
      } else {
        probVal = (Math.random() * 0.02 + 0.005).toFixed(3);
      }

      const percent = (probVal * 100).toFixed(1);

      const row = document.createElement('div');
      row.className = 'prob-bar-row';
      row.innerHTML = `
        <span class="prob-label">${c}</span>
        <div class="prob-track">
          <div class="prob-fill" style="width: ${percent}%;"></div>
        </div>
        <span class="prob-val">${percent}%</span>
      `;
      probList.appendChild(row);
    });
  };

  picker.querySelectorAll('.cifar-class-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      picker.querySelectorAll('.cifar-class-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPredictions(btn.dataset.class);
    });
  });

  renderPredictions('airplane');
}

/* --------------------------------------------------------------------------
   10. Skills Catalog Filter
   -------------------------------------------------------------------------- */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-domain-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      skillCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   11. Contact Form
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('senderName').value;
    const email = document.getElementById('senderEmail').value;
    const subject = document.getElementById('senderSubject').value;
    const message = document.getElementById('senderMessage').value;

    const mailtoUrl = `mailto:vani.vashishtha2024@nst.rishihood.edu.in?subject=${encodeURIComponent(
      `[Portfolio Inquiry] ${subject} from ${name}`
    )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

    window.location.href = mailtoUrl;
    showToast('Drafting email in your default email client...');
    form.reset();
  });
}