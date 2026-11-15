export class LoginPageApiUtil{
    constructor(request){
        this.request=request;
    }
    async getProtectedResource(endpoint,token){
        const response=await this.request.get(endpoint,{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        });
        return response;
    }
}