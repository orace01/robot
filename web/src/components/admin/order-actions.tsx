"use client";

import { useState, useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import {
  saveOrderNote,
  saveOrderTracking,
  updateOrderStatus,
  type AdminActionResult,
} from "@/app/(admin)/admin/commandes/actions";
import { Field, TextAreaField } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { allowedTransitions, type OrderStatus } from "@/lib/orders/status";

const actionLabels: Record<OrderStatus, string> = {
  pending_payment: "Remettre en attente de paiement",
  paid: "Marquer payée",
  processing: "Passer en préparation",
  shipped: "Marquer expédiée",
  delivered: "Marquer livrée",
  cancelled: "Annuler la commande",
  refunded: "Marquer remboursée",
};

const destructive: OrderStatus[] = ["cancelled", "refunded"];

function useAdminAction() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const execute = (task: () => Promise<AdminActionResult>, onSuccess?: () => void) =>
    startTransition(async () => {
      const result = await task();
      setError(result.error);
      if (!result.error) onSuccess?.();
    });
  return { pending, error, execute };
}

function ErrorMessage({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p role="alert" className="mt-3 rounded-[12px] bg-red-50 p-3 text-sm text-red-800">
      {error}
    </p>
  );
}

export function StatusActions({ number, status }: { number: string; status: OrderStatus }) {
  const { pending, error, execute } = useAdminAction();
  const next = allowedTransitions[status];
  if (next.length === 0) return <p className="text-sm text-muted">Aucune action possible : la commande est close.</p>;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {next.map((target) => (
          <Button
            key={target}
            size="sm"
            variant={destructive.includes(target) ? "secondary" : "primary"}
            className={destructive.includes(target) ? "text-red-700" : undefined}
            disabled={pending}
            onClick={() => {
              if (destructive.includes(target) && !window.confirm(`${actionLabels[target]} ${number} ?`)) return;
              execute(() => updateOrderStatus(number, target));
            }}
          >
            {actionLabels[target]}
          </Button>
        ))}
        {pending && <LoaderCircle className="size-5 animate-spin self-center text-muted" aria-hidden />}
      </div>
      <ErrorMessage error={error} />
    </div>
  );
}

export function TrackingEditor({
  number,
  carrier,
  trackingNumber,
}: {
  number: string;
  carrier: string | null;
  trackingNumber: string | null;
}) {
  const { pending, error, execute } = useAdminAction();
  const [values, setValues] = useState({ carrier: carrier ?? "", trackingNumber: trackingNumber ?? "" });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        execute(() => saveOrderTracking(number, values.carrier, values.trackingNumber));
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Transporteur"
          name="transporteur"
          required
          placeholder="Colissimo, DHL, YunExpress…"
          value={values.carrier}
          onChange={(event) => setValues((v) => ({ ...v, carrier: event.target.value }))}
        />
        <Field
          label="Numéro de suivi"
          name="numero-suivi"
          required
          value={values.trackingNumber}
          onChange={(event) => setValues((v) => ({ ...v, trackingNumber: event.target.value }))}
        />
      </div>
      <Button type="submit" size="sm" className="mt-3" disabled={pending}>
        {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
        Enregistrer le suivi
      </Button>
      <ErrorMessage error={error} />
    </form>
  );
}

export function NoteEditor({ number }: { number: string }) {
  const { pending, error, execute } = useAdminAction();
  const [message, setMessage] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        execute(() => saveOrderNote(number, message), () => setMessage(""));
      }}
    >
      <TextAreaField
        label="Note interne"
        name="note"
        required
        rows={3}
        placeholder="Visible uniquement dans l'administration."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <Button type="submit" size="sm" variant="secondary" className="mt-3" disabled={pending}>
        {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
        Ajouter la note
      </Button>
      <ErrorMessage error={error} />
    </form>
  );
}
