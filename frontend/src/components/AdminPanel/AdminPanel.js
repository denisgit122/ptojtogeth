import css from './AdminPanel.module.css';
import {useState} from "react";
import {ManagerDescription} from "../Admin/ManagerDescription/ManagerDescription";
import {ButtonAdmin} from "../Admin/ButtonAdmin/ButtonAdmin";
import {useDispatch} from "react-redux";
import {managerAction} from "../../redux/slices/manager.slice";
import {useNavigate} from "react-router-dom";
import {authAction} from "../../redux/slices/auth.slice";

const AdminPanel = ({manager}) => {

    const [active, setActive] = useState(true);
    const [cop, setCoty] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addPassword = () => {

        if (manager.password === null) {
            navigate(`/adminPanel/${manager.id.toString()}`)
        } else {
            setCoty(true)

            setTimeout(() => {
                setCoty(false)
            }, 3000)
        }
    }
    const ban = () => {
        if (manager.status === "unbanned"){

            dispatch(managerAction.updateManager({id: manager.id, manager: {status: "banned", is_active: false}}))
        }

    };

    const unban = () => {
        if (manager.status === "banned"){

            dispatch(managerAction.updateManager({id: manager.id, manager: {status: "unbanned", is_active: true}}))
        }

    };
    const forgotPass = () => {
        dispatch(authAction.forgotPassword({email: manager.email}))
        alert('We have send you a confirmation email');
    }
    return (
        <div className={css.headBox}>

            {active
                ?
                <div className={css.box }>
                    <ManagerDescription manager={manager}/>
                    <div className={css.lie}></div>
                    <ButtonAdmin active={active} setActive={setActive} word={'Learn more...'}/>

                </div>
                :
                <div className={css.boxFalse}>

                    <ManagerDescription manager={manager}/>
                    <div className={css.lieFalse}></div>

                    <div className={css.boxButton}>

                        <button onClick={() => addPassword()} className={css.button}>ADD PASSWORD</button>

                        {cop
                            ? <div className={css.copied}>
                                <div >This manager has a password </div>,
                                <div onClick={()=>forgotPass()} className={css.forgotPass}>Forgot password</div>
                            </div>
                            : <></>}

                        <button onClick={()=>ban()} className={css.button}>BAN</button>
                        <button onClick={()=>unban()} className={css.button}>ANBUN</button>

                    </div>

                    <div className={css.lie && css.lieFalse2}></div>
                    <ButtonAdmin active={active} setActive={setActive} word={'skip'}/>

                </div>
            }
        </div>

    );
};

export {AdminPanel};