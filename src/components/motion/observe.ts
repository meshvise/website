/**
 * Quand une figure joue, et quand elle se tait.
 *
 * Les figures tournent sur une horloge de temps. Livrées à elles-mêmes,
 * elles ont deux défauts : un lecteur qui arrive au milieu d'une séquence
 * ne comprend pas ce qu'il voit, et six figures animées en permanence font
 * travailler le navigateur pour des dessins que personne ne regarde.
 *
 * Ce module corrige les deux avec une seule mesure : le cycle repart de
 * zéro quand la figure entre dans l'écran, et se met en pause quand elle en
 * sort. Le lecteur voit donc toujours le premier acte en premier, et une
 * seule figure travaille à la fois.
 *
 * Ce n'est pas un pilotage par le défilement : le mouvement garde son
 * rythme propre, il ne se calque pas sur le geste du lecteur. Une molette
 * avance par paliers, et une animation calée dessus avance par à-coups ;
 * c'est ce que la version précédente a montré.
 *
 * Sans script, tout tourne quand même : la mise en pause est un
 * raffinement, jamais une condition. Sous `prefers-reduced-motion`, il n'y
 * a aucune animation à observer et le module ne fait rien.
 */

const SEUIL = 0.3;

let installe = false;

export function observerLesFigures(): void {
  // Le composant du bandeau d'acte est présent dans chaque figure : le
  // module peut donc être importé plusieurs fois par page.
  if (installe) return;
  installe = true;

  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const animations = (figure: Element): Animation[] => {
    const svg = figure.querySelector('svg');
    if (!svg || typeof svg.getAnimations !== 'function') return [];
    return svg.getAnimations({ subtree: true });
  };

  const observateur = new IntersectionObserver(
    (entrees) => {
      for (const entree of entrees) {
        for (const animation of animations(entree.target)) {
          if (entree.isIntersecting) {
            // Reprendre au début : une histoire prise en cours de route
            // n'en est pas une.
            animation.currentTime = 0;
            animation.play();
          } else {
            animation.pause();
          }
        }
      }
    },
    { threshold: SEUIL },
  );

  for (const figure of document.querySelectorAll('.mvf')) {
    observateur.observe(figure);
  }
}
