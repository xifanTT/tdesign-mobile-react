import React, { useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { Icon } from 'tdesign-icons-react';
import useConfig from '../_util/useConfig';
import { TdMessageProps } from './type';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

enum MessageThemeListEnum {
  info = 'info',
  success = 'success',
  warning = 'warning',
  error = 'error',
}

enum IconType {
  info = 'error-circle',
  success = 'check-circle',
  warning = 'error-circle',
  error = 'error-circle',
}

const defaultProps = {
  duration: 3000,
  theme: MessageThemeListEnum.info,
  visible: true,
  zIndex: 5000,
  content: '',
  icon: false,
};

interface MessageProps extends TdMessageProps {
  children?: React.ReactNode;
  el: React.ReactNode;
}

const Message: React.FC = (props: MessageProps) => {
  const {
    children,
    closeBtn = undefined,
    duration = 3000,
    theme = MessageThemeListEnum.info,
    visible = true,
    zIndex = 5000,
    onClose = noop,
    onClosed = noop,
    onOpen = noop,
    onOpened = noop,
    onVisibleChange = noop,
    content = '',
    icon = false,
    el,
  } = props;

  const { classPrefix } = useConfig();

  console.log('el: ', el);
  const [messageVisible, setMessageVisible] = useState<boolean>(visible);

  const closeMessage = useCallback(() => {
    onClose();
    setMessageVisible(false);
    console.log('remove');
    ReactDOM.unmountComponentAtNode(el);
    (el as any)?.parentNode?.removeChild(el);
  }, [el, onClose]);

  useEffect(() => {
    if (duration) {
      setTimeout(() => {
        onClose();
        setMessageVisible(false);
        console.log('remove');
        ReactDOM.unmountComponentAtNode(el);
        (el as any)?.parentNode?.removeChild(el);
      }, duration);
    }
  }, [duration, el, onClose]);

  useEffect(() => {
    onVisibleChange(messageVisible);
  }, [onVisibleChange, messageVisible]);

  const leftIcon = typeof icon === 'boolean' ? <Icon name={IconType[theme]} size={22} /> : icon;

  const closeButton = typeof closeBtn === 'boolean' ? <Icon name="close" size={22} /> : closeBtn;

  const mainContent = content ? content : children;

  const message = (
    <div
      className={classNames(
        `${classPrefix}-message`,
        `${classPrefix}-message-align--center`,
        `${classPrefix}-message--${theme}`,
      )}
      style={{ zIndex }}
    >
      {icon && <>{leftIcon}</>}
      <div className={`${classPrefix}-message--txt`}>{mainContent}</div>
      {closeBtn && (
        <div className={`${classPrefix}-icon-close`} onClick={closeMessage}>
          {closeButton}
        </div>
      )}
    </div>
  );
  return (
    <CSSTransition in={messageVisible} timeout={duration} onEnter={onOpen} onEntered={onOpened} onExited={onClosed}>
      {message}
    </CSSTransition>
  );
};

function createMessage(props, theme: MessageThemeListEnum) {
  const config = { ...defaultProps, ...props };
  const el = document.createElement('div');
  el.classList.add('message-container-wrapper');
  document.body.appendChild(el);
  ReactDOM.render(<Message {...{ ...config, theme, el }} />, el);
}

export default {
  info(props: TdMessageProps) {
    return createMessage(props, MessageThemeListEnum.info);
  },
  success(props: TdMessageProps) {
    return createMessage(props, MessageThemeListEnum.success);
  },
  warning(props: TdMessageProps) {
    return createMessage(props, MessageThemeListEnum.warning);
  },
  error(props: TdMessageProps) {
    return createMessage(props, MessageThemeListEnum.error);
  },
};
