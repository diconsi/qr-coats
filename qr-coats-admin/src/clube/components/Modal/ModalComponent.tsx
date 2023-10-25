import { ReactNode } from "react";
import { Modal, Button } from "react-bootstrap";

interface IModal {
  showModal: boolean;
  center: boolean;
  isLoadingButton: boolean;
  className: string;
  title: ReactNode;
  stylesTitle: object;
  body: ReactNode;
  size: "sm" | "lg" | "xl" | undefined;
  onClose: () => void;
  onSave: () => void;
  textButtonClose: string;
  textButtonSave: string;
  bsStyleButtonSave: string;
  dialogClassName: string;
  properties: object;
  onHide: () => void;
  footer: ReactNode;
  footerClassName: string;
  headerProperties: { closeButton: boolean };
  titleClassName: string;
  bodyStyle: object;
  propertyButtonClose: object;
  propertyButtonSave: object;
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
    textButtonClose,
    textButtonSave,
    isLoadingButton,
    dialogClassName,
    bsStyleButtonSave,
    propertyButtonSave,
    footerClassName,
    propertyButtonClose,
    headerProperties,
    titleClassName,
  } = props;

  const onClick = () => {
    if (!isLoadingButton) {
      onSave();
    }
  };

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
        <Modal.Header {...headerProperties} style={{display:'flex', justifyContent:'center'}}>
          <Modal.Title className={titleClassName} style={stylesTitle}>
            {title}
          </Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body style={bodyStyle || {}}>{body}</Modal.Body>
      {!footer && !onClose && !onSave ? null : (
        <Modal.Footer
          className={
            footer && !footerClassName ? "camera-modal-footer" : footerClassName
          }
        >
          {onClose && (
            <Button
              variant="secondary"
              className="btn-user-mang btn-secondary-user-mang"
              onClick={onClose}
              {...propertyButtonClose}
            >
              {textButtonClose || "cancel"}
            </Button>
          )}

          {footer ? (
            footer
          ) : (
            <Button
              className="btn-user-mang btn-primary-user-mang"
              variant={bsStyleButtonSave}
              disabled={isLoadingButton}
              onClick={onClick}
              {...propertyButtonSave}
            >
              {isLoadingButton ? (
                <span>
                  loading...
                  <i
                    className="fa fa-spinner fa-spin"
                    style={{ animation: "fa-spin 1s infinite linear" }}
                    aria-hidden="true"
                  ></i>
                </span>
              ) : (
                textButtonSave || "save"
              )}
            </Button>
          )}
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default SWSModal;
