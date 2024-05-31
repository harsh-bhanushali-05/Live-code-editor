import "./RoomStyles.css";
import logo from "../logo.png";
import { useEffect, useState } from "react";
import Client from "../Components/Client";
import toast from "react-hot-toast";
import Editor, { loader } from '@monaco-editor/react';
import axios from 'axios';
import { edit_key, secret } from "../data.jsx"
function Room(props) {


    const [code, setCode] = useState('// type your code here');
    const [output, setOutput] = useState('');
    const editorOptions = {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: 'Fira Code, monospace',
    };

    useEffect(() => {
        loader.init().then(monaco => {
            monaco.editor.defineTheme('myCustomTheme', {
                base: 'vs-dark', // or 'vs' for light theme
                inherit: true, // will inherit from the base theme
                preview: false,
                rules: [],
                colors: {
                    'editor.background': '#171717',
                    'editor.foreground': '#F57D1F',
                    'editorCursor.foreground': '#F57D1F',
                    'editor.lineHighlightBackground': '#171717',
                    'editorLineNumber.foreground': '#DA0037',
                    'editor.selectionBackground': '#DA0037',
                    'editor.inactiveSelectionBackground': '#DA0037',
                }
            });
            monaco.editor.setTheme('myCustomTheme');
        });
    }, []);

    const [client, setClient] = useState([
        { sokectID: 1, username: "Harsh" },
        { sokectID: 2, username: "rakesh" },
        { sokectID: 3, username: "nisha" },
    ]);

    function copyID() {
        navigator.clipboard.writeText(props.id);
        toast.success("Room Id copied to clipboard")
    }

    const runCode = async () => {
        const clientId = edit_key;
        const clientSecret = secret;
        const language = 'java';
        const versionIndex = '3';
        try {
            const response = await axios.post('/v1/execute/', {
                "script": code,
                "language": language,
                "versionIndex": versionIndex,
                "clientId": clientId,
                "clientSecret": clientSecret,
            }).then((response) => {
                setOutput(response.data.output);

            });
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
                                <Client className="User" key={e.sokectID} username={e.username} />
                            )}
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <Editor
                    height="60vh"
                    defaultLanguage="java"
                    defaultValue={code}
                    onChange={(value) => setCode(value)}
                    options={editorOptions}
                    theme="myCustomTheme"
                />
                <button onClick={runCode} className="button"><b>Run Code</b></button>
                <pre>{output}</pre>
            </div>
            <div className="footer">
                <button onClick={copyID} className="button"><b>Copy ID</b></button>
            </div>
        </div>
    );
}

export default Room;