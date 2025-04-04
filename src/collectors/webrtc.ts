export const detectLocalIP = async (): Promise<string[]> => {
  return new Promise(resolve => {
    if (!window.RTCPeerConnection) {
      return resolve([]);
    }

    const ips: string[] = [];
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.createDataChannel('');
    
    pc.onicecandidate = (event) => {
      if (!event.candidate) return;
      const ip = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(
        event.candidate.candidate
      )?.[1];
      ip && ips.push(ip);
    };

    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .catch(() => resolve([]));

    setTimeout(() => {
      pc.close();
      resolve([...new Set(ips)]);
    }, 1000);
  });
};