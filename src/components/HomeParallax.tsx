import backgroundLayer from '@assets/background.svg';
import midgroundLayer from '@assets/midground.svg';
import foregroundLayer from '@assets/foreground.svg';
import { useParallax } from '../lib/useParallax';

const layers = [
  {
    id: 'background',
    src: backgroundLayer,
    speed: 0.25,
    scale: 1.4,
    minScale: 1.35,
    startOffset: -340,
    endOffset: -60,
    zIndex: 'z-10',
  },
  {
    id: 'midground',
    src: midgroundLayer,
    speed: 0.05,
    scale: 0.99,
    minScale: 0.75,
    startOffset: -50,
    endOffset: 20,
    zIndex: 'z-20',
  },
  {
    id: 'foreground',
    src: foregroundLayer,
    speed: 0.025,
    scale: 1.32,
    minScale: 1.1,
    startOffset: 240,
    endOffset: 90,
    zIndex: 'z-30',
  },
];

const HomeParallax = () => {
  const { registerLayer } = useParallax();

  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-screen w-screen overflow-hidden" aria-hidden="true">
      {layers.map((layer, index) => (
        <img
          key={layer.id}
          ref={registerLayer(index)}
          data-speed={layer.speed}
          data-scale={layer.scale}
          data-min-scale={layer.minScale ?? layer.scale}
          data-start-offset={layer.startOffset ?? 0}
          data-end-offset={layer.endOffset ?? (layer.startOffset ?? 0)}
          src={layer.src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover ${layer.zIndex}`}
          style={{ transform: `translate3d(0, 0, 0) scale(${layer.scale})`, transformOrigin: '50% 50%' }}
        />
      ))}
    </div>
  );
};

export default HomeParallax;
