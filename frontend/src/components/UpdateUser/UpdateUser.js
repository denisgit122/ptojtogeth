import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {ordersAction} from "../../redux/slices/orders.slice";
import {joiResolver} from "@hookform/resolvers/joi/dist/joi";
import {updateValidator} from "../../validators";
import {groupAction} from "../../redux/slices/group.slice";

const UpdateUser = ({active, setModalActive, order,page, nameQur:name, search}) => {

    const {reset, register, handleSubmit,setValue, formState:{isValid}} = useForm(
        {mode:"all", resolver: joiResolver(updateValidator)}

    );
    const {groups} = useSelector(state => state.groups);

    const [activeGroup, setActiveGroup] = useState(true);
    const [groupValue, setGroupValue] = useState('');

    useEffect(() => {
        if (order){
            setValue("email", order.email, {shouldValidate: true})
            setValue("name", order.name, {shouldValidate: true})
            setValue("surname", order.surname, {shouldValidate: true})
            setValue("already_paid", order.already_paid, {shouldValidate: true})
            setValue("phone", order.phone, {shouldValidate: true} )
            setValue("sum", order.sum, {shouldValidate: true} )
            setValue("course_format", order.course_format, {shouldValidate: true})
            setValue("course", order.course, {shouldValidate: true} )
            setValue("age", order.age, {shouldValidate: true})
            setValue("group", order.group, {shouldValidate: true} )
            setValue("status", order.status, {shouldValidate: true} )
            setValue("course_type", order.course_type, {shouldValidate: true})
        }
    },[order, setValue])

    const dispatch = useDispatch();

    const create = (data) =>{

        if (name !== null){

            if (name[1]==='asc' || name[1]==='desc'){
                dispatch(ordersAction.updateOrder({id:order.id, value: data, page,query: `${name[0]}:${name[1]}`}))
            }
        }
        else if (search){
            dispatch(ordersAction.updateOrder({id: order.id, value: data, page, query: search}));

        }
        else if (name === null && search === '') {
            dispatch(ordersAction.updateOrder({id:order.id, value: data, page }));
        }

    };

    const output = () => {
        setModalActive(false);
        reset();
    };

    const addGroup = () => {
        dispatch(groupAction.addGroups({name: groupValue}));
        setActiveGroup(true);

    };

    return (
        <div className={active ? "modal active" : "modal"} onClick={() => output()}>
            <div className="modalContentUpd" onClick={e => e.stopPropagation()}>
                <form className={'formUpt'} onSubmit={handleSubmit(create)}>

                    <div className='boxInp'>
                        <span>Email</span>
                        <input required={false}
                               className={ "inputUpd"}
                               type="text" placeholder={"Email"} {...register("email")}
                        />
                    </div>

                    <div className='boxInp'>
                        <span>Name</span>
                        <input required={false}
                               className={ "inputUpd"}
                               type="text" placeholder={"Name"} {...register("name")}
                        />
                    </div>

                    <div className='boxInp'>
                        <span>Already paid</span>
                        <input required={false}
                               className={ "inputUpd"}
                               type="text" placeholder={"Already paid"} {...register("already_paid")}
                        />
                    </div>

                    <div className='boxInp'>
                        <span>Surname</span>
                        <input required={false}
                               className={ "inputUpd"}
                               type="text" placeholder={"Surname"} {...register("surname")}
                        />
                    </div>

                    <div className='boxInp'>
                        <span>Sum</span>
                        <input required={false}
                               className={ "inputUpd"}
                               type="number" placeholder={"Sum"} {...register("sum")}
                        />
                    </div>
                    <div className='boxInp'>
                        <span>Phone</span>
                        <input required={false}
                               className={ "inputUpd"}
                               type="text" placeholder={"Phone"} {...register("phone")}
                        />
                    </div>

                    <div className='boxInp'>
                        <span>Age</span>
                        <input required={false}
                               className={ "inputUpd"}
                               type="text" placeholder={"Age"} {...register("age")}
                        />
                    </div>

                    <div className='boxInp'>
                        <span>Course</span>

                        <select required={false} {...register("course")} className={'select'} name="course" >
                            <option value="">all courses</option>
                            <option value="FS">FS</option>
                            <option value="QACX">QACX</option>
                            <option value="JCX">JCX</option>
                            <option value="JSCX">JSCX</option>
                            <option value="FE">FE</option>
                            <option value="PCX">PCX</option>

                        </select>
                    </div>

                    <div className='boxInp'>
                        <span>Course format</span>

                        <select required={false} {...register("course_format")}
                                className={'select'} name="course_format" >
                            <option value="">all formats</option>
                            <option value="static">static</option>
                            <option value="online">online</option>
                        </select>
                    </div>

                    <div className='boxInp'>
                        <span>Course type</span>

                        <select required={false} {...register("course_type")}
                                className={'select'} name="course_type" >
                            <option value="">all course type</option>
                            <option value="pro">pro</option>
                            <option value="minimal">minimal</option>
                            <option value="premium">premium</option>
                            <option value="vip">vip</option>
                            <option value="incubator">incubator</option>
                        </select>
                    </div>

                    <div className='boxInp'>
                        <span>Status</span>

                        <select required={false} {...register("status")}
                                className={'select'} name="status" >
                            <option value="">all status</option>
                            <option value="In work">In work</option>
                            <option value="New">new</option>
                            <option value="Agree">agree</option>
                            <option value="Disagree">disagree</option>
                            <option value="Dubbing">dubbing</option>
                        </select>

                    </div>

                    <div className='boxInp'>
                        <span>Groups</span>
                        {activeGroup ?
                            <div>
                                <select required={false} {...register("group")}
                                        className={'select'} name="group" >
                                    <option  value="">all groups</option>
                                    {
                                        groups.map(group => <option  key={group.id}>{group.name}</option>)
                                    }
                                </select>
                                <div onClick={()=>setActiveGroup(false)} className='group'>Add group</div>
                            </div>

                            :<div>

                                <input name={'group'}
                                       onChange={(e)=> setGroupValue(e.target.value)}
                                       className={ "inputUpd"}
                                       type="text" placeholder={"Group"}
                                />
                                <div className='boxGroupAdd'>
                                    <div onClick={()=>addGroup()} className='addGroup'>Add</div>
                                    <div className='addGroup' onClick={()=>setActiveGroup(true)}>Select</div>

                                </div>

                            </div>
                        }

                    </div>


                    {isValid ?
                        <center>
                            <button className={'buttManOk'}>
                                Update
                                <span></span>
                            </button>
                        </center>
                        :
                        <center>
                            <button className={"buttManEr"}>
                                Invalid
                                <span></span>
                            </button>
                        </center>
                    }

                </form>
            </div>
        </div>

    );
};

export {UpdateUser};