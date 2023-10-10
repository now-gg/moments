import { SVGProps, memo } from "react"
const IconDownload = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      fill="#0397EB"
      fillRule="evenodd"
      d="M11.354 9.646a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 11.793V1a.5.5 0 0 1 1 0v10.793l2.146-2.147a.5.5 0 0 1 .708 0Z"
      clipRule="evenodd"
    />
    <path
      fill="#0397EB"
      fillRule="evenodd"
      d="M0 13.5V11h1v2.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5V11h1v2.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 13.5Z"
      clipRule="evenodd"
    />
  </svg>
)
const Memo = memo(IconDownload)
export { Memo as IconDownload }
