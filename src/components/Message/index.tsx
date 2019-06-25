import "./scss/index.scss";

import * as React from "react";
import ReactSVG from "react-svg";

import closeImg from "../../images/x.svg";

interface MessageProps {
  closeLabel?: string;
  title: string;
  status?: "success" | "error";
  onClose: () => void;
}

const Message: React.FC<MessageProps> = ({
  closeLabel,
  title,
  status = "neutral",
  children,
  onClose,
}) => (
  <div className={`message message__status-${status}`}>
    <p className="message__title">{title}</p>
    {children ? <div className="message__content">{children}</div> : null}
    {closeLabel ? (
      <p className="message__action-button" onClick={onClose}>{closeLabel}</p>
    ) : (
      <ReactSVG
        path={closeImg}
        className="message__close-icon"
        onClick={onClose}
      />
    )}
  </div>
);

export default Message;
