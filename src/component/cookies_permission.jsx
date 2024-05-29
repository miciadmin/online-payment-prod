import React, { useState, useEffect } from 'react';

function CookiesPermission() {
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted') {
        setShowCookieConsent(false);
    } else {
        setShowCookieConsent(true);
    }
  }, []);

  const handleGotIt = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowCookieConsent(false);
  }

  const handleLearnMore = () => {
    setShowMoreInfo(true);
  };

  const closeLearnMore = () => {
    setShowMoreInfo(false);
  };

  return (
    <div className="App">
      {showCookieConsent && (
        <div className="cookie-consent">
            <div>
                <p>This website uses cookies to ensure you get the best experience on our website.</p>
                <span onClick={handleLearnMore}>Learn more</span>
            </div>
            <div>
                <button type="button" className="btn btn-light" onClick={handleGotIt}>Got it!</button>
            </div>
        </div>
      )}

      {showMoreInfo && (
        <div className="cookie-info">
            <div className="cookie-info-header">
                <span>More About Cookies</span>
                <button type="button" className="btn-close" onClick={closeLearnMore} aria-label="Close"/>
            </div>
            <p>Cookies are small text files that can be used by websites to make a user's experience more efficient. We use cookies for managing payment details and remove them after the payment transaction is complete.</p>
        </div>
      )}
    </div>
  );
}

export default CookiesPermission;
