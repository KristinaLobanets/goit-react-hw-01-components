import env from '../env';
import { store } from '../App';

class Socket {
  socket = null;

  connection = true;

  error = false;

  open() {
    return new Promise(resolve => {
      this.socket = new WebSocket(env.app_url);
      this.socket.onerror = () => {
        this.error = true;
      };
      this.socket.onclose = () => {
        setTimeout(() => this.open(), 5000);
      };
      this.socket.onopen = () => {
        if (this.error && this.socket.readyState === 1) {
          this.logon();
          setTimeout(() => this.logon(), 5000);
          this.error = false;
        }
        resolve(this.socket.readyState === 1);
      };
    });
  }

  logon = () => {
    const phone = store.getState().user.phone;
    const token = store.getState().auth.token;
    if (phone && token) {
      const dataLogin = {
        taxiToken: env.app_token,
        phone,
        firebaseToken: token,
      };
      this.send('LOGON', dataLogin);
    }
  };

  send(command, data = null) {
    if (this.socket.readyState === 1) {
      const message = JSON.stringify({
        command,
        data,
      });
      console.log('send', message);
      return this.socket.send(message);
    }
    return setTimeout(() => {
      this.send(command, data);
    }, 10);
  }

  get() {
    return this.socket;
  }
}

export default new Socket();
