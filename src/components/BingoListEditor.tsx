import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { normalizeText, type BingoPrompt } from "@/lib/bingo";

interface BingoListEditorProps {
  title: string;
  description: string;
  entryLabel: string;
  entries: BingoPrompt[];
  onSave: (entries: BingoPrompt[]) => void;
  triggerClassName?: string;
}

export default function BingoListEditor({
  title,
  description,
  entryLabel,
  entries,
  onSave,
  triggerClassName,
}: BingoListEditorProps) {
  const formId = useId();
  const nextFocus = useRef<string | null>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<BingoPrompt[]>([]);
  const [error, setError] = useState("");

  function changeOpen(isOpen: boolean) {
    if (isOpen) {
      setDraft(entries);
      setError("");
    }
    setOpen(isOpen);
  }

  function addEntry() {
    const id = crypto.randomUUID();
    nextFocus.current = id;
    setDraft((current) => [...current, { id, text: "" }]);
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = draft.map(({ id, text }) => ({ id, text: text.trim() }));
    const names = cleaned.map(({ text }) => normalizeText(text));
    if (names.includes("")) {
      setError(`Enter text for each ${entryLabel.toLowerCase()}.`);
      return;
    }
    if (new Set(names).size !== names.length) {
      setError(`Use a different name for each ${entryLabel.toLowerCase()}.`);
      return;
    }
    onSave(cleaned);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className={triggerClassName}>
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-y-auto rounded-sm border-stone-600 bg-stone-950 text-stone-100">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-stone-300">
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={save} className="grid gap-4">
          {draft.length > 0 && (
            <ul className="grid gap-2">
              {draft.map(({ id, text }, index) => (
                <li
                  key={id}
                  className="flex flex-wrap items-end gap-2 sm:flex-nowrap"
                >
                  <div className="grid flex-1 gap-1">
                    <label
                      htmlFor={`${formId}-${id}`}
                      className="text-sm text-stone-300"
                    >
                      {entryLabel} {index + 1}
                    </label>
                    <input
                      id={`${formId}-${id}`}
                      ref={(input) => {
                        if (input && nextFocus.current === id) {
                          nextFocus.current = null;
                          input.focus();
                        }
                      }}
                      type="text"
                      value={text}
                      onChange={(event) => {
                        const value = event.target.value;
                        setDraft((current) =>
                          current.map((entry) =>
                            entry.id === id ? { id, text: value } : entry,
                          ),
                        );
                        setError("");
                      }}
                      className="min-h-11 min-w-0 rounded-sm border border-stone-600 bg-stone-900 px-3 text-base focus-visible:outline-2 focus-visible:outline-red-300"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    aria-label={`Remove ${entryLabel.toLowerCase()} ${index + 1}`}
                    className="min-h-11 text-red-200 hover:bg-red-950 hover:text-red-100 focus-visible:ring-red-300"
                    onClick={() => {
                      setDraft((current) =>
                        current.filter((entry) => entry.id !== id),
                      );
                      setError("");
                    }}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={addEntry}
            className="min-h-11 justify-self-start border-stone-600 bg-stone-950 text-stone-100 hover:bg-stone-800 hover:text-white focus-visible:ring-red-300"
          >
            Add {entryLabel.toLowerCase()}
          </Button>
          {error && (
            <p role="alert" className="text-sm text-red-300">
              {error}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="min-h-11 hover:bg-stone-800 hover:text-white focus-visible:ring-red-300"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="min-h-11 bg-red-800 text-white hover:bg-red-700 focus-visible:ring-red-300"
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
