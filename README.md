# Gaussian Splat Viewer

A web-based 3D Gaussian Splatting viewer built with React and Three.js. View and interact with .ply, .splat, and .ksplat files directly in your browser.

## Features

- Drag & drop file loading (.ply, .splat, .ksplat)
- Load sample data from URL
- Real-time FPS counter
- Splat count display
- GPU memory usage monitoring
- Customizable settings:
  - Background color (black, white, gray, custom)
  - Point cloud mode
  - Point size adjustment
  - Auto-rotate with speed control
- Camera controls (orbit, zoom, pan)
- Reset camera position

## Demo

https://splat.raihara3.xyz/

## Getting Started

### Prerequisites

- Node.js 20.19+ (recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/gaussian-splat-viewer.git
cd gaussian-splat-viewer

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## Deployment

This project is optimized for deployment on Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Tech Stack

### Core

- [React](https://react.dev/) v19 - UI framework
- [TypeScript](https://www.typescriptlang.org/) v5.9 - Type safety
- [Vite](https://vite.dev/) v7 - Build tool and dev server

### 3D Rendering

- [Three.js](https://threejs.org/) v0.181 - 3D graphics library
- [@mkkellogg/gaussian-splats-3d](https://github.com/mkkellogg/GaussianSplats3D) v0.4.7 - Gaussian splatting renderer

### Styling

- [Tailwind CSS](https://tailwindcss.com/) v4 - Utility-first CSS framework

### Development

- [ESLint](https://eslint.org/) - Code linting
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) - React plugin for Vite

## Supported File Formats

| Format | Extension | Description                          |
| ------ | --------- | ------------------------------------ |
| PLY    | .ply      | Standard polygon file format         |
| Splat  | .splat    | Compressed splat format              |
| KSplat | .ksplat   | Compressed splat format with sorting |

## License

MIT

## Acknowledgments

- [GaussianSplats3D](https://github.com/mkkellogg/GaussianSplats3D) by Mark Kellogg for the excellent Gaussian splatting renderer
- [Three.js](https://threejs.org/) for 3D rendering capabilities
