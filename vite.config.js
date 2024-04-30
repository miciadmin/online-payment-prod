import reactRefresh from '@vitejs/plugin-react-refresh';

export default {
  plugins: [reactRefresh()],
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  server: {
    proxy: {
      '/online-payment/api': {
        target: 'http://120.28.153.210:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/online-payment\/api/, '/online-payment/api'),
      },
    },
  },
};
