import React, { useEffect, useRef, useState } from 'react'
import styles from '../styles/videoComponent.module.css'
import { Badge, Button, IconButton, TextField } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import io from "socket.io-client";
import server from '../environment';

const server_url=server;

var connections={};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}
export default function VideoMeetComponent() {

     var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState([]);

    let [audio, setAudio] = useState(true);

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(true);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])

    // if(isChrome()===false){

    // }

    useEffect(() => {
        console.log("HELLO")
        getPermissions();

    })

   

     const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };


   

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);

        }


    }, [video, audio])

     let getMedia=()=>{
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }

     let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            // connections[id].addStream(window.localStream)
            window.localStream.getTracks().forEach(track => {
    connections[id].addTrack(track, window.localStream);
});

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
               window.localStream.getTracks().forEach(track => {
        connections[id].addTrack(track, window.localStream);
    });

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

      let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }

     let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }
    


    const iceBuffer = {};

function gotMessageFromServer(fromId, message) {
    const signal = JSON.parse(message);

    if (!connections[fromId]) return;

    if (signal.sdp) {
        connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp))
        .then(() => {
            // Add ICE candidates from buffer
            if (iceBuffer[fromId]) {
                iceBuffer[fromId].forEach(candidate => {
                    connections[fromId].addIceCandidate(candidate).catch(console.error);
                });
                delete iceBuffer[fromId];
            }

            if (signal.sdp.type === 'offer') {
                connections[fromId].createAnswer()
                .then(desc => connections[fromId].setLocalDescription(desc))
                .then(() => {
                    socketRef.current.emit("signal", fromId, JSON.stringify({ sdp: connections[fromId].localDescription }));
                })
                .catch(console.error);
            }
        })
        .catch(console.error);
    }

    if (signal.ice) {
        const candidate = new RTCIceCandidate(signal.ice);
        if (connections[fromId].remoteDescription) {
            connections[fromId].addIceCandidate(candidate).catch(console.error);
        } else {
            if (!iceBuffer[fromId]) iceBuffer[fromId] = [];
            iceBuffer[fromId].push(candidate);
        }
    }
}


    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };
    let connectToSocketServer=()=>{
        socketRef.current=io.connect(server_url,{secure:false});
        socketRef.current.on('signal',gotMessageFromServer);
        socketRef.current.on("connect",()=>{
            socketRef.current.emit("join-call",window.location.href)
            socketIdRef.current=socketRef.current.id;
            socketRef.current.on("chat-message",addMessage)
             socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })
            socketRef.current.on("user-joined",(id,clients)=>{
                clients.forEach((socketListId)=>{
                    connections[socketListId]=new RTCPeerConnection(peerConfigConnections)
                    connections[socketListId].onicecandidate=(event)=>{
                        if(event.candidate!==null){
                            socketRef.current.emit("signal",socketListId,JSON.stringify({'ice':event.candidate}))
                        }
                    }
                    connections[socketListId].onaddstream=(event)=>{
                        let videoExists=videoRef.current.find(video=>video.socketId===socketListId)
                        if(videoExists){
                             setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }else{
                            let newVideo={
                                socketId:socketListId,
                                stream:event.stream,
                                autoPlay:true,
                                playsinline:true
                            }

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });

                        }
                    }
                    if(window.localStream!==undefined && window.localStream!==null){
                        window.localStream.getTracks().forEach(track => {
        connections[socketListId].addTrack(track, window.localStream);
    });

                    }
                    else{
                        // let blackSilence
                        let blackSilence=(...args)=> new MediaStream([black(...args),silence()])
                        window.localStream=blackSilence();
                        connections[socketListId].addStream(window.localStream)
                    }
                })
                if(id===socketIdRef.current){
                    for(let id2 in connections){
                        if(id2 === socketIdRef.current){
                            continue;
                        }
                        try{
                            connections[id2].addStream(window.localStream);
                        }
                        catch(e){}
                        connections[id2].createOffer().then((description)=>{
                            connections[id2].setLocalDescription(description)
                            .then(()=>{
                                socketRef.current.emit("signal",id2,JSON.stringify({"sdp":connections[id2].localDescription}))
                            })
                            .catch(e=>console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }
   
    let connect=()=>{
        setAskForUsername(false);
        getMedia();
    }

let handleVideo = () => {
    if (window.localStream) {
        const videoTracks = window.localStream.getVideoTracks();
        if (videoTracks.length > 0) {
            videoTracks.forEach(track => {
                track.enabled = !track.enabled;
                setVideo(track.enabled);
            });
        }
    }
};



    let handleAudio = () => {
    if (window.localStream) {
        const audioTracks = window.localStream.getAudioTracks();
        if (audioTracks.length > 0) {
            audioTracks.forEach(track => {
                track.enabled = !track.enabled;
                setAudio(track.enabled);
            });
        }
    }
};

let getDisplayMediaSuccess=(stream)=>{
    try{
        window.localStream.getTracks().forEach(track=>track.stop())
    }
    catch(e){
        console.log(e);
    }
    window.localStream=stream;
    localVideoref.current.srcObject=stream;

    for(let id in connections){
        if(id===socketIdRef.current){
            continue;
        }
        connections[id].addStream(window.localStream)
        connections[id].createOffer().then((description)=>{
            connections[id].setLocalDescription(description)
            .then(()=>{
                socketRef.current.emit("signal",id,JSON.stringify({"sdp":connections[id].localDescription}))
            })
            .catch(e=>console.log(e))
        })
    }

    stream.getTracks().forEach(track => track.onended = () => {
           setScreen(false);
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia();
        })
}

let getDisplayMedia=()=>{
    if(screen){
        if(navigator.mediaDevices.getDisplayMedia){
            navigator.mediaDevices.getDisplayMedia({video:true,audio:true})
            .then(getDisplayMediaSuccess)
            .then((stream)=>{})
            .catch((e)=>console.log(e))
        }
    }
}

useEffect(()=>{
    if(screen!==undefined){
        getDisplayMedia();
    }
},[screen])

let handleScreen=()=>{
    setScreen(!screen);
}

let sendMessage=()=>{
    socketRef.current.emit("chat-message",message,username);
    setMessage("");
}

let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/home"
    }

    return (
    <div>
        <img style={{position:"absolute",top:"0", height:"3rem",width:"auto",gap:"1rem",left:"0"}} src='/image.png' alt='logo'/>
      {askForUsername === true ?
        <div style={{marginTop:"4rem",padding:"1rem"}}>
            <div style={{position:"relative",display:"flex"}}>
            <h2 style={{display:"flex",margin:"1rem"}}>Enter into Lobby</h2>
            </div>
            <div>
            <TextField id="outlined-basic" label="Username" value={username} onChange={e => setUsername(e.target.value)} variant="outlined" />
                    <Button style={{margin:"0.5rem"}} variant="contained" onClick={connect} >Connect</Button>
                    </div>
                    
                    <div>
                        <video ref={localVideoref} autoPlay muted></video>
                    </div>

        </div>:
        <div className={styles.meetVideoContainer}>

            {showModal ? <div className={styles.chatRoom}>
                <div className={styles.chatContainer}>
                <h1 style={{fontStyle:"italic"}}>Chat</h1>
                <img src='/image.png' alt='logo' style={{position:"absolute",top:"0", height:"3rem",width:"auto",gap:"1rem",right:"0"}}/>
                <div className={styles.chattingDisplay}>

                    {messages.length>0 ? messages.map((item,index)=>{
                        return(
                            <div style={{marginBottom:"20px"}} key={index}>
                                <p style={{fontWeight:"bold",fontStyle:"italic"}}>{item.sender}</p>
                                <p>{item.data}</p>
                            </div>
                        )
                    }):<p>No messages yet</p>}
                </div>
                <div className={styles.chattingArea}>
                    
                {/* <TextField value={message} onChange={e=>setMessage(e.target.value)} id="outlined-basic" label="Enter your Chat" variant="outlined" /> */}
                <TextField
  value={message}
  onChange={e => setMessage(e.target.value)}
  id="outlined-basic"
  label="Enter your Chat"
  variant="outlined"
  multiline
  rows={1}
  maxRows={4}
  sx={{
    width: "100%",
    '& .MuiInputBase-input': {
      overflowY: 'auto',
    }
  }}
/>
                <Button variant='contained' onClick={sendMessage}>Send</Button>
                </div>
                </div>

            </div>:<></>
            }
            
            <div className={styles.buttonContainers}>

            <IconButton onClick={handleVideo} style={{color:"white",fontSize:"32px"}}>
                {video===true? <VideocamIcon/>:<VideocamOffIcon/>}
            </IconButton>

            <IconButton onClick={handleEndCall} style={{color:"red",fontSize:"32px"}}>
                <CallEndIcon/>
            </IconButton>

             <IconButton onClick={handleAudio} style={{color:"white",fontSize:"32px"}}>
                {audio===true?<MicIcon/>:<MicOffIcon/>}
            </IconButton>

            {screenAvailable===true?
            <IconButton onClick={handleScreen} style={{color:"white",fontSize:"32px"}}>
                {screen===true?<ScreenShareIcon/>:<StopScreenShareIcon/>}
            </IconButton>:<></>}

            <Badge badgeContent={newMessages} max={999} color='primary'>
                <IconButton onClick={()=>setModal(!showModal)} style={{color:"orange",fontSize:"32px"}}>
                    <ChatIcon/>
                </IconButton>            
            </Badge>
            
            </div>



            <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted></video>
            <div className={styles.conferenceView}>
            {videos.map((video)=>(
                <div  key={video.socketId}>
                    
                    <video
                    data-socket={video.socketId}
                    ref={ref=>{
                        if(ref && video.stream){
                            ref.srcObject=video.stream;
                        }
                    }}
                    autoPlay
                    >

                    </video>
                </div>
            ))}
            </div>
        </div>
    }
    </div>
  )
}
