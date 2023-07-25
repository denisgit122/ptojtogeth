import {Outlet, useNavigate} from "react-router-dom";

import {HeaderManager} from "../../components";

const HeaderLayotsManager = () => {
    const accessToken =  localStorage.getItem('access')
    const navigate = useNavigate();
    return (
        accessToken
            ? <div>
                <HeaderManager/>
                <Outlet/>
            </div>
            :
            setTimeout(()=>navigate('/'), 10)

    );
};

export {HeaderLayotsManager};