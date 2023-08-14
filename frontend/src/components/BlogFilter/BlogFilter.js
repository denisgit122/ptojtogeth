import {useState} from "react";

import css from './BlogFilter.module.css'
import {ordersService} from "../../services";
import {useSelector} from "react-redux";
import {Container, Pagination, PaginationItem, Stack} from "@mui/material";
import {Link} from "react-router-dom";

const BlogFilter = ({ setOrder,setOrderPage, pageQty,order,orderPage,setPage, setResetForm, resetForm, start_dateQuery,
                        page, setSearchParams,nameQuery,surnameQuery, emailQuery, phoneQuery, ageQuery, end_dateQuery,
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

    const [searchByStart_date, setSearchByStart_date] = useState(start_dateQuery);
    const [searchByEnd_date, setSearchByEnd_date] = useState(end_dateQuery);

    const [startDate, setStartDate] = useState(false);
    const [endDate, setEndDate] = useState(false);

    const {groups} = useSelector(state => state.groups)

    const [sendMessage, setSendMessage]= useState(true)

    if (resetForm === true){
        setTimeout(() =>{
            setResetForm(false);
            setSearchByName('');
            setSearchBySurname('');
            setSearchByEmail('');
            setSearchByPhone('');
            setSearchByAge('');
            setSearchByCourse('');
            setSearchByCourse_format('');
            setSearchByCourse_type('');
            setSearchByStatus('');
            setSearchByGroups('');
            setSearchByStart_date('');
            setSearchByEnd_date('')
        }, 10 )

     }
    const params = {page};

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
        const queryStart = form?.start?.value;
        const queryEnd = form?.end?.value;

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

        if (queryStart?.length) params.startDate = queryStart;
        if (queryEnd?.length) params.endDate = queryEnd;


        const pageQtys= 20;

        if (pageQty) {
        setOrderPage([]);
        setOrder([]);

            ordersService.getBySearch(
                page, params.name, params.surname, params.email, params.phone, params.age, params.course,
                params.course_format, params.course_type, params.status, params.groups, params.startDate, params.endDate
            ).then(({data}) => {
                data.data.map(user=>
                    setOrder(prev=> prev === null ? [user] : [...prev, user]))
            })
        for (let i = 1; i < pageQty + 1; i++) {

            ordersService.getBySearch(
                page = i, params.name, params.surname, params.email, params.phone, params.age, params.course,
                params.course_format, params.course_type, params.status, params.groups,params.startDate, params.endDate
            ).then(({data}) => {
                data.data.map(user=>
                    setOrderPage(prev=> prev === null ? [user] : [...prev, user]))
            })

        }

        setSearchParams(params);

        } else if (pageQtys) {

            setOrderPage([]);
            setOrder([]);

            ordersService.getBySearch(
                page, params.name, params.surname, params.email, params.phone, params.age, params.course,
                params.course_format, params.course_type, params.status, params.groups, params.startDate, params.endDate
            ).then(({data}) => {
                data.data.map(user=>
                    setOrder(prev=> prev === null ? [user] : [...prev, user]))
            });

            for (let i = 1; i < pageQtys + 1; i++) {

                ordersService.getBySearch(
                    page = i, params.name, params.surname, params.email, params.phone, params.age, params.course,
                    params.course_format, params.course_type, params.status, params.groups, params.startDate, params.endDate
                ).then(({data}) => {
                    data.data.map(user=>
                        setOrderPage(prev=> prev === null ? [user] : [...prev, user]))
                })


            }
            setSearchParams(params)
        }

    }
    if (orderPage?.length>25){
        if (sendMessage === true ){

            setSendMessage(false)
            alert('if you want to use page numbering uou need to:' +
                '1) Be sure to select a page.' +
                '2) Click the search button')
            setTimeout(()=> {
                setSendMessage(true)
            }, 9000)
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
                    <input className={css.inputAge} type="search"  placeholder={'age'} name={'age'} value={searchByAge} onChange={e => setSearchByAge(e.target.value)}/>


                    {!startDate
                        ?   <div className={css.startDate} defaultValue={'data'} onClick={()=>setStartDate(true)}>start Date</div>
                        : <input className={css.input} type="date"  placeholder={'start'} name={'start'} value={searchByStart_date} onChange={e => setSearchByStart_date(e.target.value)}/>
                    }</div>

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
                    {!endDate
                        ?<div className={css.endDate} onClick={()=>setEndDate(true)}>End date</div>
                        :<input className={css.input} type="date"  placeholder={'end'} name={'end'} value={searchByEnd_date} onChange={e => setSearchByEnd_date(e.target.value)}/>

                    }

                </div>


                <button className={css.a} >search</button>


            </form>
            {order === null
            ? <div></div>

            :
            <div className={css.conteiner}>
                <Container>
                    <Stack spacing={2}>
                        {
                            !!pageQty && (<Pagination
                                sx={{marginY:3, marginX: "auto"}}
                                count={Math.ceil(+orderPage.length/25)}
                                page={page}
                                showFirstButton
                                showLastButton
                                onChange={(_, num) => setPage(num)}
                                renderItem={
                                    (item) =>(
                                        <PaginationItem
                                            component={Link}
                                            to={`/orders?page=${item.page}`}

                                            {...item}
                                        />
                                    )
                                }
                            />)
                        }

                    </Stack>
                </Container>
            </div>}
        </div>
    );
};

export {BlogFilter};