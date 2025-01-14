import 'next-auth'

declare module 'next-auth'{
    interface User{
        _id?:string,
        name?:string,
        phone:string,
        isAdmin?:boolean,
        isDelivery?:boolean,
        isPantry?:boolean
    }

    interface Session{
        user:{
            _id?:string,
            name?:string,
            phone:string,
            isAdmin?:boolean,
            isDelivery?:boolean,
            isPantry?:boolean
        }& DefaultSession['user']

    }
}
