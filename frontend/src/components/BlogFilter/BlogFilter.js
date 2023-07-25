import {useState} from "react";

import css from './BlogFilter.module.css'
import {ordersService} from "../../services";
import {useSelector} from "react-redux";

const BlogFilter = ({ setOrder,pageQty,
                        page, setSearchParams,nameQuery,surnameQuery, emailQuery, phoneQuery, ageQuery,
                        courseQuery, course_formatQuery, course_typeQuery, statusQuery, groupsQuery}) => {

    const [searchByName, setSearchByName] = useState(nameQuery);
    const [searchBySurname, setSearchBySurname] = useState(surnameQuery);
    const [searchByEmail, setSearchByEmail] = useState(emailQuery);
    const [searchByPhone, setSearchByPhone] = useState(phoneQuery);
    const [searchByAge, setSearchByAge] = useState(ageQuery);
    const [searchByCourse, setSearchByCourse] = useState(courseQuery);
    const [searchByCourse_format, setSearchByCourse_format] = useState(course_formatQuery)
    const [searchByCourse_type, setSearchByCourse_type] = useState(course_typeQuery);
    const [searchByStatus, setSearchByStatus] = useState(statusQuery);
    const [searchByGroups, setSearchByGroups] = useState(groupsQuery);

    const {groups} = useSelector(state => state.groups)

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = e.target;

        const queryName = form.name.value;
        const querySurname = form.surname.value;
        const queryEmail = form.email.value;
        const queryPhone = form.phone.value;
        const queryAge = form.age.value;
        const queryCourse = form.course.value;
        const queryCourse_format = form.course_format.value;
        const queryCourse_type = form.course_type.value;
        const queryStatus = form.status.value;
        const queryGroups = form.groups.value;

        const params = {page};

        if (queryName.length) params.name = queryName;
        if (querySurname.length) params.surname = querySurname;
        if (queryEmail.length) params.email = queryEmail;
        if (queryPhone.length) params.phone = queryPhone;
        if (queryAge.length) params.age = queryAge;
        if (queryCourse.length) params.course = queryCourse;
        if (queryCourse_format.length) params.course_format = queryCourse_format;
        if (queryCourse_type.length) params.course_type = queryCourse_type;
        if (queryStatus.length) params.status = queryStatus;
        if (queryGroups.length) params.groups = queryGroups;

     const pageQtys= 20;

    if (pageQty) {
        setOrder([])
        for (let i = 1; i < pageQty + 1; i++) {

            ordersService.getBySearch(
                page = i, params.name, params.surname, params.email, params.phone, params.age, params.course,
                params.course_format, params.course_type, params.status, params.groups
            ).then(({data}) => {
                data.data.map(user=>
                    setOrder(prev=> prev === null ? [user] : [...prev, user]))
            })


        }
        setSearchParams(params)
    } else if (pageQtys) {
            setOrder([])
            for (let i = 1; i < pageQtys + 1; i++) {

                ordersService.getBySearch(
                    page = i, params.name, params.surname, params.email, params.phone, params.age, params.course,
                    params.course_format, params.course_type, params.status, params.groups
                ).then(({data}) => {
                    data.data.map(user=>
                        setOrder(prev=> prev === null ? [user] : [...prev, user]))
                })


            }
            setSearchParams(params)
        }

    }
    return (
        <div className={css.headForm}>
            <form autoComplete='off' onSubmit={handleSubmit} action="">

                <div className={css.boxInpFirs}>
                    <input className={css.input} type="search"  placeholder={'name'} name={'name'} value={searchByName} onChange={e => setSearchByName(e.target.value)}/>
                    <input className={css.input} type="search"  placeholder={'surname'} name={'surname'} value={searchBySurname} onChange={e => setSearchBySurname(e.target.value)}/>
                    <input className={css.input} type="search"  placeholder={'email'} name={'email'} value={searchByEmail} onChange={e => setSearchByEmail(e.target.value)}/>
                    <input className={css.input} type="search"  placeholder={'phone'} name={'phone'} value={searchByPhone} onChange={e => setSearchByPhone(e.target.value)}/>
                    <input className={css.inputAge} type="number"  placeholder={'age'} name={'age'} value={searchByAge} onChange={e => setSearchByAge(e.target.value)}/>

                </div>

                <div className={css.boxInpFirs}>
                    <select name="course" value={searchByCourse} onChange={e => setSearchByCourse(e.target.value)} >
                        <option value="">all courses</option>
                        <option value="FS">FS</option>
                        <option value="QACX">QACX</option>
                        <option value="JCX">JCX</option>
                        <option value="JSCX">JSCX</option>
                        <option value="FE">FE</option>
                        <option value="PCX">PCX</option>

                    </select>

                    <select name="course_format" value={searchByCourse_format} onChange={e => setSearchByCourse_format(e.target.value)}>
                        <option value="">all formats</option>
                        <option value="static">static</option>
                        <option value="online">online</option>
                    </select>

                    <select name="course_type" value={searchByCourse_type} onChange={e => setSearchByCourse_type(e.target.value)}>
                        <option value="">all course type</option>
                        <option value="pro">pro</option>
                        <option value="minimal">minimal</option>
                        <option value="premium">premium</option>
                        <option value="vip">vip</option>
                        <option value="incubator">incubator</option>
                    </select>

                    <select name="status" value={searchByStatus} onChange={e => setSearchByStatus(e.target.value)}>
                        <option value="">all status</option>
                        <option value="In work">In work</option>
                        <option value="New">new</option>
                        <option value="Agree">agree</option>
                        <option value="Disagree">disagree</option>
                        <option value="Dubbing">dubbing</option>
                    </select>

                    <select name="groups" value={searchByGroups} onChange={e => setSearchByGroups(e.target.value)}>
                        <option value="">all groups</option>
                        {
                            groups.map(group => <option value={group.name} key={group.id}>{group.name}</option>)
                        }
                    </select>
                </div>


                <button className={css.a} >search</button>
            </form>
        </div>
    );
};

export {BlogFilter};