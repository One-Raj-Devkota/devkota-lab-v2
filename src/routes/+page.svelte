<script lang="ts">
  import { onMount } from 'svelte';
  import { experiences, projects, site, skills } from '$lib/site';

  let canvas: HTMLCanvasElement;
  let cursorX = -1000;
  let cursorY = -1000;
  let scrollProgress = 0;
  let navOpen = false;

  onMount(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let frame = 0;

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
      pulse: number;
    };

    let particles: Particle[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(125, Math.max(42, Math.floor(width / 13)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.14,
        r: 0.4 + Math.random() * 1.5,
        a: 0.18 + Math.random() * 0.55,
        pulse: Math.random() * Math.PI * 2
      }));
    };

    const draw = () => {
      frame += 0.012;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const alpha = Math.max(0.08, p.a + Math.sin(frame * 1.8 + p.pulse) * 0.12);
        ctx.beginPath();
        ctx.fillStyle = `rgba(160, 190, 255, ${alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        const dx = p.x - cursorX;
        const dy = p.y - cursorY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 155) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(123, 97, 255, ${0.16 * (1 - distance / 155)})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(cursorX, cursorY);
          ctx.stroke();
        }
      }

      if (!reduced) requestAnimationFrame(draw);
    };

    resize();
    draw();

    const onResize = () => resize();
    const onPointer = (event: PointerEvent) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      document.documentElement.style.setProperty('--mx', `${event.clientX}px`);
      document.documentElement.style.setProperty('--my', `${event.clientY}px`);
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      scrollProgress = max > 0 ? Math.min(1, scrollY / max) : 0;
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        }
      },
      { threshold: 0.14 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
      const move = (event: PointerEvent) => {
        if (reduced) return;
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * 8;
        const ry = (px - 0.5) * 10;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
        card.style.setProperty('--card-x', `${px * 100}%`);
        card.style.setProperty('--card-y', `${py * 100}%`);
      };
      const leave = () => (card.style.transform = '');
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', leave);
    });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  });

  const formReady = !site.formspreeEndpoint.includes('REPLACE_WITH_YOUR_FORM_ID');
</script>

<svelte:head>
  <title>{site.brand} | {site.name}</title>
  <meta
    name="description"
    content="One-Raj Devkotaの個人ポートフォリオ。Web開発、Software Testing、学習・制作物を紹介しています。"
  />
</svelte:head>

<canvas class="stars" bind:this={canvas} aria-hidden="true"></canvas>
<div class="noise" aria-hidden="true"></div>
<div class="cursor-glow" aria-hidden="true"></div>
<div class="scroll-line" style={`transform: scaleX(${scrollProgress})`}></div>

<header class="nav-wrap">
  <a class="brand" href="#top" aria-label="Devkota Lab home">
    <span class="brand-orbit"><i></i></span>
    <span>
      <b>Devkota <em>Lab</em></b>
      <small>BUILD · LEARN · CREATE · BEYOND</small>
    </span>
  </a>

  <button
    class="menu"
    aria-label="menu"
    aria-expanded={navOpen}
    onclick={() => (navOpen = !navOpen)}
  >
    <span></span><span></span>
  </button>

  <nav class:open={navOpen}>
    <a href="#about" onclick={() => (navOpen = false)}>About</a>
    <a href="#skills" onclick={() => (navOpen = false)}>Skills</a>
    <a href="#projects" onclick={() => (navOpen = false)}>Projects</a>
    <a href="#experience" onclick={() => (navOpen = false)}>Experience</a>
    <a href="#contact" onclick={() => (navOpen = false)}>Contact</a>
    <a class="connect mini" href="#contact" onclick={() => (navOpen = false)}>Let's Connect <span>↗</span></a>
  </nav>
</header>

<main>
  <section class="hero" id="top">
    <div class="aurora aurora-a"></div>
    <div class="aurora aurora-b"></div>
    <div class="hero-grid"></div>

    <div class="hero-copy reveal visible">
      <p class="kicker"><span></span> SYSTEM ENGINEER / WEB DEVELOPER</p>
      <h1>
        Build a<br />
        <span class="gradient-text">Better Tomorrow.</span>
      </h1>
      <p class="hello">Hi, I'm <strong>{site.name}.</strong></p>
      <p class="hero-description">
        Webシステム開発・テストの経験を土台に、技術を学び、試し、
        小さなアイデアを実際に動くものへ変えていく。
      </p>

      <div class="hero-actions">
        <a class="connect" href="#projects">View My Work <span>→</span></a>
        <a class="ghost" href={site.github} target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
      </div>

      <div class="social-row">
        <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub">GH</a>
        <a href="#contact" aria-label="Email">@</a>
        <span class="availability"><i></i> Open to learning & new opportunities</span>
      </div>
    </div>

    <div class="orb-stage reveal visible" aria-hidden="true">
      <div class="planet">
        <div class="planet-light"></div>
        <div class="planet-ring ring-one"></div>
        <div class="planet-ring ring-two"></div>
        <div class="planet-ring ring-three"></div>
        <span class="satellite sat-a"></span>
        <span class="satellite sat-b"></span>
      </div>
      <div class="orbit-label">DEVKOTA LAB · JAPAN · 2026</div>
      <div class="floating-card">
        <span class="quote">“</span>
        <b>Technology</b>
        <p>Connect ideas, people and possibilities.</p>
      </div>
    </div>

    <div class="metrics glass reveal">
      <div><strong>3+</strong><span>Years Experience</span></div>
      <div><strong>Web</strong><span>Development</span></div>
      <div><strong>Test</strong><span>Quality Focus</span></div>
      <div><strong>∞</strong><span>Curiosity</span></div>
    </div>
  </section>

  <section class="section" id="about">
    <div class="section-label reveal"><span>01</span> ABOUT ME</div>
    <div class="about-layout">
      <div class="about-copy reveal">
        <h2>Turning Ideas<br />into <span>Impact.</span></h2>
        <p class="lead">
          約3年間、Webシステム開発案件に携わり、主に単体テスト・システムテストを担当してきました。
        </p>
        <p>
          新規開発、既存画面の改修、管理画面実装、一部の運用保守も経験。
          現在はWeb開発を軸に、AI・セキュリティなど新しい分野も継続的に学んでいます。
        </p>
      </div>

      <div class="value-grid reveal">
        <article data-tilt>
          <i>✦</i><div><b>Problem Solver</b><span>課題を小さく分解して前に進める。</span></div>
        </article>
        <article data-tilt>
          <i>◎</i><div><b>Quality Mindset</b><span>テスト経験を活かして品質を見る。</span></div>
        </article>
        <article data-tilt>
          <i>⌘</i><div><b>Lifelong Learner</b><span>知らないことを学び続ける。</span></div>
        </article>
        <article data-tilt>
          <i>◉</i><div><b>Global Mindset</b><span>日本で働き、多様な視点を大切にする。</span></div>
        </article>
      </div>

      <div class="japan-card reveal" data-tilt>
        <div class="sun"></div>
        <div class="mountain m1"></div>
        <div class="mountain m2"></div>
        <div class="city"></div>
        <div class="japan-caption"><span>●</span> Based in Japan</div>
      </div>
    </div>
  </section>

  <section class="section skills-section" id="skills">
    <div class="section-label reveal"><span>02</span> SKILLS & TECHNOLOGIES</div>
    <div class="heading-row reveal">
      <div>
        <h2>Tools I Work With</h2>
        <p>実務経験と学習経験を含む技術スタック。</p>
      </div>
    </div>

    <div class="skills-grid">
      {#each skills as skill, i}
        <article class="skill-card reveal" data-tilt style={`--delay:${i * 35}ms`}>
          <div class="skill-icon">{skill.name.slice(0, 2).toUpperCase()}</div>
          <div class="skill-meta"><b>{skill.name}</b><span>{skill.group}</span></div>
          <div class="skill-track"><i style={`width:${skill.level}%`}></i></div>
        </article>
      {/each}
    </div>
    <p class="skill-note reveal">
      ※ 数値は資格点数ではなく、ポートフォリオ上の視覚表現。技術ごとに実務経験の深さは異なります。
    </p>
  </section>

  <section class="section" id="projects">
    <div class="section-label reveal"><span>03</span> FEATURED PROJECTS</div>
    <div class="heading-row reveal">
      <div>
        <h2>Things I've Built</h2>
        <p>制作物を少しずつ増やしていく場所。</p>
      </div>
    </div>

    <div class="projects-grid">
      {#each projects as project}
        <article class="project-card reveal" data-tilt>
          <div class="project-visual">
            <div class="project-orb"></div>
            <div class="project-lines"></div>
            <span>{project.number}</span>
          </div>
          <div class="project-body">
            <div class="project-topline"><span>{project.type}</span><b>{project.status}</b></div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div class="tags">
              {#each project.tags as tag}<span>{tag}</span>{/each}
            </div>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <section class="section" id="experience">
    <div class="section-label reveal"><span>04</span> EXPERIENCE</div>
    <div class="journey reveal">
      <div class="journey-copy">
        <h2>My Journey</h2>
        <p>経験と学習を、次の挑戦へつなげる。</p>
      </div>
      <div class="timeline">
        {#each experiences as experience}
          <article>
            <span class="timeline-dot"></span>
            <small>{experience.period}</small>
            <h3>{experience.title}</h3>
            <p>{experience.summary}</p>
          </article>
        {/each}
      </div>
      <blockquote>
        <span>“</span>
        Small steps,<br />better every day.
        <small>— Devkota Lab</small>
      </blockquote>
    </div>
  </section>

  <section class="section contact-section" id="contact">
    <div class="section-label reveal"><span>05</span> CONTACT</div>
    <div class="contact-grid">
      <div class="contact-copy reveal">
        <h2>Let's Build<br /><span>Something Great.</span></h2>
        <p>仕事・技術・制作物についてのご連絡はこちらから。</p>
        <div class="contact-facts">
          <div><i>⌖</i><span>{site.location}</span></div>
          <div><i>●</i><span>Open to opportunities</span></div>
          <div><i>GH</i><a href={site.github} target="_blank" rel="noreferrer">GitHub Profile</a></div>
        </div>
      </div>

      <form
        class="contact-form glass reveal"
        action={formReady ? site.formspreeEndpoint : undefined}
        method="POST"
      >
        <div class="form-row">
          <label>Your Name<input required name="name" placeholder="お名前" /></label>
          <label>Your Email<input required type="email" name="email" placeholder="you@example.com" /></label>
        </div>
        <label>Subject<input required name="subject" placeholder="お問い合わせ件名" /></label>
        <label>Message<textarea required name="message" rows="6" placeholder="お問い合わせ内容"></textarea></label>
        <input type="hidden" name="_subject" value="Devkota Lab Website Contact" />
        <button class="connect" disabled={!formReady}>
          {formReady ? 'Send Message' : 'Formspree IDを設定すると送信可能'} <span>→</span>
        </button>
        {#if !formReady}
          <p class="form-note">
            公開前に <code>src/lib/site.ts</code> の <code>formspreeEndpoint</code> を設定してください。
          </p>
        {/if}
      </form>
    </div>
  </section>
</main>

<footer>
  <a class="brand footer-brand" href="#top">
    <span class="brand-orbit"><i></i></span>
    <span><b>Devkota <em>Lab</em></b><small>BUILD · LEARN · CREATE · BEYOND</small></span>
  </a>
  <p>© 2026 {site.name}. Built with SvelteKit.</p>
  <a class="to-top" href="#top">↑</a>
</footer>

<style>
  :global(*) { box-sizing: border-box; }
  :global(html) {
    scroll-behavior: smooth;
    background: #070912;
    --mx: 50vw;
    --my: 30vh;
  }
  :global(body) {
    margin: 0;
    min-width: 320px;
    color: #f7f8ff;
    background:
      radial-gradient(circle at 72% 4%, rgba(23, 74, 170, .24), transparent 28rem),
      radial-gradient(circle at 9% 33%, rgba(137, 52, 255, .13), transparent 27rem),
      #070912;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    overflow-x: hidden;
  }
  :global(a) { color: inherit; text-decoration: none; }
  :global(button), :global(input), :global(textarea) { font: inherit; }
  :global(::selection) { background: #8e5cff; color: white; }

  .stars {
    position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none;
  }
  .noise {
    position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: .025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E");
  }
  .cursor-glow {
    position: fixed; left: var(--mx); top: var(--my); width: 34rem; height: 34rem; z-index: 0;
    transform: translate(-50%, -50%); pointer-events: none; border-radius: 50%;
    background: radial-gradient(circle, rgba(69, 156, 255, .12), rgba(152, 77, 255, .06) 35%, transparent 67%);
    filter: blur(12px);
  }
  .scroll-line {
    position: fixed; top: 0; left: 0; width: 100%; height: 2px; z-index: 100; transform-origin: left;
    background: linear-gradient(90deg, #36d8ff, #7857ff, #ff48cf);
    box-shadow: 0 0 14px rgba(121, 85, 255, .8);
  }

  .nav-wrap {
    position: fixed; z-index: 50; left: 50%; top: 18px; transform: translateX(-50%);
    width: min(1180px, calc(100% - 38px)); display: flex; align-items: center; justify-content: space-between;
    padding: 12px 15px 12px 12px; border: 1px solid rgba(155, 183, 255, .12); border-radius: 18px;
    background: rgba(7, 10, 22, .56); backdrop-filter: blur(24px) saturate(150%);
    box-shadow: 0 18px 70px rgba(0,0,0,.18);
  }
  .brand { display: flex; align-items: center; gap: 11px; }
  .brand-orbit {
    width: 38px; height: 38px; border: 1px solid rgba(128, 183, 255, .27); border-radius: 12px;
    display: grid; place-items: center; position: relative; background: linear-gradient(145deg, rgba(42,125,255,.16), rgba(164,78,255,.15));
  }
  .brand-orbit:before, .brand-orbit:after {
    content: ""; position: absolute; border: 1px solid rgba(101, 196, 255, .65); border-radius: 50%; width: 21px; height: 8px;
    transform: rotate(24deg);
  }
  .brand-orbit:after { transform: rotate(-34deg); border-color: rgba(231, 86, 255, .5); }
  .brand-orbit i { width: 4px; height: 4px; border-radius: 50%; background: #a8eaff; box-shadow: 0 0 13px #59dfff; }
  .brand b { display: block; font-size: 14px; letter-spacing: .02em; }
  .brand em { font-style: normal; color: #a685ff; }
  .brand small { display: block; margin-top: 1px; color: #65738f; font-size: 8px; letter-spacing: .17em; }
  nav { display: flex; align-items: center; gap: 23px; font-size: 12px; color: #c7cce0; }
  nav a:not(.connect) { transition: .25s ease; }
  nav a:not(.connect):hover { color: white; text-shadow: 0 0 12px rgba(132,181,255,.7); }
  .menu { display:none; }

  main, footer { position: relative; z-index: 2; }
  .hero {
    min-height: 100svh; padding: 152px max(5vw, calc((100vw - 1180px)/2)) 60px; position: relative;
    display: grid; grid-template-columns: 1.03fr .97fr; align-items: center; gap: 4vw; overflow: hidden;
  }
  .hero-grid {
    position: absolute; inset: 0; pointer-events: none; opacity: .12;
    background-image: linear-gradient(rgba(92,142,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(92,142,255,.18) 1px, transparent 1px);
    background-size: 58px 58px;
    mask-image: radial-gradient(circle at 63% 44%, black 0, transparent 67%);
  }
  .aurora { position: absolute; border-radius: 50%; filter: blur(70px); opacity: .2; pointer-events: none; }
  .aurora-a { width: 38rem; height: 14rem; right: -8rem; top: 10rem; background: #256cff; transform: rotate(-22deg); }
  .aurora-b { width: 28rem; height: 12rem; left: -10rem; bottom: 5rem; background: #b029ff; transform: rotate(22deg); }

  .hero-copy { max-width: 650px; }
  .kicker { color: #a6b3d0; letter-spacing: .16em; font-size: 12px; }
  .kicker span { display:inline-block; width: 18px; height: 1px; vertical-align: middle; background:#5edaff; margin-right: 8px; box-shadow: 0 0 12px #5edaff; }
  h1 { font-size: clamp(57px, 7.7vw, 105px); letter-spacing: -.065em; line-height: .91; margin: 20px 0 18px; }
  .gradient-text {
    color: transparent; background: linear-gradient(90deg,#4ee2ff 2%,#5f99ff 34%,#9b6aff 66%,#ff4ac9 100%);
    background-clip: text; -webkit-background-clip:text; filter: drop-shadow(0 0 22px rgba(102,127,255,.18));
  }
  .hello { margin: 0 0 10px; font-size: clamp(22px,3vw,33px); font-weight: 700; letter-spacing: -.03em; }
  .hello strong { color: #8eafff; }
  .hero-description { color: #aeb8d0; max-width: 610px; font-size: 16px; line-height: 1.85; }
  .hero-actions { display:flex; flex-wrap:wrap; gap: 12px; margin-top: 29px; }
  .connect, .ghost {
    border: 0; min-height: 47px; padding: 0 21px; border-radius: 12px; display:inline-flex; align-items:center; justify-content:center; gap:17px;
    font-weight: 750; font-size: 13px; cursor:pointer; transition: transform .25s ease, box-shadow .25s ease, opacity .25s ease;
  }
  .connect {
    color: white; background: linear-gradient(100deg,#228fff,#7867ff 48%,#fa4bd0);
    box-shadow: 0 0 0 1px rgba(196,211,255,.25) inset, 0 0 25px rgba(81,107,255,.28), 0 8px 28px rgba(0,0,0,.3);
  }
  .connect:hover:not(:disabled), .ghost:hover { transform: translateY(-2px); }
  .connect:hover:not(:disabled) { box-shadow:0 0 0 1px rgba(220,230,255,.4) inset,0 0 34px rgba(126,89,255,.48),0 12px 36px rgba(0,0,0,.3); }
  .connect:disabled { opacity: .5; cursor:not-allowed; }
  .connect.mini { min-height: 36px; padding: 0 16px; font-size: 11px; }
  .ghost { border: 1px solid rgba(144,162,215,.29); background: rgba(13,20,42,.48); color:#d7dcee; }
  .social-row { display:flex; align-items:center; gap:9px; margin-top: 22px; }
  .social-row > a {
    width:34px;height:34px;border:1px solid rgba(134,169,237,.18);border-radius:10px;display:grid;place-items:center;
    color:#a9c9ff;background:rgba(8,14,31,.58);font-size:11px;font-weight:800;
  }
  .availability { color:#7f8ba7;font-size:11px;margin-left:8px;display:flex;gap:8px;align-items:center; }
  .availability i {width:6px;height:6px;border-radius:50%;background:#43e79f;box-shadow:0 0 11px #43e79f;}

  .orb-stage { min-height: 560px; position: relative; display: grid; place-items: center; }
  .planet {
    width: min(34vw, 470px); aspect-ratio:1; border-radius:50%; position:relative;
    background:
      radial-gradient(circle at 36% 29%, rgba(215,248,255,.96) 0 1%, transparent 3%),
      radial-gradient(circle at 40% 40%, transparent 15%, rgba(52,181,255,.16) 47%, rgba(27,64,160,.46) 70%, rgba(4,12,39,.95) 74%),
      conic-gradient(from 60deg,#0b1738,#2764c1,#0b2349,#393aa1,#08234a,#0b1738);
    box-shadow: inset -55px -25px 75px rgba(2,5,22,.84), inset 30px 0 55px rgba(64,197,255,.28), 0 0 18px rgba(76,176,255,.58),0 0 90px rgba(26,102,255,.24);
    animation: planetFloat 7s ease-in-out infinite;
  }
  .planet:before {
    content:"";position:absolute;inset:10%;border-radius:50%;opacity:.6;
    background-image: radial-gradient(circle at 20% 34%,#63caff 0 1px,transparent 2px),radial-gradient(circle at 62% 23%,#96dbff 0 1px,transparent 2px),radial-gradient(circle at 74% 65%,#8887ff 0 1px,transparent 2px),radial-gradient(circle at 48% 72%,#54b9ff 0 1px,transparent 2px);
    background-size: 43px 40px,55px 47px,61px 52px,37px 45px;
    filter: drop-shadow(0 0 4px #65c9ff);
  }
  .planet-light {position:absolute;inset:-3%;border-radius:50%;border:1px solid rgba(89,204,255,.46);box-shadow:0 0 33px rgba(70,176,255,.27);}
  .planet-ring {position:absolute;left:50%;top:50%;border:1px solid rgba(112,143,255,.33);border-radius:50%;transform:translate(-50%,-50%) rotate(-14deg);}
  .ring-one{width:138%;height:44%;}.ring-two{width:148%;height:58%;transform:translate(-50%,-50%) rotate(18deg);}.ring-three{width:120%;height:92%;transform:translate(-50%,-50%) rotate(70deg);}
  .satellite {position:absolute;width:7px;height:7px;background:#fff;border-radius:50%;box-shadow:0 0 8px #fff,0 0 18px #6ee4ff;}
  .sat-a{left:-14%;top:50%;animation:blink 2.3s ease-in-out infinite}.sat-b{right:-9%;top:27%;animation:blink 1.8s ease-in-out infinite reverse}
  .orbit-label {position:absolute;right:4%;top:16%;font-size:9px;letter-spacing:.18em;color:#64708b;writing-mode:vertical-rl;}
  .floating-card {
    position:absolute;right:-2%;bottom:14%;width:210px;padding:17px;border:1px solid rgba(130,151,255,.27);border-radius:14px;
    background:rgba(9,18,47,.55);backdrop-filter:blur(15px);box-shadow:0 20px 70px rgba(0,0,0,.27);
  }
  .floating-card .quote {color:#b4c8ff;font-size:28px;line-height:1}.floating-card b{font-size:13px}.floating-card p{color:#8e9ab6;font-size:11px;line-height:1.6;margin-bottom:0}

  .glass { border:1px solid rgba(128,159,225,.18); background:rgba(11,18,39,.6); backdrop-filter:blur(20px); }
  .metrics {
    grid-column:1/-1;display:grid;grid-template-columns:repeat(4,1fr);border-radius:16px;padding:20px 25px;margin-top:18px;
    box-shadow:inset 0 1px rgba(255,255,255,.025),0 18px 70px rgba(0,0,0,.18);
  }
  .metrics div{display:flex;flex-direction:column;gap:3px;padding:4px 25px;border-right:1px solid rgba(114,139,193,.14)}.metrics div:last-child{border-right:0}
  .metrics strong{font-size:25px;color:#f4f8ff}.metrics span{font-size:10px;color:#74819c;text-transform:uppercase;letter-spacing:.1em}

  .section {
    width:min(1180px,90vw);margin:0 auto;padding:105px 0;position:relative;border-top:1px solid rgba(105,133,191,.12);
  }
  .section-label{color:#6f7c99;font-size:10px;letter-spacing:.19em;margin-bottom:22px}.section-label span{color:#55bdfd;margin-right:8px}
  .section h2 {font-size:clamp(38px,5vw,65px);line-height:1.03;letter-spacing:-.05em;margin:0}.section h2 span{color:#9d72ff}
  .about-layout{display:grid;grid-template-columns:1.05fr 1fr .72fr;gap:22px;align-items:stretch}
  .about-copy{padding-right:18px}.about-copy .lead{font-size:18px;color:#d4d9e7;line-height:1.65;margin:25px 0 14px}.about-copy p:not(.lead){font-size:14px;color:#8995ad;line-height:1.85}
  .value-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px;align-content:center}
  .value-grid article {
    --card-x:50%;--card-y:50%;min-height:120px;padding:17px;border:1px solid rgba(124,153,218,.17);border-radius:14px;background:
      radial-gradient(circle at var(--card-x) var(--card-y),rgba(112,83,255,.13),transparent 38%),rgba(10,17,37,.62);
    display:flex;gap:14px;transition:transform .18s ease, border-color .2s ease;transform-style:preserve-3d;
  }
  .value-grid article:hover{border-color:rgba(119,166,255,.37)}.value-grid i{font-style:normal;color:#65dfff;font-size:20px;text-shadow:0 0 13px rgba(86,215,255,.65)}
  .value-grid b{display:block;font-size:12px;margin-bottom:6px}.value-grid span{font-size:10px;color:#7e8aa5;line-height:1.55}
  .japan-card{position:relative;overflow:hidden;border:1px solid rgba(143,162,220,.2);border-radius:16px;background:linear-gradient(#111b47 5%,#ff7c8c 54%,#0e1735 55%);min-height:310px;transform-style:preserve-3d;transition:.18s ease}
  .sun{position:absolute;width:90px;height:90px;border-radius:50%;background:#ffd3b0;right:22px;top:35px;box-shadow:0 0 42px rgba(255,151,134,.7)}
  .mountain{position:absolute;bottom:52px;width:0;height:0;border-left:125px solid transparent;border-right:125px solid transparent;border-bottom:170px solid #13264b;filter:drop-shadow(0 -4px 6px rgba(255,255,255,.12))}
  .m1{left:6px}.m2{right:-60px;border-left-width:100px;border-right-width:100px;border-bottom-width:128px;border-bottom-color:#1a1d4e}
  .city{position:absolute;left:0;right:0;bottom:41px;height:42px;background:repeating-linear-gradient(90deg,#080d20 0 11px,transparent 11px 16px)}
  .japan-caption{position:absolute;left:0;right:0;bottom:0;height:48px;display:flex;align-items:center;gap:8px;padding:0 16px;background:rgba(6,10,25,.85);font-size:11px}.japan-caption span{color:#53dcff}

  .heading-row{display:flex;justify-content:space-between;align-items:end;margin-bottom:30px}.heading-row h2{font-size:42px}.heading-row p{font-size:12px;color:#7c89a4;margin-bottom:0}
  .skills-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:11px}
  .skill-card{
    --card-x:50%;--card-y:50%;min-height:135px;padding:15px;border:1px solid rgba(115,151,226,.17);border-radius:13px;
    background:radial-gradient(circle at var(--card-x) var(--card-y),rgba(92,91,255,.15),transparent 45%),rgba(9,15,33,.62);
    transition:transform .18s ease,border-color .2s ease;transform-style:preserve-3d;
  }
  .skill-card:hover{border-color:rgba(77,206,255,.35)}.skill-icon{width:40px;height:40px;display:grid;place-items:center;border:1px solid rgba(78,190,255,.25);border-radius:11px;color:#70dcff;background:rgba(36,104,196,.12);font-size:10px;font-weight:900;box-shadow:inset 0 0 20px rgba(64,131,255,.08)}
  .skill-meta{display:flex;justify-content:space-between;gap:8px;margin-top:16px}.skill-meta b{font-size:11px}.skill-meta span{font-size:8px;color:#687690}
  .skill-track{height:2px;background:#17223c;margin-top:12px;overflow:hidden;border-radius:99px}.skill-track i{display:block;height:100%;background:linear-gradient(90deg,#29ceff,#8368ff,#e94ed4);box-shadow:0 0 10px #756dff}
  .skill-note{font-size:9px;color:#596680;margin-top:13px}

  .projects-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
  .project-card{--card-x:50%;--card-y:50%;border:1px solid rgba(126,154,219,.19);border-radius:17px;overflow:hidden;background:rgba(8,14,31,.67);transition:transform .18s ease,border-color .2s ease;transform-style:preserve-3d}
  .project-card:hover{border-color:rgba(113,181,255,.42)}
  .project-visual{height:190px;position:relative;overflow:hidden;background:radial-gradient(circle at 65% 40%,rgba(87,84,255,.32),transparent 35%),linear-gradient(145deg,#070b1a,#0e2144 55%,#160d38)}
  .project-orb{position:absolute;width:120px;height:120px;border-radius:50%;right:22px;top:28px;background:radial-gradient(circle at 35% 32%,#bff7ff 0 2%,#3a9fff 7%,#2950a3 42%,#0b0f31 68%);box-shadow:0 0 40px rgba(59,118,255,.4)}
  .project-lines{position:absolute;inset:0;background:repeating-linear-gradient(120deg,transparent 0 34px,rgba(87,128,255,.06) 35px,transparent 36px)}
  .project-visual>span{position:absolute;left:18px;bottom:15px;color:#6d7f9f;font-size:11px;letter-spacing:.14em}
  .project-body{padding:20px}.project-topline{display:flex;justify-content:space-between;color:#687791;font-size:9px;letter-spacing:.1em}.project-topline b{color:#5ee2ff}
  .project-body h3{font-size:22px;margin:10px 0 8px}.project-body p{font-size:11px;color:#8996af;line-height:1.72;min-height:58px}.tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:17px}.tags span{font-size:8px;padding:5px 8px;border:1px solid rgba(116,153,230,.2);border-radius:999px;color:#93a4c7;background:#0b1429}

  .journey{display:grid;grid-template-columns:.65fr 2fr .65fr;gap:30px;align-items:start}.journey-copy h2{font-size:42px}.journey-copy p{font-size:11px;color:#73819d}
  .timeline{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:20px;padding-top:30px}.timeline:before{content:"";position:absolute;left:0;right:0;top:9px;height:1px;background:linear-gradient(90deg,#4cdcff,#695fff,#ff53c7);box-shadow:0 0 12px rgba(88,120,255,.5)}
  .timeline article{position:relative}.timeline-dot{position:absolute;width:10px;height:10px;border-radius:50%;background:#94eaff;top:-26px;left:0;box-shadow:0 0 0 3px rgba(80,162,255,.14),0 0 13px #5bcfff}
  .timeline small{font-size:9px;color:#71809e}.timeline h3{font-size:14px;margin:7px 0 8px}.timeline p{font-size:10px;line-height:1.65;color:#76839f}
  blockquote{margin:0;padding:20px;border:1px solid rgba(132,103,255,.27);border-radius:14px;background:linear-gradient(145deg,rgba(30,21,70,.46),rgba(12,16,36,.65));font-size:15px;line-height:1.55;color:#d9d9ef;box-shadow:0 0 40px rgba(85,52,255,.08)}
  blockquote>span{color:#9e8bff;font-size:29px}blockquote small{display:block;margin-top:17px;text-align:right;color:#737f9b;font-size:9px}

  .contact-section{padding-bottom:90px}.contact-grid{display:grid;grid-template-columns:.7fr 1.3fr;gap:45px}.contact-copy h2{font-size:48px}.contact-copy p{color:#8490a9;font-size:12px;line-height:1.7}.contact-facts{margin-top:24px;display:grid;gap:10px}.contact-facts div{display:flex;gap:11px;align-items:center;color:#a8b2c7;font-size:11px}.contact-facts i{width:29px;height:29px;border:1px solid rgba(112,153,226,.17);border-radius:9px;display:grid;place-items:center;color:#63d6ff;font-style:normal;font-size:9px;background:#0a1428}
  .contact-form{padding:24px;border-radius:17px;display:grid;gap:14px}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.contact-form label{display:grid;gap:6px;color:#75839d;font-size:9px;text-transform:uppercase;letter-spacing:.08em}
  .contact-form input,.contact-form textarea{width:100%;border:1px solid rgba(115,153,226,.15);background:#0b1630;color:#e9edfa;border-radius:9px;padding:12px 13px;outline:none;text-transform:none;letter-spacing:0;font-size:11px;resize:vertical;transition:.2s}
  .contact-form input:focus,.contact-form textarea:focus{border-color:rgba(78,201,255,.5);box-shadow:0 0 0 3px rgba(60,143,255,.08),0 0 25px rgba(77,114,255,.08)}
  .contact-form .connect{justify-self:end;min-width:190px}.form-note{font-size:9px;color:#66738e;text-align:right;margin:0}.form-note code{color:#a895ff}

  footer{width:min(1180px,90vw);margin:auto;padding:28px 0 48px;border-top:1px solid rgba(106,132,190,.12);display:flex;align-items:center;justify-content:space-between;gap:20px;color:#697690;font-size:9px}
  .footer-brand .brand-orbit{width:32px;height:32px}.to-top{width:38px;height:38px;display:grid;place-items:center;border:1px solid rgba(123,157,220,.22);border-radius:50%;color:#b8c5e3;background:#0a1125}

  .reveal{opacity:0;transform:translateY(22px);transition:opacity .75s ease,transform .75s cubic-bezier(.2,.75,.25,1)}.reveal.visible{opacity:1;transform:none}
  @keyframes planetFloat{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-12px) rotate(2deg)}}
  @keyframes blink{0%,100%{opacity:.35;transform:scale(.75)}50%{opacity:1;transform:scale(1.3)}}

  @media (max-width: 980px){
    .nav-wrap{top:10px}.menu{display:grid;width:40px;height:40px;border:0;background:transparent;place-content:center;gap:6px}.menu span{display:block;width:18px;height:1px;background:#d9e1f2}
    nav{display:none;position:absolute;left:0;right:0;top:68px;padding:20px;flex-direction:column;align-items:stretch;border:1px solid rgba(132,158,218,.14);border-radius:15px;background:rgba(6,10,23,.96);backdrop-filter:blur(20px)}nav.open{display:flex}
    .hero{grid-template-columns:1fr;padding-top:125px}.orb-stage{min-height:430px}.planet{width:min(70vw,390px)}.floating-card{right:3%}.metrics{grid-template-columns:repeat(2,1fr)}.metrics div:nth-child(2){border-right:0}
    .about-layout{grid-template-columns:1fr 1fr}.about-copy{grid-column:1/-1}.japan-card{min-height:260px}.skills-grid{grid-template-columns:repeat(3,1fr)}.projects-grid{grid-template-columns:1fr}.journey{grid-template-columns:1fr}.timeline{margin:10px 0}.contact-grid{grid-template-columns:1fr}
  }
  @media (max-width: 640px){
    .nav-wrap{width:calc(100% - 20px)}.brand small{display:none}.hero{padding-left:5vw;padding-right:5vw}.hero-description{font-size:14px}.orb-stage{min-height:350px}.floating-card{width:180px;bottom:4%}.metrics{padding:12px}.metrics div{padding:8px 12px}.metrics strong{font-size:20px}
    .section{padding:78px 0}.about-layout{grid-template-columns:1fr}.value-grid{grid-template-columns:1fr 1fr}.skills-grid{grid-template-columns:repeat(2,1fr)}.skill-card{min-height:125px}.timeline{grid-template-columns:1fr;padding-left:20px}.timeline:before{left:4px;top:0;bottom:0;width:1px;height:auto}.timeline article{padding-bottom:22px}.timeline-dot{top:4px;left:-20px}.form-row{grid-template-columns:1fr}.contact-form .connect{justify-self:stretch}.heading-row h2{font-size:34px}footer{align-items:flex-start;flex-direction:column}.to-top{position:absolute;right:0;top:27px}
  }
  @media (prefers-reduced-motion: reduce){
    :global(html){scroll-behavior:auto}.planet,.satellite{animation:none!important}.reveal{opacity:1;transform:none;transition:none}
  }
</style>
