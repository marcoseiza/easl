import React from "react";
import { Controlled as CodeMirror } from 'react-codemirror2'
import cm from 'codemirror';
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router";
import { createStyles, makeStyles, Theme } from "@material-ui/core";

export interface MdEditorProps {
  options: cm.EditorConfiguration;
}

interface RouterParams {
  id: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    codeMirrorWrapper: {
      display: `grid`,
      placeItems: `center`,
    },
    codeMirror: {
      "& .CodeMirror": {
        margin: `1in`,
        width: `210mm`,
        height: `297mm`,
        outline: `none`,
      },
      "& .CodeMirror-scroll": {
        padding: `1in`,
      }
    }
  }));

export const MdEditor: React.FC<MdEditorProps> = (props) => {
  const classes = useStyles();
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
    <div className={classes.codeMirrorWrapper}>
      <CodeMirror
        value={value}
        options={props.options}
        onBeforeChange={(_ed, _dt, val) => setValue(val)}
        className={classes.codeMirror}
        editorDidMount={(ed) => {
          setEditor(ed);
          ed.setOption("readOnly", true);
          setValue("loading...")
        }}
        onChange={(_ed, dt, _val) => dt.origin !== author.current && setData(dt)}
      />
    </div>
  );
}

export default MdEditor;