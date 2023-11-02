import {
    IconDirectionalArrow,
    IconProductLogo,
    IconEdit,
    IconCopy,
    IconDownload,
    IconTrash,
} from "../../assets/icons";
import Button from "../Button";
import IconButton from "../IconButton";
import Divider from "../Divider";
import "./header.css";

type HeaderProps = {
    title?: string;
};

const Header = ({ title = "Moments202305051403" }: HeaderProps) => {
    return (
        <header className="font-poppins bg-white">
            <div className="py-2 px-4 w-full flex justify-between header-container">
                <div className="flex items-center gap-x-3">
                    <div className="cursor-pointer">
                        <IconDirectionalArrow />
                    </div>
                    <div>
                        <IconProductLogo />
                    </div>

                    <Divider />

                    <p className="text-base-900 text-xl font-semibold">{title}</p>
                    <div>
                        <IconButton type="primary">
                            <IconEdit className="group-hover:fill-white" />
                        </IconButton>
                    </div>
                </div>
                <div className="flex items-center py-2.5 pl-2.5 gap-x-6">
                    <p className="text-black font-normal text-sm">
                        Connect with your account
                        <a className="text-additional-link" href="https://vitejs.dev/">
                            {" "}
                            sign up
                        </a>
                        {" "}or{" "}
                        <a className="text-additional-link" href="https://tailwindcss.com/">
                            log in
                        </a>
                    </p>
                    <Button type="secondary">
                        <div className="flex items-center gap-x-2.5">
                            <IconCopy className="group-hover:stroke-white" />
                            Copy Link
                        </div>
                    </Button>
                    <IconButton type="secondary" color="link">
                        <IconDownload />
                    </IconButton>

                    <Divider />

                    <IconButton type="secondary" color="warning">
                        <IconTrash />
                    </IconButton>
                </div>
            </div>
        </header>
    );
};

export default Header;
