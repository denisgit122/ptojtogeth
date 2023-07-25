import {baseURL, urlsAuth} from "../configs";
import {axiosService} from "./axiosService";

const accessToken = "access";
const refreshToken = "refresh";

const authService = {

    login: async function (data){
        const response = await axiosService.post(urlsAuth.auth.login, data);

        if (response.status === 200){
            this.setTokens(response.data)
        }
        return response;
    },

    refresh: async function() {
        const refreshTok = this.getRefreshToken();


        if (!refreshTok){
            throw new Error("Refresh token isn't exist")
        }

        const url = baseURL + '/auth/refresh';

        await fetch(url, {
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
                'Authorization': refreshTok
            },
        }).then((response)=>{
            if (response.status === 200){

                return response.json();

            }else if (response.status === 401){

                this.deletesToken();
            }
        }).then((data)=> this.setTokens(data))
        // const data = await axiosService.post('/auth/refresh' , {},{headers:{Authorization: refreshTok}});

    },


    setTokens:({tokenPair})=>{

        localStorage.setItem(accessToken, tokenPair.accessToken )
        localStorage.setItem(refreshToken,tokenPair.refreshToken )

    },
    getAccessToken:()=> localStorage.getItem(accessToken),
    getRefreshToken:()=> localStorage.getItem(refreshToken),

    deletesToken:()=>{
        localStorage.removeItem(accessToken)
        localStorage.removeItem(refreshToken)

    },
    isAuthenticated:()=> !!localStorage.getItem(accessToken),

    forgotPassword:(email)=> axiosService.post(urlsAuth.auth.forgotPassword, email),

    forgotPasswordPut:(token,password)=> axiosService.put(urlsAuth.auth.forgotPassword, { password},{params:{token}}),

}
export {
    authService
}