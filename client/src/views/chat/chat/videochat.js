import { log, log_error, reportError } from '@/utils/index.js'

export default {
  data() {
    return {
      mediaConstraints: {
        audio: true,            // We want an audio track
        video: {
          aspectRatio: {
            ideal: 1.333333     // 3:2 aspect is preferred
          }
        }
      },

      myPeerConnection: null,
      transceiver: null,
      webcamStream: null,
    }
  },
  methods: {
    sendToServer(msg) {
      var msgJSON = JSON.stringify(msg);
    
      log("Sending '" + msg.type + "' message: " + msgJSON);
      this.$socket.client.emit('videoChatEvent', msgJSON);
    },
    handleVideoOfferMsg(msg) {
      this.$confirm(`${msg.name}请求进行视频聊天，是否同意？`, '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'info'
      }).then(() => {
        this.currentFriendId = msg.id
        this.getChats()
        this.videoDialogVisible = true
        handleVideoOfferMsgDetail(msg).catch(err => {
          this.videoDialogVisible = false
        })
      })
    },
    async handleVideoAnswerMsg(msg) {
      log("*** Call recipient has accepted our call");

      // Configure the remote description, which is the SDP payload
      // in our "video-answer" message.
    
      var desc = new RTCSessionDescription(msg.sdp);
      await this.myPeerConnection.setRemoteDescription(desc).catch(reportError);
    },
    async handleNewICECandidateMsg(msg) {
      var candidate = new RTCIceCandidate(msg.candidate);

      log("*** Adding received ICE candidate: " + JSON.stringify(candidate));
      try {
        await this.myPeerConnection.addIceCandidate(candidate)
      } catch(err) {
        reportError(err);
      }
    },
    handleHangUpMsg(msg) {
      log("*** Received hang up notification from other peer");

      this.closeVideoCall();
    },
    async handleVideoOfferMsgDetail(msg) {
      // If we're not already connected, create an RTCPeerConnection
      // to be linked to the caller.
    
      log("Received video chat offer from " + msg.name);
      if (!this.myPeerConnection) {
        this.createPeerConnection();
      }
    
      // We need to set the remote description to the received SDP offer
      // so that our local WebRTC layer knows how to talk to the caller.
    
      var desc = new RTCSessionDescription(msg.sdp);
    
      // If the connection isn't stable yet, wait for it...
    
      if (this.myPeerConnection.signalingState != "stable") {
        log("  - But the signaling state isn't stable, so triggering rollback");
    
        // Set the local and remove descriptions for rollback; don't proceed
        // until both return.
        await Promise.all([
          this.myPeerConnection.setLocalDescription({type: "rollback"}),
          this.myPeerConnection.setRemoteDescription(desc)
        ]);
        return;
      } else {
        log ("  - Setting remote description");
        await this.myPeerConnection.setRemoteDescription(desc);
      }
    
      // Get the webcam stream if we don't already have it
    
      if (!this.webcamStream) {
        try {
          this.webcamStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
        } catch(err) {
          this.handleGetUserMediaError(err);
          return Promise.reject(err);
        }
    
        document.getElementById("local_video").srcObject = this.webcamStream;
    
        // Add the camera stream to the RTCPeerConnection
    
        try {
          this.webcamStream.getTracks().forEach(
            transceiver = track => this.myPeerConnection.addTransceiver(track, {streams: [this.webcamStream]})
          );
        } catch(err) {
          this.handleGetUserMediaError(err);
          return Promise.reject(err);
        }
      }
    
      log("---> Creating and sending answer to caller");
    
      await this.myPeerConnection.setLocalDescription(await this.myPeerConnection.createAnswer());
    
      this.sendToServer({
        // name: myUsername,
        target: this.currentFriendId,
        type: "video-answer",
        sdp: this.myPeerConnection.localDescription
      });

      return Promise.resolve()
    },

    async createPeerConnection() {
      log("Setting up a connection...");
    
      // Create an RTCPeerConnection which knows to use our chosen
      // STUN server.
    
      this.myPeerConnection = new RTCPeerConnection({
        iceServers: [     // Information about ICE servers - Use your own!
          {
            urls: "turn:" + window.location.hostname,  // A TURN server
            username: "webrtc",
            credential: "turnserver"
          }
        ]
      });
    
      // Set up event handlers for the ICE negotiation process.
    
      this.myPeerConnection.onicecandidate = this.handleICECandidateEvent;
      this.myPeerConnection.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
      this.myPeerConnection.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent;
      this.myPeerConnection.onsignalingstatechange = this.handleSignalingStateChangeEvent;
      this.myPeerConnection.onnegotiationneeded = this.handleNegotiationNeededEvent;
      this.myPeerConnection.ontrack = this.handleTrackEvent;
    },
    handleICECandidateEvent(event) {
      if (event.candidate) {
        log("*** Outgoing ICE candidate: " + event.candidate.candidate);
    
        this.sendToServer({
          type: "new-ice-candidate",
          target: this.currentFriendId,
          candidate: event.candidate
        });
      }
    },
    handleICEConnectionStateChangeEvent(event) {
      log("*** ICE connection state changed to " + this.myPeerConnection.iceConnectionState);
    
      switch(this.myPeerConnection.iceConnectionState) {
        case "closed":
        case "failed":
        case "disconnected":
          this.closeVideoCall();
          break;
      }
    },
    handleICEGatheringStateChangeEvent(event) {
      log("*** ICE gathering state changed to: " + this.myPeerConnection.iceGatheringState);
    },
    handleSignalingStateChangeEvent(event) {
      log("*** WebRTC signaling state changed to: " + this.myPeerConnection.signalingState);
      switch(this.myPeerConnection.signalingState) {
        case "closed":
          this.closeVideoCall();
          break;
      }
    },
    async handleNegotiationNeededEvent() {
      log("*** Negotiation needed");
    
      try {
        log("---> Creating offer");
        const offer = await this.myPeerConnection.createOffer();
    
        // If the connection hasn't yet achieved the "stable" state,
        // return to the caller. Another negotiationneeded event
        // will be fired when the state stabilizes.
    
        if (this.myPeerConnection.signalingState != "stable") {
          log("     -- The connection isn't stable yet; postponing...")
          return;
        }
    
        // Establish the offer as the local peer's current
        // description.
    
        log("---> Setting local description to the offer");
        await this.myPeerConnection.setLocalDescription(offer);
    
        // Send the offer to the remote peer.
    
        log("---> Sending the offer to the remote peer");
        this.sendToServer({
          name: this.$store.state.user.name,
          id: this.$store.state.user.id,
          target: this.currentFriendId,
          type: "video-offer",
          sdp: this.myPeerConnection.localDescription
        });
      } catch(err) {
        log("*** The following error occurred while handling the negotiationneeded event:");
        reportError(err);
      };
    },
    handleTrackEvent(event) {
      log("*** Track event");
      document.getElementById("received_video").srcObject = event.streams[0];
      document.getElementById("hangup-button").disabled = false;
    },
    closeVideoCall() {
      var localVideo = document.getElementById("local_video");
    
      log("Closing the call");
    
      // Close the RTCPeerConnection
    
      if (this.myPeerConnection) {
        log("--> Closing the peer connection");
    
        // Disconnect all our event listeners; we don't want stray events
        // to interfere with the hangup while it's ongoing.
    
        this.myPeerConnection.ontrack = null;
        this.myPeerConnection.onnicecandidate = null;
        this.myPeerConnection.oniceconnectionstatechange = null;
        this.myPeerConnection.onsignalingstatechange = null;
        this.myPeerConnection.onicegatheringstatechange = null;
        this.myPeerConnection.onnotificationneeded = null;
    
        // Stop all this.transceivers on the connection
    
        this.myPeerConnection.getTransceivers().forEach(transceiver => {
          transceiver.stop();
        });
    
        // Stop the webcam preview as well by pausing the <video>
        // element, then stopping each of the getUserMedia() tracks
        // on it.
    
        if (localVideo.srcObject) {
          localVideo.pause();
          localVideo.srcObject.getTracks().forEach(track => {
            track.stop();
          });
        }
    
        // Close the peer connection
    
        this.myPeerConnection.close();
        this.myPeerConnection = null;
        this.webcamStream = null;
      }
    
      // Disable the hangup button
    
      document.getElementById("hangup-button").disabled = true;

      this.videoDialogVisible = false;
    },
    handleGetUserMediaError(e) {
      log_error(e);
      switch(e.name) {
        case "NotFoundError":
          alert("Unable to open your call because no camera and/or microphone" +
                "were found.");
          break;
        case "SecurityError":
        case "PermissionDeniedError":
          // Do nothing; this is the same as the user canceling the call.
          break;
        default:
          alert("Error opening your camera and/or microphone: " + e.message);
          break;
      }
    
      // Make sure we shut down our end of the RTCPeerConnection so we're
      // ready to try again.
    
      this.closeVideoCall();
    },
    async invite() {
      log("Starting to prepare an invitation");
      if (this.myPeerConnection) {
        alert("You can't start a call because you already have one open!");
      } else {
        var clickedUsername = '';
        for (let obj of this.chatList) {
          if (obj.friend_id == this.currentFriendId) {
            clickedUsername = obj.friend_name
            break;
          }
        }
        // Don't allow users to call themselves, because weird.
    
        if (this.currentFriendId === this.$store.state.user.id) {
          alert("I'm afraid I can't let you talk to yourself. That would be weird.");
          return Promise.reject();
        }
    
        // Record the username being called for future reference
    
        log("Inviting user " + clickedUsername);
    
        // Call createPeerConnection() to create the RTCPeerConnection.
        // When this returns, this.myPeerConnection is our RTCPeerConnection
        // and this.webcamStream is a stream coming from the camera. They are
        // not linked together in any way yet.
    
        log("Setting up connection to invite user: " + clickedUsername);
        this.createPeerConnection();
    
        // Get access to the webcam stream and attach it to the
        // "preview" box (id "local_video").
    
        try {
          this.webcamStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
          document.getElementById("local_video").srcObject = this.webcamStream;
        } catch(err) {
          this.handleGetUserMediaError(err);
          return Promise.reject(err);
        }
    
        // Add the tracks from the stream to the RTCPeerConnection
    
        try {
          this.webcamStream.getTracks().forEach(
            transceiver = track => this.myPeerConnection.addTransceiver(track, {streams: [this.webcamStream]})
          );
        } catch(err) {
          this.handleGetUserMediaError(err);
        }

        return Promise.resolve()
      }
    },
    hangUpCall() {
      this.closeVideoCall();
    
      this.sendToServer({
        name: myUsername,
        target: this.currentFriendId,
        type: "hang-up"
      });
    } 
  },
  sockets: {
    videoChatEvent(data) {
      var msg = JSON.parse(data);
      log("Message received: ");
      console.dir(msg);
      var time = new Date(msg.date);
      var timeStr = time.toLocaleTimeString();
      switch(msg.type) {
        case "video-offer":  // Invitation and offer to chat
          this.handleVideoOfferMsg(msg);
          break;

        case "video-answer":  // Callee has answered our offer
          this.handleVideoAnswerMsg(msg);
          break;

        case "new-ice-candidate": // A new ICE candidate has been received
          this.handleNewICECandidateMsg(msg);
          break;

        case "hang-up": // The other peer has hung up the call
          this.handleHangUpMsg(msg);
          break;

        // Unknown message; output to console for debugging.
        default:
          log_error("Unknown message received:");
          log_error(msg);
      }
    }
  }
}