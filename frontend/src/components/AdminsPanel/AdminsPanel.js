import css from './AdminPanel.module.css'
import {AdminPanel} from "../AdminPanel/AdminPanel";
import {useEffect, useState} from "react";
import {ModalCreate} from "../ModalCreate/ModalCreate";
import {useDispatch, useSelector} from "react-redux";
import {managerAction} from "../../redux/slices/manager.slice";
import {Loader} from "../Loader/Loader";

const AdminsPanel = () => {

    const [length, setLength] = useState(0);
    const [modalActive, setModalActive] = useState(false);
    const [loader, setLoader] = useState(true);

    const dispatch = useDispatch();

    const {managers} = useSelector(state => state.managers);

    const banned = managers.filter(manager => manager.status === "banned");
    const unbanned = managers.filter(manager => manager.status === "unbanned");
    const is_activeFalse = managers.filter(manager => manager.is_active === false);
    const is_activeTrue = managers.filter(manager => manager.is_active === true);

    useEffect(() => {
        setLoader(true)
        dispatch(managerAction.getManagers());

        setLength(managers.length);
        setTimeout(()=>setLoader(false), 1000)
    }, [dispatch])

    return (
        <div className={css.box}>

            <div className={css.adminPanelBox}>

                <div className={css.ordersBox}>
                    <h3 className={css.order}>Orders statistic</h3>
                </div>

                <div  className={css.totalBox}>
                    <div onClick={() => setModalActive(true)} className={css.create}>
                        <div>create</div>
                    </div>

                    <div className={css.totalBox}>
                        <div className={css.total}>total: {length}</div>
                        <div className={css.total}>Banned: {banned.length}</div>
                        <div className={css.total}>Unbanned: {unbanned.length}</div>
                        <div className={css.total}>Is active: {is_activeFalse.length}False</div>
                        <div className={css.total}>Is active: {is_activeTrue.length}True</div>
                    </div>

                </div>

                <ModalCreate active={modalActive} setModalActive={setModalActive}/>

                <div>
                    {
                        loader
                            ?<div className={css.boxLoader}><Loader/></div>
                            : managers && managers.map((manager )=> <AdminPanel  key={manager.id} length={length} manager={manager}/>)
                    }
                </div>

            </div>
        </div>

    );
};

export {AdminsPanel};