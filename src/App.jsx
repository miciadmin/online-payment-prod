import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/home'
import PaymentStep1 from './pages/payment_step1'
import PaymentStep2 from './pages/payment_step2'
import PaymentStep3 from './pages/payment_step3'
import PaymentResult from './pages/payment_result'
import SearchRefNo from './component/search_refno'
import TermsAndCondition from './component/terms_and_condition'
import PrivacyPolicy from './component/privacy_policy'
import ErrorPage from './pages/error_page'

function App() {

  return(
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<PaymentStep1/>}></Route>
          <Route path="search-policy" element={<PaymentStep1/>}></Route>
          <Route path="/search-policy" element={<PaymentStep1/>}></Route>

          <Route path="choose-method" element={<PaymentStep2/>}></Route>
          <Route path="/choose-method" element={<PaymentStep2/>}></Route>

          <Route path="review-payment" element={<PaymentStep3/>}></Route>
          <Route path="/review-payment" element={<PaymentStep3/>}></Route>

          <Route path="/payment-result/:status" element={<PaymentResult/>} />

          <Route path="search-refno" element={<SearchRefNo/>}></Route>
          <Route path="/search-refno" element={<SearchRefNo/>}></Route>

          <Route path="terms-and-condition" element={<TermsAndCondition/>}></Route>
          <Route path="/terms-and-condition" element={<TermsAndCondition/>}></Route>

          <Route path="privacy-policy" element={<PrivacyPolicy/>}></Route>
          <Route path="/privacy-policy" element={<PrivacyPolicy/>}></Route>

          <Route path="*" element={<ErrorPage/>}></Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App
