const localVideo = document.getElementById('local-video');

// Obtener acceso a la cámara web
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        localVideo.srcObject = stream;
    } catch (error) {
        console.error('Error accessing the camera', error);
    }
}

startCamera();



const socket = io.connect('http://localhost:3000');
let localStream = null;
let remoteStream = null;
let peerConnection = new RTCPeerConnection();

// Escuchar por candidatos ICE desde el servidor de señalización
socket.on('candidate', (candidate) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});

// Escuchar por ofertas desde el servidor de señalización
socket.on('offer', async (offer) => {
    if (!localStream) {
        await startCamera(); // Asegúrate de haber implementado esta función
    }
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', answer);
});

// Escuchar por respuestas
socket.on('answer', (answer) => {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

// Manejar ICE candidates localmente
peerConnection.onicecandidate = ({candidate}) => {
    if (candidate) {
        socket.emit('candidate', candidate);
    }
};

// Establecer la transmisión de medios remotos
peerConnection.ontrack = (event) => {
    const [remoteStream] = event.streams;
    document.getElementById('remote-video').srcObject = remoteStream;
};
