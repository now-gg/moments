import React from "react";
import styled from "styled-components";
type SidebarProps = {
  sidebar?: string
}

const SideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  p{
    color: rgba(0, 0, 0, 0.80);
  }
  button{
    display: flex;
    border-radius: 8px;
    border: 1px solid var(--Base---400, #797091);
    gap: 8px;
    padding: 11px 20px;
    color: #1F1637;
    align-items: center;
    font-size: .75em;
    font-weight: 600;
    line-height: 1em;
  }
`

const Sidebar = ({ sidebar }: SidebarProps) => {
  return (
    <aside className="bg-white rounded-lg">
      <SideWrapper className="bg-white p-6 rounded-lg w-[300px]">
        <p className="text-base font-semibold text-translucent-80">{sidebar}</p>
        <button className="upload-on-youtube">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="17" viewBox="0 0 24 17" fill="none">
            <g clip-path="url(#clip0_3470_4285)">
              <path d="M22.7814 2.95966C22.5221 1.99099 21.7609 1.22975 20.7922 0.970448C19.0363 0.5 12 0.5 12 0.5C12 0.5 4.96366 0.5 3.20966 0.970448C2.24099 1.22975 1.47975 1.99099 1.22045 2.95966C0.75 4.71366 0.75 8.37537 0.75 8.37537C0.75 8.37537 0.75 12.0371 1.22045 13.7911C1.47975 14.7598 2.24099 15.521 3.20966 15.7803C4.96366 16.2507 12 16.2507 12 16.2507C12 16.2507 19.0363 16.2507 20.7903 15.7803C21.759 15.521 22.5203 14.7598 22.7796 13.7911C23.25 12.0371 23.25 8.37537 23.25 8.37537C23.25 8.37537 23.25 4.71366 22.7796 2.95966H22.7814Z" fill="#FF0000" />
              <path d="M9.74951 11.7502L15.5968 8.37561L9.74951 5.00098V11.7502Z" fill="white" />
            </g>
            <defs>
              <clipPath id="clip0_3470_4285">
                <rect width="22.5" height="15.7507" fill="white" transform="translate(0.75 0.5)" />
              </clipPath>
            </defs>
          </svg>
          Upload to YouTube
        </button>
        <button className="upload-shorts">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="17" viewBox="0 0 24 17" fill="none">
            <g clip-path="url(#clip0_3470_4285)">
              <path d="M22.7814 2.95966C22.5221 1.99099 21.7609 1.22975 20.7922 0.970448C19.0363 0.5 12 0.5 12 0.5C12 0.5 4.96366 0.5 3.20966 0.970448C2.24099 1.22975 1.47975 1.99099 1.22045 2.95966C0.75 4.71366 0.75 8.37537 0.75 8.37537C0.75 8.37537 0.75 12.0371 1.22045 13.7911C1.47975 14.7598 2.24099 15.521 3.20966 15.7803C4.96366 16.2507 12 16.2507 12 16.2507C12 16.2507 19.0363 16.2507 20.7903 15.7803C21.759 15.521 22.5203 14.7598 22.7796 13.7911C23.25 12.0371 23.25 8.37537 23.25 8.37537C23.25 8.37537 23.25 4.71366 22.7796 2.95966H22.7814Z" fill="#FF0000" />
              <path d="M9.74951 11.7502L15.5968 8.37561L9.74951 5.00098V11.7502Z" fill="white" />
            </g>
            <defs>
              <clipPath id="clip0_3470_4285">
                <rect width="22.5" height="15.7507" fill="white" transform="translate(0.75 0.5)" />
              </clipPath>
            </defs>
          </svg>
          Upload to YouTube Shorts
        </button>
        <button className="send-to-tiktok">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19.582 7.09585V6.97719C18.532 6.97719 17.5634 6.62985 16.7834 6.04585C16.854 6.13985 16.9274 6.23185 17.0047 6.32052C17.744 6.80985 18.6294 7.09585 19.582 7.09585ZM9.1927 17.8499C10.6807 17.8499 11.8914 16.6392 11.8914 15.1512L11.916 12.7765V12.6579L11.8914 15.0325C11.8914 16.5205 10.6807 17.7312 9.1927 17.7312C8.6907 17.7312 8.22137 17.5932 7.8187 17.3539C7.8567 17.4179 7.89737 17.4799 7.9407 17.5405C8.3147 17.7379 8.7407 17.8499 9.1927 17.8499ZM14.906 2.41918C14.906 2.51518 14.9087 2.61118 14.9147 2.70585C14.926 2.88852 14.9487 3.06785 14.98 3.24452H15.002C14.958 3.03052 14.9287 2.81118 14.9154 2.58785C14.9094 2.49318 14.9067 2.39718 14.9067 2.30118V2.29785H11.9167V2.41652H14.9067V2.41918H14.906ZM9.1927 9.42919C9.4847 9.42919 9.77137 9.45118 10.0507 9.49318L10.054 10.2592H10.0547L10.0507 9.37519C9.7707 9.33319 9.48404 9.31118 9.1927 9.31118C6.0327 9.31118 3.4707 11.8732 3.4707 15.0332C3.4707 15.0532 3.47137 15.0725 3.47137 15.0925C3.50337 11.9592 6.0527 9.42919 9.1927 9.42919Z" fill="#08FFF9" />
            <path d="M3.47137 15.0918C3.47137 15.1118 3.4707 15.1311 3.4707 15.1511C3.4707 17.0951 4.4407 18.8125 5.9227 19.8465C5.82737 19.7425 5.73604 19.6351 5.64804 19.5245C4.33604 18.4885 3.49004 16.8891 3.47137 15.0918Z" fill="#08FFF9" />
            <path d="M5.64799 19.525C4.87799 18.5503 4.41799 17.319 4.41799 15.9803C4.41799 12.849 6.93399 10.305 10.0553 10.259L10.052 9.49298C9.77199 9.45098 9.48532 9.42898 9.19399 9.42898C6.05399 9.42898 3.50466 11.959 3.47266 15.0916C3.48999 16.8896 4.33599 18.489 5.64799 19.525ZM19.582 7.82765V7.09565C18.6293 7.09565 17.7433 6.80965 17.0047 6.32031C17.664 7.07698 18.5627 7.61831 19.582 7.82765Z" fill="#08FFF9" />
            <path d="M11.8913 15.1513C11.8913 16.6393 10.6806 17.85 9.19261 17.85C8.74061 17.85 8.31461 17.738 7.93994 17.5407C8.42927 18.2287 9.23261 18.6787 10.1393 18.6787C11.6273 18.6787 12.8379 17.468 12.8379 15.98L12.8626 13.6053V3.24468H14.9799C14.9486 3.06802 14.9259 2.88868 14.9146 2.70602C14.9086 2.61135 14.9059 2.51535 14.9059 2.41935V2.41602H11.9159V12.6587V12.7773L11.8913 15.1513Z" fill="#08FFF9" />
            <path d="M19.5821 7.82715V9.95981V10.0785L19.5127 10.0765C17.8401 10.0411 16.2247 9.45915 14.9147 8.41915V15.0325V15.1511C14.9147 15.9498 14.7507 16.7111 14.4547 17.4018C13.5801 19.4431 11.5534 20.8731 9.19205 20.8731C7.97605 20.8731 6.84872 20.4931 5.92139 19.8465C6.96739 20.9865 8.46939 21.7018 10.1387 21.7018C12.5001 21.7018 14.5267 20.2718 15.4014 18.2305C15.6967 17.5398 15.8614 16.7785 15.8614 15.9798V9.24848C17.1714 10.2885 18.7867 10.8705 20.4594 10.9058L20.5287 10.9078V7.92448C20.2047 7.92448 19.8881 7.89048 19.5821 7.82715Z" fill="#F00044" />
            <path d="M10.0654 12.4778L10.0661 12.5964C9.91543 12.5451 9.76009 12.5071 9.60209 12.4831C9.46809 12.4631 9.33076 12.4531 9.19343 12.4531C7.72476 12.4531 6.52809 13.6318 6.49609 15.0925C6.51676 16.0545 7.04276 16.8931 7.81876 17.3544C7.57943 16.9518 7.44143 16.4818 7.44143 15.9804C7.44143 14.4924 8.65209 13.2818 10.1401 13.2818C10.2774 13.2818 10.4148 13.2918 10.5488 13.3118C10.7074 13.3358 10.8621 13.3731 11.0128 13.4251L10.9981 10.3225C10.7181 10.2805 10.4314 10.2585 10.1401 10.2585C10.1121 10.2585 10.0834 10.2591 10.0554 10.2598L10.0654 12.4778ZM16.7834 6.04645C16.2534 5.33778 15.9188 4.47445 15.8621 3.53512C15.8561 3.44045 15.8534 3.34445 15.8534 3.24845V3.24512H15.0021C15.2354 4.38512 15.8848 5.37378 16.7834 6.04645Z" fill="#F00044" />
            <path d="M17.0046 6.32112C16.9273 6.23245 16.854 6.14045 16.7833 6.04645C15.8846 5.37378 15.2353 4.38512 15.002 3.24512H14.98C15.2086 4.52778 15.9586 5.62845 17.0046 6.32112Z" fill="#08FFF9" />
            <path d="M10.0654 12.4778L10.066 12.4784L10.0554 10.2598H10.0547L10.0654 12.4778Z" fill="black" />
            <path d="M6.49595 15.0924C6.49528 15.1124 6.49462 15.1318 6.49462 15.1518C6.49462 16.1878 7.08195 17.0891 7.94062 17.5411C7.89795 17.4804 7.85662 17.4184 7.81862 17.3544C7.04195 16.8938 6.51662 16.0544 6.49595 15.0924ZM14.9146 8.30176V8.42042C16.2246 9.46043 17.8399 10.0424 19.5126 10.0778L19.582 10.0798V9.96109L19.5126 9.95909C17.8406 9.92376 16.2253 9.34242 14.9146 8.30176ZM14.4553 17.4024C14.7506 16.7118 14.9153 15.9504 14.9153 15.1518V15.0331C14.9153 15.8318 14.7513 16.5931 14.4553 17.2838C13.5806 19.3251 11.5539 20.7551 9.19262 20.7551C7.85395 20.7551 6.62262 20.2951 5.64795 19.5251C5.73528 19.6358 5.82728 19.7431 5.92262 19.8471C6.84995 20.4938 7.97662 20.8738 9.19328 20.8738C11.5539 20.8738 13.5806 19.4438 14.4553 17.4024Z" fill="black" />
            <path d="M9.19256 12.335C7.70456 12.335 6.4939 13.5456 6.4939 15.0336C6.4939 15.0536 6.49523 15.073 6.49523 15.093C6.52723 13.6323 7.7239 12.4536 9.19256 12.4536C9.3299 12.4536 9.46723 12.4636 9.60123 12.4836C9.7599 12.5076 9.91456 12.545 10.0652 12.597L10.0646 12.4783C9.9139 12.427 9.75923 12.3896 9.60123 12.3656C9.4679 12.345 9.3299 12.335 9.19256 12.335Z" fill="black" />
            <path d="M17.0047 6.32112C15.9587 5.62845 15.2087 4.52778 14.9801 3.24512H12.8627V13.6058L12.8381 15.9805C12.8381 17.4685 11.6274 18.6791 10.1394 18.6791C9.23275 18.6791 8.42941 18.2291 7.94008 17.5411C7.08141 17.0891 6.49408 16.1878 6.49408 15.1518C6.49408 15.1318 6.49541 15.1125 6.49541 15.0925C6.49475 15.0725 6.49408 15.0531 6.49408 15.0331C6.49408 13.5451 7.70475 12.3345 9.19275 12.3345C9.33008 12.3345 9.46742 12.3445 9.60142 12.3645C9.75942 12.3885 9.91475 12.4258 10.0647 12.4771L10.0541 10.2585C6.93341 10.3038 4.41675 12.8478 4.41675 15.9798C4.41675 17.3185 4.87675 18.5498 5.64675 19.5245C6.62141 20.2951 7.85275 20.7545 9.19141 20.7545C11.5527 20.7545 13.5794 19.3245 14.4541 17.2831C14.7494 16.5925 14.9141 15.8311 14.9141 15.0325V8.41912V8.30045C16.2241 9.34045 17.8394 9.92245 19.5121 9.95778L19.5814 9.95978V7.82712C18.5627 7.61845 17.6641 7.07712 17.0047 6.32112Z" fill="black" />
          </svg>
          Send to TikTok
        </button>
      </SideWrapper>
    </aside>
  )
};


export default Sidebar;
