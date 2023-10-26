import { SVGProps, memo } from "react"

const IconEdit = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="#FF42A5"
        {...props}
    >
        <path
            d="M9.5 12.5a.5.5 0 0 0 0 1v-1Zm4 1a.5.5 0 0 0 0-1v1ZM2.314 10.438l-.347-.36a.5.5 0 0 0-.149.297l.496.063ZM2 12.886l-.496-.064a.5.5 0 0 0 .561.56L2 12.886Zm2.547-.335.065.495a.5.5 0 0 0 .28-.134l-.345-.361Zm8.445-8.1-.342-.366-.004.005.346.36Zm.035-1.409.358-.348a.39.39 0 0 0-.012-.012l-.346.36Zm-.035-.033.346-.36-.346.36Zm-.733-.704-.351.355.005.005.346-.36Zm-1.465-.034L10.46 1.9a.405.405 0 0 0-.012.012l.346.36Zm-.035.034-.346-.36.346.36Zm-.48.742a.5.5 0 1 0-.713.702l.712-.702Zm.865 2.304.35.356.713-.702-.35-.356-.713.702ZM9.5 13.5h4v-1h-4v1Zm-7.682-3.125-.314 2.447.992.128.314-2.448-.992-.127Zm.247 3.007 2.547-.335-.13-.992-2.547.335.13.992Zm2.828-.47 8.445-8.1-.692-.722-8.446 8.1.693.722Zm8.44-8.096c.292-.273.466-.65.475-1.05l-1-.025a.488.488 0 0 1-.158.344l.683.73Zm.475-1.05c.01-.401-.144-.786-.423-1.072l-.717.697a.484.484 0 0 1 .14.35l1 .025Zm-.435-1.084-.035-.034-.693.721.035.034.693-.721Zm-.035-.034-.732-.704-.693.721.732.704.693-.72Zm-.727-.699a1.567 1.567 0 0 0-1.066-.449l-.023 1c.15.004.288.063.386.16l.703-.71ZM11.545 1.5a1.57 1.57 0 0 0-1.085.4l.668.743a.57.57 0 0 1 .394-.143l.023-1Zm-1.097.41-.035.034.693.721.035-.033-.693-.721Zm-.036.035-8.445 8.133.694.72 8.445-8.133-.694-.72Zm-.846 1.804 1.578 1.602.712-.702-1.578-1.602-.712.702Z"
        />
    </svg>
)
const Memo = memo(IconEdit)
export { Memo as IconEdit }