import { ReactNode } from "react";
import { Modal } from "react-bootstrap";

interface IModal {
  showModal: boolean;
  center?: boolean;
  isLoadingButton?: boolean;
  className?: string;
  title?: ReactNode;
  stylesTitle?: object;
  body?: ReactNode;
  size?: "sm" | "lg" | "xl" | undefined;
  onClose?: () => void;
  onSave?: () => void;
  textButtonClose?: string;
  textButtonSave?: string;
  bsStyleButtonSave?: string;
  dialogClassName?: string;
  properties?: object;
  onHide?: () => void;
  footer?: ReactNode;
  footerClassName?: string;
  headerProperties?: { closeButton: boolean };
  titleClassName?: string;
  bodyStyle?: object;
  propertyButtonClose?: object;
  propertyButtonSave?: object;
}
const SWSModal = (props: IModal) => {
  const {
    size,
    body,
    title,
    footer,
    center,
    onHide,
    onSave,
    onClose,
    bodyStyle,
    showModal,
    className,
    properties,
    stylesTitle,
    dialogClassName,
    footerClassName,
    headerProperties,
    titleClassName,
  } = props;

  return (
    <Modal
      className={className}
      dialogClassName={dialogClassName}
      show={showModal}
      size={size}
      onHide={() => {
        if (onHide) onHide();
        else if (onClose) onClose();
      }}
      centered={center}
      {...properties}
    >
      {title && (
        <Modal.Header
          {...headerProperties}
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#2E2F47",
            backdropFilter: "blur(90px)",
            fontFamily: 'AttenBold'
          }}
        >
          <Modal.Title className={titleClassName} style={stylesTitle}>
            {title}
          </Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body
        style={
          bodyStyle || {
            backgroundColor: "#2E2F47",
            backdropFilter: "blur(90px)",
          }
        }
      >
        {body}
      </Modal.Body>
      {!footer && !onClose && !onSave ? null : (
        <Modal.Footer
          className={
            footer && !footerClassName ? "camera-modal-footer" : footerClassName
          }
          style={{
            backgroundColor: "#2E2F47",
            backdropFilter: "blur(90px)",
            border: "none",
          }}
        >
          {footer}
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default SWSModal;
