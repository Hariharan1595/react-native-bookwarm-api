import cron from 'cron'
import https from 'https'

const job = new cron.CronJob("*/14 * * * *", async () => {
    https.get(process.env.API_URL ,(res)=>{
        if(res.statusCode === 200){
            console.log('API is up and running')
        }
        else{
            console.log('API is down')
        }
    })
    .on('error', (e) => {
        console.error(e);
    }
    )
})

export default job