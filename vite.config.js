import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [reactRefresh()],
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  build: {
    rollupOptions: {
      input: {
        index: './index.html',
        "search-policy": './src/pages/payment_step1.jsx',
        "choose-method": './src/pages/payment_step2.jsx',
        "review-payment": './src/pages/payment_step3.jsx',
        "payment-result": './src/pages/payment_result.jsx',
        "search-refno": './src/component/search_refno.jsx',
        "terms-and-condition": './src/component/terms_and_condition.jsx',
      }
    }
  }
});
