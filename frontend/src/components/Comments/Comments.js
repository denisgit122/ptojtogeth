import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";

import css from './Comment.module.css'
import {Comment} from "../Comment/Comment";
import {ordersService} from "../../services";
import {ordersAction} from "../../redux/slices/orders.slice";
import {UpdateUser} from "../UpdateUser/UpdateUser";

const Comments = ({page, id,search, order, nameQur, ord, setOrder, orders,setOrderPage, setPage}) => {

    const [comments, setComments] = useState('');
    const [modalActive, setModalActive] = useState(false);

    const [user, setUser] = useState('');


    const {reset, handleSubmit, register} = useForm();

    const dispatch = useDispatch();

    const submit = async (data) => {
        reset();
        await dispatch(ordersAction.postComments({id: id, comment: data, page}));

        ordersService.getAllComments(id).then(({data})=> setComments(data))

    }

    useEffect(() => {
        ordersService.getAllComments(id).then(({data})=> setComments(data))
    },[ id])

    const update = async () => {
        setModalActive(true);
        await ordersService.getOneOrder(id).then(({data})=> setUser(data));
    }

    return (
        <div className={css.headBoxComment}>
            <div className={css.commentBox}>

                {Array.isArray(comments) && comments.map(comment=><Comment key={comment.id} comment={comment}/>)}


            </div>
            <div className={css.form}>
                <form onSubmit={handleSubmit(submit)}>
                    <input className={css.input} type="text" placeholder={'comment'} required={true} {...register('comment')}/>
                    <button
                        // disabled={order.manager !== null }
                        className={css.a}>Submit</button>
                </form>
            </div>
            <button
                onClick={() =>  update()} className={css.edit}>EDIT</button>
            <UpdateUser setOrderPage={setOrderPage} setPage={setPage} page={page} ord={ord} setOrder={setOrder} orders={orders} search={search} nameQur={nameQur} order={user} active={modalActive} setModalActive={setModalActive}/>

        </div>
    );
};

export {Comments};