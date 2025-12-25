"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";
import { useRouter } from "next/navigation";

export default function FallingShapes() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!sceneRef.current) return;

    // Module aliases
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Events = Matter.Events;

    // Create engine
    const engine = Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    // Get initial dimensions
    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: width,
        height: height,
        background: "transparent",
        wireframes: false,
      },
    });
    renderRef.current = render;

    // Colors
    const colors = {
      cream: "#FFF9F0", // Updated to match cream-mutu
      black: "#1E1E1E",
      purple: "#7E2152",
      green: "#199C72",
      yellow: "#EFDB2C",
    };

    const bodies: Matter.Body[] = [];

    // 1. Building Blocks
    const blockTextures = [
      "/assets/home/hero/building_block_black.png",
      "/assets/home/hero/building_block_green.png",
      "/assets/home/hero/building_block_purple.png",
      "/assets/home/hero/building_block_yellow.png",
    ];

    // Create a balanced array: 4 of each color
    const balancedTextures = [
      ...Array(4).fill(blockTextures[0]), // Black
      ...Array(4).fill(blockTextures[1]), // Green
      ...Array(4).fill(blockTextures[2]), // Purple
      ...Array(4).fill(blockTextures[3]), // Yellow
    ];

    // Shuffle the array to randomize drop order
    for (let i = balancedTextures.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [balancedTextures[i], balancedTextures[j]] = [
        balancedTextures[j],
        balancedTextures[i],
      ];
    }

    balancedTextures.forEach((texture) => {
      const x = Math.random() * width;
      const y = -Math.random() * 1000 - 100;
      // Size: Mobile <768 (80), Tablet <1024 (110), Laptop <1280 (130), Desktop <1536 (150), 2XL (180)
      const size =
        width < 768
          ? 80
          : width < 1024
            ? 110
            : width < 1280
              ? 130
              : width < 1536
                ? 150
                : 180;
      const scale = size / 300; // Original SVG is 300x300

      const box = Bodies.rectangle(x, y, size, size, {
        chamfer: { radius: size * 0.4 }, // Responsive radius
        restitution: 0.9,
        friction: 0.5,
        frictionAir: 0.01,
        render: {
          sprite: {
            texture: texture,
            xScale: scale,
            yScale: scale,
          },
        },
      });
      bodies.push(box);
    });

    // 2. Letter Boxes (Interactive)
    const letters = [
      { text: "A", bg: colors.purple, route: "/services/advertising" },
      { text: "B", bg: colors.green, route: "/services/branding" },
      { text: "C", bg: colors.yellow, route: "/services/character-design" },
      { text: "'s", bg: colors.black, route: "/services/social-media" },
    ];

    letters.forEach((item) => {
      const x = Math.random() * width;
      const y = -Math.random() * 500 - 100;
      // Make them slightly distinct or same size as blocks
      const size =
        width < 768
          ? 80
          : width < 1024
            ? 110
            : width < 1280
              ? 130
              : width < 1536
                ? 150
                : 180;

      const box = Bodies.rectangle(x, y, size, size, {
        chamfer: { radius: size * 0.2 },
        restitution: 0.9,
        friction: 0.5,
        frictionAir: 0.01,
        render: {
          fillStyle: item.bg,
        },
        label: item.text, // Used for rendering text
        plugin: {
          route: item.route, // Custom data for navigation
          originalFill: item.bg,
        },
      });
      bodies.push(box);
    });

    // 3. Mascot Images
    const mascots = [
      {
        texture: "/assets/home/hero/mutualist_home_mascot_1.svg",
        xScale: 140 / 535,
        yScale: 140 / 565,
      },
      {
        texture: "/assets/home/hero/mutualist_home_mascot_2.svg",
        xScale: 140 / 560,
        yScale: 140 / 485,
      },
    ];

    mascots.forEach((item) => {
      const x = Math.random() * width;
      const y = -Math.random() * 500 - 100;

      const mascotSize =
        width < 768
          ? 80
          : width < 1024
            ? 100
            : width < 1280
              ? 120
              : width < 1536
                ? 140
                : 170;

      const mascot = Bodies.rectangle(x, y, mascotSize, mascotSize, {
        chamfer: { radius: 15 },
        restitution: 0.9,
        friction: 0.5,
        frictionAir: 0.01,
        render: {
          sprite: {
            texture: item.texture,
            xScale: item.xScale * (mascotSize / 140),
            yScale: item.yScale * (mascotSize / 140),
          },
        },
      });
      bodies.push(mascot);
    });

    // Add bodies to world
    Composite.add(world, bodies);

    // Add walls
    const wallOptions = {
      isStatic: true,
      render: { visible: false },
      restitution: 1,
    };
    const ground = Bodies.rectangle(
      width / 2,
      height + 50,
      width,
      100,
      wallOptions
    );
    const leftWall = Bodies.rectangle(
      -50,
      height / 2,
      100,
      height,
      wallOptions
    );
    const rightWall = Bodies.rectangle(
      width + 50,
      height / 2,
      100,
      height,
      wallOptions
    );
    Composite.add(world, [ground, leftWall, rightWall]);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);

    // Fix: Remove wheel listeners to allow scrolling
    // @ts-expect-error - legacy event
    mouse.element.removeEventListener("wheel", mouse.mousewheel);
    // @ts-expect-error - legacy event
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    // Fix: Make touch events passive to allow scrolling
    // @ts-expect-error - access internal listener
    mouse.element.removeEventListener("touchmove", mouse.mousemove);
    // @ts-expect-error - access internal listener
    mouse.element.removeEventListener("touchstart", mouse.mousedown);
    // @ts-expect-error - access internal listener
    mouse.element.removeEventListener("touchend", mouse.mouseup);

    // @ts-expect-error - access internal listener
    mouse.element.addEventListener("touchmove", mouse.mousemove, {
      passive: true,
    });
    // @ts-expect-error - access internal listener
    mouse.element.addEventListener("touchstart", mouse.mousedown, {
      passive: true,
    });
    // @ts-expect-error - access internal listener
    mouse.element.addEventListener("touchend", mouse.mouseup, {
      passive: true,
    });

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2, // Looser for clicking
        render: {
          visible: false,
        },
      },
    });
    Composite.add(world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // --- Interaction Logic ---
    let startPoint = { x: 0, y: 0 };
    let selectedBody: Matter.Body | null = null;

    // Handle Click/Press
    Events.on(mouseConstraint, "mousedown", (event) => {
      const body = event.source.body;
      if (body && body.plugin && body.plugin.route) {
        selectedBody = body;
        startPoint = { ...event.mouse.position };
        // Visual Feedback
        body.render.opacity = 0.7;
      }
    });

    Events.on(mouseConstraint, "mouseup", (event) => {
      if (selectedBody && selectedBody.plugin && selectedBody.plugin.route) {
        const endPoint = event.mouse.position;
        const distance = Math.sqrt(
          Math.pow(endPoint.x - startPoint.x, 2) +
            Math.pow(endPoint.y - startPoint.y, 2)
        );

        // Reset opacity
        selectedBody.render.opacity = 1;

        // Navigate only if movement is small (it's a click, not a drag)
        // Increased threshold to 30px for better touch tolerance
        if (distance < 30) {
          router.push(selectedBody.plugin.route);
        }

        selectedBody = null;
      }
    });

    // Custom rendering for text on Letter Blocks
    Events.on(render, "afterRender", () => {
      const context = render.context;
      const fontSize =
        width < 768
          ? "40px"
          : width < 1024
            ? "60px"
            : width < 1280
              ? "70px"
              : width < 1536
                ? "80px"
                : "100px";
      context.font = `bold ${fontSize} sans-serif`; // Responsive font size
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = colors.cream;

      // Hover Logic
      const mousePosition = mouse.position;
      const hoveredBodies = Matter.Query.point(bodies, mousePosition);
      let isHoveringInteractive = false;

      // Reset opacity for all interactive bodies first
      bodies.forEach((body) => {
        if (body.plugin && body.plugin.route) {
          body.render.opacity = 1;
        }
      });

      // Apply hover effect
      hoveredBodies.forEach((body) => {
        if (body.plugin && body.plugin.route) {
          isHoveringInteractive = true;
          body.render.opacity = 0.8; // Dim on hover
        }
      });

      // Set cursor
      if (render.canvas) {
        render.canvas.style.cursor = isHoveringInteractive
          ? "pointer"
          : "default";
      }

      bodies.forEach((body) => {
        if (
          body.label &&
          body.label.length <= 2 &&
          !body.label.startsWith("Rect")
        ) {
          const { x, y } = body.position;
          const angle = body.angle;

          context.save();
          context.translate(x, y);
          context.rotate(angle);
          context.fillText(body.label, 0, 0);
          context.restore();
        }
      });
    });

    // Run the engine
    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Handle resize with ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;

        render.canvas.width = width;
        render.canvas.height = height;
        render.options.width = width;
        render.options.height = height;
        render.bounds.max.x = width;
        render.bounds.max.y = height;

        // Reposition walls
        Matter.Body.setPosition(ground, {
          x: width / 2,
          y: height + 50,
        });
        Matter.Body.setPosition(rightWall, {
          x: width + 50,
          y: height / 2,
        });
        Matter.Body.setPosition(leftWall, {
          x: -50,
          y: height / 2,
        });

        // Update vertices
        Matter.Body.setVertices(
          ground,
          Matter.Bodies.rectangle(width / 2, height + 50, width, 100).vertices
        );
        Matter.Body.setVertices(
          leftWall,
          Matter.Bodies.rectangle(-50, height / 2, 100, height).vertices
        );
        Matter.Body.setVertices(
          rightWall,
          Matter.Bodies.rectangle(width + 50, height / 2, 100, height).vertices
        );
      }
    });

    if (sceneRef.current) {
      resizeObserver.observe(sceneRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas) {
        render.canvas.remove();
      }
      Composite.clear(world, false);
      Engine.clear(engine);
    };
  }, [router]);

  return (
    <div
      ref={sceneRef}
      className="absolute inset-0 pointer-events-auto z-0 max-w-screen-2xl mx-auto left-0 right-0"
      style={{ pointerEvents: "all", touchAction: "pan-y" }}
    />
  );
}
