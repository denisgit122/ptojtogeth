import {Container, Pagination, Stack, PaginationItem} from '@mui/material'
import {useEffect, useState} from "react";
import {Link, useLocation, useSearchParams} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {BiReset} from 'react-icons/bi'

import css from './Users.module.css'
import {ordersAction} from "../../redux/slices/orders.slice";
import {User} from "../User/User";
import {BlogFilter} from "../BlogFilter/BlogFilter";
import {groupAction} from "../../redux/slices/group.slice";
import {Loader} from "../Loader/Loader";

const Users = () => {

    const location = useLocation();

    const [page, setPage] = useState(parseInt(location.search?.split('=')[1]?.split('&')[0] || 1));
    const [name, setName] = useState( location.search?.split('=')[2]?.split('+') || null)

    const [order, setOrder] = useState(null);
    const [orderPage, setOrderPage] = useState(null);


    const [pageQty, setPageQty] = useState(0);

    const [resetForm, setResetForm] = useState(false);

    const dispatch = useDispatch();
    const {orders} = useSelector(state => state.orders);

    const [searchByName, setSearchByName] = useState(true );
    const [loader, setLoader] = useState(true );


    const [search, setSearch] = useState('');


    const [searchParams, setSearchParams] = useSearchParams();

    const nameQuery = searchParams.get('name') || '';
    const surnameQuery = searchParams.get('surname') || '';
    const emailQuery = searchParams.get('email') || '';
    const phoneQuery = searchParams.get('phone') || '';
    const ageQuery = searchParams.get('age') || '';
    const courseQuery = searchParams.get('course') || '';
    const course_formatQuery = searchParams.get('course_format') || '';
    const course_typeQuery = searchParams.get('course_type') || '';
    const statusQuery = searchParams.get('status') || '';
    const groupsQuery = searchParams.get('groups') || '';

    const start_dateQuery = searchParams.get('start_date') || '';
    const end_dateQuery = searchParams.get('end_date') || '';

    useEffect(() => {
        setLoader(true);

        dispatch(groupAction.getGroups());
        setPageQty(orders.totalPages);

        setTimeout(()=>setLoader(false), 1000);



        if (search !== ''){

            dispatch(ordersAction.getAll({page, query: search}));
            const arg = search.split(':');

            setSearchParams({page, sortBy: `${arg[0]} ${arg[1]}`});


        }else if(name !== null){

            if (name[1]==='asc' || name[1]==='desc'){

                dispatch(ordersAction.getAll({page, query: `${name[0]}:${name[1]}` }));
                setSearchParams({page, sortBy: `${name[0]} ${name[1]}`});

            }

        } else if (search === ''){

            dispatch(ordersAction.getAll({page}));

        }

    }, [dispatch, orders.limit, orders.totalPages, page])

    const sortByName = async (word) => {

        if (searchByName|| !searchByName){
            setPage(1);
        }
        if (!searchByName){

            // setOrder(null);

            setSearchByName(true);

            dispatch(ordersAction.getAll({page, query: `${word}:asc` }));

            setSearch(`${word}:asc`);

            setSearchParams({page, sortBy: `${word} asc` });

        }else {

            setSearchParams({page, sortBy: `${word} desc`});

            setSearch(`${word}:desc`);

            dispatch(ordersAction.getAll({page, query: `${word}:desc` }));

            setSearchByName(false);
            setOrder(null);

        }

    };
    const reset = async () => {
        setPage(1)
        setOrder(null);
        setSearchParams({page:1});
        setSearch('');
        setName(null)
        setOrderPage(null);

        await dispatch(ordersAction.getAll({page }));
        setSearchByName(true);

        setResetForm(true);
    }
    return (
        <div className={css.box}>
            <div className={css.usersBox}>
                <div className={css.pagin}>

                    <div className={css.boxBiReset} onClick={()=>reset()}><BiReset className={css.BiReset}/></div>

                    <div className={order === null? css.headBoxSearch : css.headBoxSearchOrder}>
                        <BlogFilter
                            name={name}
                            start_dateQuery={start_dateQuery}
                            end_dateQuery={end_dateQuery}
                            setResetForm={setResetForm}
                            resetForm={resetForm}
                            setPage={setPage}
                            orderPage={orderPage}
                            loader={loader}
                            order={order}
                            setOrderPage={setOrderPage}
                            pageQty={pageQty}
                            page={page}
                            setOrder={setOrder}
                            nameQuery={nameQuery}
                            setSearchParams={setSearchParams}
                            surnameQuery={surnameQuery}
                            emailQuery={emailQuery}
                            phoneQuery={phoneQuery}
                            ageQuery={ageQuery}
                            courseQuery={courseQuery}
                            course_formatQuery={course_formatQuery}
                            course_typeQuery={course_typeQuery}
                            statusQuery={statusQuery}
                            groupsQuery={groupsQuery}

                        />

                    </div>
                    {order === null
                        ? loader
                            ?<div className={css.boxLoader}><Loader/></div>
                            : <div className={css.conteiner}>
                                <Container>
                                    <Stack spacing={2}>
                                        {
                                            !!pageQty && (<Pagination
                                                sx={{marginY:3, marginX: "auto"}}
                                                count={pageQty}
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
                            </div>

                        :<div></div>}
                    <div >
                        <div className={css.headBox}>

                            <div onClick={()=>sortByName('id')} className={css.all && css.id}>id</div>
                            <div onClick={()=>sortByName('name')} className={css.all && css.name}>name</div>
                            <div onClick={()=>sortByName('surname')} className={css.all && css.surname}>surname</div>
                            <div onClick={()=>sortByName('email')} className={css.all && css.email}>email</div>
                            <div onClick={()=>sortByName('phone')} className={css.all && css.phone}>phone</div>
                            <div onClick={()=>sortByName('age')} className={css.all && css.age}>age</div>
                            <div onClick={()=>sortByName('course')} className={css.all && css.surname}>course</div>
                            <div onClick={()=>sortByName('course_format')} className={css.all && css.course_format}>course_format</div>
                            <div onClick={()=>sortByName('course_type')} className={css.all && css.course_format}>course_type</div>
                            <div onClick={()=>sortByName('status')} className={css.all && css.course_format}>status</div>
                            <div onClick={()=>sortByName('sum')} className={css.all && css.course_format}>sum</div>
                            <div onClick={()=>sortByName('already_paid')} className={css.all && css.course_format}>already_paid</div>
                            <div onClick={()=>sortByName('group')} className={css.all && css.course_format}>group</div>
                            <div onClick={()=>sortByName('created_at')} className={css.all && css.course_format}>created_at</div>
                            <div onClick={()=>sortByName('manager')} className={css.all}>manager</div>
                        </div>
                        { loader
                            ?<div className={css.boxLoader}><Loader/></div>
                            :order === null
                              ? orders.data && orders.data.map(order => <User orders={orders}  page={page} search={search} nameQur={name} key={order.id} order={order}/>)

                              :order !== null && order.length >=0 && order.map(orde => <User ord={order} setOrder={setOrder} page={page} search={search} nameQur={name} key={orde.id} order={orde}/>)}
                    </div>

                </div>

            </div>
        </div>
    );
};

export {Users};