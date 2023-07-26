import {urlsManager} from "../configs";
import {axiosService} from "./axiosService";

const managerService ={
    getAll:()=> axiosService.get(urlsManager.manager.gerAll),
    create:(manager)=> axiosService.post(urlsManager.manager.create, manager),
    update:(id, manager)=> axiosService.patch(urlsManager.manager.update(id), manager),
    getByToken:(token)=> axiosService.get(urlsManager.manager.getByToken(token)),

}
export {
    managerService
}