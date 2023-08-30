import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";

import css from './Comment.module.css'
import {Comment} from "../Comment/Comment";
import {ordersService} from "../../services";
import {ordersAction} from "../../redux/slices/orders.slice";
import {UpdateUser} from "../UpdateUser/UpdateUser";

const Comments = ({page, id,search, order, nameQur, ord, setOrder, orders}) => {

    const [comments, setComments] = useState('');
    const [modalActive, setModalActive] = useState(false);

    const {reset, handleSubmit, register} = useForm();

    const dispatch = useDispatch();

    const submit = async (data) => {

        await dispatch(ordersAction.postComments({id: id, comment: data, page}));

        ordersService.getAllComments(id).then(({data})=> setComments(data))
        reset();
    }

    useEffect(() => {
        ordersService.getAllComments(id).then(({data})=> setComments(data))
    },[ id])

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
                // disabled={order.manager !== null }
                    onClick={() => setModalActive(true)} className={css.edit}>EDIT</button>
            <UpdateUser page={page} ord={ord} setOrder={setOrder} orders={orders} search={search} nameQur={nameQur} order={order} active={modalActive} setModalActive={setModalActive}/>

        </div>
    );
};

export {Comments};