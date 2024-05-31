import "../pages/RoomStyles.css";
import Avatar from "react-avatar";
function Client(props) {
    return <div>
        <div className="showhim">
            <Avatar name={props.username} round="50%" size={40} />
            <p className="showme"> {props.username.substring(0, 1).toUpperCase() + props.username.substring(1)}</p>
        </div>
    </div>
}
export default Client;