"use client";

import { useModal } from "./ModalContext";
import ApplyModal from "./ApplyModal";
import StatusModal from "./StatusModal";
import ConsultModal from "./ConsultModal";
import EligibilityModal from "./EligibilityModal";
import DocumentsModal from "./DocumentsModal";

export default function ModalRoot() {
  const { active, close } = useModal();
  if (!active) return null;
  switch (active) {
    case "apply":
      return <ApplyModal onClose={close} />;
    case "status":
      return <StatusModal onClose={close} />;
    case "consult":
      return <ConsultModal onClose={close} />;
    case "eligibility":
      return <EligibilityModal onClose={close} />;
    case "documents":
      return <DocumentsModal onClose={close} />;
    default:
      return null;
  }
}
