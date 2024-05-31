import logo from "../logo.png";
import "./LoginStyles.css";
import { v4 } from 'uuid';
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
function Login(props) {
    const nav = useNavigate();
    const [room, setroom] = useState("");
    const [username, setusername] = useState("");

    function createRoom(e) {
        e.preventDefault();
        const id = v4();
        setroom(id);
        props.setid(id);
        console.log(id);
        toast.success('Room has been created');
    }
    function enterpress(key) {
        if (key.code == 'Enter') {
            JoinClick();
        }
    }
    function JoinClick() {
        if (username == "") {
            toast.error("Enter Username");
            return;
        }
        if (room == "") {
            const id = v4();
            setroom(id);
            props.setid(id);
            nav('/room/' + id, {
                state: {
                    username,
                }
            })
        }
        else {
            nav('/room/' + room, {
                state: {
                    username,
                }
            })
        }


    }
    return <div className="Parent">
        <div className="form-box">
            <h1> <img className="logo" src={logo}></img>  Real Time Collaborative IDE </h1>
            <h2 className="label">Enter the Details: </h2>
            <div className="input-form">
                <input type="text" className="input-box" onKeyUp={enterpress} placeholder="Room Id: " value={room} onChange={(res) => {
                    setroom(res.target.value);
                }} />
                <input type="text" className="input-box" onKeyUp={enterpress} placeholder="User Name " value={username} onChange={(res) => {
                    setusername(res.target.value)
                }} />
                <button className="button" onClick={JoinClick}><b>JOIN</b> </button>
                <h4>Lets Create a  <a href=" " onClick={createRoom} className="new-room"> new room!</a></h4>
            </div>

        </div>
    </div>
}
export default Login;