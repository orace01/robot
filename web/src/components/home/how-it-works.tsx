import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import { serpentine } from "@/lib/paths";

const steps = [
  {
    title: "Attachez la corde de sécurité",
    text: "Fixez-la à un point solide, côté intérieur. C'est votre filet de sécurité.",
  },
  {
    title: "Posez-le sur la vitre",
    text: "Allumez-le : l'aspiration le plaque aussitôt contre le verre.",
  },
  {
    title: "Appuyez sur Start",
    text: "Il calcule son trajet, pulvérise, essuie et s'arrête une fois la vitre terminée.",
  },
];

const PATH = serpentine("z", { x: 70, y: 66, w: 340, h: 208 }, 5);
const DURATION = "11s";
// Le robot parcourt le trajet en 90 % du cycle, puis marque une pause avant de recommencer.
const KEY_TIMES = "0;0.9;1";

/** Schéma animé d'une vitre nettoyée en Z (animation SVG native, sans JavaScript). */
function WindowDiagram() {
  return (
    <svg viewBox="0 0 480 340" className="h-auto w-full" role="img" aria-label="Le robot parcourt la vitre en Z, de haut en bas">
      <defs>
        <linearGradient id="verre" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.03" />
        </linearGradient>
        <pattern id="grille" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="#fff" strokeOpacity="0.07" />
        </pattern>
      </defs>

      {/* Cadre et vitre */}
      <rect x="20" y="20" width="440" height="300" rx="16" fill="none" stroke="#fff" strokeOpacity="0.55" />
      <rect x="34" y="34" width="412" height="272" rx="6" fill="url(#verre)" />
      <rect x="34" y="34" width="412" height="272" rx="6" fill="url(#grille)" />
      <path d="M300 60 380 140M330 60 400 130" stroke="#fff" strokeOpacity="0.12" strokeWidth="6" strokeLinecap="round" />

      {/* Zone nettoyée (version animée) */}
      <g className="motion-reduce:hidden">
        <path
          d={PATH}
          fill="none"
          stroke="#fff"
          strokeOpacity="0.16"
          strokeWidth="44"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
        >
          <animate attributeName="stroke-dashoffset" values="1;0;0" keyTimes={KEY_TIMES} dur={DURATION} repeatCount="indefinite" />
        </path>
      </g>
      {/* Version fixe si l'utilisateur a réduit les animations */}
      <path
        d={PATH}
        className="hidden motion-reduce:block"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.16"
        strokeWidth="44"
        strokeLinejoin="round"
      />

      {/* Trajet prévu */}
      <path id="trajet" d={PATH} fill="none" stroke="#fff" strokeOpacity="0.45" strokeDasharray="3 6" />

      {/* Le robot */}
      <g className="motion-reduce:hidden">
        <g>
          <rect x="-20" y="-20" width="40" height="40" rx="9" fill="#fff" />
          <rect x="-11" y="-11" width="6" height="22" rx="2" fill="#0d0f12" />
          <rect x="5" y="-11" width="6" height="22" rx="2" fill="#0d0f12" />
          <circle cx="0" cy="-14" r="2" fill="#2d5bff" />
          <animateMotion dur={DURATION} repeatCount="indefinite" keyPoints="0;1;1" keyTimes={KEY_TIMES} calcMode="linear">
            <mpath href="#trajet" />
          </animateMotion>
        </g>
      </g>

      {/* Annotations */}
      <g fontFamily="var(--font-jetbrains), monospace" fontSize="9" letterSpacing="1.2" fill="#fff" fillOpacity="0.7">
        <text x="52" y="13">TRAJET EN Z · PULVÉRISATION ON</text>
        <text x="430" y="334" textAnchor="end">
          BORD DÉTECTÉ → DEMI-TOUR
        </text>
      </g>
      <path d="M446 300v20M436 320h20" stroke="#fff" strokeOpacity="0.6" />
      <path d="M34 20V8M24 8h20" stroke="#fff" strokeOpacity="0.6" />
    </svg>
  );
}

export function HowItWorks() {
  return (
    <section id="fonctionnement" className="px-2 sm:px-3">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-deep-gradient text-white">
        <div aria-hidden className="plus-grid-light absolute inset-0 -z-10" />
        <div
          aria-hidden
          className="dot-grid absolute top-10 -left-6 -z-10 h-56 w-80 text-white/30 [mask-image:linear-gradient(135deg,black,transparent_70%)]"
        />

        <Container className="grid gap-14 py-20 lg:grid-cols-12 lg:items-center lg:py-28">
          <div className="lg:col-span-5">
            <Eyebrow tone="light">Mode d&apos;emploi</Eyebrow>
            <h2 className="mt-4 text-[clamp(2.25rem,4.6vw,4rem)] leading-[1] font-semibold tracking-[-0.03em]">
              Trois gestes.
              <br />
              <span className="text-white/55">Zéro trace.</span>
            </h2>
            <ol className="mt-10 space-y-6">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-5 border-t border-white/15 pt-6">
                  <span className="font-mono text-sm text-white/50">0{i + 1}</span>
                  <div>
                    <p className="text-lg font-medium">{step.title}</p>
                    <p className="mt-1 text-white/65">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white/[0.04] p-5 ring-1 ring-white/10 [clip-path:polygon(28px_0,calc(100%-28px)_0,100%_28px,100%_calc(100%-28px),calc(100%-28px)_100%,28px_100%,0_calc(100%-28px),0_28px)] sm:p-8">
              <WindowDiagram />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
