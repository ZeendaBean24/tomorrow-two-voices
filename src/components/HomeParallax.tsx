import backgroundLayer from '@assets/background.svg';
import midgroundLayer from '@assets/midground.svg';
import foregroundLayer from '@assets/foreground.svg';
import { useParallax } from '../lib/useParallax';

const layers = [
  { id: 'background', src: backgroundLayer, speed: 0.08, scale: 1.15, zIndex: 'z-10' },
  { id: 'midground', src: midgroundLayer, speed: 0.18, scale: 1.18, zIndex: 'z-20' },
  { id: 'foreground', src: foregroundLayer, speed: 0.28, scale: 1.22, zIndex: 'z-30' },
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
          src={layer.src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover ${layer.zIndex}`}
          style={{ transform: `translate3d(0, 0, 0) scale(${layer.scale})` }}
        />
      ))}
    </div>
  );
};

export default HomeParallax;
