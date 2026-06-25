import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function CSSFallback() {
  return (
    <>
      <style>{`
        @keyframes floatA {
          0%,100%{transform:translateY(0) translateX(0) scale(1);opacity:var(--op);}
          33%{transform:translateY(-20px) translateX(8px) scale(1.1);opacity:calc(var(--op)*0.4);}
          66%{transform:translateY(10px) translateX(-12px) scale(0.9);opacity:calc(var(--op)*0.7);}
        }
        @keyframes shootStar {
          0%{transform:translateX(0) translateY(0) rotate(-30deg);opacity:0;width:0;}
          5%{opacity:1;width:80px;}
          90%{opacity:0.2;width:80px;}
          100%{transform:translateX(350px) translateY(180px) rotate(-30deg);opacity:0;width:0;}
        }
      `}</style>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {Array.from({length:200},(_,i)=>{
          const hue=Math.random()<0.55?'rgba(255,140,60,':'Math.random()<0.3?rgba(255,200,120,:rgba(255,255,255,';
          const colors=['rgba(255,140,60,','rgba(255,180,90,','rgba(255,220,140,','rgba(255,255,255,','rgba(200,160,255,'];
          const c=colors[Math.floor(Math.random()*colors.length)];
          const op=(Math.random()*0.5+0.1).toFixed(2);
          const sz=(Math.random()*3+0.5).toFixed(1);
          const dur=(Math.random()*10+6).toFixed(1);
          const del=(Math.random()*12).toFixed(1);
          return(
            <div key={i} className="absolute rounded-full" style={{
              left:`${Math.random()*100}%`,
              top:`${Math.random()*100}%`,
              width:`${sz}px`,height:`${sz}px`,
              background:`${c}1)`,
              '--op':op,opacity:Number(op),
              boxShadow:Number(sz)>1.8?`0 0 ${Number(sz)*4}px ${c}0.6)`:'none',
              animation:`floatA ${dur}s ${del}s ease-in-out infinite`,
            } as React.CSSProperties}/>
          );
        })}
        {[0,1,2].map(i=>(
          <div key={`s${i}`} className="absolute h-px" style={{
            top:`${[12,30,55][i]}%`,left:`${[8,30,65][i]}%`,
            background:'linear-gradient(90deg,transparent,rgba(255,160,60,0.7),transparent)',
            animation:`shootStar ${[14,20,25][i]}s ${[3,9,16][i]}s linear infinite`,
            opacity:0,
          }}/>
        ))}
        <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 30% 40%,rgba(255,120,40,0.04) 0%,transparent 55%)'}}/>
        <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 70% 70%,rgba(60,80,200,0.06) 0%,transparent 50%)'}}/>
      </div>
    </>
  );
}

export default function CinematicLayer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
    } catch {
      setUseFallback(true);
      return;
    }

    const canvas = renderer.domElement;
    const testCtx = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!testCtx) { setUseFallback(true); renderer.dispose(); return; }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const count = 1800;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random()-0.5)*18;
      pos[i*3+1] = (Math.random()-0.5)*18;
      pos[i*3+2] = (Math.random()-0.5)*12;
      phases[i]  = Math.random()*Math.PI*2;
      speeds[i]  = 0.3+Math.random()*0.7;
      sizes[i]   = 0.04+Math.random()*0.12;

      const r = Math.random();
      if (r < 0.5) {       col[i*3]=1.0; col[i*3+1]=0.55; col[i*3+2]=0.15; } // warm orange
      else if (r < 0.75) { col[i*3]=1.0; col[i*3+1]=0.75; col[i*3+2]=0.4;  } // gold
      else if (r < 0.9) {  col[i*3]=1.0; col[i*3+1]=1.0;  col[i*3+2]=1.0;  } // white
      else {               col[i*3]=0.8; col[i*3+1]=0.65; col[i*3+2]=1.0;  } // cool purple
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos.slice(), 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(col, 3));
    geo.setAttribute("size",     new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX/window.innerWidth - 0.5)*1.2;
      my = (e.clientY/window.innerHeight - 0.5)*1.2;
    };
    window.addEventListener("mousemove", onMouse);

    const basePos = pos.slice();
    let raf: number;
    let t = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.008;

      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        const ph = phases[i];
        const sp = speeds[i];
        posAttr.array[i*3]   = basePos[i*3]   + Math.sin(t*sp + ph)*0.35;
        posAttr.array[i*3+1] = basePos[i*3+1] + Math.cos(t*sp*0.7 + ph)*0.25;
        posAttr.array[i*3+2] = basePos[i*3+2] + Math.sin(t*sp*0.5 + ph)*0.2;
      }
      posAttr.needsUpdate = true;

      camera.position.x += (mx - camera.position.x)*0.04;
      camera.position.y += (-my - camera.position.y)*0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      geo.dispose(); mat.dispose(); renderer.dispose();
    };
  }, []);

  if (useFallback) return <CSSFallback />;

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
