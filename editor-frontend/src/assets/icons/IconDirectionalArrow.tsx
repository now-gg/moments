import { SVGProps, memo } from "react"
const IconDirectionalArrow = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
        {...props}
    >
        <path
            stroke="#FF42A5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.5 11.5h-16m0 0 6.546 6.546M4.5 11.5l6.546-6.545"
        />
    </svg>
)
const Memo = memo(IconDirectionalArrow)
export { Memo as IconDirectionalArrow }
