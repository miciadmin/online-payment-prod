import reactRefresh from '@vitejs/plugin-react-refresh';

export default({
  plugins: [reactRefresh()],
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  server: {
    historyApiFallback: true,
  },
});
