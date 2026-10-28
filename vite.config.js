import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: 배포 위치(서브 경로)에 맞춰 조정
export default defineConfig({
  plugins: [react()],
  base: './',
});
