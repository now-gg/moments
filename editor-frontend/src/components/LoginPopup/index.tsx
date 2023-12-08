import './login.css';
type LoginProps = {
  closePopup: any;
};

const LoginPopup = ({ closePopup }: LoginProps) => {
  return (
    <section className="login-popup">
      <div className="modal-body">
        <div className="modal-parent">
          <div className="flex popup-close" onClick={closePopup}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="close-icon" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.2201 5.3709L18.6291 3.77991L12 10.409L5.37087 3.77991L3.77988 5.3709L10.409 12L3.77988 18.6292L5.37087 20.2201L12 13.591L18.6291 20.2201L20.2201 18.6292L13.591 12L20.2201 5.3709Z" fill="#0B0223"></path>
            </svg>
          </div>
          <div className="flex column perfectCenter">
            <a className="nowgg-logo" href="/">
              <figure>
                <img src="https://cdn.now.gg/apps-content/img/nowgg-logo.png" alt="nowgg logo" height="48" width="190" />
              </figure>
            </a>
            <h2 className="title">Sign in to edit videos in your library</h2>
            <a className="sign-up-btn flex perfectCenter" href={`${import.meta.env.VITE_ACCOUNTS_BASE}/accounts/auth/v1/identifier?provider=google&continue=${location.href}`}>
              <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_i_1877_36272)">
                  <rect x="0.5" width="32" height="32" rx="16" fill="white"></rect>
                  <path d="M10.3549 18.2384L9.59237 21.085L6.80535 21.144C5.97244 19.5991 5.5 17.8316 5.5 15.9533C5.5 14.137 5.94172 12.4242 6.7247 10.916H6.7253L9.20653 11.3709L10.2935 13.8373C10.066 14.5005 9.94198 15.2124 9.94198 15.9533C9.94206 16.7573 10.0877 17.5277 10.3549 18.2384Z" fill="#FBBB00"></path>
                  <path d="M27.2158 13.9071C27.3416 14.5697 27.4072 15.254 27.4072 15.9533C27.4072 16.7375 27.3248 17.5024 27.1677 18.2402C26.6345 20.751 25.2413 22.9435 23.3112 24.495L23.3106 24.4944L20.1854 24.3349L19.7431 21.5737C21.0238 20.8227 22.0246 19.6473 22.5518 18.2402H16.6949V13.9071H22.6372H27.2158Z" fill="#518EF8"></path>
                  <path d="M23.3098 24.4942L23.3104 24.4948C21.4334 26.0036 19.0489 26.9063 16.4533 26.9063C12.282 26.9063 8.65547 24.5749 6.80545 21.1439L10.355 18.2383C11.28 20.7069 13.6614 22.4643 16.4533 22.4643C17.6533 22.4643 18.7775 22.1399 19.7422 21.5736L23.3098 24.4942Z" fill="#28B446"></path>
                  <path d="M23.4432 7.52162L19.8949 10.4266C18.8965 9.80253 17.7163 9.44202 16.4519 9.44202C13.5968 9.44202 11.1709 11.28 10.2922 13.8371L6.72402 10.9159H6.72342C8.54635 7.40127 12.2187 5 16.4519 5C19.1095 5 21.5463 5.94668 23.4432 7.52162Z" fill="#F14336"></path>
                </g>
                <defs>
                  <filter id="filter0_i_1877_36272" x="0.5" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                    <feOffset dy="-2"></feOffset>
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"></feColorMatrix>
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1877_36272"></feBlend>
                  </filter>
                </defs>
              </svg>
              Sign in with Google</a>
            <div className="social-icons flex">
              <a className="discord flex perfectCenter" href={`${import.meta.env.VITE_ACCOUNTS_BASE}/accounts/oauth2/v1/auth?provider=discord&continue=${location.href}`}>
                <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_i_1877_36287)">
                    <rect x="0.5" width="32" height="32" rx="16" fill="white"></rect>
                    <path d="M24.1361 9.33997C22.6907 8.70499 21.1648 8.25449 19.5973 8C19.3832 8.3681 19.1891 8.74664 19.0159 9.13408C17.3462 8.89345 15.6485 8.89345 13.9788 9.13408C13.8056 8.74664 13.6116 8.3681 13.3974 8C11.8292 8.25741 10.3024 8.70894 8.85518 9.3433C5.98276 13.4213 5.20409 17.3981 5.59342 21.3184C7.2754 22.5113 9.15827 23.4183 11.16 24C11.6106 23.4182 12.0094 22.8011 12.3523 22.1553C11.7013 21.9221 11.0731 21.6342 10.4748 21.2951C10.6323 21.1856 10.7863 21.0726 10.9351 20.9631C12.676 21.7487 14.5761 22.156 16.5 22.156C18.4238 22.156 20.3239 21.7487 22.0648 20.9631C22.2154 21.0809 22.3694 21.1939 22.5251 21.2951C21.9259 21.6351 21.2965 21.9235 20.6442 22.1569C20.9864 22.8026 21.3853 23.4192 21.8364 24C23.8399 23.4207 25.7242 22.5141 27.4065 21.32C27.8633 16.7738 26.6261 12.8335 24.1361 9.33997ZM12.8454 18.9074C11.7605 18.9074 10.8641 17.9626 10.8641 16.8003C10.8641 15.638 11.7293 14.6849 12.842 14.6849C13.9546 14.6849 14.844 15.638 14.825 16.8003C14.8059 17.9626 13.9511 18.9074 12.8454 18.9074ZM20.1545 18.9074C19.0678 18.9074 18.175 17.9626 18.175 16.8003C18.175 15.638 19.0401 14.6849 20.1545 14.6849C21.2689 14.6849 22.1514 15.638 22.1323 16.8003C22.1133 17.9626 21.2602 18.9074 20.1545 18.9074Z" fill="#5A31FD"></path>
                  </g>
                  <defs>
                    <filter id="filter0_i_1877_36287" x="0.5" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                      <feOffset dy="-2"></feOffset>
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"></feColorMatrix>
                      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1877_36287"></feBlend>
                    </filter>
                  </defs>
                </svg>
                Discord
              </a>
              <a className="facebook flex perfectCenter" href={`${import.meta.env.VITE_ACCOUNTS_BASE}/accounts/oauth2/v1/auth?provider=facebook&continue=${location.href}`}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_i_1877_36296)">
                    <rect width="32" height="32" rx="16" fill="white"></rect>
                    <path d="M19.9918 8.65292H22V5.15492C21.6535 5.10725 20.462 5 19.0742 5C16.1787 5 14.1952 6.82142 14.1952 10.1691V13.25H11V17.1605H14.1952V27H18.1127V17.1614H21.1787L21.6654 13.2509H18.1118V10.5568C18.1127 9.42658 18.417 8.65292 19.9918 8.65292Z" fill="#2377FA"></path>
                  </g>
                  <defs>
                    <filter id="filter0_i_1877_36296" x="0" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                      <feOffset dy="-2"></feOffset>
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"></feColorMatrix>
                      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1877_36296"></feBlend>
                    </filter>
                  </defs>
                </svg>
                Facebook
              </a>
            </div>
            <p className="policy-note">
              By signing up, you agree to the
              <a href="/terms-and-privacy.html#terms">Terms of Use </a>
              and
              <a href="/terms-and-privacy.html#privacy">Privacy Policy</a>,
              including
              <a href="/terms-and-privacy.html#cookie-policy">Cookie Use.</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginPopup;