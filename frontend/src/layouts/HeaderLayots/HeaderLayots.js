import {Outlet, useNavigate} from "react-router-dom";
import {Header} from "../../components";

const HeaderLayots = () => {
    const accessToken =  localStorage.getItem('access')
    const navigate = useNavigate();
    return (
        accessToken
            ? <div>
                <Header/>
                <Outlet/>
            </div>
            :
            setTimeout(()=>navigate('/'), 10)

    );
};

export {HeaderLayots};