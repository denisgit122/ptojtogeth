import {urlsOrders} from "../configs";
import {axiosService} from "./axiosService";

const ordersService =  {
    getBySearch: (page=1,name, surname, email, phone, age, course, course_format, course_type, status,groups,endDate, startDate
    )=> axiosService.get(urlsOrders.orders.getAll,
        {params:{page,'filter.name':name,'filter.surname':surname, 'filter.email':email,
                'filter.phone':phone,'filter.age':age, 'filter.course':course,'filter.course_format':course_format,
                'filter.course_type':course_type,'filter.status':status, 'filter.group':groups, 'filter.start_date':endDate, 'filter.end_date':startDate
            }}),

    getAll: (page= 1, query, filt)=> axiosService.get(urlsOrders.orders.getAll, {params:{page, sortBy: query, filt}}),

    getAllComments: (id)=> axiosService.get(urlsOrders.orders.getAllComments(id)),
    postComments: (id, comment) =>axiosService.post(urlsOrders.orders.postComments(id), comment),

    updateOrder: (id, value)=> axiosService.patch(urlsOrders.orders.updateOrder(id), value),

}
export {
    ordersService
}