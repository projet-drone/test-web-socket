//register the plugin (just once)
gsap.registerPlugin(MotionPathPlugin);

gsap.to("#_magnets", { 
  duration: 2, 
  rotation: 360, 
  repeat: -1,
  transformOrigin: '50% 50%'
});

gsap.to("#_dot", {
  duration: 2,
  repeat: -1,
  yoyo: false,
  ease: "power0",

  motionPath: {
    path: "#_sin",
    align: "#_sin",
    autoRotate: true,
    alignOrigin: [0.5, 0.5]
  }
});

