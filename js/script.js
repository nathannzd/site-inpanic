document.addEventListener('DOMContentLoaded', () => {

  // Menu hamburguer
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');
  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMobile.classList.toggle('open');
    });
    navMobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMobile.classList.remove('open');
      });
    });
  }

  // Link ativo na navbar
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Animações fade-up
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Terminal CMD animado do index
  const terminalBody = document.getElementById('terminal-body');
  if (terminalBody) {

    const session = [
      { type: 'prompt', text: 'inpanic --init projeto_cliente' },
      { type: 'out',    text: 'Lendo o briefing... isso vai demorar.' },
      { type: 'out',    text: 'AVISO: escopo mal definido detectado.' },
      { type: 'out',    text: 'Continuando mesmo assim...' },
      { type: 'out',    text: '' },
      { type: 'prompt', text: 'inpanic --estimate prazo' },
      { type: 'out',    text: 'Calculando prazo realista: 12 semanas.' },
      { type: 'out',    text: 'Aplicando fator otimismo: / 3' },
      { type: 'out',    text: 'Prazo prometido ao cliente: 4 semanas.' },
      { type: 'out',    text: '' },
      { type: 'prompt', text: 'inpanic --deploy --sexta=true --horario=18h' },
      { type: 'out',    text: 'ERRO: 3 dependencias desatualizadas.' },
      { type: 'out',    text: 'Ignorando erros e continuando...' },
      { type: 'out',    text: 'Deploy realizado. Rezando.' },
      { type: 'ok',     text: 'STATUS: ONLINE (por enquanto)' },
      { type: 'ok',     text: 'Uptime: 97.3% | Bugs abertos: 14' },
    ];

    let lineIdx  = 0;
    let charIdx  = 0;
    let typing   = false;
    const rendered = [];

    function buildHTML() {
      terminalBody.innerHTML = '';
      rendered.forEach(line => {
        const div = document.createElement('div');
        div.className = 'cmd-line';
        if (line.type === 'prompt') {
          div.innerHTML = `<span class="cmd-prompt-txt">C:\\INPANIC&gt;</span><span class="cmd-in"> ${line.text}</span>`;
        } else if (line.type === 'ok') {
          div.innerHTML = `<span class="cmd-ok">${line.text}</span>`;
        } else {
          div.innerHTML = `<span class="cmd-out">${line.text || '&nbsp;'}</span>`;
        }
        terminalBody.appendChild(div);
      });
    }

    function typeNext() {
      if (lineIdx >= session.length) {
        // Aguarda e reinicia
        setTimeout(() => {
          lineIdx = 0; charIdx = 0; typing = false;
          rendered.length = 0;
          terminalBody.innerHTML = '';
          typeNext();
        }, 3500);
        return;
      }

      const line = session[lineIdx];

      if (!typing && line.type === 'prompt') {
        typing = true;
        charIdx = 0;
      }

      if (typing) {
        const partial = line.text.slice(0, charIdx + 1);
        buildHTML();
        // Linha sendo digitada
        const cur = document.createElement('div');
        cur.className = 'cmd-line';
        cur.innerHTML = `<span class="cmd-prompt-txt">C:\\INPANIC&gt;</span><span class="cmd-in"> ${partial}</span><span class="cmd-cursor"></span>`;
        terminalBody.appendChild(cur);
        terminalBody.scrollTop = terminalBody.scrollHeight;

        charIdx++;
        if (charIdx < line.text.length) {
          setTimeout(typeNext, 60);
        } else {
          typing = false;
          rendered.push(line);
          lineIdx++;
          setTimeout(typeNext, 300);
        }
      } else {
        rendered.push(line);
        lineIdx++;
        buildHTML();
        terminalBody.scrollTop = terminalBody.scrollHeight;
        const delay = line.type === 'ok' ? 700 : (line.text === '' ? 100 : 280);
        setTimeout(typeNext, delay);
      }
    }

    setTimeout(typeNext, 600);
  }

  // Contadores animados
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (counters.length) {
    const countObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        let cur = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const timer = setInterval(() => {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(timer); }
          el.textContent = cur + suffix;
        }, 35);
        countObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObs.observe(c));
  }

  // Formulário de contato
  const form = document.getElementById('contact-form');
  if (form) {

    function validate(group) {
      const input = group.querySelector('input, textarea, select');
      if (!input) return true;
      const val = input.value.trim();
      let ok = true;
      if (input.required && !val) ok = false;
      if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) ok = false;
      group.classList.toggle('error', !ok);
      return ok;
    }

    form.querySelectorAll('.form-group').forEach(g => {
      const inp = g.querySelector('input, textarea, select');
      if (inp) {
        inp.addEventListener('blur', () => validate(g));
        inp.addEventListener('input', () => { if (g.classList.contains('error')) validate(g); });
      }
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      let allOk = true;
      form.querySelectorAll('.form-group').forEach(g => { if (!validate(g)) allOk = false; });
      if (!allOk) return;

      const btn = form.querySelector('.btn-submit');
      btn.textContent = '> ENTRANDO EM PANICO...';
      btn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        document.getElementById('form-success').style.display = 'block';
      }, 1200);
    });
  }

});
