import React from "react";
type SidebarProps = {
    sidebar?: string
}

const Sidebar = ({ sidebar }: SidebarProps) => {
    return (
        <aside>
            <div className="bg-white p-6 rounded-lg w-[300px]">
                <p className="text-base font-semibold text-translucent-80">{sidebar}</p>
                <button>

                </button>
                <button>

                </button>
                <button>

                </button>
            </div>
        </aside>
    )
};


export default Sidebar;
