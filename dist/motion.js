(()=>{
/* Progressive enhancement: content is visible before JS and if animation is unavailable. */
function initMotion(config) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return () => {};
  const played = new WeakSet();
  const animations = new Set();
  const targets = new Map();
  const add = (selector, kind, delay = 0) => {
    if (!selector) return;
    document.querySelectorAll(selector).forEach((element, index) => {
      targets.set(element, { kind, delay: Math.min(index * delay, 160) });
    });
  };
  add(config.reveal, 'rise', 65);
  add(config.art, 'art');
  add(config.hero, 'hero', 70);
  let observer;
  const play = (element) => {
    if (played.has(element)) return;
    played.add(element);
    observer?.unobserve(element);
    element.classList.add('motion-seen');
    if (preference.matches || element.matches(':focus-within')) return;
    const {kind, delay} = targets.get(element);
    const base = getComputedStyle(element).transform;
    const finalTransform = base === 'none' ? '' : base;
    const offset = kind === 'art' ? config.artStart : 'translateY(18px)';
    const duration = kind === 'art' ? 1250 : kind === 'hero' ? 850 : 700;
    const animation = element.animate([
      {opacity: 0, transform: `${finalTransform} ${offset}`.trim()},
      {opacity: 1, transform: finalTransform || 'none'}
    ], {duration, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards'});
    animations.add(animation);
    const remove = () => animations.delete(animation);
    animation.addEventListener('finish', remove, {once: true});
    animation.addEventListener('cancel', remove, {once: true});
  };
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) play(entry.target);
  }, {threshold: .1});
  for (const element of targets.keys()) observer.observe(element);
  const focus = event => {
    for (const element of targets.keys()) if (element.contains(event.target)) {
      played.add(element); observer.unobserve(element); element.classList.add('motion-seen');
      for (const animation of animations) if (animation.effect?.target === element) animation.cancel();
    }
  };
  const reduce = () => {
    if (!preference.matches) return;
    for (const animation of animations) animation.cancel();
  };
  document.addEventListener('focusin', focus);
  preference.addEventListener('change', reduce);
  return () => {
    observer.disconnect();
    for (const animation of animations) animation.cancel();
    document.removeEventListener('focusin', focus);
    preference.removeEventListener('change', reduce);
  };
}

initMotion({"hero": ".hero h1, .hero-subtitle, .hero-description, .hero .button", "art": ".hero-art img", "reveal": ".hero-bottom, .about h2, .occasion-intro h2, .visit h2", "artStart": "translateX(20px) scale(1.04)"});
})();
