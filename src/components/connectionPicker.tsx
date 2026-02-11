"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  Trash2,
  Plus,
  Plug,
  Eye,
  EyeOff,
  LoaderCircle,
  FolderOpen,
  FileText,
  Calendar,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useConnections } from "@/contexts/connectionContext";
import { normalizeApiUrl } from "@/lib/craftApi";
import {
  encryptSecrets,
  testConnection,
  decryptSecretsForEdit,
} from "@/app/actions";
import type { CraftConnection, CraftConnectionType } from "@/types/connection";

const MotionButton = motion.create(Button);

const TYPE_CONFIG: Record<
  CraftConnectionType,
  { label: string; description: string; icon: React.ElementType }
> = {
  folders: {
    label: "All Documents (Space)",
    description: "Browse folders and pick any document",
    icon: FolderOpen,
  },
  documents: {
    label: "Selected Documents",
    description: "Flat list of shared documents",
    icon: FileText,
  },
  daily_notes: {
    label: "Daily Notes & Tasks",
    description: "Daily notes — not supported for events",
    icon: Calendar,
  },
};

interface ConnectionFormState {
  name: string;
  url: string;
  apiKey: string;
  type: CraftConnectionType;
}

const INITIAL_FORM: ConnectionFormState = {
  name: "",
  url: "",
  apiKey: "",
  type: "documents",
};

function suggestName(url: string): string {
  try {
    const hostname = new URL(
      url.startsWith("http") ? url : `https://${url}`
    ).hostname;
    return hostname.replace(/^connect\./, "").replace(/\.do$/, "");
  } catch {
    return "";
  }
}

interface ConnectionPickerProps {
  onConnectionReady: (blob: string, connection: CraftConnection) => void;
}

export default function ConnectionPicker({
  onConnectionReady,
}: ConnectionPickerProps) {
  const {
    connections,
    addConnection,
    updateConnection,
    deleteConnection,
    setActiveConnection,
  } = useConnections();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingConnection, setEditingConnection] =
    useState<CraftConnection | null>(null);
  const [deletingConnection, setDeletingConnection] =
    useState<CraftConnection | null>(null);
  const [form, setForm] = useState<ConnectionFormState>(INITIAL_FORM);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Auto-suggest name from URL
  useEffect(() => {
    if (!editingConnection && form.url && !form.name) {
      const suggested = suggestName(form.url);
      if (suggested) setForm((prev) => ({ ...prev, name: suggested }));
    }
  }, [form.url, form.name, editingConnection]);

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setFormError(null);
    setShowApiKey(false);
    setIsTesting(false);
  };

  const handleUse = (connection: CraftConnection) => {
    setActiveConnection(connection.id);
    onConnectionReady(connection.encryptedBlob, connection);
  };

  const handleEdit = async (connection: CraftConnection) => {
    try {
      const secrets = await decryptSecretsForEdit(connection.encryptedBlob);
      setForm({
        name: connection.name,
        url: connection.url,
        apiKey: secrets.apiKey ?? "",
        type: connection.type,
      });
      setEditingConnection(connection);
      setFormError(null);
    } catch {
      setFormError("Failed to decrypt connection for editing");
    }
  };

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.url.trim()) {
      setFormError("URL is required");
      return;
    }

    setIsTesting(true);

    try {
      const normalizedUrl = normalizeApiUrl(form.url);
      const blob = await encryptSecrets({
        apiUrl: normalizedUrl,
        apiKey: form.apiKey.trim() || undefined,
      });

      const result = await testConnection(blob, form.type);
      if (!result.ok) {
        setFormError(result.error ?? "Connection test failed");
        setIsTesting(false);
        return;
      }

      const name = form.name.trim() || suggestName(form.url) || "My Connection";

      if (editingConnection) {
        updateConnection(editingConnection.id, {
          name,
          url: form.url.trim(),
          type: form.type,
          encryptedBlob: blob,
        });
        setEditingConnection(null);
      } else {
        const connection = addConnection({
          name,
          url: form.url.trim(),
          type: form.type,
          encryptedBlob: blob,
        });
        setActiveConnection(connection.id);
        onConnectionReady(blob, connection);
      }

      setAddDialogOpen(false);
      resetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save connection");
    } finally {
      setIsTesting(false);
    }
  };

  const handleDelete = () => {
    if (deletingConnection) {
      deleteConnection(deletingConnection.id);
      setDeletingConnection(null);
    }
  };

  const connectionForm = (
    <form onSubmit={handleTestAndSave} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="conn-name" className="text-sm font-medium">
          Connection Name
        </Label>
        <Input
          id="conn-name"
          type="text"
          placeholder="e.g. My Craft Space"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          disabled={isTesting}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Connection Type</Label>
        <div className="grid gap-2">
          {(Object.entries(TYPE_CONFIG) as [CraftConnectionType, typeof TYPE_CONFIG[CraftConnectionType]][]).map(
            ([key, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type: key }))}
                  disabled={isTesting}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                    form.type === key
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{config.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {config.description}
                    </p>
                  </div>
                </button>
              );
            }
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="conn-url" className="text-sm font-medium">
          Craft Doc URL
        </Label>
        <Input
          id="conn-url"
          type="text"
          placeholder="https://connect.craft.do/links/..."
          value={form.url}
          onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
          disabled={isTesting}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="conn-key" className="text-sm font-medium">
          API Key{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <div className="relative">
          <Input
            id="conn-key"
            type={showApiKey ? "text" : "password"}
            placeholder="Enter API key if secured"
            value={form.apiKey}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, apiKey: e.target.value }))
            }
            disabled={isTesting}
            className="h-11 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowApiKey((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showApiKey ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {formError && (
        <div className="text-sm text-destructive-foreground bg-destructive/90 p-3 rounded-lg border border-destructive/50">
          {formError}
        </div>
      )}

      <MotionButton
        type="submit"
        className="w-full h-11 font-medium"
        disabled={isTesting}
        size="lg"
        whileTap={{ scale: 0.97 }}
      >
        {isTesting ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Testing...
          </>
        ) : editingConnection ? (
          "Test & Update"
        ) : (
          "Test & Save"
        )}
      </MotionButton>
    </form>
  );

  // No connections yet — show inline form
  if (connections.length === 0) {
    return (
      <Card className="w-full shadow-lg border-border/50">
        <CardHeader className="space-y-2 pb-4">
          <CardTitle className="text-xl font-semibold">
            Connect to Craft
          </CardTitle>
          <CardDescription className="text-sm leading-6">
            Save your connection for quick access next time
          </CardDescription>
        </CardHeader>
        <CardContent>{connectionForm}</CardContent>
      </Card>
    );
  }

  // Connections exist — show list
  return (
    <>
      <Card className="w-full shadow-lg border-border/50">
        <CardHeader className="space-y-2 pb-4">
          <CardTitle className="text-xl font-semibold">
            Your Connections
          </CardTitle>
          <CardDescription className="text-sm leading-6">
            Select a saved connection or add a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {connections.map((conn) => {
            const typeConfig = TYPE_CONFIG[conn.type];
            const TypeIcon = typeConfig.icon;
            return (
              <div
                key={conn.id}
                className="flex flex-col gap-3 rounded-lg border p-4 transition-all border-border hover:border-accent/50 hover:shadow-sm bg-card/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold truncate text-foreground">
                      {conn.name}
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground shrink-0">
                      <TypeIcon className="h-3 w-3" />
                      {typeConfig.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {conn.url}
                  </p>
                  {conn.lastDocumentTitle && (
                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                      Last used: {conn.lastDocumentTitle}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => handleUse(conn)}
                    className="flex-1 sm:flex-none"
                  >
                    <Plug className="mr-1.5 h-3.5 w-3.5" />
                    Use
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(conn)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeletingConnection(conn)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}

          <div className="pt-2 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                resetForm();
                setAddDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add new connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Connection Dialog */}
      <Dialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Connection</DialogTitle>
            <DialogDescription>
              Connect to a Craft space or document
            </DialogDescription>
          </DialogHeader>
          {connectionForm}
        </DialogContent>
      </Dialog>

      {/* Edit Connection Dialog */}
      <Dialog
        open={!!editingConnection}
        onOpenChange={(open) => {
          if (!open) {
            setEditingConnection(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Connection</DialogTitle>
            <DialogDescription>
              Update your connection settings
            </DialogDescription>
          </DialogHeader>
          {connectionForm}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingConnection}
        onOpenChange={(open) => {
          if (!open) setDeletingConnection(null);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Connection</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deletingConnection?.name}
              &rdquo;? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeletingConnection(null)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
