"use client";

import {
  ProjectRequestForm,
  type ProjectRequestMode,
} from "@/components/forms/ProjectRequestForm";
import { Drawer } from "@/components/ui/Drawer";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: ProjectRequestMode;
  prefill?: {
    commune?: string;
    propertyType?: string;
    budgetMax?: string;
    piecesMin?: string;
  };
}

export function ProjectRequestModal({ open, onClose, mode, prefill }: Props) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Confier ma recherche"
      side="right"
      size="md"
    >
      <p className="mb-5 text-sm text-body">
        Décrivez votre projet en quelques lignes. Je vous reviens sous 48 h
        ouvrées avec une première sélection — y compris les biens off-market.
      </p>
      <ProjectRequestForm mode={mode} prefill={prefill} />
    </Drawer>
  );
}
