import './Notification.css'

function Notification(props){

    const {title, message, handleOkClicked} = props
    
    return(
        <div className='notification'>
            <h3 >{title}</h3>
            <h4>{message}</h4>

            <button onClick={handleOkClicked}>Ok</button>
        </div>
    )
}


export default Notification