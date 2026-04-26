/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment } from './components/World/Environment';
import { Player } from './components/World/Player';
import { LevelManager } from './components/World/LevelManager';
import { Effects } from './components/World/Effects';
import { HUD } from './components/UI/HUD';
import { useStore } from './store';
import { GameStatus } from './types';
import { audio } from './components/System/Audio';

function MusicController() {
    const { status } = useStore();
    
    useEffect(() => {
        if (status === GameStatus.PLAYING) {
            audio.startMusic();
        } else if (status === GameStatus.OVER) {
            audio.stopMusic();
            audio.playGameOver();
        } else if (status === GameStatus.MENU) {
            audio.stopMusic();
        }
    }, [status]);

    return null;
}

// Dynamic Camera Controller - Improved for mobile visibility
const CameraController = () => {
  const { camera, size } = useThree();
  const { laneCount } = useStore();
  
  useFrame((state, delta) => {
    // Determine if screen is narrow (mobile portrait)
    const aspect = size.width / size.height;
    const isMobile = aspect < 1.2;

    // Improved mobile positioning: bring camera higher and closer
    // This gives better visibility of the player and upcoming obstacles
    const heightFactor = isMobile ? 1.5 : 0.5;  // Reduced from 2.0 to 1.5
    const distFactor = isMobile ? 3.5 : 1.0;    // Reduced from 4.5 to 3.5

    // Base (3 lanes): y=5.5, z=8 → Mobile: y=6.8, z=18.5
    const extraLanes = Math.max(0, laneCount - 3);

    const targetY = 5.5 + (extraLanes * heightFactor);
    const targetZ = 8.0 + (extraLanes * distFactor);

    const targetPos = new THREE.Vector3(0, targetY, targetZ);
    
    // Smoothly interpolate camera position
    camera.position.lerp(targetPos, delta * 2.0);
    
    // Look slightly higher to center player better in frame
    camera.lookAt(0, isMobile ? 1.5 : 0, -30);
  });
  
  return null;
};

function Scene() {
  return (
    <>
        <Environment />
        <group>
            {/* Attach a userData to identify player group for LevelManager collision logic */}
            <group userData={{ isPlayer: true }} name="PlayerGroup">
                 <Player />
            </group>
            <LevelManager />
        </group>
        <Effects />
    </>
  );
}

function App() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      <MusicController />
      <HUD />
      <Canvas
        shadows
        dpr={[1, 1.5]} 
        gl={{ antialias: false, stencil: false, depth: true, powerPreference: "high-performance" }}
        // Initial camera, matches the controller base
        camera={{ position: [0, 5.5, 8], fov: 60 }}
      >
        <CameraController />
        <Suspense fallback={null}>
            <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
