import App from '.';
import '../css/styles.scss';
import '../css/cover.css';

App();

if (module.hot) {
  module.hot.accept('./index.jsx', () => {
    return App();
  });
}
