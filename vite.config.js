import reactRefresh from '@vitejs/plugin-react-refresh';

export default {
  plugins: [reactRefresh()],
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  base: process.env.NODE_ENV === 'production' ? '/micpayuat.mici.com.ph/' : '/'
}
