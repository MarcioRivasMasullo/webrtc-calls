# webrtc-calls

This repository contains a simple video call app built with JavaScript, sockets, and WebRTC. The project consists of a Next.js-based client in the `client` directory and a Node.js server in the `server` directory. The server is used to do the signaling before the peers get connected.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js: Make sure Node.js is installed on your machine. You can download it [here](https://nodejs.org/).

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/video-call-app.git
   ```

2. Install dependencies for client and server:

  ```bash
  cd webrtc-calls/client
  npm install
  ``` 

  ```bash
  cd webrtc-calls/server
  npm install
  ```

### Running the Application

1. Start the server: 

  ```bash
  cd webrtc-calls/server
  node server.js
  ```

The server will be running at http://localhost:5000.

2. Start the client:

```bash
  cd webrtc-calls/client
  npm run dev
  ```

The client application will be accessible at http://localhost:3000.

### Usage

Visit http://localhost:3000 in your browser to use the video call app. Ensure that the server is running for proper communication between peers.


  

