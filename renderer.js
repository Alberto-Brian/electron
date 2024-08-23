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
  