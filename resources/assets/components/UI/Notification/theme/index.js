import css from './src/styles/styles.scss';

// media breakpoint - small screen min width
const smallScreenMin = 768;

// default className for NotificationsSystem component
const notificationsSystemClassName = css['notifications-system'];

// default className for NotificationsContainer component
const notificationsContainerClassName = {
  main: css['notifications-container'],
  position: function position(_position) {
    return css[`notifications-container--${_position}`];
  },
};

// default transition for Notification component
const notificationsContainerTransition = {
  enterTimeout: 500,
  leaveTimeout: 900,
  name: {
    enter: css['notification-wrapper-enter'],
    leave: css['notification-wrapper-leave'],
  },
};

// default className for Notification component
const notificationClassName = {
  main: css.notification,
  wrapper: css['notification-wrapper'],
  meta: css['notification-meta'],
  title: css['notification-title'],
  message: css['notification-message'],
  // `fa` corresponds to font-awesome's class name
  icon: `fa ${css['notification-icon']}`,
  imageContainer: css['notification-image-container'],
  image: css['notification-image'],
  status: function status(_status) {
    return css[`notification--${_status}`];
  },
  dismissible: css['notification--dismissible'],
  buttons: function buttons(count) {
    if (count === 0) {
      return '';
    }
    if (count === 1) {
      return css['notification--buttons-1'];
    }
    if (count === 2) {
      return css['notification--buttons-2'];
    }
    return css['notification-buttons'];
  },
  closeButtonContainer: css['notification-close-button-container'],
  closeButton: `fa ${css['notification-close-button']}`,
  button: css['notification-button'],
  buttonText: css['notification-button-text'],
};

const config = {
  smallScreenMin,
  notificationsSystem: {
    className: notificationsSystemClassName,
  },
  notificationsContainer: {
    className: notificationsContainerClassName,
    transition: notificationsContainerTransition,
    position: 'tc',
  },
  notification: {
    className: notificationClassName,
  },
};

export default config;
