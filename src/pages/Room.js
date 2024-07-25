import "./RoomStyles.css";
import logo from "../logo.png";
import { useEffect, useRef, useState } from "react";
import Client from "../Components/Client";
import toast from "react-hot-toast";
import AceEditor from "react-ace";
import axios from 'axios';
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// Import Ace Editor modes and themes
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

function Room(props) {
    const { id } = useParams();
    const [code, setCode] = useState('// type your code here');
    const [visible, setVisible] = useState(false);
    const location = useLocation();
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const [language, setLanguage] = useState("java");
    const nav = useNavigate();
    const [client, setClient] = useState([]);
    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));
            function handleErrors(e) {
                console.log("There is an error in the socket connection ");
                toast.error("Could not connect to the server try again in a bit!");
                nav('/');
            }
            console.log(id);
            socketRef.current.emit(ACTIONS.JOIN, {
                id,
                username: location.state?.username,
            });
            socketRef.current.on(ACTIONS.JOINED, ({ client, username, socket_id }) => {
                if (username !== location.state.username) {
                    socketRef.current.emit(ACTIONS.SYNC, ({ socket_id, code: codeRef.current || "Ask other user to hit spacebar" }));
                    toast.success(`${username} joined the room`);
                }
                setClient(client);
            });

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socket_id, username }) => {
                console.log("SOMEONE LEFT ");
                toast.error(`${username} has left the room `);
                setClient((prev) => {
                    console.log(prev);
                    return prev.filter(client => client.socket_id !== socket_id);
                });
            });

            socketRef.current.on(ACTIONS.CHANGE, ({ value }) => {
                console.log(value);
                if (code !== null) {
                    console.log(value);
                    setCode(value);
                }
            });

            return () => {
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
                socketRef.current.disconnect();
            };
        };
        init();
        if (!location.state) nav('/');
    }, []);

    const [output, setOutput] = useState('Output will be shown here');
    const editorOptions = {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: 'Fira Code, monospace',
    };

    function changeCode(value) {
        codeRef.current = value;
        setCode(value);
        socketRef.current.emit(ACTIONS.CHANGE, {
            id,
            code: value,
        });
    }

    function copyID() {
        navigator.clipboard.writeText(id);
        toast.success("Room Id copied to clipboard");
    }

    const runCode = async () => {
        const clientId = process.env.edit_key;
        const clientSecret = process.env.secret;
        const versionIndex = '3';
        console.log("this is the change");
        try {
            const response = await axios.post('/v1/execute', {
                script: code,
                language: language,
                versionIndex: versionIndex,
                clientId: clientId,
                clientSecret: clientSecret,
            });
            setOutput(response.data.output);
        } catch (error) {
            console.error('Error executing code:', error);
            setOutput('Error executing code');
        }
    };

    return (
        <div className="main-div">
            <div className="users">
                <div className="header">
                    <h3 className="title-logo">
                        <img className="logo" src={logo} alt="Logo" />
                        Real Time Collaborative IDE
                    </h3>
                    <div className="User user-list">
                        <p className="user-list">
                            {client.map((e) =>
                                <Client className="User" key={e.socket_id} username={e.username} />
                            )}
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <AceEditor
                    mode={language}
                    theme="monokai"
                    value={code}
                    onChange={changeCode}
                    name="editor"
                    editorProps={{ $blockScrolling: true }}
                    setOptions={editorOptions}
                    height="60vh"
                    width="100%"
                />
                <div className="horizontal-line"></div>
                <button onClick={runCode} className="button run"><b onClick={runCode}>Run Code</b></button>
                <button className="button run"><b>Current language : {language}</b></button>
                <button onClick={() => { setVisible((prev) => { return !prev }) }} className="button run"><b> Change language</b></button>
                {visible ? <div>
                    <ul onClick={() => { setLanguage('java'); setVisible(false) }}>Java</ul>
                    <ul onClick={() => { setLanguage('c_cpp'); setVisible(false) }}>C++</ul>
                    <ul onClick={() => { setLanguage('python'); setVisible(false) }}>Python</ul>
                    <ul onClick={() => { setLanguage('javascript'); setVisible(false) }}>JavaScript</ul>
                </div> : <div></div>}

                <pre className="run">{output}</pre>
            </div>
            <div className="footer">
                <button onClick={copyID} className="button bottom"><b>Copy ID</b></button>
                <h3 className="credits"> Made by -> <a href="https://www.linkedin.com/in/harsh-bhanushali-706044225/s">Harsh Bhanushali</a> </h3>
            </div>
        </div>
    );
}

export default Room;