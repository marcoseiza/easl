import React from "react";
import { Controlled as CodeMirror } from 'react-codemirror2'
import * as cm from 'codemirror'
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router";
import "../styles/md-editor.css";
require('../../node_modules/codemirror/mode/markdown/markdown');


export interface MdEditorProps {
  options: object;
}

interface RouterParams {
  id: string;
}

const MdEditor: React.FC<MdEditorProps> = (props) => {
  let author = useRef("");
  let { id: docId } = useParams<RouterParams>();
  const [value, setValue] = useState("");
  const [data, setData] = useState<cm.EditorChange>();
  const [socket, setSocket] = useState<Socket>();
  const [editor, setEditor] = useState<cm.Editor>();

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);
    s.on('connect', () => author.current = s.id);
    return () => { s.disconnect(); }
  }, [])

  useEffect(() => {
    socket?.emit("send-changes", data);
  }, [data, socket])

  useEffect(() => {
    const handler = (dt: cm.EditorChange) => {
      dt && dt.origin !== author.current && editor?.replaceRange(dt.text, dt.from, dt.to, author.current);
    }

    socket?.on("recieve-changes", handler);
    return () => { socket?.off("recieve-changes", handler); }
  }, [socket, editor, author])

  useEffect(() => {
    socket?.on("load-doc", doc => {
      setValue(doc);
      editor?.setOption("readOnly", false);
    })

    socket?.emit("get-doc", docId);
  }, [socket, editor, docId])

  return (
    <div className="CodeMirrorWrapper">
      <CodeMirror
        value={value}
        options={props.options}
        onBeforeChange={(ed, dt, val) => setValue(val)}
        editorDidMount={(ed) => {
          setEditor(ed);
          ed.setOption("readOnly", true);
          setValue("loading...")
        }}
        onChange={(ed, dt, val) => dt.origin !== author.current && setData(dt)}
      />
    </div>
  );
}

export default MdEditor;