import './Notification.css'


export default function BriefNotification({status, message}){

    return(
        <div className= {`brief-notification fixed bottom-0 -right-full m-5 max-w-xs text-base md:text-lg
             ${status === 'success'? 'bg-green-500' : 'bg-red-500'} p-3 text-white z-20 rounded`}
        >
            {message}
        </div>
    )
}