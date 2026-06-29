"use client";

import { FormEvent, useMemo, useState } from "react";

type StatusTone = "default" | "error" | "success";

type FormData = {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  shipmentType: string;
  origin: string;
  destination: string;
  pickupDate: string;
  weight: string;
  packages: string;
  fragile: string;
  insurance: string;
  notes: string;
  privacy: boolean;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialData: FormData = {
  fullName: "",
  company: "",
  email: "",
  phone: "",
  shipmentType: "",
  origin: "",
  destination: "",
  pickupDate: "",
  weight: "",
  packages: "",
  fragile: "",
  insurance: "",
  notes: "",
  privacy: false,
};

function validateField(name: keyof FormData, value: string | boolean): string {
  switch (name) {
    case "fullName": {
      const v = String(value).trim();
      if (!v) return "El nombre completo es obligatorio.";
      if (v.length < 3) return "El nombre debe tener al menos 3 caracteres.";
      return "";
    }
    case "company": {
      const v = String(value).trim();
      if (!v) return "";
      if (v.length < 2) return "El nombre de empresa es demasiado corto.";
      return "";
    }
    case "email": {
      const v = String(value).trim();
      if (!v) return "El email es obligatorio.";
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      return ok ? "" : "Introduce un email valido, por ejemplo nombre@dominio.com.";
    }
    case "phone": {
      const v = String(value).trim();
      if (!v) return "El telefono es obligatorio.";
      const digits = v.replace(/[^\d+]/g, "");
      if (digits.length < 9) return "El telefono debe tener al menos 9 digitos.";
      return "";
    }
    case "shipmentType":
      return String(value) ? "" : "Selecciona el tipo de servicio.";
    case "origin":
      return String(value).trim() ? "" : "Indica el origen del envio.";
    case "destination":
      return String(value).trim() ? "" : "Indica el destino del envio.";
    case "pickupDate": {
      const v = String(value);
      if (!v) return "Selecciona la fecha de recogida.";
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(`${v}T00:00:00`);
      return selected < today ? "La fecha de recogida no puede ser anterior a hoy." : "";
    }
    case "weight": {
      const v = String(value);
      if (!v) return "El peso es obligatorio.";
      const n = Number(v);
      if (!Number.isFinite(n) || n <= 0) return "El peso debe ser mayor que 0.";
      if (n > 1000) return "Para mas de 1000 kg, solicita gestion especializada.";
      return "";
    }
    case "packages": {
      const v = String(value);
      if (!v) return "Indica la cantidad de paquetes.";
      const n = Number(v);
      if (!Number.isInteger(n) || n < 1) return "La cantidad minima es 1 paquete.";
      return "";
    }
    case "fragile":
      return String(value) ? "" : "Indica si la mercancia es fragil.";
    case "insurance":
      return String(value) ? "" : "Selecciona una opcion de seguro.";
    case "notes":
      return String(value).length > 500 ? "El maximo permitido es 500 caracteres." : "";
    case "privacy":
      return Boolean(value) ? "" : "Debes aceptar la politica de privacidad.";
    default:
      return "";
  }
}

export function QuoteForm() {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState(
    "Completa los campos para validar y generar tu solicitud."
  );
  const [statusTone, setStatusTone] = useState<StatusTone>("default");

  const statusClass = useMemo(() => {
    if (statusTone === "error") {
      return "rounded-xl border border-red-400/40 bg-red-900/30 px-4 py-3 text-sm text-red-200";
    }
    if (statusTone === "success") {
      return "rounded-xl border border-emerald-400/40 bg-emerald-900/20 px-4 py-3 text-sm text-emerald-200";
    }
    return "rounded-xl border border-sky/30 bg-navy/60 px-4 py-3 text-sm text-sky";
  }, [statusTone]);

  const baseInputClass =
    "w-full rounded-xl border bg-navy/70 px-4 py-3 outline-none focus:border-orange focus:ring-2 focus:ring-orange/30";

  const getFieldClass = (name: keyof FormData) => {
    const hasError = Boolean(errors[name]);
    return `${baseInputClass} ${hasError ? "border-red-400 ring-2 ring-red-400/30" : "border-sky/30"}`;
  };

  const setValue = <K extends keyof FormData>(name: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    const message = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const validateAll = (): boolean => {
    const nextErrors: FormErrors = {};
    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const message = validateField(key, formData[key]);
      if (message) nextErrors[key] = message;
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ok = validateAll();

    if (!ok) {
      setStatus("No se puede enviar: revisa los campos marcados en rojo.");
      setStatusTone("error");
      return;
    }

    setStatus(
      "Solicitud enviada correctamente. En breve recibiras tu presupuesto estimado por email."
    );
    setStatusTone("success");
  };

  const handleReset = () => {
    setFormData(initialData);
    setErrors({});
    setStatus("Completa los campos para validar y generar tu solicitud.");
    setStatusTone("default");
  };

  return (
    <form id="quoteForm" className="space-y-8" noValidate onSubmit={handleSubmit} onReset={handleReset}>
      <fieldset className="space-y-4">
        <legend className="font-display text-2xl tracking-[-0.02em]">Datos de contacto</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-medium">Nombre completo *</label>
            <input id="fullName" name="fullName" type="text" required autoComplete="name" value={formData.fullName} onChange={(e) => setValue("fullName", e.target.value)} className={getFieldClass("fullName")} aria-invalid={Boolean(errors.fullName)} />
            <p className="mt-2 text-sm text-red-300" role="alert" aria-live="polite">{errors.fullName || ""}</p>
          </div>
          <div>
            <label htmlFor="company" className="mb-2 block text-sm font-medium">Empresa</label>
            <input id="company" name="company" type="text" autoComplete="organization" value={formData.company} onChange={(e) => setValue("company", e.target.value)} className={getFieldClass("company")} aria-invalid={Boolean(errors.company)} />
            <p className="mt-2 text-sm text-red-300" role="alert" aria-live="polite">{errors.company || ""}</p>
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">Email *</label>
            <input id="email" name="email" type="email" required autoComplete="email" value={formData.email} onChange={(e) => setValue("email", e.target.value)} className={getFieldClass("email")} aria-invalid={Boolean(errors.email)} />
            <p className="mt-2 text-sm text-red-300" role="alert" aria-live="polite">{errors.email || ""}</p>
          </div>
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">Telefono *</label>
            <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+34 600 123 456" value={formData.phone} onChange={(e) => setValue("phone", e.target.value)} className={getFieldClass("phone")} aria-invalid={Boolean(errors.phone)} />
            <p className="mt-2 text-sm text-red-300" role="alert" aria-live="polite">{errors.phone || ""}</p>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-2xl tracking-[-0.02em]">Detalles del envio</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="shipmentType" className="mb-2 block text-sm font-medium">Tipo de servicio *</label>
            <select id="shipmentType" name="shipmentType" required value={formData.shipmentType} onChange={(e) => setValue("shipmentType", e.target.value)} className={getFieldClass("shipmentType")} aria-invalid={Boolean(errors.shipmentType)}>
              <option value="">Selecciona una opcion</option>
              <option value="express">Envio express</option>
              <option value="international">Envio internacional</option>
              <option value="business">Logistica para empresas</option>
            </select>
            <p className="mt-2 text-sm text-red-300" role="alert" aria-live="polite">{errors.shipmentType || ""}</p>
          </div>
          <div>
            <label htmlFor="origin" className="mb-2 block text-sm font-medium">Origen *</label>
            <input id="origin" name="origin" type="text" required placeholder="Ciudad o codigo postal" value={formData.origin} onChange={(e) => setValue("origin", e.target.value)} className={getFieldClass("origin")} aria-invalid={Boolean(errors.origin)} />
            <p className="mt-2 text-sm text-red-300" role="alert" aria-live="polite">{errors.origin || ""}</p>
          </div>
          <div>
            <label htmlFor="destination" className="mb-2 block text-sm font-medium">Destino *</label>
            <input id="destination" name="destination" type="text" required placeholder="Ciudad o codigo postal" value={formData.destination} onChange={(e) => setValue("destination", e.target.value)} className={getFieldClass("destination")} aria-invalid={Boolean(errors.destination)} />
            <p className="mt-2 text-sm text-red-300" role="alert" aria-live="polite">{errors.destination || ""}</p>
          </div>
          <div>
            <label htmlFor="pickupDate" className="mb-2 block text-sm font-medium">Fecha de recogida *</label>
            <input id="pickupDate" name="pickupDate" type="date" required value={formData.pickupDate} onChange={(e) => setValue("pickupDate", e.target.value)} className={getFieldClass("pickupDate")} aria-invalid={Boolean(errors.pickupDate)} />
            <p className="mt-2 text-sm text-red-300" role="alert" aria-live="polite">{errors.pickupDate || ""}</p>
          </div>
          <div>
            <label htmlFor="weight" className="mb-2 block text-sm font-medium">Peso total (kg) *</label>
            <input id="weight" name="weight" type="number" min="0.1" step="0.1" required value={formData.weight} onChange={(e) => setValue("weight", e.target.value)} className={getFieldClass("weight")} aria-invalid={Boolean(errors.weight)} />
            <p className="mt-2 text-sm text-red-300" role="alert" aria-live="polite">{errors.weight || ""}</p>
          </div>
          <div>
            <label htmlFor="packages" className="mb-2 block text-sm font-medium">Numero de paquetes *</label>
            <input id="packages" name="packages" type="number" min="1" step="1" required value={formData.packages} onChange={(e) => setValue("packages", e.target.value)} className={getFieldClass("packages")} aria-invalid={Boolean(errors.packages)} />
            <p className="mt-2 text-sm text-red-300" role="alert" aria-live="polite">{errors.packages || ""}</p>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-2xl tracking-[-0.02em]">Opciones adicionales</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fragile" className="mb-2 block text-sm font-medium">Mercancia fragil *</label>
            <select id="fragile" name="fragile" required value={formData.fragile} onChange={(e) => setValue("fragile", e.target.value)} className={getFieldClass("fragile")} aria-invalid={Boolean(errors.fragile)}>
              <option value="">Selecciona una opcion</option>
              <option value="no">No</option>
              <option value="si">Si</option>
            </select>
            <p className="mt-2 text-sm text-red-300" role="alert" aria-live="polite">{errors.fragile || ""}</p>
          </div>
          <div>
            <label htmlFor="insurance" className="mb-2 block text-sm font-medium">Seguro adicional *</label>
            <select id="insurance" name="insurance" required value={formData.insurance} onChange={(e) => setValue("insurance", e.target.value)} className={getFieldClass("insurance")} aria-invalid={Boolean(errors.insurance)}>
              <option value="">Selecciona una opcion</option>
              <option value="basico">Basico</option>
              <option value="premium">Premium</option>
              <option value="sin-seguro">Sin seguro</option>
            </select>
            <p className="mt-2 text-sm text-red-300" role="alert" aria-live="polite">{errors.insurance || ""}</p>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="notes" className="mb-2 block text-sm font-medium">Observaciones</label>
            <textarea id="notes" name="notes" rows={4} maxLength={500} placeholder="Horarios preferidos, referencias o requisitos de entrega" value={formData.notes} onChange={(e) => setValue("notes", e.target.value)} className={getFieldClass("notes")} aria-invalid={Boolean(errors.notes)} />
            <p className="mt-2 text-sm text-red-300" role="alert" aria-live="polite">{errors.notes || ""}</p>
          </div>
          <div className="sm:col-span-2">
            <label className="inline-flex items-start gap-3 text-sm text-sky" htmlFor="privacy">
              <input id="privacy" name="privacy" type="checkbox" required checked={formData.privacy} onChange={(e) => setValue("privacy", e.target.checked)} className="mt-1 h-4 w-4 rounded border-sky/40 bg-navy/70 text-orange focus:ring-orange" aria-invalid={Boolean(errors.privacy)} />
              <span>Acepto la politica de privacidad y el tratamiento de datos para recibir el presupuesto *</span>
            </label>
            <p className="mt-2 text-sm text-red-300" role="alert" aria-live="polite">{errors.privacy || ""}</p>
          </div>
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="inline-flex items-center rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white hover:bg-orange/90">Enviar solicitud</button>
        <button type="reset" className="inline-flex items-center rounded-full border border-sky/40 px-6 py-3 text-sm font-medium text-sky hover:border-white/60 hover:text-white">Limpiar formulario</button>
      </div>

      <p id="formStatus" className={statusClass} role="status" aria-live="polite">{status}</p>
    </form>
  );
}
