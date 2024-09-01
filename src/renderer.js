// renderer.js

window.onload = () => {
    if (window.api && typeof window.api.versionElectron === 'function') {
      window.api.versionElectron().then(response => {
        console.log('Versão do Electron:', response);  // Deve exibir a versão do Electron no console
      }).catch(error => console.error('Erro ao chamar versionElectron:', error));
    } else {
      console.error('Função versionElectron não disponível ou não é uma função');
    }
  };

const childWindow = () => api.openChildWindow();
const sendMessage = () => api.sendMessage("Sending a message to main process...");
sendMessage();
api.receiveMessage((event, message) => {
      console.log('Receiving the response message from main process: ')
      console.log(message);
} )

const info = () => api.info("Click the OK button to exit from this window!");
const warning = () => api.warning("Do you want to execute this operation?");
const choose = () => api.choose();

