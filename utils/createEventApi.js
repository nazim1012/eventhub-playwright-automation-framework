export class CreateEvents{
  /** @param {import('@playwright/test').APIRequestContext} request */
    constructor(request,token){
        this.request=request;
        this.baseUrl=process.env.API_URL;
        this.headers={
            Authorization:`Bearer ${token}`
        }
    }
    async createEvent(overrides={}){
        const tomorrow= new Date(Date.now()+24 *60*60 *1000).toISOString();
        const payload={
            title:`Event ${Date.now()}`,
            description:'Created by Playwright ',
            category:'Concert',
            venue:'test venue',
            city:'Navi Mumbai',
            eventDate:tomorrow,
            price:500,
            totalSeats:100,
            ...overrides,
        };
        const response=await this.request.post(`${this.baseUrl}/events`,{
            headers:this.headers,
            data:payload
        });
        if(!response.ok()){
            throw new Error(`Create event failed: ${response.status()}`)
        }
        const body=await response.json();
        const id=body.data.id;
        if(!id){
            throw new Error(`no event id in response :${JSON.stringify(body)}`);
        }
        console.log('Created event response:',body);
        return{...payload,id}
    }
    async deleteEvent(id){
        const response=await this.request.delete(`${this.baseUrl}/events/${id}`,{
            headers:this.headers
        });
        if(!response.ok()){
            throw new Error(`Delete faild ${id} ${response.status()}${await response.text()}`)
        }
    }
}