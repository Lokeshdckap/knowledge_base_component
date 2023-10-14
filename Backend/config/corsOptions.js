const whiteList = ['https://www.google.com','http://localhost:3000/','http://127.0.0.1:3001/']

const corsOptions = {
    origin:(origin,callback)=>{
        if(whiteList.indexOf(origin) !== -1 || !origin){
            callback(null,true)
        }
        else{
            callback(new Error ('Not Allowed By Cors'))
        }
    },
    optionsSucessStatus : 200
}