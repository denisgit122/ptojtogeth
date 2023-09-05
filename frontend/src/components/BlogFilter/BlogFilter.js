import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Container, Pagination, PaginationItem, Stack} from "@mui/material";
import {Link, useLocation} from "react-router-dom";

import css from './BlogFilter.module.css'
import {ordersService} from "../../services";


const BlogFilter = ({name, setOrder,setOrderPage, pageQty,order,orderPage, setPage, setResetForm, resetForm, start_dateQuery,
                        page, setSearchParams,nameQuery,surnameQuery, emailQuery, phoneQuery, ageQuery, end_dateQuery,
                        courseQuery, course_formatQuery, course_typeQuery, statusQuery, groupsQuery}) => {

    const manager = localStorage.getItem('manager');
    const location = useLocation();



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

    const [data, setData] = useState();

    const [word, setWord] = useState();
    const [search, setSearch] = useState(true);

    if (resetForm === true){
        setTimeout(() =>{
            setOrder(null)
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
            setSearchByStart_date(' ');
            setSearchByEnd_date(' ')
            setWord('')
        }, 10 )

    }
    const params = {page};


    // const handleSubmit = (e) => {
    //     e.preventDefault();
    // const form = e.target;
    //
    // const queryName = form.name.value;
    // const querySurname = form.surname.value;
    // const queryEmail = form.email.value;
    // const queryPhone = form.phone.value;
    // const queryAge = form.age.value;
    // const queryCourse = form.course.value;
    // const queryCourse_format = form.course_format.value;
    // const queryCourse_type = form.course_type.value;
    // const queryStatus = form.status.value;
    // const queryGroups = form.groups.value;
    // const queryStart = form?.start?.value;
    // const queryEnd = form?.end?.value;
    //
    // if (queryName.length) params.name = queryName;
    // if (querySurname.length) params.surname = querySurname;
    // if (queryEmail.length) params.email = queryEmail;
    // if (queryPhone.length) params.phone = queryPhone;
    // if (queryAge.length) params.age = queryAge;
    // if (queryCourse.length) params.course = queryCourse;
    // if (queryCourse_format.length) params.course_format = queryCourse_format;
    // if (queryCourse_type.length) params.course_type = queryCourse_type;
    // if (queryStatus.length) params.status = queryStatus;
    // if (queryGroups.length) params.groups = queryGroups;
    //
    // if (queryStart?.length) params.startDate = queryStart;
    // if (queryEnd?.length) params.endDate = queryEnd;


    // if (pageQty) {
    //
    //     setOrderPage([]);
    //     setOrder([]);
    //     ordersService.getBySearch(
    //         page, params.name, params.surname, params.email, params.phone, params.age, params.course,
    //         params.course_format, params.course_type, params.status, params.groups, params.startDate, params.endDate
    //     ).then(({data}) => {
    //         setData(data)
    //
    //         setOrderPage(data.totalPages)
    //         data.data.map(user=>
    //             setOrder(prev=> prev === null ? [user] : [...prev, user]))
    //     })
    //
    //     setPage(1);
    // setSearchParams(params);
    //
    // }
    // }
    // useEffect(() => {
    //     if (location.search && !pageQty ) {
    //         if (name?.[1]!=='asc' && name?.[1]!=='desc'){
    //
    //             const page = location.search?.split('=')[1]?.split('&')[0] || 1;
    //
    //             if (nameQuery.length) params.name = nameQuery;
    //             if (surnameQuery.length) params.surname = surnameQuery;
    //             if (emailQuery.length) params.email = emailQuery;
    //             if (phoneQuery.length) params.phone = phoneQuery;
    //             if (ageQuery.length) params.age = ageQuery;
    //             if (courseQuery.length) params.course = courseQuery;
    //             if (course_formatQuery.length) params.course_format = course_formatQuery;
    //             if (course_typeQuery.length) params.course_type = course_typeQuery;
    //             if (statusQuery.length) params.status = statusQuery;
    //             if (groupsQuery.length) params.groups = groupsQuery;
    //
    //             if (start_dateQuery?.length) params.startDate = start_dateQuery;
    //             if (end_dateQuery?.length) params.endDate = end_dateQuery;
    //
    //
    //             setOrderPage([]);
    //             setOrder([]);
    //
    //             ordersService.getBySearch(
    //                 page, params.name, params.surname, params.email, params.phone, params.age, params.course,
    //                 params.course_format, params.course_type, params.status, params.groups, params.startDate, params.endDate
    //
    //             ).then(({data}) => {
    //                 data.data.map(user=>
    //                     setOrder(prev=> prev === null ? [user] : [...prev, user]))
    //             });
    //             setPage(1);
    //         }
    //
    //     }
    //
    //
    //     if (data?.page > data?.totalPages){
    //         setOrder([]);
    //         setPage(1)
    //         if (nameQuery.length) params.name = nameQuery;
    //         if (surnameQuery.length) params.surname = surnameQuery;
    //         if (emailQuery.length) params.email = emailQuery;
    //         if (phoneQuery.length) params.phone = phoneQuery;
    //         if (ageQuery.length) params.age = ageQuery;
    //         if (courseQuery.length) params.course = courseQuery;
    //         if (course_formatQuery.length) params.course_format = course_formatQuery;
    //         if (course_typeQuery.length) params.course_type = course_typeQuery;
    //         if (statusQuery.length) params.status = statusQuery;
    //         if (groupsQuery.length) params.groups = groupsQuery;
    //
    //         if (start_dateQuery?.length) params.startDate = start_dateQuery;
    //         if (end_dateQuery?.length) params.endDate = end_dateQuery;
    //
    //
    //         setOrderPage([]);
    //         setOrder([]);
    //         console.log("lox")
    //         ordersService.getBySearch(
    //             1, params.name, params.surname, params.email, params.phone, params.age, params.course,
    //             params.course_format, params.course_type, params.status, params.groups, params.startDate, params.endDate
    //
    //         ).then(({data}) => {
    //             setData(data)
    //
    //             setOrderPage(data.totalPages)
    //             data.data.map(user=>
    //                 setOrder(prev=> prev === null ? [user] : [...prev, user]))
    //         });
    //         setPage(1);
    //         params.page = 1;
    //
    //     }
    // },[location, data])

    const searchBy = async (word) => {
        if (search){
            setSearch(false);
            setWord(word);
            setPage(1);

        }else {
            setSearch(true);
            setWord(word);
            setPage(1);

        }

    }

    useEffect(() => {
        console.log(search)
        console.log(word)
        if (searchByName.length) params.name = searchByName;
        if (searchBySurname.length) params.surname = searchBySurname;
        if (searchByEmail.length) params.email = searchByEmail;
        if (searchByPhone.length) params.phone = searchByPhone;
        if (searchByAge.length) params.age = searchByAge;
        if (searchByCourse.length) params.course = searchByCourse;
        if (searchByCourse_format.length) params.course_format = searchByCourse_format;
        if (searchByCourse_type.length) params.course_type = searchByCourse_type;
        if (searchByStatus.length) params.status = searchByStatus;
        if (searchByGroups.length) params.groups = searchByGroups;

        if (searchByStart_date?.length >= 2) params.startDate = searchByStart_date;
        if (searchByEnd_date?.length >= 2) params.endDate = searchByEnd_date;
        if (pageQty){
            if (word){

                if (search){

                    setOrderPage([]);
                    setOrder([]);
                    params.sortBy =  `${word} desc`
                    ordersService.getBySearch(
                        page, params.name, params.surname, params.email, params.phone, params.age, params.course,
                        params.course_format, params.course_type, params.status, params.groups, params.startDate, params.endDate,
                        `${word}:desc`
                    ).then(({data}) => {
                        setData(data)

                        setOrderPage(data.totalPages)
                        setOrder(data.data)
                    })

                    console.log(11)
                }else {
                    setOrderPage([]);
                    setOrder([]);
                    params.sortBy =  `${word} asc`
                    ordersService.getBySearch(
                        page, params.name, params.surname, params.email, params.phone, params.age, params.course,
                        params.course_format, params.course_type, params.status, params.groups, params.startDate, params.endDate,
                        `${word}:asc`
                    ).then(({data}) => {
                        setData(data)

                        setOrderPage(data.totalPages)
                        setOrder(data.data)
                    })
                    console.log(12)
                }
                setSearchParams(params)
            }else {
                setOrderPage([]);
                setOrder([]);

                ordersService.getBySearch(
                    page, params.name, params.surname, params.email, params.phone, params.age, params.course,
                    params.course_format, params.course_type, params.status, params.groups, params.startDate, params.endDate,
                ).then(({data}) => {
                    setData(data)

                    setOrderPage(data.totalPages)
                    setOrder(data.data)
                })
                setSearchParams(params)

            }
        }else {

            if (location.search && !pageQty ) {
                // if (name?.[1]!=='asc' && name?.[1]!=='desc'){
                    console.log(13)
                    // const page = location.search?.split('=')[1]?.split('&')[0] || 1;

                    if (nameQuery.length) params.name = nameQuery;
                    if (surnameQuery.length) params.surname = surnameQuery;
                    if (emailQuery.length) params.email = emailQuery;
                    if (phoneQuery.length) params.phone = phoneQuery;
                    if (ageQuery.length) params.age = ageQuery;
                    if (courseQuery.length) params.course = courseQuery;
                    if (course_formatQuery.length) params.course_format = course_formatQuery;
                    if (course_typeQuery.length) params.course_type = course_typeQuery;
                    if (statusQuery.length) params.status = statusQuery;
                    if (groupsQuery.length) params.groups = groupsQuery;

                    if (start_dateQuery?.length) params.startDate = start_dateQuery;
                    if (end_dateQuery?.length) params.endDate = end_dateQuery;
                    const pages = location.search?.split('=')[1]?.split('&')[0] || 1;
                    console.log(pages);

                    setOrderPage([]);
                    setOrder([]);

                    ordersService.getBySearch(
                        pages, params.name, params.surname, params.email, params.phone, params.age, params.course,
                        params.course_format, params.course_type, params.status, params.groups, params.startDate, params.endDate

                    ).then(({data}) => {

                            setOrder(data.data)
                    });
                    setPage(1);
                // }

            }


            if (data?.page > data?.totalPages){
                console.log(14)
                setOrder([]);
                setPage(1)
                if (nameQuery.length) params.name = nameQuery;
                if (surnameQuery.length) params.surname = surnameQuery;
                if (emailQuery.length) params.email = emailQuery;
                if (phoneQuery.length) params.phone = phoneQuery;
                if (ageQuery.length) params.age = ageQuery;
                if (courseQuery.length) params.course = courseQuery;
                if (course_formatQuery.length) params.course_format = course_formatQuery;
                if (course_typeQuery.length) params.course_type = course_typeQuery;
                if (statusQuery.length) params.status = statusQuery;
                if (groupsQuery.length) params.groups = groupsQuery;

                if (start_dateQuery?.length) params.startDate = start_dateQuery;
                if (end_dateQuery?.length) params.endDate = end_dateQuery;


                setOrderPage([]);
                setOrder([]);
                ordersService.getBySearch(
                    1, params.name, params.surname, params.email, params.phone, params.age, params.course,
                    params.course_format, params.course_type, params.status, params.groups, params.startDate, params.endDate

                ).then(({data}) => {
                    setData(data)

                    setOrderPage(data.totalPages)
                    data.data.map(user=>
                        setOrder(prev=> prev === null ? [user] : [...prev, user]))
                });
                setPage(1);
                params.page = 1;

            }

        }

    },[searchByAge,searchByName, searchBySurname,searchByEmail, searchByPhone, searchByCourse, searchByCourse_type,
        searchByCourse_format, searchByGroups, searchByStatus, searchByEnd_date, searchByStart_date, page, word, setWord,
        search,setSearch

    ])
    return (
        <div className={css.headForm}>
            <form autoComplete='off' action="">

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


                {/*<button className={css.a} >search</button>*/}


            </form>
            {order === null || Math.ceil(+orderPage.length/25)<=0
                ? <div></div>

                :
                <div className={css.conteiner}>
                    <Container>
                        <Stack spacing={2}>
                            {
                                (<Pagination
                                    sx={{marginY:3, marginX: "auto"}}
                                    count={orderPage}
                                    page={page}
                                    showFirstButton
                                    showLastButton
                                    onChange={(_, num) => setPage(num)}
                                    renderItem={
                                        (item) =>(
                                            <PaginationItem
                                                component={Link}
                                                to={`/${manager === "manager" ? "manager": "orders"}?page=${item.page}${searchByEmail !== '' ? `&email=${searchByEmail}` : ''}${searchBySurname !== '' ? `&surname=${searchBySurname}` : ''}${searchByName !== '' ? `&name=${searchByName}` : ''}${searchByCourse !== '' ? `&course=${searchByCourse}` : ''}${searchByAge !== '' ? `&age=${searchByAge}` : ''}${searchByPhone !== '' ? `&phone=${searchByPhone}` : ''}${searchByStatus !== '' ? `&status=${searchByStatus}` : ''}${searchByCourse_type !== '' ? `&course_type=${searchByCourse_type}` : ''}${searchByCourse_format !== '' ? `course_format=${searchByCourse_format}` : ''}${searchByGroups !== '' ? `&groups=${searchByGroups}` : ''}
                                          `}
                                                {...item}
                                            />
                                        )
                                    }
                                />)
                            }

                        </Stack>
                    </Container>
                </div>}

            <div className={css.headBox}>

                <div onClick={()=>searchBy('id')} className={css.all && css.id}>id</div>
                <div onClick={()=>searchBy('name')} className={css.all && css.name}>name</div>
                <div onClick={()=>searchBy('surname')} className={css.all && css.surname}>surname</div>
                <div onClick={()=>searchBy('email')} className={css.all && css.email}>email</div>
                <div onClick={()=>searchBy('phone')} className={css.all && css.phone}>phone</div>
                <div onClick={()=>searchBy('age')} className={css.all && css.age}>age</div>
                <div onClick={()=>searchBy('course')} className={css.all && css.surname}>course</div>
                <div onClick={()=>searchBy('course_format')} className={css.all && css.course_format}>course_format</div>
                <div onClick={()=>searchBy('course_type')} className={css.all && css.course_format}>course_type</div>
                <div onClick={()=>searchBy('status')} className={css.all && css.course_format}>status</div>
                <div onClick={()=>searchBy('sum')} className={css.all && css.course_format}>sum</div>
                <div onClick={()=>searchBy('already_paid')} className={css.all && css.course_format}>already_paid</div>
                <div onClick={()=>searchBy('group')} className={css.all && css.course_format}>group</div>
                <div onClick={()=>searchBy('created_at')} className={css.all && css.course_format}>created_at</div>
                <div onClick={()=>searchBy('manager')} className={css.all}>manager</div>
            </div>
        </div>
    );
};

export {BlogFilter};