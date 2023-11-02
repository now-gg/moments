
import { SVGProps, memo } from "react"
const IconCopy = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={14}
        height={14}
        fill="none"
        stroke="#FF42A5"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.465 7.706 2.051 9.121a2 2 0 0 0 0 2.828v0a2 2 0 0 0 2.828 0l2.829-2.828a2 2 0 0 0 0-2.829v0"
        />
        <path
            strokeLinecap="round"
            d="m10.536 6.293 1.414-1.415a2 2 0 0 0 0-2.828v0a2 2 0 0 0-2.828 0L6.293 4.878a2 2 0 0 0 0 2.829v0"
        />
    </svg>
)
const Memo = memo(IconCopy)
export { Memo as IconCopy }
