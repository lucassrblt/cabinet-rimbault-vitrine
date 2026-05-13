"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import type { ProjectRequestMode } from "@/components/forms/ProjectRequestForm";
import { Button } from "@/components/ui/Button";
import { ProjectRequestModal } from "./ProjectRequestModal";

interface Props {
  mode: ProjectRequestMode;
  prefill?: {
    commune?: string;
    propertyType?: string;
    budgetMax?: string;
    piecesMin?: string;
  };
  label?: string;
}

export function ProjectRequestCta({
  mode,
  prefill,
  label = "Confier ma recherche",
}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {label}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
      <ProjectRequestModal
        open={open}
        onClose={() => setOpen(false)}
        mode={mode}
        prefill={prefill}
      />
    </>
  );
}
