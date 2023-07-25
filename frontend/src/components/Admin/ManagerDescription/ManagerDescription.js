import css from "../../AdminPanel/AdminPanel.module.css";

const ManagerDescription = ({manager}) => {
    const {email, name, surname, is_active, last_login, status} = manager;
    let strings = '';
    let login = '';
    let loginDay = '';
    let _id = '';

    if (manager.last_login){
        strings = last_login.split('-').slice(0,2);

        login = last_login.split('-').slice(0,3);
        const arr = login.splice(2,1);
        loginDay = arr[0].split('').splice(0,2)

    }
    return (
        <div>
            <div className={css.desc}>

                <div className={css.span}>email: {email}</div>
                <div className={css.span}>name: {name}</div>
                <div className={css.span}>surname: {surname}</div>
                <div className={css.span}>status: {status}</div>
                <div className={css.span}>last_login: {
                    last_login===null
                        ? null
                        : `${strings[0]}-${strings[1]}-${loginDay[1]}${loginDay[0]}`

                }</div>

            </div>
        </div>
    );
};

export {ManagerDescription};