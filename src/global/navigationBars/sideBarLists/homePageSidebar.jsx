import React from 'react';
import { FolderOpen,HouseSimple} from '@phosphor-icons/react';

const HomePageSidebar = () => {
    const homePageMenu = {
        allowedPaths:[],
        menuList:[
            {
                title: "Home",
                to: "/",
                icon: <HouseSimple size={25} weight="duotone" />
            },
            {
                title: "Projects",
                to: "/projects",
                icon: <FolderOpen size={25} weight="duotone" />
            }
        ]
    };
    
    return homePageMenu;
};

export default HomePageSidebar;
