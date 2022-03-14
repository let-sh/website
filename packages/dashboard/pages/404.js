// 404.js
import Link from 'next/link'
import Logo from "../components/common/logo/logo";
import * as React from "react";

export default function FourOhFour() {
  return <>
    <div className="error-header">
      <Logo/>
    </div>
    <div className="error-container">
      <div className="error-message">
        <div className="error-message-code">404</div>
        <div className="error-message-reason">Page Not Found</div>
      </div>
    </div>
    <div className="error-container">
      <div className="error-stage">
        <div className="error-block">
          <div className="error-block-icon">
            <img src={require('assets/img/website.png')}/>
          </div>
          <div className="error-block-title">Your browser</div>
          <div className="error-block-status"><div className="error-block-ok">✓</div></div>
        </div>
        <div className="error-space">....</div>
        <div className="error-block">
          <div className="error-block-icon">
            <img src={require('assets/img/website.png')}/>
          </div>
          <div className="error-block-title">Edge Network</div>
          <div className="error-block-status"><div className="error-block-ok">✓</div></div>
        </div>
        <div className="error-space">....</div>
        <div className="error-block">
          <div className="error-block-icon">
            <img src={require('assets/img/website.png')}/>
          </div>
          <div className="error-block-title">Cloud Server</div>
          <div className="error-block-status"><div className="error-block-ok">✓</div></div>
        </div>
        <div className="error-space">....</div>
        <div className="error-block">
          <div className="error-block-icon">
            <img src={require('assets/img/website.png')}/>
          </div>
          <div className="error-block-title">Application</div>
          <div className="error-block-status"><div className="error-block-not">?</div></div>
        </div>
      </div>
    </div>
    <div className="error-container">
      <div className="error-desc">
        <div className="error-desc-wrapper">
          <div className="error-desc-title">
            Why am I seeing this page?
          </div>
          <div className="error-desc-content">
            You request was successfully received by the let.sh Edge Network and Core Location but there was no running service to process this request.
            As a result, we cannot display the web page.
          </div>
        </div>
        <div className="error-desc-wrapper">
          <div className="error-desc-title">
            What can I do?
          </div>
          <div className="error-desc-content">
            If you are meant to deploy a service to this domain, you could set up your project with this guide to take this domain.
          </div>
        </div>
      </div>
    </div>

  </>
}
